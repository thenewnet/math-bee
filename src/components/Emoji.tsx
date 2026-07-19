import { useState } from 'react'

// Ảnh emoji Twemoji (SVG màu, offline) — đồng nhất & đẹp trên mọi thiết bị.
function toCodePoint(str: string, sep = '-'): string {
  const r: string[] = []
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
export function emojiFile(emoji: string): string {
  const s = emoji.indexOf(U200D) < 0 ? emoji.replace(UFE0Fg, '') : emoji
  return toCodePoint(s)
}

export function Emoji({ char, size = 40 }: { char: string; size?: number }) {
  const [err, setErr] = useState(false)
  if (err) {
    return (
      <span className="inline-block leading-none" style={{ fontSize: size * 0.9 }}>
        {char}
      </span>
    )
  }
  return (
    <img
      src={`${import.meta.env.BASE_URL}emoji/${emojiFile(char)}.svg`}
      width={size}
      height={size}
      alt={char}
      draggable={false}
      className="inline-block select-none align-middle"
      style={{ objectFit: 'contain' }}
      onError={() => setErr(true)}
    />
  )
}
