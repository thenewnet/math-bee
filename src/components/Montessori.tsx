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

// ---------- Hệ thập phân hạt vàng (Golden Beads) ----------
const GOLD = '#ffb300'
function goldBead(size = 12) {
  return {
    width: size,
    height: size,
    borderRadius: '9999px',
    background: `radial-gradient(circle at 32% 30%, #fff3c4, ${GOLD} 62%)`,
    border: '1px solid rgba(0,0,0,0.15)',
    boxShadow: 'inset -1px -1px 2px rgba(0,0,0,0.25)',
  } as const
}

function HundredSquare() {
  return (
    <svg width="30" height="30" viewBox="0 0 10 10" className="anim-pop">
      <rect x="0.3" y="0.3" width="9.4" height="9.4" rx="0.6" fill={GOLD} stroke="#c88a00" strokeWidth="0.4" />
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <g key={i} stroke="#c88a00" strokeWidth="0.25" opacity="0.6">
          <line x1={i} y1="0.3" x2={i} y2="9.7" />
          <line x1="0.3" y1={i} x2="9.7" y2={i} />
        </g>
      ))}
    </svg>
  )
}
function TenBar() {
  return (
    <div className="flex flex-col gap-[1px] anim-pop">
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={i} style={goldBead(9)} />
      ))}
    </div>
  )
}

// Hiển thị một số bằng hạt vàng: trăm (ô 100), chục (thanh 10), đơn vị (hạt lẻ).
export function GoldenBeads({ value }: { value: number }) {
  const h = Math.floor(value / 100)
  const t = Math.floor((value % 100) / 10)
  const u = value % 10
  return (
    <div className="flex flex-wrap items-start justify-center gap-4">
      {h > 0 && (
        <div className="flex flex-wrap items-start gap-1">
          {Array.from({ length: h }).map((_, i) => <HundredSquare key={i} />)}
        </div>
      )}
      {t > 0 && (
        <div className="flex items-start gap-1">
          {Array.from({ length: t }).map((_, i) => <TenBar key={i} />)}
        </div>
      )}
      {u > 0 && (
        <div className="grid max-w-[64px] grid-cols-3 gap-1">
          {Array.from({ length: u }).map((_, i) => <span key={i} style={goldBead(12)} />)}
        </div>
      )}
    </div>
  )
}

// ---------- Bảng 100 ----------
export function HundredBoard({ missing }: { missing: number }) {
  return (
    <div className="grid grid-cols-10 gap-[2px]">
      {Array.from({ length: 100 }).map((_, i) => {
        const n = i + 1
        const isMissing = n === missing
        return (
          <span
            key={n}
            className={`flex h-6 w-6 items-center justify-center rounded text-[9px] font-extrabold ${
              isMissing
                ? 'bg-honey/30 text-transparent ring-2 ring-honey anim-bounce'
                : 'bg-white text-ink/80'
            }`}
          >
            {isMissing ? '?' : n}
          </span>
        )
      })}
    </div>
  )
}
