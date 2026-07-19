import { useState } from 'react'
import { BeeSvg } from './Mascot'

// Cổng nhập mã PIN để vào khu quản trị (dành cho phụ huynh).
export function PinGate({
  pin,
  onSuccess,
  onCancel,
}: {
  pin: string
  onSuccess: () => void
  onCancel: () => void
}) {
  const [entry, setEntry] = useState('')
  const [error, setError] = useState(false)
  const len = pin.length || 4

  function press(d: string) {
    if (entry.length >= len) return
    const next = entry + d
    setError(false)
    if (next.length === len) {
      if (next === pin) {
        onSuccess()
      } else {
        setError(true)
        setTimeout(() => setEntry(''), 350)
        setEntry(next)
        return
      }
    }
    setEntry(next)
  }

  return (
    <div className="mx-auto flex min-h-full max-w-sm flex-col items-center justify-center gap-6 p-6">
      <BeeSvg size={80} />
      <div className="text-center">
        <h1 className="text-xl font-extrabold text-honey-dark">Khu dành cho phụ huynh</h1>
        <p className="text-sm font-bold text-ink/60">Nhập mã PIN để tiếp tục</p>
      </div>

      <div className={`flex gap-3 ${error ? 'anim-shake' : ''}`}>
        {Array.from({ length: len }).map((_, i) => (
          <span
            key={i}
            className={`h-5 w-5 rounded-full border-2 ${
              i < entry.length ? 'border-honey bg-honey' : 'border-ink/25'
            }`}
          />
        ))}
      </div>
      {error && <p className="text-sm font-bold text-coral">Sai mã PIN, thử lại nhé!</p>}

      <div className="grid grid-cols-3 gap-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button
            key={d}
            onClick={() => press(d)}
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-extrabold text-ink shadow active:scale-95"
          >
            {d}
          </button>
        ))}
        <button
          onClick={onCancel}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black/5 text-sm font-extrabold text-ink/60 active:scale-95"
        >
          Huỷ
        </button>
        <button
          onClick={() => press('0')}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-extrabold text-ink shadow active:scale-95"
        >
          0
        </button>
        <button
          onClick={() => setEntry((e) => e.slice(0, -1))}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black/5 text-2xl active:scale-95"
        >
          ⌫
        </button>
      </div>
    </div>
  )
}
