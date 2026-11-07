"use strict";
const assert = require("node:assert/strict");
const {
  Tetris, COLS, TOTAL, HIDDEN, CELLS, TYPES, DEFAULT_KEYS, cleanKeys,
} = require("./assets/tetris.js");

const fresh = () => {
  const game = new Tetris(() => .63);
  game.start();
  return game;
};

{
  const game = fresh();
  const sequence = [game.active.type, ...game.next];
  while (sequence.length < 14) sequence.push(game.draw());
  assert.deepEqual([...new Set(sequence.slice(0, 7))].sort(), [...TYPES].sort());
  assert.deepEqual([...new Set(sequence.slice(7))].sort(), [...TYPES].sort());
  assert.equal(game.next.length, 3);
}

{
  const game = fresh();
  game.active = {type:"T", x:3, y:6, rotation:0};
  assert(game.act("left"));
  assert.equal(game.active.x, 2);
  assert(game.act("right"));
  assert.equal(game.active.x, 3);
  assert(game.act("ccw"));
  assert.equal(game.active.rotation, 3);
  assert(game.act("cw"));
  assert.equal(game.active.rotation, 0);
  assert(game.act("half"));
  assert.equal(game.active.rotation, 2);
  while (game.act("left")) {}
  assert(game.collides({...game.active, x:game.active.x - 1}));
  game.active = {type:"T", x:-1, y:6, rotation:1};
  assert(!game.collides(game.active));
  assert(game.act("ccw"), "rotation near left wall should kick");
  assert.equal(game.active.x, 0);
  game.active = {type:"I", x:7, y:6, rotation:3};
  assert(!game.collides(game.active));
  assert(game.act("cw"), "I piece has its own kicks");
  assert.equal(game.active.x, 5);
  const [dx, dy] = CELLS[game.active.type][game.active.rotation][0];
  const candidate = {...game.active, y:game.active.y + 1};
  game.board[candidate.y + dy][candidate.x + dx] = "J";
  assert(game.collides(candidate));
}

{
  const game = fresh();
  const original = game.active.type, upcoming = game.next[0];
  assert(game.act("hold"));
  assert.equal(game.held, original);
  assert.equal(game.active.type, upcoming);
  assert(!game.act("hold"));
  assert(game.act("soft"));
  assert.equal(game.score, 1);
  const distance = game.ghostY() - game.active.y;
  assert(game.act("hard"));
  assert.equal(game.score, 1 + distance * 2);
  assert(game.act("hold"));
  assert.equal(game.active.type, original);
  assert(!game.act("hold"));
}

const clear = (count, existingLines = 0) => {
  const game = fresh();
  game.lines = existingLines;
  game.level = 1 + Math.floor(existingLines / 10);
  game.active = {type:"I", x:2, y:TOTAL - 4, rotation:1};
  for (let y = TOTAL - count; y < TOTAL; y++) {
    game.board[y] = Array(COLS).fill("J");
    game.board[y][4] = null;
  }
  const interval = game.gravity();
  game.act("hard");
  return {game, interval};
};
for (const [lines, score] of [[1,100], [2,300], [3,500], [4,800]]) {
  const {game} = clear(lines);
  assert.equal(game.lines, lines);
  assert.equal(game.score, score);
  assert(!game.board.some(row => row.every(Boolean)));
}
{
  const {game, interval} = clear(2, 9);
  assert.equal(game.level, 2);
  assert.equal(game.score, 300);
  assert(game.gravity() < interval);
  assert.equal(clear(4, 10).game.score, 1600);
}

{
  const clears = [];
  const game = new Tetris(() => .63, (event, rows, streak) => {
    if (event === "clear") clears.push({lines: rows.length, ...streak});
  });
  game.start();
  game.lines = 9;
  for (let y = TOTAL - 3; y < TOTAL; y++) {
    game.board[y] = [null, null, null, null, "J", "J", "J", "J", "J", "J"];
  }
  for (const [row, score] of [[TOTAL - 3, 100], [TOTAL - 2, 400], [TOTAL - 1, 800]]) {
    game.active = {type:"I", x:0, y:row - 1, rotation:0};
    game.lock();
    assert.equal(game.score, score);
  }
  assert.deepEqual(clears, [
    {lines:1, combo:1, bonus:0},
    {lines:1, combo:2, bonus:100},
    {lines:1, combo:3, bonus:200},
  ]);
  game.active = {type:"I", x:0, y:TOTAL - 2, rotation:0};
  game.lock();
  assert.equal(game.combo, 0);
  game.board[TOTAL - 1].fill("J", 8);
  game.active = {type:"I", x:4, y:TOTAL - 2, rotation:0};
  game.lock();
  assert.deepEqual(clears.at(-1), {lines:1, combo:1, bonus:0});
  assert.equal(game.score, 1000);
  game.start();
  assert.equal(game.combo, 0);
}

{
  const game = fresh();
  game.active.y = game.ghostY();
  game.advance(449);
  assert(game.grounded());
  game.advance(1);
  assert.equal(game.active.y, HIDDEN - 1);
  const next = game.next[0];
  game.board[HIDDEN - 1].fill("J");
  game.board[HIDDEN].fill("J");
  game.spawn();
  assert.equal(game.status, "over");
  assert.equal(game.active, null);
  assert(!game.act("left"));
  assert(next);
  game.start();
  assert.equal(game.status, "playing");
  assert.equal(game.score, 0);
}

{
  const game = fresh();
  const y = game.active.y;
  game.pause();
  game.advance(5000);
  assert.equal(game.active.y, y);
  assert(!game.act("hard"));
  game.resume();
  game.advance(game.gravity());
  assert.equal(game.active.y, y + 1);
  const slowFrames = fresh(), fastFrames = fresh();
  for (let i = 0; i < 45; i++) slowFrames.advance(60);
  for (let i = 0; i < 270; i++) fastFrames.advance(10);
  assert.deepEqual(slowFrames.active, fastFrames.active);
}

assert.deepEqual(cleanKeys({left:"F5"}), DEFAULT_KEYS);
assert.deepEqual(cleanKeys({...DEFAULT_KEYS, left:DEFAULT_KEYS.right}), DEFAULT_KEYS);
assert.equal(cleanKeys({...DEFAULT_KEYS, left:"KeyA"}).left, "KeyA");
console.log("Motor: bolsa, vista previa, colisiones, giros, reserva, caídas, 1–4 líneas, combos, nivel, tiempo, pausa y fin OK");
