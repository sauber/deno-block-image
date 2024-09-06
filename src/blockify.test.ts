import { assertEquals, assertThrows } from "@std/assert";
import { blockify } from "./blockify.ts";

// Test colors
const black = new Uint8Array(4).fill(0);
const white = new Uint8Array(4).fill(255);

// Group pixels
type Pixels = Array<Uint8Array>;

// Create an image by concatinating pixels
const image = (colors: Pixels) =>
  new Uint8Array(
    colors.reduce(
      (acc: Uint8Array, curr: Uint8Array) => new Uint8Array([...acc, ...curr]),
      new Uint8Array(0)
    )
  );

// 0x0 pixels image
const noImage = image([]);

Deno.test("No Image", () => {
  const printable = blockify(noImage, 0, 0);
  assertEquals(printable, "");
});

Deno.test("Parameter validation", () => {
  assertThrows(() => blockify(noImage, 1, 1));
  assertThrows(() => blockify(noImage, 2, 1));
  assertThrows(() => blockify(noImage, 2, 2));
});

Deno.test("White Image", () => {
  const img = image([white, white, white, white]);
  const printable: string = blockify(img, 2, 2);
  console.log(printable);
  assertEquals(printable, "\x1b[48;2;255;255;255m \x1b[49m");
});

Deno.test("Chessboard Char", () => {
  const img = image([white, black, black, white]);
  const printable: string = blockify(img, 2, 2);
  assertEquals(
    printable,
    "\x1b[48;2;0;0;0m\x1b[38;2;255;255;255m▚\x1b[39m\x1b[49m"
  );
  console.log(printable);
});

Deno.test("Gradient Image", () => {
  const rows = 16;
  const cols = 36;
  const pixels: Pixels = [];
  const d = rows - 1 + cols - 1;
  for (let y = 0; y < rows; ++y) {
    for (let x = 0; x < cols; ++x) {
      // Distance to red point in lower left.
      const r: number = Math.floor(255 * (1 - (x + rows - 1 - y) / d));
      // Distance to green point in upper left.
      const g: number = Math.floor(224 * (1 - (x + y) / d));
      // Distance to blue point in upper rigth.
      const b: number = Math.floor(192 * (1 - (cols - 1 - x + y) / d));

      pixels.push(new Uint8Array([r, g, b, 0]));
    }
  }

  const img = image(pixels);
  const printable: string = blockify(img, cols, rows);
  console.log(printable);
});
