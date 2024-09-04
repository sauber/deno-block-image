/** RGB dict */
export type RGB = {
  r: number;
  g: number;
  b: number;
};

export type Pixels = Array<Pixel>;

/** Red, Green, Blue and Alpha channel represented as 4 char Uint8Array */
export class Pixel {
  constructor(private readonly data: Uint8Array = new Uint8Array(4)) {
    if (data.length != 4)
      throw new Error(`Data length must be 4, is ${data.length}`);
  }

  /** A black pixel (default) */
  static get black(): Pixel {
    return new Pixel();
  }

  /** Create pixel object from number values in range 0-255 */
  static fromValues(r: number, g: number, b: number, a: number = 0) {
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255)
      throw new Error(
        `Error: (r:${r},g:${g},b:${b}) not in range(r:[0-255],g:[0-255],b:[0-255])`
      );

    return new Pixel(new Uint8Array([r, g, b, a]));
  }

  /** A white pixel */
  static get white(): Pixel {
    return Pixel.fromValues(255, 255, 255, 0);
  }

  /** A random color */
  static get random(): Pixel {
    return Pixel.fromValues(
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256)
    );
  }

  /** Red value */
  public get r(): number {
    return this.data.at(0) || 0;
  }

  /** Green value */
  public get g(): number {
    return this.data.at(1) || 0;
  }

  /** Blue value */
  public get b(): number {
    return this.data.at(2) || 0;
  }

  /** Alpha value */
  get a(): number {
    return this.data.at(3) || 0;
  }

  /** Get RGB dict */
  get rgb(): RGB {
    return { r: this.r, g: this.g, b: this.b };
  }

  /** Average of color channel values */
  get brightness(): number {
    return (this.r + this.g + this.b) / 3;
  }

  /** Are two pixels identical */
  public equals(other: Pixel): boolean {
    for (let i = 0; i < 4; i++)
      if (this.data.at(i) != other.data.at(i)) return false;
    return true;
  }

  /** Sum of squared differences for each channel */
  public distance(other: Pixel): number {
    const sqr = (n: number) => n * n;
    const distance: number =
      sqr(this.r - other.r) + sqr(this.g - other.g) + sqr(this.b - other.b);
    return distance;
  }

  /** Sort colors by brightness */
  static sort(pixels: Pixels): Pixels {
    return pixels.sort((a, b) => a.brightness - b.brightness);
  }

  /** Average of multiple colors */
  static average(pixels: Pixels): Pixel {
    if (!pixels.length) {
      throw new Error(`Error Average requires at least 1 argument.`);
    }
    return Pixel.fromValues(
      Math.round(
        pixels.map((c) => c.r).reduce((s, a) => s + a) / pixels.length
      ),
      Math.round(
        pixels.map((c) => c.g).reduce((s, a) => s + a) / pixels.length
      ),
      Math.round(pixels.map((c) => c.b).reduce((s, a) => s + a) / pixels.length)
    );
  }
}
