const PATTERN_BY_PIECE = {
  i: "A",
  o: "A",
  t: "A",
  z: "B",
  l: "B",
  j: "C",
  s: "C",
};

const SPRITE_URLS = {
  "0A": new URL("./0A.png", import.meta.url).href,
  "0B": new URL("./0B.png", import.meta.url).href,
  "0C": new URL("./0C.png", import.meta.url).href,
  "1A": new URL("./1A.png", import.meta.url).href,
  "1B": new URL("./1B.png", import.meta.url).href,
  "1C": new URL("./1C.png", import.meta.url).href,
  "2A": new URL("./2A.png", import.meta.url).href,
  "2B": new URL("./2B.png", import.meta.url).href,
  "2C": new URL("./2C.png", import.meta.url).href,
  "3A": new URL("./3A.png", import.meta.url).href,
  "3B": new URL("./3B.png", import.meta.url).href,
  "3C": new URL("./3C.png", import.meta.url).href,
  "4A": new URL("./4A.png", import.meta.url).href,
  "4B": new URL("./4B.png", import.meta.url).href,
  "4C": new URL("./4C.png", import.meta.url).href,
  "5A": new URL("./5A.png", import.meta.url).href,
  "5B": new URL("./5B.png", import.meta.url).href,
  "5C": new URL("./5C.png", import.meta.url).href,
  "6A": new URL("./6A.png", import.meta.url).href,
  "6B": new URL("./6B.png", import.meta.url).href,
  "6C": new URL("./6C.png", import.meta.url).href,
  "7A": new URL("./7A.png", import.meta.url).href,
  "7B": new URL("./7B.png", import.meta.url).href,
  "7C": new URL("./7C.png", import.meta.url).href,
  "8A": new URL("./8A.png", import.meta.url).href,
  "8B": new URL("./8B.png", import.meta.url).href,
  "8C": new URL("./8C.png", import.meta.url).href,
  "9A": new URL("./9A.png", import.meta.url).href,
  "9B": new URL("./9B.png", import.meta.url).href,
  "9C": new URL("./9C.png", import.meta.url).href
};

export function getTetrisSpriteUrl(piece, level) {
  const pattern = PATTERN_BY_PIECE[piece];
  if (!pattern) {
    throw new Error(`No Tetris sprite pattern is defined for piece "${piece}".`);
  }

  const levelSprite = ((Math.floor(level) - 1) % 10 + 10) % 10;
  const spriteUrl = SPRITE_URLS[`${levelSprite}${pattern}`];
  if (typeof spriteUrl !== "string") {
    throw new Error(`Missing Tetris sprite: ${levelSprite}${pattern}.png`);
  }
  return spriteUrl;
}
