import { assertEquals } from "@std/assert";
import { Line } from "./line.ts";
import { Color } from "./color.ts";

Deno.test("Empty string", () => {
  const line = new Line();
  const str = line.toString();
  assertEquals(str, "");
});

Deno.test("Single element", () => {
  const line = new Line();
  line.add("A");
  const str = line.toString();
  assertEquals(str, "A");
});

Deno.test("Multiple elements", () => {
  const line = new Line();
  line.add("A");
  line.add("B");
  line.add("C");
  const str = line.toString();
  assertEquals(str, "ABC");
});

Deno.test("Element with foreground color", () => {
  const line = new Line();
  line.addFg("F", new Color());
  const str = line.toString();
  assertEquals(str, "\x1b[38;2;0;0;0mF\x1b[39m");
});

Deno.test("Element with background color", () => {
  const line = new Line();
  line.addBg("B", new Color());
  const str = line.toString();
  assertEquals(str, "\x1b[48;2;0;0;0mB\x1b[49m");
});

Deno.test("Element with foreground and background color", () => {
  const line = new Line();
  line.addFgBg("C", new Color(), new Color());
  const str = line.toString();
  assertEquals(str, "\x1b[48;2;0;0;0m\x1b[38;2;0;0;0mC\x1b[39m\x1b[49m");
});

Deno.test("Multiple elements with colors", () => {
  const line = new Line();
  line.addFg("A", new Color());
  line.addBg("B", new Color());
  line.addFgBg("C", new Color(), new Color());
  const str = line.toString();
  assertEquals(str, "\x1b[38;2;0;0;0mA\x1b[48;2;0;0;0mBC\x1b[39m\x1b[49m");
});
