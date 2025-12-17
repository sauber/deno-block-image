// import { bgRgb24, rgb24 } from "@std/fmt/colors";
import type { Color } from "./color.ts";

/** Ansi set foreground color */
function rgb24(str: string, color: Color): string {
  const { r, g, b } = color.rgb;
  return `\x1b[38;2;${r};${g};${b}m${str}`;
}

/** Ansi set background color */
function bgRgb24(str: string, color: Color): string {
  const { r, g, b } = color.rgb;
  return `\x1b[48;2;${r};${g};${b}m${str}`;
}

/** Ansi code for closing foreground color */
const rgb24close = "\x1b[39m";

/** Ansi code for closing background color */
const bgRgb24close = "\x1b[49m";

/** Build a line of colored char blocks */
export class Line {
  // Colors of previous element
  private previousForeground: Color | undefined;
  private previousBackground: Color | undefined;
  private readonly elements: string[] = [];

  /** Encode foreground color */
  private foreground(element: string, color: Color): string {
    const encoded =
      (this.previousForeground && this.previousForeground.equals(color))
        ? element
        : rgb24(element, color);
    this.previousForeground = color;
    return encoded;
  }

  /** Encode background color */
  private background(element: string, color: Color): string {
    const encoded =
      (this.previousBackground && this.previousBackground.equals(color))
        ? element
        : bgRgb24(element, color);
    this.previousBackground = color;
    return encoded;
  }

  /** Unset colors at end of line, if required */
  public reset(): string {
    return (this.previousForeground ? rgb24close : "") +
      (this.previousBackground ? bgRgb24close : "");
  }

  /** Add an element with foreground color */
  public addFg(element: string, color: Color): void {
    this.elements.push(this.foreground(element, color));
  }

  /** Add an element with background color */
  public addBg(element: string, color: Color): void {
    this.elements.push(this.background(element, color));
  }

  /** Add an element with foreground and background color */
  public addFgBg(element: string, foreground: Color, background: Color): void {
    this.elements.push(
      this.background(this.foreground(element, foreground), background),
    );
  }

  /** Add an element with no color */
  public add(element: string): void {
    this.elements.push(element);
  }

  /** Convert line to string */
  public toString(): string {
    return this.elements.join("") + this.reset();
  }
}
