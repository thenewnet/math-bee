import { useRef, useState } from 'react'

// Điểm mốc theo nét viết của từng chữ số (toạ độ trong viewBox 100 x 140).
const PATHS: Record<number, [number, number][]> = {
  0: [[50, 22], [30, 40], [24, 70], [30, 100], [50, 120], [70, 100], [76, 70], [70, 40], [50, 22]],
  1: [[36, 38], [50, 24], [50, 60], [50, 90], [50, 122]],
  2: [[28, 42], [50, 24], [72, 42], [52, 74], [28, 120], [76, 120]],
  3: [[28, 34], [58, 24], [50, 60], [72, 88], [42, 122], [24, 106]],
  4: [[64, 24], [40, 62], [24, 86], [82, 86], [62, 40], [62, 124]],
  5: [[74, 26], [34, 26], [32, 62], [58, 56], [74, 88], [46, 122], [26, 110]],
  6: [[66, 28], [40, 46], [28, 80], [40, 116], [66, 104], [66, 76], [42, 70]],
  7: [[26, 28], [76, 28], [58, 76], [46, 124]],
  8: [[50, 24], [32, 42], [50, 66], [68, 42], [50, 24], [68, 92], [50, 118], [32, 92], [50, 66]],
  9: [[64, 44], [42, 28], [30, 50], [44, 68], [64, 60], [64, 92], [50, 122]],
}

export function TraceNumber({ value, onComplete }: { value: number; onComplete: () => void }) {
  const pts = PATHS[value] ?? PATHS[0]
  const svgRef = useRef<SVGSVGElement>(null)
  const [hit, setHit] = useState(0) // số mốc đã tô được (theo thứ tự)
  const drawing = useRef(false)
  const done = useRef(false)

  function toViewBox(clientX: number, clientY: number): [number, number] {
    const svg = svgRef.current
    if (!svg) return [0, 0]
    const r = svg.getBoundingClientRect()
    return [((clientX - r.left) / r.width) * 100, ((clientY - r.top) / r.height) * 140]
  }

  function tryHit(clientX: number, clientY: number) {
    if (done.current) return
    const [x, y] = toViewBox(clientX, clientY)
    setHit((cur) => {
      if (cur >= pts.length) return cur
      const [tx, ty] = pts[cur]
      const near = Math.hypot(x - tx, y - ty) < 16
      const next = near ? cur + 1 : cur
      if (next >= pts.length && !done.current) {
        done.current = true
        setTimeout(onComplete, 250)
      }
      return next
    })
  }

  return (
    <div className="flex flex-col items-center">
      <svg
        ref={svgRef}
        viewBox="0 0 100 140"
        className="h-[300px] w-[214px] touch-none rounded-3xl bg-white shadow-inner"
        onPointerDown={(e) => {
          drawing.current = true
          ;(e.target as Element).setPointerCapture?.(e.pointerId)
          tryHit(e.clientX, e.clientY)
        }}
        onPointerMove={(e) => {
          if (drawing.current) tryHit(e.clientX, e.clientY)
        }}
        onPointerUp={() => (drawing.current = false)}
        onPointerCancel={() => (drawing.current = false)}
      >
        {/* chữ số hướng dẫn mờ phía sau */}
        <text
          x="50"
          y="112"
          textAnchor="middle"
          fontSize="128"
          fontWeight="800"
          fill="#fff3d6"
          stroke="#ffcc80"
          strokeWidth="1.5"
          fontFamily="system-ui, sans-serif"
        >
          {value}
        </text>

        {/* đường nối các mốc đã tô */}
        {hit > 1 && (
          <polyline
            points={pts.slice(0, hit).map(([x, y]) => `${x},${y}`).join(' ')}
            fill="none"
            stroke="#66bb6a"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* các mốc */}
        {pts.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i === hit ? 7 : 5}
            fill={i < hit ? '#43a047' : i === hit ? '#ffb300' : '#ffe0b2'}
            stroke={i === hit ? '#ff8f00' : '#ffcc80'}
            strokeWidth="1.5"
            className={i === hit ? 'anim-bounce' : ''}
          />
        ))}
        {/* điểm bắt đầu */}
        {hit === 0 && <circle cx={pts[0][0]} cy={pts[0][1]} r="10" fill="none" stroke="#ff7043" strokeWidth="2" className="anim-bounce" />}
      </svg>
      <p className="mt-2 text-sm font-bold text-ink/60">Đặt ngón tay lên chấm cam và tô theo nét</p>
    </div>
  )
}
