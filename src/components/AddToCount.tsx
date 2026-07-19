import { useState } from 'react'
import { ObjectGroup } from './ObjectGroup'
import { playCorrect, playTap } from '../audio/sound'

// "Vẽ thêm cho đủ": bắt đầu có `current` đồ vật, chạm ➕ để thêm cho đủ `target`.
// Chạm ➖ để bớt (không xuống dưới số ban đầu). Đủ `target` → onComplete.
export function AddToCount({
  icon,
  current,
  target,
  onComplete,
}: {
  icon: string
  current: number
  target: number
  onComplete: () => void
}) {
  const [count, setCount] = useState(current)
  const done = count === target

  function add() {
    if (count >= target) return
    playTap()
    const next = count + 1
    setCount(next)
    if (next === target) {
      playCorrect()
      window.setTimeout(onComplete, 500)
    }
  }
  function remove() {
    if (count <= current) return
    playTap()
    setCount((c) => c - 1)
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex min-h-[160px] w-full items-center justify-center rounded-3xl bg-white/70 p-4 shadow-inner">
        <ObjectGroup icon={icon} count={count} size="md" faded={Math.max(0, count - current)} />
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={remove}
          disabled={count <= current}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-3xl font-extrabold text-coral shadow active:scale-95 disabled:opacity-40"
          aria-label="Bớt một"
        >
          ➖
        </button>
        <div
          className={`rounded-2xl px-5 py-2 text-2xl font-extrabold shadow ${
            done ? 'bg-grass/20 text-grass-dark' : 'bg-white text-ink'
          }`}
        >
          {count} / {target}
        </div>
        <button
          onClick={add}
          disabled={count >= target}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-honey text-3xl font-extrabold text-white shadow active:scale-95 disabled:opacity-40"
          aria-label="Thêm một"
        >
          ➕
        </button>
      </div>
    </div>
  )
}
