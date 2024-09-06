import {
  assert,
  assertEquals,
  assertGreaterOrEqual,
  assertInstanceOf,
  assertLessOrEqual,
} from "@std/assert";
import { Color } from "./color.ts";

const dark = Color.fromValues(1, 1, 1);

Deno.test("Color Instance", () => {
  const p = new Color();
  assertInstanceOf(p, Color);
});

Deno.test("Color Presets", () => {
  const black = Color.black;
  assertEquals(black.brightness, 0);
  const white = Color.white;
  assertEquals(white.brightness, 255);
});

Deno.test("Random Color", () => {
  const p = Color.random;
  assertGreaterOrEqual(p.brightness, 0);
  assertLessOrEqual(p.brightness, 255);
});

Deno.test("Color Channels", () => {
  const p = new Color();
  assertEquals(p.r, 0);
  assertEquals(p.g, 0);
  assertEquals(p.b, 0);
  assertEquals(p.a, 0);
});

Deno.test("Color Brightness", () => {
  const p = new Color();
  assertEquals(p.brightness, 0);
});

Deno.test("Color Equality", () => {
  const p = new Color();
  const q = new Color();
  assert(p.equals(q));
});

Deno.test("Color Distance", () => {
  // Minimum distance
  const p = new Color();
  const q = new Color();
  assertEquals(p.distance(q), 0);

  // Maximum distance
  const b = Color.black;
  const w = Color.white;
  assertEquals(b.distance(w), 255 * 255 * 3);
});

Deno.test("Sort Colors by Brightness", () => {
  const sorted: Array<Color> = Color.sort([Color.black, Color.white, dark]);
  assertEquals(
    sorted.map((c) => c.brightness),
    [0, 1, 255]
  );
});

Deno.test("Average Color", () => {
  const avg: Color = Color.average([Color.black, Color.white, dark]);
  assertEquals(avg, Color.fromValues(85, 85, 85));
});
