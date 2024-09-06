import { assert, assertEquals, assertInstanceOf } from "@std/assert";
import { Color } from "./color.ts";

const black = new Color(new Uint8Array(4).fill(0));
const dark = new Color(new Uint8Array(4).fill(1));
const white = new Color(new Uint8Array(4).fill(255));
const average = new Color(new Uint8Array([85, 85, 85, 0]));

Deno.test("Color Instance", () => {
  const p = new Color();
  assertInstanceOf(p, Color);
});

Deno.test("Color Presets", () => {
  assertEquals(black.brightness, 0);
  assertEquals(white.brightness, 255);
});

Deno.test("Color Channels", () => {
  const p = new Color();
  assertEquals(p.r, 0);
  assertEquals(p.g, 0);
  assertEquals(p.b, 0);
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
  assertEquals(black.distance(black), 0);

  // Maximum distance
  assertEquals(black.distance(white), 255 * 255 * 3);
});

Deno.test("Average Color", () => {
  const avg: Color = Color.average([black, white, dark]);
  assertEquals(avg, average);
});
