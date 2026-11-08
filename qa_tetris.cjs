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
  const interval = game.gravity();
  clearRows(game, count);
  return {game, interval};
};
function clearRows(game, count) {
  for (const row of game.board) row.fill(null);
  game.active = {type:"I", x:2, y:TOTAL - 4, rotation:1};
  for (let y = TOTAL - count; y < TOTAL; y++) {
    game.board[y] = Array(COLS).fill("J");
    game.board[y][4] = null;
  }
  game.act("hard");
}
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
  const game = fresh();
  let previousGravity = Infinity, previousDelay = Infinity;
  for (const [level, maxInterval] of [[1,700], [5,220], [10,90], [15,55], [30,26], [57,20]]) {
    game.level = level;
    assert(game.gravity() < previousGravity);
    assert(game.gravity() <= maxInterval);
    assert(game.lockDelay() < previousDelay);
    previousGravity = game.gravity();
    previousDelay = game.lockDelay();
  }
  assert(game.gravity() < 30);
  game.active.y = game.ghostY();
  const delay = game.lockDelay();
  game.advance(delay - 1);
  assert(game.grounded());
  game.advance(1);
  assert.equal(game.active.y, HIDDEN - 1);
}

{
  const clears = [];
  const game = new Tetris(() => .63, (event, rows, {combo, bonus} = {}) => {
    if (event === "clear") clears.push({lines: rows.length, combo, bonus});
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

function prepareSpin(game, count, mini = false) {
  for (const row of game.board) row.fill(null);
  const x = 3, y = TOTAL - 3;
  game.board[y][x] = "J";
  game.board[y + 2][x] = "J";
  game.board[mini ? y + 2 : y][x + 2] = "J";
  if (count >= 1) {
    game.board[y + 1].fill("J");
    game.board[y + 1].fill(null, x, x + 3);
  }
  if (count === 2) {
    game.board[y].fill("J");
    game.board[y][x + 1] = null;
  }
  game.active = {type:"T", x, y, rotation:1};
}

for (const [lines, mini, score] of [[0,false,400], [1,false,800], [2,false,1200], [0,true,100], [1,true,200]]) {
  const game = fresh();
  prepareSpin(game, lines, mini);
  assert(game.act("ccw"));
  assert.equal(game.ghostY(), game.active.y);
  assert(game.act("hard"));
  assert.equal(game.lines, lines);
  assert.equal(game.score, score);
}

{
  const game = fresh();
  const x = 3, y = TOTAL - 3;
  for (let row = y; row < TOTAL; row++) game.board[row].fill("J");
  for (const [dx, dy] of CELLS.T[1]) game.board[y + dy][x + dx] = null;
  game.board[y - 2][x + 1] = "J"; // Forces the fifth 0→1 kick into the triple slot.
  game.active = {type:"T", x:x+1, y:y-2, rotation:0};
  assert(game.act("cw"));
  assert.deepEqual(game.active, {type:"T", x, y, rotation:1});
  game.act("hard");
  assert.equal(game.lines, 3);
  assert.equal(game.score, 1600);
}

{
  const game = fresh();
  prepareSpin(game, 1);
  game.active.rotation = 0;
  game.act("hard");
  assert.equal(game.score, 100, "a T in the slot needs an actual rotation");
  game.start();
  game.active = {type:"T", x:3, y:6, rotation:1};
  game.act("ccw");
  game.act("hard");
  assert(game.score < 100, "a hard drop through open space is not a spin");
}

{
  const game = fresh();
  clearRows(game, 4);
  clearRows(game, 4);
  assert.equal(game.score, 800 + 1200 + 50);
  prepareSpin(game, 0);
  game.act("ccw");
  game.act("hard");
  assert.equal(game.combo, 0);
  assert.equal(game.score, 2450);
  prepareSpin(game, 2);
  game.act("ccw");
  game.act("hard");
  assert.equal(game.score, 4250, "no-line placements preserve back-to-back, without a combo");
  clearRows(game, 1);
  assert.equal(game.backToBack, false);
  const score = game.score;
  clearRows(game, 4);
  assert.equal(game.score - score, 1600 + 200, "a normal clear breaks back-to-back but keeps the combo");
  game.start();
  assert.equal(game.backToBack, false);
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
console.log("Motor: bolsa, giros, reserva, caídas, líneas, T-Spins, combos, B2B, nivel, pausa y fin OK");
