// Nhân vật GỐC do Math Bee tự thiết kế (SVG) — quái vật, robot, siêu nhân.
// KHÔNG sao chép nhân vật có bản quyền. Bản quyền thuộc về ứng dụng.
import { Emoji } from './Emoji'

function Eyes({ y = 52 }: { y?: number }) {
  return (
    <>
      <circle cx="40" cy={y} r="8" fill="#fff" />
      <circle cx="60" cy={y} r="8" fill="#fff" />
      <circle cx="41" cy={y + 2} r="3.6" fill="#241c2b" />
      <circle cx="61" cy={y + 2} r="3.6" fill="#241c2b" />
    </>
  )
}
function Cheeks() {
  return (
    <>
      <circle cx="30" cy="63" r="4" fill="#ff8a80" opacity="0.7" />
      <circle cx="70" cy="63" r="4" fill="#ff8a80" opacity="0.7" />
    </>
  )
}
function Smile() {
  return <path d="M42 64 Q50 72 58 64" stroke="#241c2b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
}

// ---------- Quái vật ----------
function Monster({ id }: { id: string }) {
  switch (id) {
    case 'slime':
      return (
        <g>
          <path d="M50 20 C74 20 82 42 82 60 C82 82 66 88 50 88 C34 88 18 82 18 60 C18 42 26 20 50 20 Z" fill="#66bb6a" stroke="#2e7d32" strokeWidth="2" />
          <Eyes /><Cheeks /><Smile />
        </g>
      )
    case 'spike':
      return (
        <g>
          <polygon points="50,8 40,26 60,26" fill="#7e57c2" />
          <polygon points="30,16 26,30 42,26" fill="#7e57c2" />
          <polygon points="70,16 74,30 58,26" fill="#7e57c2" />
          <ellipse cx="50" cy="58" rx="32" ry="30" fill="#9575cd" stroke="#5e35b1" strokeWidth="2" />
          <Eyes /><Cheeks /><ellipse cx="50" cy="66" rx="4" ry="5" fill="#241c2b" />
        </g>
      )
    case 'ears':
      return (
        <g>
          <circle cx="26" cy="30" r="12" fill="#42a5f5" /><circle cx="74" cy="30" r="12" fill="#42a5f5" />
          <circle cx="26" cy="30" r="6" fill="#bbdefb" /><circle cx="74" cy="30" r="6" fill="#bbdefb" />
          <ellipse cx="50" cy="58" rx="30" ry="30" fill="#64b5f6" stroke="#1976d2" strokeWidth="2" />
          <Eyes /><Cheeks /><Smile />
        </g>
      )
    case 'horn':
      return (
        <g>
          <polygon points="50,6 44,28 56,28" fill="#ffca28" stroke="#f9a825" strokeWidth="1.5" />
          <path d="M50 22 C76 22 84 44 82 62 C80 84 62 90 50 90 C38 90 20 84 18 62 C16 44 24 22 50 22 Z" fill="#ff8a65" stroke="#e64a19" strokeWidth="2" />
          <Eyes /><Cheeks /><Smile />
        </g>
      )
    case 'star':
      return (
        <g>
          <polygon points="50,10 61,38 92,38 67,57 76,88 50,69 24,88 33,57 8,38 39,38" fill="#ec407a" stroke="#c2185b" strokeWidth="2" strokeLinejoin="round" />
          <g transform="translate(0,6)"><Eyes /><Smile /></g>
        </g>
      )
    default: // bot creature
      return (
        <g>
          <line x1="50" y1="8" x2="50" y2="20" stroke="#78909c" strokeWidth="3" /><circle cx="50" cy="8" r="5" fill="#ff5252" />
          <rect x="22" y="24" width="56" height="52" rx="12" fill="#90a4ae" stroke="#546e7a" strokeWidth="2" />
          <rect x="30" y="44" width="40" height="20" rx="6" fill="#263238" />
          <circle cx="41" cy="54" r="5" fill="#4fc3f7" /><circle cx="59" cy="54" r="5" fill="#4fc3f7" />
        </g>
      )
  }
}

// ---------- Robot ----------
function Robot({ id }: { id: string }) {
  switch (id) {
    case 'dome':
      return (
        <g>
          <line x1="50" y1="6" x2="50" y2="18" stroke="#607d8b" strokeWidth="3" /><circle cx="50" cy="6" r="4" fill="#ffca28" />
          <path d="M20 60 A30 34 0 0 1 80 60 Z" fill="#b0bec5" stroke="#546e7a" strokeWidth="2" />
          <rect x="20" y="60" width="60" height="22" rx="6" fill="#90a4ae" stroke="#546e7a" strokeWidth="2" />
          <rect x="30" y="40" width="40" height="16" rx="8" fill="#263238" />
          <circle cx="42" cy="48" r="5" fill="#69f0ae" /><circle cx="58" cy="48" r="5" fill="#69f0ae" />
          <rect x="42" y="70" width="16" height="4" rx="2" fill="#546e7a" />
        </g>
      )
    case 'tread':
      return (
        <g>
          <rect x="28" y="16" width="44" height="40" rx="10" fill="#7986cb" stroke="#3949ab" strokeWidth="2" />
          <rect x="35" y="26" width="30" height="14" rx="5" fill="#1a237e" />
          <circle cx="45" cy="33" r="4" fill="#ffd54f" /><circle cx="55" cy="33" r="4" fill="#ffd54f" />
          <rect x="20" y="60" width="60" height="20" rx="10" fill="#455a64" />
          <circle cx="32" cy="70" r="7" fill="#90a4ae" stroke="#263238" strokeWidth="2" />
          <circle cx="68" cy="70" r="7" fill="#90a4ae" stroke="#263238" strokeWidth="2" />
        </g>
      )
    case 'rocket':
      return (
        <g>
          <path d="M50 8 C64 22 66 44 62 64 L38 64 C34 44 36 22 50 8 Z" fill="#ef5350" stroke="#c62828" strokeWidth="2" />
          <circle cx="50" cy="38" r="9" fill="#e1f5fe" stroke="#0288d1" strokeWidth="2" />
          <polygon points="38,58 26,74 40,66" fill="#ff8a65" /><polygon points="62,58 74,74 60,66" fill="#ff8a65" />
          <polygon points="44,66 50,86 56,66" fill="#ffca28" />
        </g>
      )
    case 'claw':
      return (
        <g>
          <path d="M30 40 L22 26 M70 40 L78 26" stroke="#607d8b" strokeWidth="4" strokeLinecap="round" />
          <circle cx="20" cy="24" r="5" fill="#ff7043" /><circle cx="80" cy="24" r="5" fill="#ff7043" />
          <rect x="26" y="38" width="48" height="44" rx="12" fill="#4db6ac" stroke="#00695c" strokeWidth="2" />
          <rect x="34" y="50" width="32" height="16" rx="6" fill="#00332e" />
          <circle cx="44" cy="58" r="5" fill="#b2ff59" /><circle cx="56" cy="58" r="5" fill="#b2ff59" />
        </g>
      )
    default: // box
      return (
        <g>
          <line x1="50" y1="8" x2="50" y2="20" stroke="#78909c" strokeWidth="3" /><circle cx="50" cy="8" r="5" fill="#ff5252" />
          <rect x="24" y="22" width="52" height="50" rx="10" fill="#78909c" stroke="#455a64" strokeWidth="2" />
          <rect x="32" y="40" width="36" height="18" rx="6" fill="#1c2b33" />
          <circle cx="42" cy="49" r="5" fill="#4fc3f7" /><circle cx="58" cy="49" r="5" fill="#4fc3f7" />
          <rect x="18" y="78" width="20" height="8" rx="4" fill="#546e7a" /><rect x="62" y="78" width="20" height="8" rx="4" fill="#546e7a" />
        </g>
      )
  }
}

// ---------- Siêu nhân (nhân vật gốc) ----------
function Hero({ id }: { id: string }) {
  const emblem: Record<string, string> = { bolt: '⚡', star: '★', shield: '🛡', cape: '✦', mask: '◆' }
  const color: Record<string, [string, string]> = {
    cape: ['#42a5f5', '#1565c0'],
    mask: ['#ab47bc', '#6a1b9a'],
    bolt: ['#ffca28', '#f57f17'],
    star: ['#ef5350', '#b71c1c'],
    shield: ['#26a69a', '#00695c'],
  }
  const [c1, c2] = color[id] ?? color.cape
  return (
    <g>
      {/* áo choàng */}
      <path d="M32 40 L20 82 L50 74 L80 82 L68 40 Z" fill={c2} opacity="0.55" />
      {/* thân */}
      <path d="M35 40 C35 32 65 32 65 40 L64 74 C58 80 42 80 36 74 Z" fill={c1} stroke={c2} strokeWidth="2" />
      {/* đầu + mặt nạ */}
      <circle cx="50" cy="26" r="15" fill="#ffcc80" />
      <path d="M35 24 Q50 14 65 24 L62 30 Q50 24 38 30 Z" fill={c2} />
      <circle cx="44" cy="27" r="2.4" fill="#241c2b" /><circle cx="56" cy="27" r="2.4" fill="#241c2b" />
      <path d="M45 33 Q50 37 55 33" stroke="#241c2b" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* huy hiệu ngực */}
      <circle cx="50" cy="56" r="10" fill="#fff" opacity="0.9" />
      <text x="50" y="61" textAnchor="middle" fontSize="14" fill={c2} fontWeight="800">{emblem[id] ?? '★'}</text>
    </g>
  )
}

// ---------- Xe cộ (nhân vật gốc, có mặt cười) ----------
function Wheels() {
  return (
    <>
      <circle cx="30" cy="78" r="10" fill="#37474f" /><circle cx="30" cy="78" r="4" fill="#b0bec5" />
      <circle cx="70" cy="78" r="10" fill="#37474f" /><circle cx="70" cy="78" r="4" fill="#b0bec5" />
    </>
  )
}
function CarFace({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const cx = x + w / 2
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx="4" fill="#b3e5fc" stroke="#4fc3f7" strokeWidth="1.5" />
      <circle cx={cx - 7} cy={y + h / 2} r="3.2" fill="#241c2b" />
      <circle cx={cx + 7} cy={y + h / 2} r="3.2" fill="#241c2b" />
      <path d={`M${cx - 6} ${y + h / 2 + 4} Q${cx} ${y + h / 2 + 8} ${cx + 6} ${y + h / 2 + 4}`} stroke="#241c2b" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </>
  )
}
function Car({ id }: { id: string }) {
  switch (id) {
    case 'truck':
      return (
        <g>
          <rect x="10" y="48" width="42" height="28" rx="5" fill="#42a5f5" stroke="#1976d2" strokeWidth="2" />
          <path d="M52 54 h22 l10 12 v10 h-32 Z" fill="#64b5f6" stroke="#1976d2" strokeWidth="2" />
          <CarFace x={58} y={56} w={18} h={13} />
          <circle cx="80" cy="60" r="2.5" fill="#fff59d" />
          <Wheels />
        </g>
      )
    case 'bus':
      return (
        <g>
          <rect x="8" y="40" width="84" height="38" rx="10" fill="#ffca28" stroke="#f9a825" strokeWidth="2" />
          <rect x="14" y="46" width="14" height="12" rx="2" fill="#b3e5fc" />
          <rect x="60" y="46" width="14" height="12" rx="2" fill="#b3e5fc" />
          <CarFace x={33} y={46} w={22} h={13} />
          <Wheels />
        </g>
      )
    case 'race':
      return (
        <g>
          <path d="M8 68 Q20 58 44 56 L58 46 Q66 42 74 50 L88 56 Q94 60 92 68 Z" fill="#66bb6a" stroke="#2e7d32" strokeWidth="2" />
          <rect x="80" y="42" width="4" height="16" fill="#2e7d32" /><rect x="74" y="42" width="14" height="4" fill="#2e7d32" />
          <CarFace x={46} y={50} w={20} h={12} />
          <text x="28" y="70" fontSize="12" fontWeight="800" fill="#fff">1</text>
          <Wheels />
        </g>
      )
    case 'van':
      return (
        <g>
          <rect x="12" y="40" width="76" height="38" rx="10" fill="#ff8a65" stroke="#e64a19" strokeWidth="2" />
          <CarFace x={40} y={46} w={30} h={16} />
          <circle cx="82" cy="58" r="2.6" fill="#fff59d" />
          <Wheels />
        </g>
      )
    default: // sedan
      return (
        <g>
          <rect x="10" y="52" width="80" height="22" rx="11" fill="#ef5350" stroke="#c62828" strokeWidth="2" />
          <path d="M28 54 Q30 36 50 36 L60 36 Q74 36 78 54 Z" fill="#e57373" stroke="#c62828" strokeWidth="2" />
          <CarFace x={34} y={40} w={32} h={14} />
          <circle cx="86" cy="60" r="3" fill="#fff59d" /><circle cx="14" cy="60" r="3" fill="#ffab91" />
          <Wheels />
        </g>
      )
  }
}

// ---------- Bộ hiển thị chung ----------
export function Character({ token, size = 44 }: { token: string; size?: number }) {
  const [family, id] = token.split(':')
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="inline-block align-middle">
      {family === 'robot' ? (
        <Robot id={id} />
      ) : family === 'hero' ? (
        <Hero id={id} />
      ) : family === 'car' ? (
        <Car id={id} />
      ) : (
        <Monster id={id} />
      )}
    </svg>
  )
}

const FAMILIES = ['creature:', 'robot:', 'hero:', 'car:']
export function isCharToken(token: string): boolean {
  return FAMILIES.some((f) => token.startsWith(f))
}

// Hiển thị một "glyph": nhân vật SVG gốc (nếu là token đặc biệt), còn lại là
// ẢNH emoji Twemoji (đồng nhất, đẹp trên mọi thiết bị).
export function Glyph({ token, size = 40 }: { token: string; size?: number }) {
  if (isCharToken(token)) return <Character token={token} size={size} />
  return <Emoji char={token} size={size} />
}
