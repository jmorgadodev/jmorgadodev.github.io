const GOOGLE_FORM = "https://docs.google.com/forms/d/e/1FAIpQLSfn-_qbGkr429pE9fX5X5bwEZpJGJf_Vl9E8HF4K20COHPeHQ/formResponse?hl=es";
const SITES = new Set(["https://jmorgado.pages.dev", "https://jmorgadodev.github.io"]);

async function readText(body, maxBytes) {
  const reader = body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = "";
  for (;;) {
    const {value, done} = await reader.read();
    if (done) return text + decoder.decode();
    bytes += value.byteLength;
    if (bytes > maxBytes) {
      await reader.cancel();
      throw new RangeError("Body too large");
    }
    text += decoder.decode(value, {stream: true});
  }
}

function cleanField(value, max) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return trimmed.length <= max ? trimmed : "";
}

export async function onRequest({request}) {
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  const isLocal = url.hostname === "127.0.0.1" || url.hostname === "localhost";
  const isPreview = /^[a-z0-9-]+\.jmorgado\.pages\.dev$/.test(url.hostname);
  const allowed = SITES.has(origin) || ((isLocal || isPreview) && origin === url.origin);
  const headers = new Headers({"Cache-Control": "no-store", "Vary": "Origin"});
  const respond = (body, status = 200) => Response.json(body, {status, headers});

  if (!allowed) return respond({sent: false}, 403);
  headers.set("Access-Control-Allow-Origin", origin);
  if (request.method === "OPTIONS") {
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    return new Response(null, {status: 204, headers});
  }
  if (request.method !== "POST") {
    headers.set("Allow", "POST, OPTIONS");
    return respond({sent: false}, 405);
  }
  if (request.headers.get("Content-Type")?.split(";")[0].trim() !== "application/json") {
    return respond({sent: false}, 415);
  }

  let data;
  try {
    data = JSON.parse(await readText(request.body, 17000));
  } catch (error) {
    return respond({sent: false}, error instanceof RangeError ? 413 : 400);
  }
  const name = cleanField(data?.name, 100);
  const email = cleanField(data?.email, 254);
  const message = cleanField(data?.message, 2500);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message || data.website !== "") {
    return respond({sent: false}, 400);
  }

  try {
    const response = await fetch(GOOGLE_FORM, {
      method: "POST",
      redirect: "manual",
      body: new URLSearchParams({
        "entry.1231643546": name,
        "entry.1169137539": email,
        "entry.1109799260": message,
        "fvv": "1",
        "pageHistory": "0",
      }),
      signal: AbortSignal.timeout(10000),
    });
    const html = await readText(response.body, 512_000);
    // Forms can return HTTP 200 when it redisplays validation errors.
    const confirmed = /class=["'][^"']*\bvHW8K\b[^"']*["']/.test(html);
    return response.ok && confirmed ? respond({sent: true}) : respond({sent: false}, 502);
  } catch {
    return respond({sent: false}, 502);
  }
}
