# block-image

Display an image using block elements on terminal.

## Example

Here is an example which downloads an image, resizes the image and mirrors the
pixels as block elements:

```ts
// External imports for handling JPEG images
import { resize } from "https://deno.land/x/deno_image@0.0.4/mod.ts";
import { decode } from "https://deno.land/x/jpegts@1.1/mod.ts";

// Import
import { blockify } from "jsr:@sauber/block-image";

// Download image
const url = "https://deno.com/images/artwork/deno_minecraft.jpg";
const data = (await fetch(url)).arrayBuffer();
const originalJPEG = new Uint8Array(await data);

// Identify source dimensions
const img = decode(originalJPEG);
const width: number = img.width;
const height: number = img.height;

// Decide target dimensions. Cols is doubled because of half-width terminal chars.
const lines = 16;
const rows: number = lines * 2;
const cols: number = Math.round((width / height) * rows) * 2;

// Resize downloaded image to target dimensions
const resizedJPEG: Uint8Array = await resize(originalJPEG, {
  width: cols,
  height: rows,
  aspectRatio: false, // because half-width chars
});

// Convert resized image
const rawData: Uint8Array = decode(resizedJPEG).data;
const printable: string = blockify(rawData, cols, rows);

// Display image as terminal block elements
console.log(printable);
```

Output should look something like this:

![Image represented by block elements](./examples/example.png)

## Motivation

https://jsr.io/@garn/terminal-images has similar usage. Main differences are:

* terminal-images has a deep stack of dependencies of both Deno and Node modules. block-image only depends on two Deno std modules.
* terminal-images need to run async. block-image is sync.
* terminal-images supports many image formats and animations. block-image supports only raw pixel buffer.