import { useMemo, useRef, useState } from 'react'

// Tháp Hồng (Montessori): chạm các khối theo thứ tự từ NHỎ nhất đến LỚN nhất.
export function PinkTower({ sizes, onComplete }: { sizes: number[]; onComplete: () => void }) {
  // thứ tự đúng: tăng dần
  const sorted = useMemo(() => [...sizes].sort((a, b) => a - b), [sizes])
  const [placed, setPlaced] = useState<number[]>([]) // các scale đã đặt đúng
  const [wrong, setWrong] = useState<number | null>(null)
  const done = useRef(false)

  function tap(scale: number, idx: number) {
    if (done.current || placed.includes(idx)) return
    const nextExpected = sorted[placed.length]
    if (scale === nextExpected) {
      const np = [...placed, idx]
      setPlaced(np)
      setWrong(null)
      if (np.length >= sizes.length && !done.current) {
        done.current = true
        setTimeout(onComplete, 300)
      }
    } else {
      setWrong(idx)
      setTimeout(() => setWrong((w) => (w === idx ? null : w)), 400)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* tháp đang xây (các khối đã đặt đúng, xếp nhỏ→lớn) */}
      <div className="flex min-h-[70px] items-end justify-center gap-1 rounded-2xl bg-white/60 px-4 py-2 shadow-inner">
        {placed.length === 0 ? (
          <span className="text-sm font-bold text-ink/40">Xây tháp ở đây…</span>
        ) : (
          placed.map((idx, order) => {
            const s = sizes[idx]
            const px = 22 + s * 46
            return (
              <span
                key={order}
                className="anim-pop rounded-md"
                style={{ width: px, height: px, background: 'linear-gradient(160deg,#f8bbd0,#ec407a)', border: '2px solid #c2185b' }}
              />
            )
          })
        )}
      </div>

      <p className="text-sm font-bold text-ink/60">Chạm khối NHỎ nhất trước nhé!</p>

      {/* các khối để chọn */}
      <div className="flex flex-wrap items-end justify-center gap-3">
        {sizes.map((s, idx) => {
          const isPlaced = placed.includes(idx)
          const px = 26 + s * 52
          return (
            <button
              key={idx}
              onClick={() => tap(s, idx)}
              disabled={isPlaced}
              className={`rounded-lg transition active:scale-95 ${wrong === idx ? 'anim-shake' : ''} ${isPlaced ? 'opacity-20' : ''}`}
              style={{
                width: px,
                height: px,
                background: 'linear-gradient(160deg,#f8bbd0,#ec407a)',
                border: '3px solid #c2185b',
              }}
              aria-label={`khối cỡ ${Math.round(s * 100)}`}
            />
          )
        })}
      </div>
    </div>
  )
}
