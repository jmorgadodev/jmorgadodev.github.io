/* Tetris de JMorgado. El motor no depende del DOM ni del reloj del navegador. */
(() => {
  "use strict";

  const COLS = 10, ROWS = 20, HIDDEN = 4, TOTAL = ROWS + HIDDEN;
  const LOCK_DELAY = 450, LOCK_RESETS = 15;
  const SHAPES = {
    I: ["....", "IIII", "....", "...."],
    O: ["OO", "OO"],
    T: [".T.", "TTT", "..."],
    S: [".SS", "SS.", "..."],
    Z: ["ZZ.", ".ZZ", "..."],
    J: ["J..", "JJJ", "..."],
    L: ["..L", "LLL", "..."],
  };
  const TYPES = Object.keys(SHAPES);
  const CELLS = Object.fromEntries(TYPES.map(type => {
    const shape = SHAPES[type];
    let cells = shape.flatMap((row, y) => [...row].flatMap((cell, x) => cell === "." ? [] : [[x, y]]));
    return [type, Array.from({length: 4}, () => {
      const rotation = cells;
      if (type !== "O") cells = cells.map(([x, y]) => [shape.length - 1 - y, x]);
      return rotation;
    })];
  }));

  // Rotation offsets for 90° turns, expressed in board coordinates (positive y is down).
  const KICKS = {
    "0>1": [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
    "1>0": [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
    "1>2": [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
    "2>1": [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
    "2>3": [[0,0],[1,0],[1,-1],[0,2],[1,2]],
    "3>2": [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
    "3>0": [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
    "0>3": [[0,0],[1,0],[1,-1],[0,2],[1,2]],
  };
  const I_KICKS = {
    "0>1": [[0,0],[-2,0],[1,0],[-2,1],[1,-2]],
    "1>0": [[0,0],[2,0],[-1,0],[2,-1],[-1,2]],
    "1>2": [[0,0],[-1,0],[2,0],[-1,-2],[2,1]],
    "2>1": [[0,0],[1,0],[-2,0],[1,2],[-2,-1]],
    "2>3": [[0,0],[2,0],[-1,0],[2,-1],[-1,2]],
    "3>2": [[0,0],[-2,0],[1,0],[-2,1],[1,-2]],
    "3>0": [[0,0],[1,0],[-2,0],[1,2],[-2,-1]],
    "0>3": [[0,0],[-1,0],[2,0],[-1,-2],[2,1]],
  };
  const HALF_KICKS = [[0,0],[-1,0],[1,0],[0,-1],[-2,0],[2,0],[-1,-1],[1,-1],[0,-2]];
  const LINE_POINTS = [0, 100, 300, 500, 800];
  const SPIN_POINTS = {full: [400, 800, 1200, 1600], mini: [100, 200, 400]};
  const COMBO_STEP = 50;
  const DEFAULT_KEYS = Object.freeze({
    left:"ArrowLeft", right:"ArrowRight", soft:"ArrowDown", hard:"Space",
    ccw:"KeyV", cw:"ArrowUp", half:"KeyX", hold:"KeyC",
  });
  const ACTIONS = Object.keys(DEFAULT_KEYS);
  const STORE = {
    controls: "jmorgado.tetris.controls.v1",
    results: "jmorgado.tetris.results.v1",
    legacyBest: "jmorgado.tetris.best.v1",
  };
  const assignable = code => typeof code === "string" &&
    /^(Key[A-Z]|Digit[0-9]|Arrow(?:Left|Right|Up|Down)|Space|Numpad(?:[0-9]|Add|Subtract|Multiply|Divide|Decimal)|Comma|Period|Slash|Semicolon|Quote|BracketLeft|BracketRight|Backslash|Backquote|Minus|Equal|IntlBackslash)$/.test(code);

  function cleanKeys(keys) {
    if (!keys || !ACTIONS.every(action => assignable(keys[action]))) return {...DEFAULT_KEYS};
    const result = ACTIONS.map(action => [action, keys[action]]);
    return new Set(result.map(([, key]) => key)).size === ACTIONS.length ?
      Object.fromEntries(result) : {...DEFAULT_KEYS};
  }

  class Tetris {
    constructor(random = Math.random, emit = () => {}) {
      this.random = random;
      this.emit = emit;
      this.reset();
    }

    reset() {
      this.board = Array.from({length: TOTAL}, () => Array(COLS).fill(null));
      this.bag = [];
      this.next = [];
      this.active = this.held = null;
      this.canHold = true;
      this.score = this.lines = 0;
      this.combo = 0;
      this.backToBack = false;
      this.lastRotation = null;
      this.level = 1;
      this.status = "idle";
      this.resetTimers();
    }

    resetTimers() {
      this.fallElapsed = this.lockElapsed = this.lockResets = 0;
    }

    start() {
      this.reset();
      this.status = "playing";
      this.fillPreview();
      this.spawn();
    }

    draw() {
      if (!this.bag.length) {
        this.bag = [...TYPES];
        for (let i = this.bag.length - 1; i > 0; i--) {
          const j = Math.floor(this.random() * (i + 1));
          [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
        }
      }
      return this.bag.pop();
    }

    fillPreview() {
      while (this.next.length < 3) this.next.push(this.draw());
    }

    spawn(type = this.next.shift()) {
      this.fillPreview();
      this.resetTimers();
      this.lastRotation = null;
      this.active = {type, x: Math.floor((COLS - SHAPES[type].length) / 2), y: HIDDEN - 1, rotation: 0};
      if (this.collides(this.active)) {
        this.active = null;
        this.status = "over";
        this.emit("over");
      } else {
        this.emit("spawn");
      }
    }

    collides(piece) {
      return CELLS[piece.type][piece.rotation].some(([dx, dy]) => {
        const x = piece.x + dx, y = piece.y + dy;
        return x < 0 || x >= COLS || y < 0 || y >= TOTAL || Boolean(this.board[y][x]);
      });
    }

    grounded() {
      return this.collides({...this.active, y: this.active.y + 1});
    }

    ghostY() {
      const ghost = {...this.active};
      while (!this.collides({...ghost, y: ghost.y + 1})) ghost.y++;
      return ghost.y;
    }

    place(candidate) {
      if (this.collides(candidate)) return false;
      const wasGrounded = this.grounded();
      this.active = candidate;
      this.lastRotation = null;
      const resetLimit = Math.max(2, LOCK_RESETS - Math.floor((this.level - 1) / 2));
      if (wasGrounded && this.lockResets < resetLimit) {
        this.lockElapsed = 0;
        this.lockResets++;
      }
      return true;
    }

    rotate(delta) {
      if (this.active.type === "O") return false;
      const {rotation, type, x, y} = this.active;
      const target = (rotation + delta + 4) % 4;
      const kicks = delta === 2 ? HALF_KICKS : (type === "I" ? I_KICKS : KICKS)[rotation + ">" + target];
      const kick = kicks.findIndex(([dx, dy]) => this.place({type, rotation: target, x: x + dx, y: y + dy}));
      if (kick < 0) return false;
      this.lastRotation = {fifthKick: delta !== 2 && kick === 4};
      return true;
    }

    descend() {
      const candidate = {...this.active, y: this.active.y + 1};
      if (this.collides(candidate)) return false;
      this.active = candidate;
      this.lastRotation = null;
      return true;
    }

    spinType() {
      const {type, rotation, x, y} = this.active;
      if (type !== "T" || !this.lastRotation) return null;
      const corners = [[x, y], [x + 2, y], [x + 2, y + 2], [x, y + 2]].map(([cx, cy]) =>
        cx < 0 || cx >= COLS || cy < 0 || cy >= TOTAL || Boolean(this.board[cy][cx]));
      if (corners.filter(Boolean).length < 3) return null;
      const frontFilled = corners[rotation] && corners[(rotation + 1) % 4];
      return frontFilled || this.lastRotation.fifthKick ? "full" : "mini";
    }

    lock() {
      const {type, rotation, x, y} = this.active;
      const spin = this.spinType();
      for (const [dx, dy] of CELLS[type][rotation]) this.board[y + dy][x + dx] = type;
      const cleared = [];
      const remaining = this.board.filter((row, index) => {
        if (row.every(Boolean)) { cleared.push({row: index - HIDDEN, colors: row}); return false; }
        return true;
      });
      const lines = cleared.length;
      this.combo = lines ? this.combo + 1 : 0;
      if (lines || spin) {
        const difficult = lines > 0 && (lines === 4 || spin !== null);
        const backToBack = difficult && this.backToBack;
        const bonus = COMBO_STEP * Math.max(0, this.combo - 1) * this.level;
        const spinGrade = spin === "mini" && lines === 3 ? "full" : spin;
        const base = spinGrade ? SPIN_POINTS[spinGrade][lines] : LINE_POINTS[lines];
        const points = base * this.level * (backToBack ? 1.5 : 1) + bonus;
        this.score += points;
        this.lines += lines;
        this.level = 1 + Math.floor(this.lines / 10);
        if (lines) {
          this.backToBack = difficult;
          this.board = [...Array.from({length: lines}, () => Array(COLS).fill(null)), ...remaining];
        }
        this.emit(lines ? "clear" : "spin", cleared, {combo: this.combo, bonus, spin: spinGrade, backToBack, points});
      }
      this.canHold = true;
      this.spawn();
    }

    act(action) {
      if (this.status !== "playing") return false;
      switch (action) {
        case "left": return this.place({...this.active, x: this.active.x - 1});
        case "right": return this.place({...this.active, x: this.active.x + 1});
        case "ccw": return this.rotate(-1);
        case "cw": return this.rotate(1);
        case "half": return this.rotate(2);
        case "soft":
          if (!this.descend()) return false;
          this.score++;
          return true;
        case "hard": {
          const y = this.ghostY();
          const distance = y - this.active.y;
          this.score += 2 * distance;
          if (distance) this.lastRotation = null;
          this.active.y = y;
          this.emit("impact");
          this.lock();
          return true;
        }
        case "hold": {
          if (!this.canHold) return false;
          const swap = this.held;
          this.held = this.active.type;
          this.canHold = false;
          this.spawn(swap ?? undefined);
          return true;
        }
        default: return false;
      }
    }

    gravity() {
      const progress = this.level - 1;
      return 16 + 684 / (1 + .31 * progress + .08 * progress ** 2);
    }

    lockDelay() {
      return 100 + (LOCK_DELAY - 100) * .94 ** (this.level - 1);
    }

    advance(ms) {
      while (ms > 0 && this.status === "playing") {
        if (this.grounded()) {
          const delay = this.lockDelay();
          const step = Math.min(ms, delay - this.lockElapsed);
          this.lockElapsed += step;
          ms -= step;
          if (this.lockElapsed >= delay) this.lock();
        } else {
          const interval = this.gravity();
          const step = Math.min(ms, interval - this.fallElapsed);
          this.fallElapsed += step;
          ms -= step;
          if (this.fallElapsed >= interval) {
            this.fallElapsed = 0;
            this.descend();
          }
        }
      }
    }

    pause() {
      if (this.status === "playing") this.status = "paused";
    }

    resume() {
      if (this.status === "paused") this.status = "playing";
    }
  }

  if (typeof module === "object" && module.exports) {
    module.exports = {Tetris, COLS, ROWS, HIDDEN, TOTAL, CELLS, TYPES, DEFAULT_KEYS, cleanKeys};
    return;
  }

  const root = document.querySelector("[data-tetris]");
  if (!root) return;
  const find = selector => root.querySelector(selector);
  const board = find(".game-board");
  const boardCanvas = find("[data-board]");
  const holdCanvas = find("[data-hold]");
  const nextCanvas = find("[data-next]");
  const ctx = boardCanvas.getContext("2d");
  const overlay = find(".game-overlay");
  const celebration = find(".game-tetris-callout");
  const celebrationTitle = find("[data-celebration-title]");
  const celebrationDetail = find("[data-celebration-detail]");
  const primary = find("[data-game-primary]");
  const pauseButton = find("[data-game-pause]");
  const restartButton = find("[data-game-restart]");
  const ranking = find(".game-ranking");
  const rankOpen = find("[data-ranking-open]");
  const rankDialog = find(".game-rank-dialog");
  const rankForm = find("[data-ranking-form]");
  const rankAlias = find("#tetris-alias");
  const rankSave = find("[data-ranking-submit]");
  const rankDismiss = find("[data-ranking-dismiss]");
  const rankView = find("[data-ranking-view]");
  const rankCount = find("[data-ranking-count]");
  const rankMeter = find("[data-ranking-meter]");
  const rankFeedback = find("[data-ranking-feedback]");
  const rankStatus = find("[data-ranking-status]");
  const rankRetry = find("[data-ranking-retry]");
  const rankList = find("[data-ranking-list]");
  const rankEndpoint = location.hostname === "jmorgado.pages.dev" ?
    "https://jmorgado.pages.dev/api/tetris/ranking" : "/api/tetris/ranking";
  const dialog = find(".game-dialog");
  const touch = find(".game-touch");
  const touchPanel = find(".game-touch-panel");
  const touchEdit = find("[data-touch-edit]");
  const touchTools = find("#touch-edit-tools");
  const touchStatus = find("[data-touch-status]");
  const touchButtons = new Map([...touch.children].map(button => [button.dataset.touch, button]));
  const defaultTouchOrder = [...touchButtons.keys()];
  const touchOption = find("[data-touch-option]");
  const stats = Object.fromEntries([...root.querySelectorAll("[data-stat]")].map(el => [el.dataset.stat, el]));
  const recordTime = find("[data-record-time]");
  const lastResult = find("[data-last-result]");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const touchPointer = matchMedia("(any-pointer: coarse)");
  const narrowScreen = matchMedia("(max-width: 620px)");
  const bindings = [...dialog.querySelectorAll("[data-bind]")];
  const bindingStatus = find(".game-binding-status");
  const format = new Intl.NumberFormat("es-CL");
  const CELL = 30;
  const BOARD_WIDTH = COLS * CELL, BOARD_HEIGHT = ROWS * CELL;
  const REPEATABLE = new Set(["left", "right", "soft"]);
  const pressed = new Map();
  const repeatAt = new Map();
  let colors, wellColor, gridColor, ghostColor, frame = 0, lastFrame = null, lastStatus = "";
  let spawnAt = -Infinity, impactAt = -Infinity, flashes = [];
  let dropTrail = null;
  let celebrationAnimation, celebrationUntil = 0;
  let elapsed = 0, activeSince = null;
  let rankCandidate = null, rankEntries = null, rankingLoading = false;
  const savedEntries = new Map();
  let draftKeys, waiting = null, scoreAnimation;
  let previews = null;

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)); }
    catch { return null; }
  }

  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { /* A session remains playable if storage is disabled. */ }
  }

  const saved = read(STORE.controls);
  let keys = cleanKeys(saved?.keys);
  const validNumber = value => Number.isSafeInteger(value) && value >= 0;
  const validResult = entry => validNumber(entry?.score) &&
    (entry.seconds === null || validNumber(entry.seconds));
  const previousBest = read(STORE.legacyBest);
  const legacyScore = validNumber(previousBest) ? previousBest : 0;
  const savedResults = read(STORE.results);
  let record = validResult(savedResults?.best) && savedResults.best.score >= legacyScore ?
    savedResults.best : {score: legacyScore, seconds: null};
  let touchOverride = typeof saved?.touchOverride === "boolean" ? saved.touchOverride : null;
  let touchSeen = false;
  let touchOrder = Array.isArray(saved?.touchOrder) && saved.touchOrder.length === touchButtons.size &&
    new Set(saved.touchOrder).size === touchButtons.size && saved.touchOrder.every(action => touchButtons.has(action)) ?
    saved.touchOrder : defaultTouchOrder;
  let editingTouch = false, touchSelection = null, touchDrag = null;

  function touchRecommended() {
    return touchSeen || touchPointer.matches || navigator.maxTouchPoints > 0 || narrowScreen.matches;
  }

  function persistControls() {
    write(STORE.controls, {keys, touchOverride, touchOrder});
  }

  function playedSeconds() {
    const running = activeSince === null ? 0 : performance.now() - activeSince;
    return Math.floor((elapsed + running) / 1000);
  }

  function stopClock() {
    if (activeSince === null) return;
    elapsed += performance.now() - activeSince;
    activeSince = null;
  }

  function clockText(seconds) {
    const pair = value => String(value).padStart(2, "0");
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return (hours ? hours + ":" : "") + pair(minutes % 60) + ":" + pair(seconds % 60);
  }

  function resultText({score, seconds}) {
    return format.format(score) + " puntos · " + clockText(seconds);
  }

  function showRankFeedback(message) {
    rankFeedback.textContent = message;
  }

  function syncRankAlias() {
    const count = rankAlias.value.length;
    rankCount.textContent = count + "/10";
    rankMeter.style.setProperty("--alias-length", count);
  }

  function offerRanking(score = 0, seconds = 0) {
    rankCandidate = score > 0 ? {score, seconds} : null;
    rankOpen.hidden = !rankCandidate;
    rankAlias.readOnly = false;
    rankSave.disabled = false;
    rankSave.hidden = false;
    rankView.hidden = true;
    rankDismiss.textContent = "Ahora no";
    rankForm.reset();
    syncRankAlias();
    showRankFeedback("");
  }

  function renderRanking() {
    const distinct = new Map([...rankEntries.map(entry => [entry.id, entry]), ...savedEntries]);
    const entries = [...distinct.values()].sort((a, b) =>
      b.score - a.score || a.seconds - b.seconds || (a.id < b.id ? -1 : a.id === b.id ? 0 : 1)).slice(0, 10);
    rankList.replaceChildren(...entries.map(entry => {
      const row = document.createElement("li");
      const alias = document.createElement("span");
      const result = document.createElement("small");
      alias.textContent = entry.name;
      result.textContent = format.format(entry.score) + " pts · " + clockText(entry.seconds);
      row.append(alias, result);
      return row;
    }));
    rankList.hidden = !entries.length;
    rankStatus.textContent = entries.length ? "" : "Aún no hay marcas publicadas.";
  }

  async function loadRanking() {
    if (rankingLoading) return;
    rankingLoading = true;
    rankRetry.hidden = true;
    rankStatus.textContent = "Cargando ranking…";
    try {
      const response = await fetch(rankEndpoint, {signal: AbortSignal.timeout(7000)});
      if (!response.ok) throw new Error("Ranking unavailable");
      const {entries} = await response.json();
      if (!Array.isArray(entries)) throw new Error("Invalid ranking");
      rankEntries = entries;
      renderRanking();
    } catch {
      rankStatus.textContent = "El ranking no está disponible ahora.";
      rankRetry.hidden = false;
    } finally {
      rankingLoading = false;
    }
  }

  ranking.addEventListener("toggle", () => {
    if (ranking.open && rankEntries === null) loadRanking();
  });
  rankRetry.addEventListener("click", loadRanking);
  rankOpen.addEventListener("click", () => {
    if (!rankCandidate) return;
    find("[data-ranking-score]").textContent = format.format(rankCandidate.score);
    find("[data-ranking-time]").textContent = clockText(rankCandidate.seconds);
    rankDialog.returnValue = "";
    rankDialog.showModal();
  });
  rankAlias.addEventListener("input", syncRankAlias);
  rankDismiss.addEventListener("click", () => rankDialog.close());
  rankView.addEventListener("click", () => {
    ranking.open = true;
    rankDialog.close("ranking");
    ranking.querySelector("summary").focus();
  });
  rankDialog.addEventListener("close", () => {
    if (!rankDialog.open && rankDialog.returnValue !== "ranking") {
      (rankOpen.hidden ? primary : rankOpen).focus({preventScroll:true});
    }
  });
  rankForm.addEventListener("submit", async event => {
    event.preventDefault();
    const entry = rankCandidate;
    if (!entry || rankSave.disabled) return;
    const name = rankAlias.value.normalize("NFC").trim();
    if (!/^[\p{L}\p{N}][\p{L}\p{M}\p{N} _-]{0,9}$/u.test(name)) {
      showRankFeedback("Escribe un alias de hasta 10 caracteres. Puedes usar letras, números, espacios y guiones.");
      return;
    }
    rankSave.disabled = true;
    rankAlias.readOnly = true;
    showRankFeedback("Guardando marca…");
    try {
      entry.id ??= crypto.randomUUID();
      const response = await fetch(rankEndpoint, {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({...entry, name}), signal: AbortSignal.timeout(7000),
      });
      if (!response.ok) throw new Error("Ranking unavailable");
      const {entry: saved} = await response.json();
      savedEntries.set(saved.id, saved);
      if (rankEntries !== null) renderRanking();
      if (entry === rankCandidate) {
        rankCandidate = null;
        rankOpen.hidden = rankSave.hidden = true;
        rankView.hidden = false;
        rankDismiss.textContent = "Cerrar";
        showRankFeedback("Marca publicada.");
        if (rankDialog.open) rankView.focus();
      }
    } catch {
      if (entry === rankCandidate) {
        showRankFeedback("No se pudo guardar la marca. Puedes volver a intentarlo o seguir jugando.");
        rankSave.disabled = false;
        rankAlias.readOnly = false;
      }
    }
  });

  function showLast(result) {
    if (!validResult(result) || result.seconds === null) return;
    lastResult.textContent = "Última partida · " + resultText(result);
    lastResult.hidden = false;
  }

  function saveResult() {
    const result = {score: game.score, seconds: playedSeconds()};
    const stored = read(STORE.results)?.best;
    if (validResult(stored) && stored.score >= record.score) record = stored;
    if (result.score > record.score) record = result;
    write(STORE.results, {best: record, last: result});
    showLast(result);
  }

  function clearCelebration() {
    celebrationUntil = 0;
    celebrationAnimation?.cancel();
    celebrationAnimation = null;
    celebration.hidden = true;
  }

  function comboTier(combo) {
    return combo >= 5 ? 3 : combo >= 3 ? 2 : 1;
  }

  function celebrateClear(lines, {combo, bonus, spin, backToBack, points}) {
    clearCelebration();
    const hasCombo = combo >= 2;
    const isTetris = lines === 4;
    const move = spin === "mini" ? "T-Spin Mini" : spin ? "T-Spin" : isTetris ? "Tetris" : "";
    const tier = comboTier(combo);
    const duration = hasCombo ? 1200 + tier * 180 : 1050;
    const bonusText = format.format(bonus);
    celebration.dataset.achievement = hasCombo ? "combo" : spin ? "spin" : "tetris";
    celebration.dataset.tier = tier;
    celebration.toggleAttribute("data-spin", Boolean(spin));
    const comboText = "Combo ×" + combo;
    const lineText = lines === 1 ? "1 línea" : lines + " líneas";
    const detail = [lineText, "+" + format.format(points) + " pts"];
    if (backToBack) detail.push("B2B +50 %");
    if (hasCombo) detail.push(comboText);
    celebrationTitle.textContent = move ? move.toUpperCase() : comboText;
    celebrationDetail.textContent = move ? detail.join(" · ") : "+" + bonusText + " pts de bono";
    celebrationUntil = performance.now() + duration;
    celebration.hidden = false;
    find(".game-status").textContent = move ?
      move + ". " + detail.join(". ").replace("pts", "puntos") : "Combo de " + combo + ". " + bonusText + " puntos de bono.";
    if (!reduced.matches) {
      celebrationAnimation = celebration.animate([
        {opacity:0, transform:hasCombo ? "translateY(12px) scale(.9)" : "translateY(9px)"},
        {opacity:1, transform:hasCombo ? `scale(${1 + tier * .026})` : "none", offset:.16},
        {opacity:1, transform:hasCombo && tier > 1 ? "scale(.985)" : "none", offset:.23},
        {opacity:1, transform:"none", offset:.28},
        {opacity:1, transform:"none", offset:.8},
        {opacity:0, transform:"translateY(-5px)"},
      ], {duration, easing:"ease-out"});
    }
  }

  function gameEffect(event, rows, streak) {
    if (event === "spin" || (event === "clear" && (streak.spin || rows.length === 4 || streak.combo >= 2))) {
      celebrateClear(rows.length, streak);
    }
    if (reduced.matches) return;
    const now = performance.now();
    if (event === "spawn") spawnAt = now;
    if (event === "impact") {
      impactAt = now;
      const piece = game.active;
      dropTrail = {
        start: now,
        type: piece.type,
        columns: [...new Set(CELLS[piece.type][piece.rotation].map(([x]) => x + piece.x))],
        bottom: Math.min(BOARD_HEIGHT, (piece.y - HIDDEN + SHAPES[piece.type].length) * CELL),
      };
    }
    if (event === "clear") {
      const tier = comboTier(streak.combo);
      flashes = rows.filter(item => item.row >= 0).map(({row, colors: cells}) => ({
        row,
        start: now,
        duration: (rows.length === 4 ? 560 : 340) + (tier - 1) * 70,
        color: streak.spin || tier === 3 ? colors.T : rows.length === 4 || tier === 2 ? colors.O : colors.I,
        dust: cells.flatMap((type, x) => Array.from({length: tier + 1}, () => ({
          x: (x + Math.random()) * CELL,
          dx: (Math.random() - .5) * 70,
          dy: -18 - Math.random() * 45,
          color: colors[type],
        }))),
      }));
    }
  }

  const game = new Tetris(Math.random, gameEffect);

  function palette() {
    const css = getComputedStyle(root);
    colors = Object.fromEntries(TYPES.map(type => [type, css.getPropertyValue("--game-piece-" + type).trim()]));
    wellColor = css.getPropertyValue("--game-well").trim();
    gridColor = css.getPropertyValue("--game-cell-line").trim();
    ghostColor = css.getPropertyValue("--game-ghost").trim();
    flashes = [];
    previews = null;
  }

  function tile(context, x, y, size, type, ghost = false) {
    if (ghost) {
      context.fillStyle = colors[type];
      context.globalAlpha = .20;
      context.fillRect(x + 3, y + 3, size - 6, size - 6);
      context.strokeStyle = ghostColor;
      context.globalAlpha = .5;
      context.lineWidth = 1.25;
      context.strokeRect(x + 3, y + 3, size - 6, size - 6);
      context.globalAlpha = 1;
      return;
    }
    context.fillStyle = colors[type];
    context.fillRect(x + 1, y + 1, size - 2, size - 2);
    context.fillStyle = "#ffffff45";
    context.fillRect(x + 2, y + 2, size - 4, Math.max(1, size * .09));
    context.fillRect(x + 2, y + 2, Math.max(1, size * .06), size - 4);
    context.fillStyle = "#08182050";
    context.fillRect(x + 2, y + size - Math.max(2, size * .12), size - 4, Math.max(1, size * .09));
    context.strokeStyle = "#08182035";
    context.lineWidth = 1;
    context.strokeRect(x + 1.5, y + 1.5, size - 3, size - 3);
  }

  function drawPiece(piece, ghost = false, rise = 0) {
    for (const [dx, dy] of CELLS[piece.type][piece.rotation]) {
      const x = (piece.x + dx) * CELL, y = (piece.y + dy - HIDDEN) * CELL;
      if (y >= 0) tile(ctx, x, y + rise, CELL, piece.type, ghost);
    }
  }

  function drawBoard(now) {
    ctx.setTransform(boardCanvas.width / BOARD_WIDTH, 0, 0, boardCanvas.height / BOARD_HEIGHT, 0, 0);
    ctx.fillStyle = wellColor;
    ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    ctx.save();
    const impact = (now - impactAt) / 110;
    if (!reduced.matches && impact >= 0 && impact < 1) ctx.translate(0, 3 * (1 - impact));
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 1; x < COLS; x++) {
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, BOARD_HEIGHT);
    }
    for (let y = 1; y < ROWS; y++) {
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(BOARD_WIDTH, y * CELL);
    }
    ctx.stroke();
    if (dropTrail && !reduced.matches) {
      const progress = Math.min(1, (now - dropTrail.start) / 210);
      ctx.globalAlpha = .2 * (1 - progress);
      ctx.fillStyle = colors[dropTrail.type];
      for (const column of dropTrail.columns) {
        ctx.fillRect(column * CELL + 2, 0, CELL - 4, dropTrail.bottom);
      }
      ctx.globalAlpha = 1;
      if (progress === 1) dropTrail = null;
    }
    for (let y = HIDDEN; y < TOTAL; y++) {
      game.board[y].forEach((type, x) => {
        if (type) tile(ctx, x * CELL, (y - HIDDEN) * CELL, CELL, type);
      });
    }
    if (game.active) {
      const ghost = game.ghostY();
      if (ghost !== game.active.y) drawPiece({...game.active, y: ghost}, true);
      const rise = reduced.matches ? 0 : -4 * Math.max(0, 1 - (now - spawnAt) / 140);
      drawPiece(game.active, false, rise);
    }
    if (!reduced.matches) {
      flashes = flashes.filter(flash => now - flash.start < flash.duration);
      for (const flash of flashes) {
        const p = (now - flash.start) / flash.duration;
        ctx.globalAlpha = (1 - p) * .65;
        ctx.fillStyle = flash.color;
        ctx.fillRect(0, flash.row * CELL, Math.min(1, p * 4 + .12) * BOARD_WIDTH, CELL);
        ctx.globalAlpha = 1 - p;
        for (const particle of flash.dust) {
          ctx.fillStyle = particle.color;
          ctx.fillRect(particle.x + particle.dx * p, (flash.row + .5) * CELL + particle.dy * p + 25 * p ** 2, 3, 3);
        }
      }
    }
    ctx.restore();
  }

  function drawPreviews() {
    const signature = [game.held, game.canHold, ...game.next].join(",");
    if (signature === previews) return;
    previews = signature;
    for (const [canvas, pieces, slots] of [[holdCanvas, [game.held], 1], [nextCanvas, game.next, 3]]) {
      const context = canvas.getContext("2d");
      const row = canvas.height / slots;
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < slots; i++) {
        const type = pieces[i];
        const center = (i + .5) * row;
        if (!type) {
          context.fillStyle = "#7C8788";
          context.fillRect(canvas.width / 2 - 10, center - 1, 20, 2);
          continue;
        }
        const cells = CELLS[type][0];
        const minX = Math.min(...cells.map(([x]) => x)), minY = Math.min(...cells.map(([, y]) => y));
        const size = slots === 3 && i === 0 ? 27 : 24;
        context.globalAlpha = canvas === holdCanvas && !game.canHold ? .38 : 1;
        const width = Math.max(...cells.map(([x]) => x)) - minX + 1;
        const height = Math.max(...cells.map(([, y]) => y)) - minY + 1;
        for (const [x, y] of cells) {
          tile(context, (canvas.width - width * size) / 2 + (x - minX) * size,
            center - height * size / 2 + (y - minY) * size, size, type);
        }
        context.globalAlpha = 1;
      }
    }
    holdCanvas.setAttribute("aria-label", game.held ? "Pieza en reserva " + game.held : "Reserva vacía");
    nextCanvas.setAttribute("aria-label", game.next.length ? "Próximas piezas " + game.next.join(", ") : "Próximas piezas al comenzar");
  }

  function syncScore() {
    const seconds = playedSeconds();
    const personalBest = Math.max(record.score, game.score);
    const values = {
      score: format.format(game.score), best: format.format(personalBest),
      time: clockText(seconds), lines: format.format(game.lines), level: format.format(game.level),
    };
    for (const [name, text] of Object.entries(values)) {
      if (stats[name].textContent === text) continue;
      stats[name].textContent = text;
      stats[name].style.setProperty("--stat-chars", text.length);
      if (name === "score" && game.score && !reduced.matches) {
        scoreAnimation?.cancel();
        scoreAnimation = stats.score.animate([{transform:"translateY(-3px)"}, {transform:"none"}], {duration:230});
      }
    }
    const bestSeconds = game.score > record.score ? seconds : record.seconds;
    const bestText = bestSeconds === null ? "" : clockText(bestSeconds);
    if (recordTime.textContent !== bestText) recordTime.textContent = bestText;
    if (recordTime.hidden !== (bestSeconds === null)) recordTime.hidden = bestSeconds === null;
  }

  function syncState() {
    if (game.status === lastStatus) return;
    lastStatus = game.status;
    root.dataset.gameState = game.status;
    overlay.hidden = game.status === "playing";
    pauseButton.disabled = !["playing", "paused"].includes(game.status);
    pauseButton.textContent = game.status === "paused" ? "Continuar" : "Pausar";
    restartButton.disabled = game.status === "idle";
    if (game.status === "playing") {
      find(".game-status").textContent = "Partida en curso.";
      return;
    }
    clearCelebration();
    stopClock();
    if (game.status !== "idle") saveResult();
    if (game.status === "over") offerRanking(game.score, playedSeconds());
    const screens = {
      idle: ["Partida individual", "Completa filas y supera tu mejor puntaje.", "Empezar"],
      paused: ["En pausa", "Tu partida queda aquí.", "Continuar"],
      over: ["Fin de la partida", resultText({score: game.score, seconds: playedSeconds()}), "Jugar de nuevo"],
    };
    const [title, message, button] = screens[game.status];
    find("[data-game-title]").textContent = title;
    find("[data-game-message]").textContent = message;
    primary.textContent = button;
    find(".game-status").textContent = game.status === "over" ? title + ". " + message : title;
    if (game.status === "over" && document.activeElement === board) primary.focus({preventScroll:true});
  }

  function draw(now = performance.now()) {
    if (celebrationUntil && now >= celebrationUntil) clearCelebration();
    syncState();
    syncScore();
    drawBoard(now);
    drawPreviews();
  }

  function clearInput() {
    pressed.clear();
    repeatAt.clear();
  }

  function repeat(now) {
    const actions = [...pressed.values()];
    const direction = actions.findLast(action => action === "left" || action === "right");
    for (const action of [direction, actions.includes("soft") ? "soft" : null]) {
      if (!action || now < repeatAt.get(action)) continue;
      let deadline = Math.max(repeatAt.get(action), now - 84);
      while (deadline <= now && game.status === "playing") {
        game.act(action);
        deadline += 42;
      }
      repeatAt.set(action, deadline);
    }
  }

  function tick(now) {
    frame = 0;
    if (game.status !== "playing") { lastFrame = null; return; }
    game.advance(lastFrame === null ? 0 : Math.min(now - lastFrame, 100));
    lastFrame = now;
    repeat(now);
    draw(now);
    if (game.status === "playing") frame = requestAnimationFrame(tick);
    else clearInput();
  }

  function run() {
    lastFrame = null;
    if (!frame) frame = requestAnimationFrame(tick);
  }

  function start() {
    setTouchEditing(false);
    offerRanking();
    if (game.status === "playing") {
      stopClock();
      saveResult();
    }
    elapsed = 0;
    activeSince = performance.now();
    clearInput();
    clearCelebration();
    flashes = [];
    dropTrail = null;
    impactAt = -Infinity;
    game.start();
    draw();
    board.focus({preventScroll:true});
    if ((touchOption.checked && touchRecommended()) || board.getBoundingClientRect().bottom > innerHeight) {
      find(".game-shell").scrollIntoView({block:"start", behavior:"instant"});
    }
    run();
  }

  function pause(focus = false) {
    if (game.status !== "playing") return;
    game.pause();
    clearInput();
    clearCelebration();
    cancelAnimationFrame(frame);
    frame = 0;
    lastFrame = null;
    flashes = [];
    dropTrail = null;
    impactAt = spawnAt = -Infinity;
    draw();
    if (focus) primary.focus({preventScroll:true});
  }

  function resume() {
    setTouchEditing(false);
    game.resume();
    activeSince = performance.now();
    draw();
    board.focus({preventScroll:true});
    run();
  }

  function press(action, source) {
    if (pressed.has(source) || game.status !== "playing") return;
    const alreadyHeld = [...pressed.values()].includes(action);
    pressed.set(source, action);
    if (alreadyHeld) return;
    game.act(action);
    if (REPEATABLE.has(action)) repeatAt.set(action, performance.now() + (action === "soft" ? 75 : 145));
    draw();
  }

  function release(source) {
    const action = pressed.get(source);
    pressed.delete(source);
    if (![...pressed.values()].includes(action)) repeatAt.delete(action);
  }

  primary.addEventListener("click", () => game.status === "paused" ? resume() : start());
  pauseButton.addEventListener("click", () => game.status === "paused" ? resume() : pause(true));
  restartButton.addEventListener("click", start);
  board.addEventListener("pointerdown", event => {
    if (event.target === boardCanvas) board.focus({preventScroll:true});
  });
  board.addEventListener("focusout", () => clearInput());
  document.addEventListener("visibilitychange", () => { if (document.hidden) pause(); });
  window.addEventListener("blur", () => pause());
  window.addEventListener("pagehide", () => pause());

  document.addEventListener("keydown", event => {
    if (dialog.open || event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
    const focused = document.activeElement;
    const pauseShortcut = event.key === "Enter" ?
      board.contains(focused) || focused === pauseButton : event.code === "Escape" && board.contains(focused);
    if (pauseShortcut && ["playing", "paused"].includes(game.status)) {
      event.preventDefault();
      if (!event.repeat) game.status === "paused" ? resume() : pause(true);
      return;
    }
    if (focused !== board || game.status !== "playing") return;
    const action = ACTIONS.find(candidate => keys[candidate] === event.code);
    if (!action) return;
    event.preventDefault();
    if (!event.repeat) press(action, "key:" + event.code);
  });
  document.addEventListener("keyup", event => release("key:" + event.code));

  function applyTouchOrder() {
    touch.replaceChildren(...touchOrder.map(action => touchButtons.get(action)));
  }

  function selectTouch(button) {
    touchSelection = button;
    for (const item of touchButtons.values()) {
      if (editingTouch) item.setAttribute("aria-pressed", String(item === button));
      else item.removeAttribute("aria-pressed");
    }
  }

  function finishTouchDrag() {
    touchDrag?.target?.classList.remove("is-touch-target");
    touchDrag = null;
  }

  function touchDestination(event, button) {
    const hit = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-touch]");
    return hit && hit !== button && touch.contains(hit) ? hit : null;
  }

  function setTouchEditing(editing) {
    if (editingTouch === editing) return;
    editingTouch = editing;
    if (editing) pause();
    finishTouchDrag();
    selectTouch(null);
    touch.toggleAttribute("data-editing", editing);
    touchTools.hidden = !editing;
    touchEdit.setAttribute("aria-expanded", String(editing));
    touchEdit.textContent = editing ? "Listo" : "Ordenar botones";
  }

  function moveTouch(button, destination) {
    const action = button.dataset.touch;
    const to = touchOrder.indexOf(destination.dataset.touch);
    touchOrder = touchOrder.filter(item => item !== action);
    touchOrder.splice(to, 0, action);
    applyTouchOrder();
    selectTouch(null);
    button.focus({preventScroll:true});
    touchStatus.textContent = button.getAttribute("aria-label") + ", posición " + (to + 1) + ".";
    persistControls();
  }

  function tapTouch(button) {
    if (touchSelection && touchSelection !== button) moveTouch(touchSelection, button);
    else selectTouch(touchSelection === button ? null : button);
  }

  touchEdit.addEventListener("click", () => setTouchEditing(!editingTouch));
  find("[data-touch-reset]").addEventListener("click", () => {
    finishTouchDrag();
    touchOrder = defaultTouchOrder;
    applyTouchOrder();
    selectTouch(null);
    touchStatus.textContent = "Orden inicial restaurado.";
    persistControls();
  });
  touchPanel.addEventListener("keydown", event => {
    if (editingTouch && event.key === "Escape") {
      setTouchEditing(false);
      touchEdit.focus({preventScroll:true});
    }
  });

  function syncTouch() {
    const enabled = touchOverride ?? touchRecommended();
    touchOption.checked = enabled;
    if (touchPanel.hidden === !enabled) return;
    touchPanel.hidden = !enabled;
    if (!enabled) setTouchEditing(false);
    clearInput();
  }
  touchOption.addEventListener("change", () => {
    touchOverride = touchOption.checked;
    syncTouch();
    persistControls();
  });
  touchPointer.addEventListener("change", syncTouch);
  narrowScreen.addEventListener("change", syncTouch);
  root.addEventListener("pointerdown", event => {
    if (event.pointerType !== "touch" || touchSeen) return;
    touchSeen = true;
    syncTouch();
  });
  for (const button of touchButtons.values()) {
    const action = button.dataset.touch;
    button.addEventListener("pointerdown", event => {
      if (event.button !== 0) return;
      if (editingTouch) {
        if (touchDrag) return;
        event.preventDefault();
        button.setPointerCapture(event.pointerId);
        touchDrag = {id:event.pointerId, x:event.clientX, y:event.clientY, target:null, moved:false};
        return;
      }
      if (game.status !== "playing") return;
      event.preventDefault();
      board.focus({preventScroll:true});
      button.setPointerCapture(event.pointerId);
      press(action, "pointer:" + event.pointerId);
    });
    button.addEventListener("pointermove", event => {
      if (touchDrag?.id !== event.pointerId) return;
      touchDrag.moved ||= Math.hypot(event.clientX - touchDrag.x, event.clientY - touchDrag.y) > 6;
      const target = touchDestination(event, button);
      if (target === touchDrag.target) return;
      touchDrag.target?.classList.remove("is-touch-target");
      touchDrag.target = target;
      target?.classList.add("is-touch-target");
    });
    for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) {
      button.addEventListener(type, event => {
        if (touchDrag?.id === event.pointerId) {
          const {moved} = touchDrag;
          const target = type === "pointerup" ? touchDestination(event, button) : null;
          finishTouchDrag();
          if (type === "pointerup") {
            if (target) moveTouch(button, target);
            else if (!moved) tapTouch(button);
          }
        }
        release("pointer:" + event.pointerId);
      });
    }
    button.addEventListener("click", event => {
      if (event.detail !== 0) return;
      if (editingTouch) {
        tapTouch(button);
        return;
      }
      game.act(action);
      draw();
    });
  }

  const keyLabels = {ArrowLeft:"←", ArrowRight:"→", ArrowDown:"↓", ArrowUp:"↑", Space:"Espacio"};
  const labelKey = code => keyLabels[code] || code.replace(/^Key|^Digit/, "");
  const bindingNames = Object.fromEntries(bindings.map(button => [button.dataset.bind, button.labels[0].textContent]));

  function syncBindings() {
    for (const button of bindings) {
      const action = button.dataset.bind;
      const label = action === waiting ? "Pulsa una tecla…" : labelKey(draftKeys[action]);
      button.textContent = label;
      button.setAttribute("aria-label", bindingNames[action] + ": " + label);
      button.classList.toggle("is-listening", action === waiting);
    }
  }

  find("[data-game-settings]").addEventListener("click", () => {
    setTouchEditing(false);
    pause();
    draftKeys = {...keys};
    waiting = null;
    bindingStatus.textContent = "";
    syncBindings();
    dialog.showModal();
  });
  for (const button of bindings) {
    button.addEventListener("click", () => {
      waiting = button.dataset.bind;
      bindingStatus.textContent = "Pulsa una tecla para " + bindingNames[waiting].toLowerCase() + ".";
      syncBindings();
    });
    button.addEventListener("blur", () => {
      if (waiting !== button.dataset.bind) return;
      waiting = null;
      syncBindings();
      bindingStatus.textContent = "Asignación cancelada.";
    });
  }
  dialog.addEventListener("keydown", event => {
    if (!waiting || event.code === "Tab" || event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.repeat) return;
    if (event.code === "Escape") {
      waiting = null;
      bindingStatus.textContent = "Asignación cancelada.";
    } else if (!assignable(event.code)) {
      bindingStatus.textContent = "Esa tecla está reservada. Elige otra.";
    } else {
      const conflict = ACTIONS.find(action => action !== waiting && draftKeys[action] === event.code);
      if (conflict) {
        bindingStatus.textContent = labelKey(event.code) + " ya está asignada a " + bindingNames[conflict].toLowerCase() + ".";
      } else {
        draftKeys[waiting] = event.code;
        bindingStatus.textContent = "Asignada " + labelKey(event.code) + " para " + bindingNames[waiting].toLowerCase() + ".";
        waiting = null;
      }
    }
    syncBindings();
  });
  find("[data-game-reset]").addEventListener("click", () => {
    draftKeys = {...DEFAULT_KEYS};
    waiting = null;
    syncBindings();
    bindingStatus.textContent = "Controles iniciales restaurados. Guarda para aplicar.";
  });
  dialog.addEventListener("close", () => {
    if (dialog.returnValue === "save") {
      keys = cleanKeys(draftKeys);
      persistControls();
    }
    dialog.returnValue = "";
    waiting = null;
  });

  palette();
  applyTouchOrder();
  syncTouch();
  showLast(savedResults?.last);
  find(".game-shell").hidden = false;
  ranking.hidden = false;
  new ResizeObserver(() => {
    const scale = Math.min(devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(boardCanvas.clientWidth * scale));
    const height = Math.max(1, Math.round(boardCanvas.clientHeight * scale));
    if (width !== boardCanvas.width) boardCanvas.width = width;
    if (height !== boardCanvas.height) boardCanvas.height = height;
    draw();
  }).observe(boardCanvas);
  new MutationObserver(() => { palette(); draw(); }).observe(document.documentElement, {attributes:true, attributeFilter:["data-jm-theme"]});
  reduced.addEventListener("change", () => {
    if (reduced.matches) {
      flashes = [];
      celebrationAnimation?.cancel();
      scoreAnimation?.cancel();
    }
    draw();
  });
  draw();
})();
