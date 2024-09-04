import { Block } from "./block.ts";

/** A 4 char representation of a color */
type Color = Uint8Array;

/** Concatination of multiple colors */
type Area = Uint8Array;

/** A line of terminal block ekements */
type Line = Array<Block>;

/** Multiple terminal lines */
type Grid = Array<Line>;

/** An image represented as Uint8Array */
export class Image {
  constructor(
    /** Number of pixels wide */
    private readonly width: number,
    /** Number of pixels high */
    private readonly height: number,
    /** Raw image data */
    protected readonly data: Uint8Array = new Uint8Array(width * height * 4)
  ) {
    if (width % 2 != 0)
      throw new Error(`Width must be even number, is ${width}`);
    if (height % 2 != 0)
      throw new Error(`Heigth must be even number, is ${height}`);
  }

  /** Translate (x,y) to array index */
  private index(x: number, y: number): number {
    return (y * this.width + x) * 4;
  }

  /** Set pixel at location */
  public set(x: number, y: number, pixel: Color): void {
    if (x < 0 || x > this.width - 1)
      throw new Error(`x (${x}) not in range 0-${this.width}`);
    if (y < 0 || y > this.height - 1)
      throw new Error(`y (${y}) not in range 0-${this.height}`);
    if (pixel.length != 4)
      throw new Error(`Pixels length is ${pixel.length}, should be 4`);
    this.data.set(pixel, this.index(x, y));
  }

  /** Get pixel at location */
  public get(x: number, y: number): Color {
    if (x < 0 || x > this.width - 1)
      throw new Error(`x (${x}) not in range 0-${this.width}`);
    if (y < 0 || y > this.height - 1)
      throw new Error(`y (${y}) not in range 0-${this.height}`);
    const offset = this.index(x, y);
    return this.data.slice(offset, offset + 4);
  }

  /** Concatinate colors */
  static join(colors: Array<Color>): Area {
    return new Uint8Array(
      colors.reduce(
        (acc: Uint8Array, curr: Uint8Array) =>
          new Uint8Array([...acc, ...curr]),
        new Uint8Array(0)
      )
    );
  }

  /** Read 2x2 pixel block from image at (x, y) */
  private block(x: number, y: number): Area {
    return Image.join([
      this.get(x, y),
      this.get(x + 1, y),
      this.get(x, y + 1),
      this.get(x + 1, y + 1),
    ]);
  }

  /** Split pixmap into blocks of 2x2 pixels */
  private get blocks(): Grid {
    const lines: Grid = [];
    for (let y = 0; y < this.height; y += 2) {
      const line: Line = [];
      for (let x = 0; x < this.width; x += 2) {
        line.push(new Block(this.block(x, y)));
      }
      lines.push(line);
    }
    return lines;
  }

  /** Convert pixmap to string printable on console */
  public toString(): string {
    return this.blocks
      .map((line) => line.map((block) => block.toString()).join(""))
      .join("\n");
  }
}
