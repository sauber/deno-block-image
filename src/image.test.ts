import { assertEquals, assertInstanceOf, assertThrows } from "@std/assert";
import { Image } from "./image.ts";

Deno.test("0x0 Image Instance", () => {
  const i: Image = new Image(0, 0);
  assertInstanceOf(i, Image);
});

Deno.test("1x1 Image Instance", () => {
  assertThrows(() => new Image(1, 1));
});

Deno.test("Image set and get Pixel", () => {
  const i: Image = new Image(2, 2);
  const pixel = new Uint8Array([1, 1, 1, 0]);
  i.set(0, 0, pixel);
  const g = i.get(0, 0);
  assertEquals(g, pixel);
  assertEquals(g.length, 4);
});

Deno.test("Image Gradient", () => {
  const rows = 8;
  const cols = 20;
  const g = new Image(cols, rows);
  for (let x = 0; x < cols; ++x) {
    for (let y = 0; y < rows; ++y) {
      const l = Math.floor((x + y) * (255 / (rows - 1 + cols - 1)));
      g.set(x, y, new Uint8Array([l, 255 - l, l, 0]));
    }
  }
  const display = g.toString();
  const lines = display.split("\n");
  assertEquals(lines.length, rows / 2);
  console.log(g.toString());
});
