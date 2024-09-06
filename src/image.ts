/** A 4 char representation of a color */
type Pixel = Uint8Array;
type Pixels = Array<Pixel>;

/** An image represented as Uint8Array */
export class Image {
  constructor(
    /** Raw image data */
    protected readonly data: Uint8Array,
    /** Number of pixels wide */
    private readonly width: number,
    /** Number of pixels high */
    private readonly height: number
  ) {
    // Validation
    if (data.length != width * height * 4)
      throw new Error(
        `Image must have ${width * height} pixels, has ${data.length / 4}`
      );
  }

  /** Get pixel at location */
  public get(x: number, y: number): Pixel {
    const offset = (y * this.width + x) * 4;
    return this.data.slice(offset, offset + 4);
  }

  /** Extract an area of pixels */
  public area(x: number, y: number, width: number, height: number): Pixels {
    const pixels: Pixels = [];
    for (let row = y; row < y + height; ++row) {
      for (let col = x; col < x + width; ++col) {
        pixels.push(this.get(col, row));
      }
    }
    return pixels;
  }
}
