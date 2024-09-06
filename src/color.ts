/** RGB dict */
export type RGB = {
  r: number;
  g: number;
  b: number;
};

export type Colors = Array<Color>;

/** Red, Green, Blue and Alpha channel represented as 4 char Uint8Array */
export class Color {
  constructor(public readonly data: Uint8Array = new Uint8Array(4)) {}

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

  /** Get RGB dict */
  get rgb(): RGB {
    return { r: this.r, g: this.g, b: this.b };
  }

  /** Average of color channel values */
  get brightness(): number {
    return (this.r + this.g + this.b) / 3;
  }

  /** Are two pixels identical */
  public equals(other: Color): boolean {
    for (let i = 0; i < 4; i++)
      if (this.data.at(i) != other.data.at(i)) return false;
    return true;
  }

  /** Sum of squared differences for each channel */
  public distance(other: Color): number {
    const sqr = (n: number) => n * n;
    const distance: number =
      sqr(this.r - other.r) + sqr(this.g - other.g) + sqr(this.b - other.b);
    return distance;
  }

  /** Average of multiple colors */
  static average(colors: Colors): Color {
    return new Color(
      new Uint8Array([
        Math.round(
          colors.map((c) => c.r).reduce((s, a) => s + a) / colors.length
        ),
        Math.round(
          colors.map((c) => c.g).reduce((s, a) => s + a) / colors.length
        ),
        Math.round(
          colors.map((c) => c.b).reduce((s, a) => s + a) / colors.length
        ),
        0,
      ])
    );
  }
}
