# deno-block-image

Display an image using block elements on terminal.

Here is an example which downloads an image, resizes the image and mirrors the
pixels as block elements:

```ts
import { Color, PixMap } from "@sauber/block-image";
import { resize } from "https://deno.land/x/deno_image/mod.ts";
import { decode } from "https://deno.land/x/jpegts@1.1/mod.ts";

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

// Copy pixels from resized image to Block PixMap
const blocks = new PixMap(cols, rows);
const resized = decode(resizedRaw);
for (let col = 0; col < cols; ++col) {
  for (let row = 0; row < rows; ++row) {
    const { r, g, b } = resized.getPixel(col, row) as {
      r: number;
      g: number;
      b: number;
    };
    blocks.set(col, row, new Color(r, g, b));
  }
}

// Display blocks
console.log(blocks.toString());
```

Output should look something like this:

![Image represented by block elements](./examples/example.png)
