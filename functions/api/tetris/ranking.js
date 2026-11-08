const PREFIX = "tetris:v1:";
const MAX_SCORE = 1_000_000_000;
const MAX_SECONDS = 7 * 24 * 60 * 60;
const TOP_SIZE = 10;
const SITES = new Set(["https://jmorgadodev.github.io", "https://jmorgado.pages.dev"]);

function normalizeEntry(data) {
  const {id, score, seconds} = data ?? {};
  const name = typeof data?.name === "string" ? data.name.normalize("NFC").trim() : "";
  if (!/^[\p{L}\p{N}][\p{L}\p{M}\p{N} _-]{0,9}$/u.test(name) ||
      typeof id !== "string" || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(id) ||
      !Number.isSafeInteger(score) || score < 1 || score > MAX_SCORE ||
      !Number.isSafeInteger(seconds) || seconds < 0 || seconds > MAX_SECONDS) return null;
  return {id, name, score, seconds};
}

function entryKey({id, score, seconds}) {
  // KV orders keys by bytes. Fixed-width values give score descending and time ascending.
  const inverse = String(MAX_SCORE - score).padStart(10, "0");
  return PREFIX + inverse + ":" + String(seconds).padStart(6, "0") + ":" + id;
}

async function readPayload(request) {
  const reader = request.body?.getReader();
  if (!reader) return null;
  const buffer = new Uint8Array(1024);
  let length = 0;
  for (;;) {
    const {done, value} = await reader.read();
    if (done) break;
    if (length + value.length > buffer.length) {
      await reader.cancel();
      return null;
    }
    buffer.set(value, length);
    length += value.length;
  }
  return JSON.parse(new TextDecoder().decode(buffer.subarray(0, length)));
}

async function topEntries(context, url) {
  const cache = caches.default;
  const key = new Request(new URL(url.pathname, url.origin));
  const hit = await cache.match(key);
  if (hit) return (await hit.json()).entries;
  const entries = [];
  let cursor;
  do {
    const page = await context.env.TETRIS_RANKING.list({prefix: PREFIX, limit: TOP_SIZE - entries.length, cursor});
    entries.push(...page.keys.map(key => normalizeEntry(key.metadata)).filter(Boolean));
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor && entries.length < TOP_SIZE);
  const response = Response.json({entries}, {headers: {"Cache-Control": "public, max-age=60"}});
  context.waitUntil(cache.put(key, response).catch(() => {}));
  return entries;
}

export async function onRequest(context) {
  const {request, env} = context;
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  const loopback = url.hostname === "127.0.0.1" || url.hostname === "localhost";
  const allowed = SITES.has(origin) || (loopback && origin === url.origin);
  const headers = new Headers({"Cache-Control": "no-store", "Vary": "Origin"});
  const respond = (body, status = 200) => Response.json(body, {status, headers});
  if (origin && !allowed) return respond({error: "origin"}, 403);
  if (allowed) headers.set("Access-Control-Allow-Origin", origin);
  if (request.method === "OPTIONS") {
    if (!allowed) return respond({error: "origin"}, 403);
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    headers.set("Access-Control-Max-Age", "600");
    return new Response(null, {status: 204, headers});
  }
  if (request.method !== "GET" && request.method !== "POST") {
    headers.set("Allow", "GET, POST, OPTIONS");
    return respond({error: "method"}, 405);
  }
  if (request.method === "POST" && !allowed) return respond({error: "origin"}, 403);
  if (!env.TETRIS_RANKING) return respond({error: "unavailable"}, 503);
  if (request.method === "GET") {
    try {
      return respond({entries: await topEntries(context, url)});
    } catch {
      return respond({error: "unavailable"}, 503);
    }
  }
  let entry;
  try {
    entry = normalizeEntry(await readPayload(request));
  } catch {
    return respond({error: "invalid"}, 400);
  }
  if (!entry) return respond({error: "invalid"}, 400);
  try {
    await env.TETRIS_RANKING.put(entryKey(entry), "", {metadata: entry});
    return respond({entry}, 201);
  } catch {
    return respond({error: "unavailable"}, 503);
  }
}
