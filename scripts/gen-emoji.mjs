// Chép các file SVG Twemoji mà app dùng vào public/emoji/ (offline, giấy phép CC-BY).
import { copyFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC = join(__dirname, '..', 'node_modules', '@twemoji', 'svg')
const OUT = join(__dirname, '..', 'public', 'emoji')
mkdirSync(OUT, { recursive: true })

// Quy tắc đặt tên file của Twemoji
function toCodePoint(str, sep = '-') {
  const r = []
  let c = 0,
    p = 0,
    i = 0
  while (i < str.length) {
    c = str.charCodeAt(i++)
    if (p) {
      r.push((0x10000 + ((p - 0xd800) << 10) + (c - 0xdc00)).toString(16))
      p = 0
    } else if (0xd800 <= c && c <= 0xdbff) {
      p = c
    } else {
      r.push(c.toString(16))
    }
  }
  return r.join(sep)
}
const U200D = '‍'
const UFE0Fg = /️/g
export function emojiFile(emoji) {
  const s = emoji.indexOf(U200D) < 0 ? emoji.replace(UFE0Fg, '') : emoji
  return toCodePoint(s)
}

// Danh sách emoji app dùng làm hình minh hoạ
const EMOJIS = [
  // fruit / animal / sea / toy / food / party / nature
  '🍎','🍓','🍌','🍊','🍇','🍉','🍑','🥝',
  '🐶','🐱','🐰','🐥','🐸','🐢','🐷','🐘',
  '🐟','🐠','🐙','🦀','🐬','🐳','🦑','🐚',
  '🧸','🎠','🪀','🎈','🧩','🚗','🪁','⚽',
  '🍪','🍰','🧁','🍭','🍩','🍬','🥨','🍿',
  '🎁','🎉','⭐','🎀','🌟','🎊',
  '🌸','🌻','🌼','🍀','🌷','🌺','🍄','🌿',
  // themes: robot / hero / monster / car
  '🤖','🦾','🚀','🛸','🛰️','🔋',
  '🦸','🦹','🦸‍♂️','🦸‍♀️','🦇','⚡',
  '👾','🐲','🐉','🦖','🦕','👹','👻','🦎','🐊','🦂','🦄',
  '🚙','🚕','🏎️','🚌','🚓','🚑','🚒','🚐','🚚','🛻','🚜',
  // time of day
  '🌅','☀️','🌇','🌙',
  // size rows
  '🐭','🐜','🦁','🐤','🐍','✏️','🥕','🧵','🚂','🌭','🦒','🌲','🏢','🗼',
  // spatial + arrows
  '🐦','⬆️','⬇️','⬅️','➡️',
  // pattern
  '🔴','🔵','🟡','🟥','🟩','🟦','❤️','🔶',
  // labels / misc
  '🟰','❌','🏁','✅',
]

let copied = 0
const missing = []
for (const e of [...new Set(EMOJIS)]) {
  const name = emojiFile(e) + '.svg'
  const src = join(SRC, name)
  if (existsSync(src)) {
    copyFileSync(src, join(OUT, name))
    copied++
  } else {
    missing.push(`${e} -> ${name}`)
  }
}
console.log(`Copied ${copied} emoji SVGs to public/emoji/`)
if (missing.length) console.log('MISSING:', missing.join(', '))
