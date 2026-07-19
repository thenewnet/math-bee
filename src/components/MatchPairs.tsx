import { useMemo, useState } from 'react'
import type { MatchCell, MatchPair } from '../types'
import { Emoji } from './Emoji'
import { ObjectGroup } from './ObjectGroup'
import { playCorrect, playTap, playWrong } from '../audio/sound'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function Cell({ cell }: { cell: MatchCell }) {
  if (cell.kind === 'digit') return <span className="text-4xl font-extrabold text-ink">{cell.value}</span>
  if (cell.kind === 'objects') return <ObjectGroup icon={cell.icon} count={cell.count} size="sm" />
  return <Emoji char={cell.char} size={48} />
}

// Bài "Nối": chạm một ô bên trái rồi chạm ô bên phải tương ứng để nối.
// Nối đúng → cặp sáng xanh; nối sai → nhấp nháy đỏ, cho thử lại (không phạt).
// Khi nối đúng hết các cặp → onComplete.
export function MatchPairs({
  pairs,
  onComplete,
}: {
  pairs: MatchPair[]
  onComplete: () => void
}) {
  const lefts = useMemo(() => shuffle(pairs), [pairs])
  const rights = useMemo(() => shuffle(pairs), [pairs])
  const [sel, setSel] = useState<string | null>(null)
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [wrong, setWrong] = useState<string | null>(null)

  const done = matched.size === pairs.length

  function tapLeft(id: string) {
    if (done || matched.has(id)) return
    playTap()
    setSel((s) => (s === id ? null : id))
  }

  function tapRight(id: string) {
    if (done || matched.has(id) || sel === null) return
    if (id === sel) {
      playCorrect()
      setSel(null)
      setMatched((prev) => {
        const next = new Set(prev).add(id)
        if (next.size === pairs.length) window.setTimeout(onComplete, 500)
        return next
      })
    } else {
      playWrong()
      setSel(null)
      setWrong(id)
      window.setTimeout(() => setWrong((w) => (w === id ? null : w)), 500)
    }
  }

  const cellBase =
    'flex min-h-[64px] items-center justify-center rounded-2xl border-4 bg-white p-2 shadow-sm transition active:scale-95'

  return (
    <div className="w-full rounded-3xl bg-white/70 p-4 shadow-inner">
      <div className="mx-auto grid max-w-md grid-cols-2 gap-x-8 gap-y-3">
        {/* Cột trái + cột phải xếp xen kẽ theo hàng để dễ nhìn trên điện thoại */}
        <div className="flex flex-col gap-3">
          {lefts.map((p) => {
            const isMatched = matched.has(p.id)
            const isSel = sel === p.id
            return (
              <button
                key={p.id}
                onClick={() => tapLeft(p.id)}
                disabled={isMatched}
                className={`${cellBase} ${
                  isMatched
                    ? 'border-grass bg-grass/15 opacity-70'
                    : isSel
                      ? 'border-honey ring-2 ring-honey'
                      : 'border-black/10'
                }`}
              >
                <Cell cell={p.left} />
                {isMatched && <span className="ml-1 text-grass-dark">✓</span>}
              </button>
            )
          })}
        </div>
        <div className="flex flex-col gap-3">
          {rights.map((p) => {
            const isMatched = matched.has(p.id)
            const isWrong = wrong === p.id
            return (
              <button
                key={p.id}
                onClick={() => tapRight(p.id)}
                disabled={isMatched}
                className={`${cellBase} ${
                  isMatched
                    ? 'border-grass bg-grass/15 opacity-70'
                    : isWrong
                      ? 'border-coral ring-2 ring-coral'
                      : 'border-black/10'
                }`}
              >
                <Cell cell={p.right} />
                {isMatched && <span className="ml-1 text-grass-dark">✓</span>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
