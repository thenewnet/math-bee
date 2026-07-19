import { useMemo, useState } from 'react'
import type { SortBin, SortItem } from '../types'
import { Emoji } from './Emoji'
import { playCorrect, playTap, playWrong } from '../audio/sound'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// "Phân loại": chạm một đồ vật rồi chạm nhóm (rổ) đúng để bỏ vào.
// Đúng → đồ vật vào rổ; sai → rổ nhấp đỏ, cho thử lại. Xong hết → onComplete.
export function SortBins({
  items,
  bins,
  onComplete,
}: {
  items: SortItem[]
  bins: SortBin[]
  onComplete: () => void
}) {
  const shuffled = useMemo(() => shuffle(items), [items])
  const [sel, setSel] = useState<string | null>(null)
  const [placed, setPlaced] = useState<Record<string, string>>({}) // itemId -> binId
  const [wrongBin, setWrongBin] = useState<string | null>(null)

  const remaining = shuffled.filter((it) => !placed[it.id])
  const selItem = shuffled.find((it) => it.id === sel) ?? null

  function tapItem(id: string) {
    if (placed[id]) return
    playTap()
    setSel((s) => (s === id ? null : id))
  }
  function tapBin(binId: string) {
    if (!selItem) return
    if (selItem.bin === binId) {
      playCorrect()
      const item = selItem
      setSel(null)
      setPlaced((prev) => {
        const next = { ...prev, [item.id]: binId }
        if (Object.keys(next).length === items.length) window.setTimeout(onComplete, 500)
        return next
      })
    } else {
      playWrong()
      setSel(null)
      setWrongBin(binId)
      window.setTimeout(() => setWrongBin((w) => (w === binId ? null : w)), 500)
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* Đồ vật chưa phân loại */}
      <div className="flex min-h-[72px] w-full flex-wrap items-center justify-center gap-2 rounded-3xl bg-white/70 p-3 shadow-inner">
        {remaining.length === 0 ? (
          <span className="text-lg font-extrabold text-grass-dark">Xong rồi! 🎉</span>
        ) : (
          remaining.map((it) => (
            <button
              key={it.id}
              onClick={() => tapItem(it.id)}
              className={`flex h-14 w-14 items-center justify-center rounded-2xl border-4 bg-white shadow-sm active:scale-95 ${
                sel === it.id ? 'border-honey ring-2 ring-honey' : 'border-black/10'
              }`}
            >
              <Emoji char={it.emoji} size={40} />
            </button>
          ))
        )}
      </div>

      {/* Các nhóm (rổ) */}
      <div className="grid w-full grid-cols-2 gap-3">
        {bins.map((b) => {
          const inBin = shuffled.filter((it) => placed[it.id] === b.id)
          return (
            <button
              key={b.id}
              onClick={() => tapBin(b.id)}
              className={`flex min-h-[110px] flex-col items-center gap-1 rounded-3xl border-4 p-3 shadow-inner transition ${
                wrongBin === b.id ? 'border-coral ring-2 ring-coral' : 'border-black/10'
              } ${selItem ? 'bg-honey/10' : 'bg-white/70'}`}
            >
              <span className="flex items-center gap-1 text-base font-extrabold text-ink">
                <Emoji char={b.emoji} size={26} /> {b.label}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1">
                {inBin.map((it) => (
                  <Emoji key={it.id} char={it.emoji} size={30} />
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
