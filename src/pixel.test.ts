import {
  assert,
  assertEquals,
  assertGreaterOrEqual,
  assertInstanceOf,
  assertLessOrEqual,
} from "@std/assert";
import { Pixel } from "./pixel.ts";

const dark = Pixel.fromValues(1, 1, 1);

Deno.test("Pixel Instance", () => {
  const p = new Pixel();
  assertInstanceOf(p, Pixel);
});

Deno.test("Pixel Presets", () => {
  const black = Pixel.black;
  assertEquals(black.brightness, 0);
  const white = Pixel.white;
  assertEquals(white.brightness, 255);
});

Deno.test("Pixel Random Color", () => {
  const p = Pixel.random;
  assertGreaterOrEqual(p.brightness, 0);
  assertLessOrEqual(p.brightness, 255);
});

Deno.test("Pixel Channels", () => {
  const p = new Pixel();
  assertEquals(p.r, 0);
  assertEquals(p.g, 0);
  assertEquals(p.b, 0);
  assertEquals(p.a, 0);
});

Deno.test("Pixel Brightness", () => {
  const p = new Pixel();
  assertEquals(p.brightness, 0);
});

Deno.test("Pixel Equality", () => {
  const p = new Pixel();
  const q = new Pixel();
  assert(p.equals(q));
});

Deno.test("Pixel Distance", () => {
  // Minimum distance
  const p = new Pixel();
  const q = new Pixel();
  assertEquals(p.distance(q), 0);

  // Maximum distance
  const b = Pixel.black;
  const w = Pixel.white;
  assertEquals(b.distance(w), 255 * 255 * 3);
});

Deno.test("Sort Pixels by Brightness", () => {
  const sorted: Array<Pixel> = Pixel.sort([Pixel.black, Pixel.white, dark]);
  assertEquals(
    sorted.map((c) => c.brightness),
    [0, 1, 255]
  );
});

Deno.test("Average color of Pixels", () => {
  const avg: Pixel = Pixel.average([Pixel.black, Pixel.white, dark]);
  assertEquals(avg, Pixel.fromValues(85, 85, 85));
});
