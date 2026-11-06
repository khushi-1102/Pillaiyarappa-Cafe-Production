import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Minimal PNG generator without external dependencies using Node.js zlib
function createPng(width, height, drawFn) {
  // RGBA buffer: (width * 4 + 1 filter byte) * height
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression method
  ihdr[11] = 0; // Filter method
  ihdr[12] = 0; // Interlace method

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const buffer = Buffer.alloc(4 + 4 + len + 4);
  buffer.writeUInt32BE(len, 0);
  buffer.write(type, 4, 4, 'ascii');
  data.copy(buffer, 8);

  const crc = crc32(buffer.subarray(4, 8 + len));
  buffer.writeUInt32BE(crc, 8 + len);
  return buffer;
}

// Standard CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Brand drawing function (Lord Ganesha halo + Yellow wave banner + Green pure veg emblem)
function drawBrandIcon(x, y, w, h) {
  const nx = x / w; // 0 to 1
  const ny = y / h; // 0 to 1

  // Background: Deep dark #0A0A0A
  let r = 10, g = 10, b = 10, a = 255;

  // Outer border with subtle golden glow
  const cx = 0.5, cy = 0.5;
  const distCenter = Math.hypot(nx - cx, ny - cy);

  // 1. Lord Ganesha Deity Emblem on upper left (cx: 0.32, cy: 0.34, radius: 0.18)
  const dEmblem = Math.hypot(nx - 0.32, ny - 0.32);
  if (dEmblem < 0.20) {
    // Golden border
    if (dEmblem >= 0.16) {
      r = 255; g = 230; b = 0; // #FFE600
    } else {
      // Crimson red field
      r = 180; g = 20; b = 25; // #B41419
      // Ganesha golden silhouette inside
      const dHead = Math.hypot(nx - 0.32, ny - 0.30);
      if (dHead < 0.08) {
        r = 255; g = 230; b = 0; // Gold
      }
      // Trunk line
      if (Math.abs(nx - 0.32) < 0.025 && ny >= 0.30 && ny <= 0.42) {
        r = 255; g = 230; b = 0; // Gold
      }
    }
  }

  // 2. Cutlery top right (cx: 0.72, cy: 0.28)
  const dCutlery = Math.hypot(nx - 0.72, ny - 0.28);
  if (dCutlery < 0.09) {
    r = 255; g = 255; b = 255;
  }

  // 3. Stretched Yellow Banner across middle (ny: 0.46 to 0.62)
  if (ny >= 0.46 && ny <= 0.62 && nx >= 0.10 && nx <= 0.90) {
    r = 255; g = 230; b = 0; // #FFE600 Brand Yellow
    
    // Bold Green letters representation in middle of banner (ny: 0.51 to 0.57)
    if (ny >= 0.51 && ny <= 0.57 && nx >= 0.20 && nx <= 0.80) {
      // Periodic green bar marks representing letters "PILLAIYARAPPA"
      const letterPhase = (nx * 25) % 1.0;
      if (letterPhase > 0.3) {
        r = 0; g = 130; b = 55; // #008237 Brand Green
      }
    }
  }

  // 4. Pure Veg Square symbol on lower right (nx: 0.76 to 0.86, ny: 0.72 to 0.82)
  if (nx >= 0.76 && nx <= 0.86 && ny >= 0.72 && ny <= 0.82) {
    r = 255; g = 255; b = 255; // White box
    // Green dot in center
    const dDot = Math.hypot(nx - 0.81, ny - 0.77);
    if (dDot < 0.028) {
      r = 30; g = 158; b = 58; // #1E9E3A Veg Green
    }
  }

  // 5. White subtitle indicator bars "South Indian Corner" (ny: 0.74 to 0.80, nx: 0.15 to 0.70)
  if (ny >= 0.75 && ny <= 0.79 && nx >= 0.14 && nx <= 0.70) {
    const wordPhase = (nx * 15) % 1.0;
    if (wordPhase > 0.25) {
      r = 255; g = 255; b = 255; // White
    }
  }

  return [r, g, b, a];
}

// Generate files
const outDir = path.resolve(__dirname, '../public');
const iconsDir = path.resolve(__dirname, '../public/icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 1. icon-192.png
const png192 = createPng(192, 192, drawBrandIcon);
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), png192);

// 2. icon-512.png
const png512 = createPng(512, 512, drawBrandIcon);
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), png512);

// 3. icon-maskable-512.png
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512.png'), png512);

// 4. apple-touch-icon.png
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), png192);
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), png192);

console.log('Successfully generated Pillaiyarappa brand PNG icons (192x192, 512x512, apple-touch-icon)');
