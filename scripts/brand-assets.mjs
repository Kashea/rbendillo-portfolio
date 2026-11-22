// Renders the Rival Peregrine icon set from the SVGs in public/brand.
// Run with: node scripts/brand-assets.mjs
import { copyFile, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const brand = "public/brand";
const icon = await readFile(`${brand}/rival-peregrine-icon.svg`);
const mark = await readFile(`${brand}/rival-peregrine-mark.svg`);

const png = (svg, size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();

// favicon.ico with embedded PNGs (16, 32, 48)
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(icon, s)));
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt8(0, e + 2);
  header.writeUInt8(0, e + 3);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(images[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += images[i].length;
});
await writeFile("app/favicon.ico", Buffer.concat([header, ...images]));

await copyFile(`${brand}/rival-peregrine-icon.svg`, "app/icon.svg");
await writeFile("app/apple-icon.png", await png(icon, 180));
await writeFile("public/icon-192.png", await png(icon, 192));
await writeFile("public/icon-512.png", await png(icon, 512));
await writeFile(`${brand}/rival-peregrine-mark-400.png`, await png(mark, 400));
console.log("brand assets written");
