import {
  createTetrisGame,
  getGhostPositions,
  getMiniPieceCells,
  getPiecePositions,
  hardDropTetrisPiece,
  holdTetrisPiece,
  moveTetrisPiece,
  rotateTetrisPiece,
  softDropTetrisPiece,
  startTetrisGame,
  tickTetris
} from "./tetris-engine.js";
import { getTetrisSpriteUrl } from "./tetris-sprites.js";

const sounds = {
  "game-over": new Audio(new URL("./game-over.mp3", import.meta.url).href),
  "level-up": new Audio(new URL("./level-up.mp3", import.meta.url).href),
  "line-clear": new Audio(new URL("./line-clear.mp3", import.meta.url).href),
  "move-piece": new Audio(new URL("./move-piece.mp3", import.meta.url).href),
  "piece-hits-ground": new Audio(new URL("./piece-hits-ground.mp3", import.meta.url).href),
  "rotate-piece": new Audio(new URL("./rotate-piece.mp3", import.meta.url).href),
  "tetris-clear": new Audio(new URL("./tetris-clear.mp3", import.meta.url).href)
};
Object.values(sounds).forEach((sound) => {
  sound.preload = "auto";
  sound.volume = 0.7;
});
function playSound(effect) {
  const sound = sounds[effect];
  sound.currentTime = 0;
  void sound.play().catch(() => {
  });
}
const MESSAGES = [
  "Looks like this page has disappeared.",
  "This page wandered out of the playground.",
  "The page you were looking for is gone.",
  "This page cleared itself from the board.",
  "No page here\u2014this one has moved on."
];
const boardElement = document.querySelector("#tetris-board");
const overlayElement = document.querySelector("#status-overlay");
const statusTextElement = document.querySelector("#status-text");
const holdElement = document.querySelector("#hold-box");
const nextElement = document.querySelector("#next-list");
const levelElement = document.querySelector("#level-value");
const scoreElement = document.querySelector("#score-value");
const messageElement = document.querySelector(
  "#not-found-message"
);
const boardCells = [];
for (let index = 0; index < 200; index += 1) {
  const cell = document.createElement("span");
  cell.className = "tetris-cell";
  cell.setAttribute("role", "gridcell");
  boardElement.append(cell);
  boardCells.push(cell);
}
messageElement.textContent = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
let game = createTetrisGame();
const repeaters = {};
const LINE_CLEAR_STEP_MS = 65;
let lineClearAnimation = null;
function makeMiniPiece(piece, level) {
  const shape = getMiniPieceCells(piece);
  const element = document.createElement("div");
  element.className = "tetris-mini-shape";
  element.style.gridTemplateColumns = `repeat(${shape.width}, var(--mini-cell))`;
  shape.cells.forEach((filled) => {
    const cell = document.createElement("span");
    cell.className = filled ? `tetris-mini-cell tetris-tile tetris-tile--${piece}` : "tetris-mini-cell";
    if (filled) {
      cell.style.backgroundImage = `url("${getTetrisSpriteUrl(piece, level)}")`;
    }
    element.append(cell);
  });
  return element;
}
function render(gameState) {
  const animation = lineClearAnimation;
  const board = animation ? animation.board : gameState.board;
  const activeCells = /* @__PURE__ */ new Map();
  const ghostCells = /* @__PURE__ */ new Set();
  if (!animation && gameState.active) {
    getPiecePositions(gameState.active).forEach(({ x, y }) => {
      if (y >= 0 && y < 20) activeCells.set(`${x},${y}`, gameState.active.type);
    });
  }
  if (!animation && gameState.status === "playing") {
    getGhostPositions(gameState).forEach(({ x, y }) => {
      if (y >= 0 && y < 20) ghostCells.add(`${x},${y}`);
    });
  }
  boardCells.forEach((cell, index) => {
    const x = index % 10;
    const y = Math.floor(index / 10);
    const key = `${x},${y}`;
    const isClearRow = Boolean(animation && animation.rows.includes(y));
    const isCleared =
      isClearRow && Math.min(Math.abs(x - 4), Math.abs(x - 5)) < animation.step;
    const piece = isCleared ? undefined : activeCells.get(key) ?? board[key];
    const isGhost = !piece && ghostCells.has(key);
    cell.className = [
      "tetris-cell",
      isClearRow ? "tetris-line-clear-cell" : "",
      isCleared ? "tetris-line-clear-hidden" : "",
      piece ? `tetris-tile tetris-tile--${piece}` : "",
      isGhost ? "tetris-ghost" : ""
    ].filter(Boolean).join(" ");
    cell.style.backgroundImage = piece
      ? `url("${getTetrisSpriteUrl(piece, gameState.level)}")`
      : "";
    cell.setAttribute(
      "aria-label",
      piece ? `${piece.toUpperCase()} block` : "Empty"
    );
  });
  overlayElement.hidden = animation !== null || gameState.status === "playing";
  if (gameState.status === "ready") {
    statusTextElement.className = "tetris-start-prompt";
    statusTextElement.textContent = "PRESS ENTER TO PLAY";
  } else if (gameState.status === "over") {
    statusTextElement.className = "tetris-game-over";
    statusTextElement.textContent = "GAME OVER";
  }
  holdElement.replaceChildren();
  holdElement.setAttribute(
    "aria-label",
    gameState.heldPiece ? `Held ${gameState.heldPiece.toUpperCase()} piece` : "No held piece"
  );
  if (gameState.heldPiece) {
    holdElement.append(makeMiniPiece(gameState.heldPiece, gameState.level));
  }
  nextElement.replaceChildren();
  gameState.queue.slice(0, 5).forEach((piece, index) => {
    const preview = document.createElement("div");
    preview.className = "tetris-next-box";
    preview.append(makeMiniPiece(piece, gameState.level));
    preview.setAttribute("aria-label", `Next piece ${index + 1}`);
    nextElement.append(preview);
  });
  levelElement.textContent = String(gameState.level);
  scoreElement.textContent = gameState.score.toLocaleString();
}
function getLandingBoard(state) {
  const board = { ...state.board };
  if (!state.active) return board;
  getGhostPositions(state).forEach(({ x, y }) => {
    board[`${x},${y}`] = state.active.type;
  });
  return board;
}
function findFullRows(board) {
  const rows = [];
  for (let y = 0; y < 20; y += 1) {
    if (Array.from({ length: 10 }, (_, x) => board[`${x},${y}`]).every(Boolean)) {
      rows.push(y);
    }
  }
  return rows;
}
function commit(next, previous = game) {
  if (next === game) return;
  const lockedPiece =
    previous.status === "playing" &&
    previous.active !== null &&
    next.board !== previous.board;
  const landingBoard = lockedPiece ? getLandingBoard(previous) : null;
  const clearedRows = landingBoard ? findFullRows(landingBoard) : [];

  if (clearedRows.length > 0) {
    lineClearAnimation = {
      board: landingBoard,
      rows: clearedRows,
      step: 0,
      elapsed: 0
    };
    Object.keys(repeaters).forEach((key) => delete repeaters[key]);
  }

  game = next;
  const reachedGround = !previous.isBottomed && (next.isBottomed || lockedPiece && next.active !== previous.active);
  if (reachedGround) playSound("piece-hits-ground");
  if (lockedPiece) {
    if (clearedRows.length === 4) playSound("tetris-clear");
    else if (clearedRows.length > 0) playSound("line-clear");
  }
  if (previous.status === "playing" && next.level > previous.level) {
    playSound("level-up");
  }
  if (previous.status !== "over" && next.status === "over") {
    playSound("game-over");
  }
  render(game);
}
function applyRepeatingAction(state, action) {
  let next = state;
  if (action === "left") next = moveTetrisPiece(state, -1);
  if (action === "right") next = moveTetrisPiece(state, 1);
  if (action === "down") next = softDropTetrisPiece(state);
  const moved = next.active?.x !== state.active?.x || next.active?.y !== state.active?.y;
  if (moved) playSound("move-piece");
  return next;
}
window.addEventListener("keydown", (event) => {
  if (lineClearAnimation) {
    event.preventDefault();
    return;
  }
  if (event.key === "Enter") {
    if (!event.repeat && game.status !== "playing") {
      const session = game.status === "over" ? createTetrisGame() : game;
      commit(startTetrisGame(session));
      Object.keys(repeaters).forEach((key) => delete repeaters[key]);
    }
    return;
  }
  if (game.status !== "playing") return;
  const repeatingKeys = {
    ArrowLeft: ["ArrowLeft", "left", 250],
    ArrowRight: ["ArrowRight", "right", 250],
    ArrowDown: ["ArrowDown", "down", 50]
  };
  const repeatConfig = repeatingKeys[event.key];
  if (repeatConfig) {
    event.preventDefault();
    if (event.repeat || repeaters[repeatConfig[0]]) return;
    const [key, action, firstRepeat] = repeatConfig;
    repeaters[key] = { action, elapsed: 0, nextAt: firstRepeat };
    commit(applyRepeatingAction(game, action));
    return;
  }
  if (event.key.startsWith("Arrow") || event.key === "Shift") {
    event.preventDefault();
  }
  if (event.repeat) return;
  if (event.key.toLowerCase() === "z") {
    const next = rotateTetrisPiece(game, false);
    if (next !== game) playSound("rotate-piece");
    commit(next);
  } else if (event.key.toLowerCase() === "x") {
    const next = rotateTetrisPiece(game, true);
    if (next !== game) playSound("rotate-piece");
    commit(next);
  } else if (event.key === "ArrowUp") {
    commit(hardDropTetrisPiece(game));
  } else if (event.key === "Shift") {
    commit(holdTetrisPiece(game));
  }
});
window.addEventListener("keyup", (event) => {
  delete repeaters[event.key];
});
window.addEventListener("blur", () => {
  Object.keys(repeaters).forEach((key) => delete repeaters[key]);
});
let lastTime = performance.now();
function animate(now) {
  const delta = Math.min(now - lastTime, 100);
  lastTime = now;
  if (lineClearAnimation) {
    const animation = lineClearAnimation;
    animation.elapsed += delta;
    let advanced = false;
    while (
      animation.elapsed >= LINE_CLEAR_STEP_MS &&
      animation.step < 5
    ) {
      animation.elapsed -= LINE_CLEAR_STEP_MS;
      animation.step += 1;
      advanced = true;
      render(game);
    }
    if (
      !advanced &&
      animation.step === 5 &&
      animation.elapsed >= LINE_CLEAR_STEP_MS
    ) {
      lineClearAnimation = null;
      render(game);
    }
    window.requestAnimationFrame(animate);
    return;
  }

  let current = game;
  Object.entries(repeaters).forEach(([key, repeater]) => {
    if (!repeater) return;
    repeater.elapsed += delta;
    while (repeater.elapsed >= repeater.nextAt && current.status === "playing") {
      repeater.nextAt += 50;
      current = applyRepeatingAction(current, repeater.action);
    }
    repeaters[key] = repeater;
  });
  commit(tickTetris(current, delta), current);
  window.requestAnimationFrame(animate);
}
render(game);
window.requestAnimationFrame(animate);
