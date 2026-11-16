const TETRIS_SHAPES = {
  i: {
    startX: 5,
    startY: 0,
    cells: [
      { x: -2, y: -1 },
      { x: -1, y: -1 },
      { x: 0, y: -1 },
      { x: 1, y: -1 }
    ],
    spin: "corner",
    kickType: "i_block"
  },
  o: {
    startX: 5,
    startY: -1,
    cells: [
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: -1, y: -1 },
      { x: 0, y: -1 }
    ],
    spin: "corner",
    kickType: "standard"
  },
  j: {
    startX: 4,
    startY: -1,
    cells: [
      { x: -1, y: -1 },
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 }
    ],
    spin: "block",
    kickType: "standard"
  },
  l: {
    startX: 4,
    startY: -1,
    cells: [
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: -1 }
    ],
    spin: "block",
    kickType: "standard"
  },
  s: {
    startX: 4,
    startY: -1,
    cells: [
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: -1 },
      { x: 1, y: -1 }
    ],
    spin: "block",
    kickType: "standard"
  },
  z: {
    startX: 4,
    startY: -1,
    cells: [
      { x: -1, y: -1 },
      { x: 0, y: -1 },
      { x: 0, y: 0 },
      { x: 1, y: 0 }
    ],
    spin: "block",
    kickType: "standard"
  },
  t: {
    startX: 4,
    startY: -1,
    cells: [
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: -1 },
      { x: 1, y: 0 }
    ],
    spin: "block",
    kickType: "standard"
  }
};
const PREVIEW_COUNT = 5;
const LOCK_DELAY = 500;
const DROP_PERIODS = [
  1e3,
  800,
  600,
  470,
  380,
  250,
  200,
  160,
  130,
  90,
  50,
  27,
  20,
  15,
  10
];
const ALL_PIECES = ["i", "o", "j", "l", "z", "s", "t"];
const KICKS = {
  standard: [
    {
      cw: [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: -1, y: -1 },
        { x: 0, y: 2 },
        { x: -1, y: 2 }
      ],
      ccw: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: -1 },
        { x: 0, y: 2 },
        { x: 1, y: 2 }
      ]
    },
    {
      cw: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: -2 },
        { x: 1, y: -2 }
      ],
      ccw: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: -2 },
        { x: 1, y: -2 }
      ]
    },
    {
      cw: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: -1 },
        { x: 0, y: 2 },
        { x: 1, y: 2 }
      ],
      ccw: [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: -1, y: -1 },
        { x: 0, y: 2 },
        { x: -1, y: 2 }
      ]
    },
    {
      cw: [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: -2 },
        { x: -1, y: -2 }
      ],
      ccw: [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: -2 },
        { x: -1, y: -2 }
      ]
    }
  ],
  i_block: [
    {
      cw: [
        { x: 0, y: 0 },
        { x: -2, y: 0 },
        { x: 1, y: 0 },
        { x: -2, y: 1 },
        { x: 1, y: -2 }
      ],
      ccw: [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: 2, y: 0 },
        { x: -1, y: -2 },
        { x: 2, y: 1 }
      ]
    },
    {
      cw: [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: 2, y: 0 },
        { x: -1, y: -2 },
        { x: 2, y: 1 }
      ],
      ccw: [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
        { x: -1, y: 0 },
        { x: 2, y: -1 },
        { x: -1, y: 2 }
      ]
    },
    {
      cw: [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
        { x: -1, y: 0 },
        { x: 2, y: -1 },
        { x: -1, y: 2 }
      ],
      ccw: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: -2, y: 0 },
        { x: 1, y: 2 },
        { x: -2, y: -1 }
      ]
    },
    {
      cw: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: -2, y: 0 },
        { x: 1, y: -2 },
        { x: -2, y: 1 }
      ],
      ccw: [
        { x: 0, y: 0 },
        { x: -2, y: 0 },
        { x: 1, y: 0 },
        { x: -2, y: 1 },
        { x: 1, y: -2 }
      ]
    }
  ]
};
function positionKey(x, y) {
  return `${x},${y}`;
}
function shufflePieces() {
  const pieces = [...ALL_PIECES];
  for (let i = pieces.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  return pieces;
}
function drawFromBag(bag) {
  let available = bag;
  if (available.length === 0) available = shufflePieces();
  const index = Math.floor(Math.random() * available.length);
  const [piece] = available.splice(index, 1);
  return { piece, bag: available };
}
function makeInitialState() {
  let bag = [];
  const queue = [];
  while (queue.length < PREVIEW_COUNT) {
    const draw = drawFromBag(bag);
    queue.push(draw.piece);
    bag = draw.bag;
  }
  return {
    status: "ready",
    board: {},
    active: null,
    queue,
    bag,
    heldPiece: null,
    canHold: true,
    score: 0,
    level: 1,
    linesRemaining: 5,
    combo: -1,
    lastWasBonus: false,
    backToBackCount: 0,
    timeToNextDrop: DROP_PERIODS[1],
    isBottomed: false,
    lockTimer: LOCK_DELAY,
    slideCount: 0
  };
}
function createPiece(type) {
  const shape = TETRIS_SHAPES[type];
  return {
    type,
    x: shape.startX,
    y: shape.startY,
    cells: shape.cells.map((cell) => ({ ...cell })),
    direction: 0,
    lastWasSpin: false
  };
}
function getPiecePositions(piece) {
  return piece.cells.map((cell) => ({ x: piece.x + cell.x, y: piece.y + cell.y }));
}
function isLegal(board, positions) {
  return positions.every(
    ({ x, y }) => x >= 0 && x < 10 && y < 20 && !board[positionKey(x, y)]
  );
}
function canMoveDown(state, piece = state.active) {
  return piece !== null && isLegal(
    state.board,
    getPiecePositions({ ...piece, y: piece.y + 1 })
  );
}
function makeQueueSpace(state) {
  const queue = [...state.queue];
  let bag = [...state.bag];
  while (queue.length < PREVIEW_COUNT) {
    const draw = drawFromBag(bag);
    queue.push(draw.piece);
    bag = draw.bag;
  }
  return { queue, bag };
}
function spawnNext(state, preserveHold) {
  const queue = [...state.queue];
  const type = queue.shift();
  if (!type) return { ...state, status: "over", active: null };
  const next = makeQueueSpace({ ...state, queue });
  const active = createPiece(type);
  const status = isLegal(state.board, getPiecePositions(active)) ? "playing" : "over";
  return {
    ...state,
    status,
    active,
    queue: next.queue,
    bag: next.bag,
    canHold: preserveHold ? state.canHold : true,
    timeToNextDrop: DROP_PERIODS[Math.min(state.level, DROP_PERIODS.length - 1)],
    isBottomed: false,
    lockTimer: LOCK_DELAY,
    slideCount: 0
  };
}
function createTetrisGame() {
  return makeInitialState();
}
function startTetrisGame(state) {
  const fresh = {
    ...state,
    status: "playing",
    board: {},
    active: null,
    heldPiece: null,
    canHold: true,
    score: 0,
    level: 1,
    linesRemaining: 5,
    combo: -1,
    lastWasBonus: false,
    backToBackCount: 0,
    timeToNextDrop: DROP_PERIODS[1],
    isBottomed: false,
    lockTimer: LOCK_DELAY,
    slideCount: 0
  };
  return spawnNext(fresh, false);
}
function resetLockTimer(state) {
  return {
    ...state,
    lockTimer: LOCK_DELAY,
    slideCount: state.slideCount + 1
  };
}
function moveTetrisPiece(state, dx) {
  const piece = state.active;
  if (state.status !== "playing" || !piece) return state;
  const moved = { ...piece, x: piece.x + dx, lastWasSpin: false };
  if (!isLegal(state.board, getPiecePositions(moved))) return state;
  const next = resetLockTimer({ ...state, active: moved });
  next.isBottomed = !canMoveDown(next, moved);
  return next;
}
function rotatePoint(point, piece, clockwise, spin) {
  let x = point.x - piece.x;
  let y = point.y - piece.y;
  if (spin === "corner") {
    if (x >= 0) x += 1;
    if (y >= 0) y += 1;
    const newX = (clockwise ? -1 : 1) * y;
    const newY = (clockwise ? 1 : -1) * x;
    return {
      x: piece.x + (newX > 0 ? newX - 1 : newX),
      y: piece.y + (newY > 0 ? newY - 1 : newY)
    };
  }
  return {
    x: piece.x + (clockwise ? -1 : 1) * y,
    y: piece.y + (clockwise ? 1 : -1) * x
  };
}
function rotateTetrisPiece(state, clockwise) {
  const piece = state.active;
  if (state.status !== "playing" || !piece) return state;
  const shape = TETRIS_SHAPES[piece.type];
  const kicks = KICKS[shape.kickType][piece.direction][clockwise ? "cw" : "ccw"];
  for (const kick of kicks) {
    const positions = getPiecePositions(piece).map(
      (point) => (() => {
        const rotated2 = rotatePoint(point, piece, clockwise, shape.spin);
        return { x: rotated2.x + kick.x, y: rotated2.y + kick.y };
      })()
    );
    if (!isLegal(state.board, positions)) continue;
    const base = { x: piece.x + kick.x, y: piece.y + kick.y };
    const nextDirection = (piece.direction + (clockwise ? 1 : 3)) % 4;
    const rotated = {
      ...piece,
      x: piece.x + kick.x,
      y: piece.y + kick.y,
      cells: positions.map((point) => ({
        x: point.x - base.x,
        y: point.y - base.y
      })),
      direction: nextDirection,
      lastWasSpin: true
    };
    const next = resetLockTimer({ ...state, active: rotated });
    next.isBottomed = !canMoveDown(next, rotated);
    return next;
  }
  return state;
}
function softDropOne(state) {
  const piece = state.active;
  if (!piece) return state;
  const moved = { ...piece, y: piece.y + 1, lastWasSpin: false };
  if (!isLegal(state.board, getPiecePositions(moved))) return state;
  return { ...state, active: moved, isBottomed: !canMoveDown(state, moved) };
}
function softDropTetrisPiece(state) {
  if (state.status !== "playing" || !state.active) return state;
  const dropped = softDropOne(state);
  return {
    ...dropped,
    score: dropped.score + 1,
    timeToNextDrop: DROP_PERIODS[Math.min(state.level, DROP_PERIODS.length - 1)]
  };
}
function getSpinType(state) {
  const piece = state.active;
  if (!piece?.lastWasSpin || piece.type !== "t") return null;
  const points = [
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: 1 },
    { x: -1, y: 1 }
  ];
  const miniIndices = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0]
  ][piece.direction];
  let blocked = 0;
  let openMiniCorner = false;
  points.forEach((point, index) => {
    const x = piece.x + point.x;
    const y = piece.y + point.y;
    const legal = isLegal(state.board, [{ x, y }]);
    if (!legal) blocked += 1;
    else if (miniIndices.includes(index)) openMiniCorner = true;
  });
  if (blocked >= 3) return openMiniCorner ? "mini" : "normal";
  return null;
}
function scorePlacement(state, lines, spin) {
  let linesCleared = 0;
  let isBonus = false;
  let scoreDiff = 0;
  if (spin === "mini") {
    linesCleared += 1;
    scoreDiff += 100 * state.level;
    if (lines === 1) {
      linesCleared += 1;
      scoreDiff += 100 * state.level;
    }
  } else if (spin === "normal") {
    if (lines === 0) {
      linesCleared += 4;
      scoreDiff += 400 * state.level;
    } else if (lines === 1) {
      linesCleared += 8;
      isBonus = true;
      scoreDiff += 800 * state.level;
    } else if (lines === 2) {
      linesCleared += 12;
      isBonus = true;
      scoreDiff += 1200 * state.level;
    } else if (lines === 3) {
      linesCleared += 16;
      isBonus = true;
      scoreDiff += 1600 * state.level;
    }
  } else if (lines > 0) {
    const lineValues = {
      1: [1, 100, false],
      2: [3, 300, false],
      3: [5, 500, false],
      4: [8, 800, true]
    };
    const values = lineValues[lines];
    if (values) {
      linesCleared += values[0];
      scoreDiff += values[1] * state.level;
      isBonus = values[2];
    }
  }
  let combo = state.combo;
  let backToBackCount = state.backToBackCount;
  let lastWasBonus = state.lastWasBonus;
  if (linesCleared > 0) {
    combo += 1;
    linesCleared += Math.floor(combo * 0.5);
    scoreDiff += 50 * combo * state.level;
  } else {
    combo = -1;
  }
  if (lastWasBonus && isBonus) {
    backToBackCount += 1;
    linesCleared = Math.floor(linesCleared * 1.5);
    scoreDiff += backToBackCount * 0.5 * scoreDiff;
  } else {
    backToBackCount = 0;
  }
  if (lines > 0) lastWasBonus = isBonus;
  let level = state.level;
  let linesRemaining = state.linesRemaining - linesCleared;
  let won = false;
  if (linesRemaining <= 0) {
    if (level < 15) {
      level += 1;
      linesRemaining = level * 5;
    } else {
      won = true;
    }
  }
  return {
    ...state,
    score: state.score + scoreDiff,
    level,
    linesRemaining,
    combo,
    lastWasBonus,
    backToBackCount,
    status: won ? "over" : state.status
  };
}
function clearFullRows(board) {
  const rows = [];
  for (let y = 0; y < 20; y += 1) {
    let full = true;
    for (let x = 0; x < 10; x += 1) {
      if (!board[positionKey(x, y)]) {
        full = false;
        break;
      }
    }
    if (full) rows.push(y);
  }
  if (rows.length === 0) return { board, rows };
  const cleared = new Set(rows);
  const nextBoard = {};
  Object.entries(board).forEach(([key, piece]) => {
    const [x, y] = key.split(",").map(Number);
    if (cleared.has(y)) return;
    const dropDistance = rows.filter((row) => row > y).length;
    nextBoard[positionKey(x, y + dropDistance)] = piece;
  });
  return { board: nextBoard, rows };
}
function lockActivePiece(state) {
  const piece = state.active;
  if (!piece) return state;
  const spin = getSpinType(state);
  const board = { ...state.board };
  getPiecePositions(piece).forEach(({ x, y }) => {
    board[positionKey(x, y)] = piece.type;
  });
  const cleared = clearFullRows(board);
  let next = {
    ...state,
    board: cleared.board,
    active: null,
    isBottomed: false,
    lockTimer: LOCK_DELAY,
    slideCount: 0
  };
  next = scorePlacement(next, cleared.rows.length, spin);
  if (next.status === "over") return next;
  return spawnNext(next, false);
}
function hardDropTetrisPiece(state) {
  const piece = state.active;
  if (state.status !== "playing" || !piece) return state;
  let distance = 0;
  let dropped = { ...piece };
  while (isLegal(state.board, getPiecePositions({ ...dropped, y: dropped.y + 1 }))) {
    dropped.y += 1;
    distance += 1;
  }
  if (distance > 0) dropped.lastWasSpin = false;
  const landing = {
    ...state,
    active: dropped,
    score: state.score + 2 * distance,
    isBottomed: true
  };
  return lockActivePiece(landing);
}
function holdTetrisPiece(state) {
  const piece = state.active;
  if (state.status !== "playing" || !piece || !state.canHold) return state;
  const heldPiece = piece.type;
  if (!state.heldPiece) {
    const next = spawnNext(
      { ...state, heldPiece, canHold: false, active: null },
      true
    );
    return { ...next, canHold: false };
  }
  const swapped = createPiece(state.heldPiece);
  const status = isLegal(state.board, getPiecePositions(swapped)) ? "playing" : "over";
  return {
    ...state,
    status,
    active: swapped,
    heldPiece,
    canHold: false,
    timeToNextDrop: DROP_PERIODS[Math.min(state.level, DROP_PERIODS.length - 1)],
    isBottomed: false,
    lockTimer: LOCK_DELAY,
    slideCount: 0
  };
}
function tickTetris(state, delta) {
  if (state.status !== "playing" || !state.active || delta <= 0) return state;
  const next = { ...state };
  const interval = DROP_PERIODS[Math.min(state.level, DROP_PERIODS.length - 1)];
  next.timeToNextDrop -= delta;
  while (next.timeToNextDrop < 0 && canMoveDown(next)) {
    const piece = next.active;
    next.active = { ...piece, y: piece.y + 1, lastWasSpin: false };
    next.timeToNextDrop += interval;
    next.isBottomed = !canMoveDown(next);
    if (next.isBottomed) next.lockTimer = LOCK_DELAY;
  }
  if (!canMoveDown(next)) {
    if (!state.isBottomed) {
      next.isBottomed = true;
      next.lockTimer = LOCK_DELAY;
    } else {
      next.lockTimer -= delta;
      if (next.lockTimer <= 0 || next.slideCount >= 15) {
        return lockActivePiece(next);
      }
    }
    next.timeToNextDrop = interval;
  } else {
    next.isBottomed = false;
  }
  return next;
}
function getGhostPositions(state) {
  if (!state.active) return [];
  let distance = 0;
  while (isLegal(state.board, getPiecePositions({ ...state.active, y: state.active.y + distance + 1 }))) {
    distance += 1;
  }
  return getPiecePositions({ ...state.active, y: state.active.y + distance });
}
function getMiniPieceCells(piece) {
  const cells = TETRIS_SHAPES[piece].cells;
  const minX = Math.min(...cells.map((cell) => cell.x));
  const minY = Math.min(...cells.map((cell) => cell.y));
  const maxX = Math.max(...cells.map((cell) => cell.x));
  const maxY = Math.max(...cells.map((cell) => cell.y));
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  const filled = new Set(cells.map((cell) => positionKey(cell.x - minX, cell.y - minY)));
  return {
    width,
    height,
    cells: Array.from(
      { length: width * height },
      (_, index) => filled.has(positionKey(index % width, Math.floor(index / width)))
    )
  };
}
export {
  TETRIS_SHAPES,
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
};
