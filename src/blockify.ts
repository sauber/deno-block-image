import { Image } from "./image.ts";
import { Color } from "./color.ts";
import type { Colors } from "./color.ts";
import { Line } from "./line.ts";

/** Image, Pixel and Pixel area types */
export type rawImage = Uint8Array;
type Pixel = Uint8Array;
type Area = [Pixel, Pixel, Pixel, Pixel];

/** A position and a pixel */
type Quadrant = {
  index: number;
  color: Color;
};

/** List of all quadrants in block */
type Quadrants = Array<Quadrant>;

/**
 * Convert 2x2 pixels into one block element
 *
 * @param area 4 Pixels
 * @returns Block element char, background and optional foreground color
 */
function blockElement(area: Area): [string, Color, Color?] {
  // Convert pixels to colors
  const colors: Colors = area.map((p) => new Color(p));

  // Keep track of positions
  const quadrants: Quadrants = colors.map((p: Color, i: number) => ({
    index: i,
    color: p,
  }));

  // Sort quadrants by bightness, darkest first
  const sorted: Quadrants = quadrants.sort(
    (a, b) => a.color.brightness - b.color.brightness,
  );

  // Identify the darkest quadrant
  const dark: Quadrants = [sorted.shift() as Quadrant];

  // Identify all pixels with color equal to darkest
  // BUG: If pixel has same brightness without same color, loop stops, even though subsequent pixels might have same color
  while (sorted.length && sorted[0].color.equals(dark[0].color)) {
    dark.push(sorted.shift() as Quadrant);
  }

  // If all pixels are identical, then only set background color and display a blank char
  if (dark.length === 4) {
    const bgColor: Color = dark[0].color;
    return [" ", bgColor];
  }

  // Identify brightest pixel
  const bright: Quadrants = [sorted.pop() as Quadrant];

  // For remaining pixels, test if they are most close the darkest or
  // brightest pixel, and add to respective groups
  sorted.forEach((q: Quadrant) => {
    if (q.color.distance(dark[0].color) < q.color.distance(bright[0].color)) {
      dark.push(q);
    } else bright.push(q);
  });

  // Average of dark and bright colors
  const bg: Color = Color.average(dark.map((p) => p.color));
  const fg: Color = Color.average(bright.map((p) => p.color));

  // Pick block element to represent brigtest pixels
  // Remaining darkest pixels will be background
  const elementIndex: number = bright
    .map((p) => p.index)
    .reduce((s, a) => s + 2 ** a, 0);
  const chars = " ▘▝▀▖▌▞▛▗▚▐▜▄▙▟█";
  const element = chars.substring(elementIndex, elementIndex + 1);

  // Color code background and foreground
  return [element, bg, fg];
}

/**
 * Convert raw image to ansi colored block elements.
 *
 * @param width Image is number of pixels wide Must be multiple of 2.
 * @param limit Image is number of pixels high. Must be multiple of 2.
 * @param image Image in UInt8Array byte format. 4 chars, RGBA, for each pixel.
 * @returns String printable in ansi compatible terminal.
 */
export function blockify(raw: rawImage, width: number, height: number): string {
  // Validation of dimensions
  if (width % 2 != 0) throw new Error(`Width must be even, is ${width}`);
  if (height % 2 != 0) throw new Error(`Heigth must be even, is ${height}`);

  const image = new Image(raw, width, height);

  // Assemble chars
  const lines: Array<string> = [];
  for (let y = 0; y < height; y += 2) {
    // let line = "";
    const line = new Line();
    for (let x = 0; x < width; x += 2) {
      // 2x2 pixel area from image
      const area = image.area(x, y, 2, 2) as Area;
      const [char, bg, fg] = blockElement(area);
      if (fg) line.addFgBg(char, fg, bg);
      else line.addBg(char, bg);
    }
    lines.push(line.toString());
  }
  return lines.join("\n");
}
