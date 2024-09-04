import { resize } from "https://deno.land/x/deno_image@0.0.4/mod.ts";
import { decode } from "https://deno.land/x/jpegts@1.1/mod.ts";
import { Image } from "./src/image.ts";

// Download image
const url = "https://deno.com/images/artwork/deno_minecraft.jpg";
const data = (await fetch(url)).arrayBuffer();
const raw = new Uint8Array(await data);

// Source dimensions
const img = decode(raw);
const width: number = img.width;
const height: number = img.height;

// Target dimensions. Cols is doubled because of half-width terminal chars.
const lines = 16;
const rows: number = lines * 2;
const cols: number = Math.round((width / height) * rows) * 2;

// Resize downloaded image to target dimensions
const resizedRaw = await resize(raw, {
  width: cols,
  height: rows,
  aspectRatio: false,
});

// Import decoded image
const image = new Image(cols, rows, decode(resizedRaw).data);

// Display image as terminal block elements
console.log(image.toString());
