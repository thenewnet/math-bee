// Generate PWA PNG icons (192 & 512) with a pure-JS painter — no native deps.
// Draws a friendly "Math Bee": rounded honey square + a bee with stripes and wings.
import zlib from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'public')
mkdirSync(OUT, { recursive: true })

function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1))
  }
  return ~c >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const t = Buffer.from(type, 'ascii')
  const body = Buffer.concat([t, data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body), 0)
  return Buffer.concat([len, body, crc])
}
function encodePNG(w, h, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // RGBA
  const raw = Buffer.alloc((w * 4 + 1) * h)
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4)
  }
  const idat = zlib.deflateSync(raw, { level: 9 })
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

function draw(size) {
  const buf = Buffer.alloc(size * size * 4)
  const px = (x, y, r, g, b, a = 255) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return
    const i = (y * size + x) * 4
    const ia = a / 255
    buf[i] = buf[i] * (1 - ia) + r * ia
    buf[i + 1] = buf[i + 1] * (1 - ia) + g * ia
    buf[i + 2] = buf[i + 2] * (1 - ia) + b * ia
    buf[i + 3] = Math.max(buf[i + 3], a)
  }
  const S = size
  const rr = S * 0.22 // corner radius
  // rounded-square honey gradient background
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      // rounded corner test
      const cx = Math.min(Math.max(x, rr), S - rr)
      const cy = Math.min(Math.max(y, rr), S - rr)
      const d = Math.hypot(x - cx, y - cy)
      if (d > rr) continue
      const t = y / S
      const r = 255
      const g = Math.round(200 - 40 * t)
      const b = Math.round(60 - 40 * t)
      px(x, y, r, g, b)
    }
  }
  const c = S / 2
  const disk = (cx, cy, rad, col, a = 255) => {
    for (let y = Math.floor(cy - rad); y <= cy + rad; y++)
      for (let x = Math.floor(cx - rad); x <= cx + rad; x++) {
        const d = Math.hypot(x - cx, y - cy)
        if (d <= rad) px(x, y, col[0], col[1], col[2], d > rad - 1.5 ? a * (rad - d) / 1.5 : a)
      }
  }
  // wings (white translucent)
  disk(c - S * 0.16, c - S * 0.2, S * 0.16, [255, 255, 255], 235)
  disk(c + S * 0.16, c - S * 0.2, S * 0.16, [255, 255, 255], 235)
  // body (yellow ellipse) drawn as overlapping disks
  const bodyCol = [255, 213, 79]
  const bodyR = S * 0.26
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++) {
      const dx = (x - c) / (bodyR * 0.85)
      const dy = (y - (c + S * 0.06)) / (bodyR * 1.05)
      const d = dx * dx + dy * dy
      if (d <= 1) {
        // stripes based on y
        const stripe = Math.floor((y - (c - bodyR)) / (S * 0.075)) % 2 === 0
        const col = stripe ? [40, 30, 20] : bodyCol
        const edge = d > 0.9 ? (1 - d) / 0.1 : 1
        px(x, y, col[0], col[1], col[2], 255 * Math.max(0, Math.min(1, edge)))
      }
    }
  // eyes
  disk(c - S * 0.08, c - S * 0.02, S * 0.035, [255, 255, 255])
  disk(c + S * 0.08, c - S * 0.02, S * 0.035, [255, 255, 255])
  disk(c - S * 0.075, c - S * 0.01, S * 0.017, [40, 30, 20])
  disk(c + S * 0.085, c - S * 0.01, S * 0.017, [40, 30, 20])
  return encodePNG(S, S, buf)
}

writeFileSync(join(OUT, 'icon-192.png'), draw(192))
writeFileSync(join(OUT, 'icon-512.png'), draw(512))
console.log('icons written to public/')
