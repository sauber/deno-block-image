import { assertEquals, assertInstanceOf } from "@std/assert";
import { Block } from "./block.ts";
import { Image } from "./image.ts";

const black = new Uint8Array(4);
const white = new Uint8Array(4).fill(255);

/** Join pixels into char */
function block(chars: Array<Uint8Array>): Block {
  return new Block(Image.join(chars));
}

Deno.test("Block Instance", () => {
  const c: Block = new Block();
  assertInstanceOf(c, Block);
});

Deno.test("White Char", () => {
  const w: Block = block([white, white, white, white]);
  const s: string = w.toString();
  assertEquals(s, "\x1b[48;2;255;255;255m \x1b[49m");
  console.log(s);
});

Deno.test("Chessboard Char", () => {
  const c: Block = block([white, black, black, white]);
  const s: string = c.toString();
  assertEquals(s, "\x1b[48;2;0;0;0m\x1b[38;2;255;255;255m▚\x1b[39m\x1b[49m");
  console.log(s);
});
