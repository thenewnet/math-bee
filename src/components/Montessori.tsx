// Học cụ Montessori số hoá: Thanh số (Number Rods) và Hạt cườm (Bead Bars).

// Màu hạt cườm chuẩn Montessori cho số 1..10
const BEAD_COLORS: Record<number, string> = {
  1: '#e53935', // đỏ
  2: '#43a047', // xanh lá
  3: '#ec407a', // hồng
  4: '#fdd835', // vàng
  5: '#29b6f6', // xanh da trời
  6: '#8e24aa', // tím
  7: '#fafafa', // trắng
  8: '#6d4c41', // nâu
  9: '#1a237e', // xanh dương đậm
  10: '#ffb300', // vàng kim
}

function beadColor(n: number): string {
  return BEAD_COLORS[n] ?? '#90a4ae'
}

// Một thanh hạt: n hạt cùng màu (màu theo số n) — như cầu thang hạt Montessori.
export function BeadBar({
  n,
  faded = 0,
  crossed = 0,
  colorByCount = true,
  color,
  bead = 26,
}: {
  n: number
  faded?: number
  crossed?: number
  colorByCount?: boolean
  color?: string
  bead?: number
}) {
  const fill = color ?? (colorByCount ? beadColor(n) : '#ffb300')
  const light = fill === '#fafafa'
  return (
    <div className="flex flex-wrap items-center justify-center gap-1">
      {Array.from({ length: n }).map((_, i) => {
        const isFaded = i >= n - faded
        const isCrossed = i >= n - crossed
        return (
          <span
            key={i}
            className={`anim-pop relative inline-block rounded-full ${isFaded ? 'opacity-25' : ''}`}
            style={{
              width: bead,
              height: bead,
              background: `radial-gradient(circle at 32% 30%, #ffffffcc, ${fill} 62%)`,
              border: light ? '2px solid #cfd8dc' : '2px solid rgba(0,0,0,0.15)',
              boxShadow: 'inset -2px -2px 3px rgba(0,0,0,0.25)',
              animationDelay: `${i * 0.04}s`,
            }}
          >
            {isCrossed && (
              <span className="absolute left-1/2 top-1/2 h-0.5 w-[130%] -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] rounded bg-coral" />
            )}
          </span>
        )
      })}
    </div>
  )
}

// Thanh số: n đoạn xen kẽ đỏ/xanh, độ dài tỉ lệ với số lượng.
export function NumberRod({ n, unit = 26 }: { n: number; unit?: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="anim-pop flex overflow-hidden rounded-lg shadow-md"
        style={{ height: unit }}
      >
        {Array.from({ length: n }).map((_, i) => (
          <span
            key={i}
            style={{
              width: unit,
              background: i % 2 === 0 ? '#e53935' : '#1e88e5',
              borderRight: i < n - 1 ? '1px solid rgba(255,255,255,0.5)' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Hai thanh hạt cạnh nhau (dùng cho gộp/cộng)
export function BeadPair({ a, b }: { a: number; b: number }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <BeadBar n={a} />
      <BeadBar n={b} />
    </div>
  )
}
