import { bgRgb24, rgb24 } from "@std/fmt/colors";
import { Pixel } from "./pixel.ts";

/** An array of Pixels */
type Pixels = Array<Pixel>;

/** A position and a pixel */
type Quadrant = {
  index: number;
  pixel: Pixel;
};

/** List of all quadrants in block */
type Quadrants = Array<Quadrant>;

/** A block is a 2x2 image which can be represented a terminal block char */
export class Block {
  constructor(private readonly data: Uint8Array = new Uint8Array(2 * 2 * 4)) {
    if (data.length != 16)
      throw new Error(`Data array length must be 16, is ${data.length}`);
  }

  /** Convert Uint8Array to pixels */
  private get pixels(): Pixels {
    const buffer: Uint8Array = this.data;
    return [0, 1, 2, 3].map((n) => new Pixel(buffer.slice(n * 4, n * 4 + 4)));
  }

  /** Array of positions and pixel at each position */
  private get quadrants(): Quadrants {
    const pixels = this.pixels;
    return pixels.map((p: Pixel, i: number) => ({ index: i, pixel: p }));
  }

  /** Generate ansi colored terminal block element */
  public toString(): string {
    // list of quadrants
    const q: Quadrants = this.quadrants;

    // Sort quadrants by bightness, darkest first
    const sorted: Quadrants = q.sort(
      (a, b) => a.pixel.brightness - b.pixel.brightness
    );

    // Identify the darkest quadrant
    const dark: Quadrants = [sorted.shift() as Quadrant];

    // Identify all pixels with color equal to darkest
    while (sorted.length && sorted[0].pixel.equals(dark[0].pixel)) {
      dark.push(sorted.shift() as Quadrant);
    }

    // If all pixels are identical, then only set background color and displace a blank char
    if (dark.length === 4) {
      const bgColor: Pixel = dark[0].pixel;
      return bgRgb24(" ", bgColor.rgb);
    }

    // Identify brightest pixel
    const bright: Quadrants = [sorted.pop() as Quadrant];

    // For remaining pixels, test if they are most close the darkest or
    // brightst pixel, and add to respective groups
    sorted.forEach((quadrant) => {
      if (
        quadrant.pixel.distance(dark[0].pixel) <
        quadrant.pixel.distance(bright[0].pixel)
      )
        dark.push(quadrant);
      else bright.push(quadrant);
    });

    // Average of dark and bright colors
    const bg: Pixel = Pixel.average(dark.map((p) => p.pixel));
    const fg: Pixel = Pixel.average(bright.map((p) => p.pixel));

    // Pick block element to represent brigtest pixels
    // Remaining darkest pixels will be background
    const elementIndex: number = bright
      .map((p) => p.index)
      .reduce((s, a) => s + 2 ** a, 0);
    const chars = " ▘▝▀▖▌▞▛▗▚▐▜▄▙▟█";
    const element = chars.substring(elementIndex, elementIndex + 1);

    // Color code background and foreground
    return bgRgb24(rgb24(element, fg.rgb), bg.rgb);
  }
}
