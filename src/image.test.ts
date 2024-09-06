import { assertEquals, assertInstanceOf, assertThrows } from "@std/assert";
import { Image } from "./image.ts";

Deno.test("0x0 Image Instance", () => {
  const i: Image = new Image(new Uint8Array(0), 0, 0);
  assertInstanceOf(i, Image);
});

Deno.test("1x1 Image Instance", () => {
  assertThrows(() => new Image(new Uint8Array(0), 1, 1));
});

Deno.test("Image get Pixel", () => {
  const i: Image = new Image(new Uint8Array(4 * 4), 2, 2);
  const pixel = new Uint8Array([0, 0, 0, 0]);
  const g = i.get(0, 0);
  assertEquals(g, pixel);
  assertEquals(g.length, 4);
});
