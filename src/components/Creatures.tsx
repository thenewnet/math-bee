// Nhân vật GỐC do Math Bee tự thiết kế (SVG) — "thú cưng quái vật" kiểu thân thiện.
// KHÔNG sao chép nhân vật có bản quyền. Bản quyền thuộc về ứng dụng.

export const CREATURE_IDS = ['slime', 'spike', 'ears', 'horn', 'star', 'bot'] as const
export type CreatureId = (typeof CREATURE_IDS)[number]

function Face({ mouth = 'smile' }: { mouth?: 'smile' | 'o' }) {
  return (
    <>
      <circle cx="40" cy="52" r="8" fill="#fff" />
      <circle cx="60" cy="52" r="8" fill="#fff" />
      <circle cx="41" cy="54" r="3.6" fill="#241c2b" />
      <circle cx="61" cy="54" r="3.6" fill="#241c2b" />
      <circle cx="30" cy="63" r="4" fill="#ff8a80" opacity="0.7" />
      <circle cx="70" cy="63" r="4" fill="#ff8a80" opacity="0.7" />
      {mouth === 'smile' ? (
        <path d="M42 64 Q50 72 58 64" stroke="#241c2b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : (
        <ellipse cx="50" cy="66" rx="4" ry="5" fill="#241c2b" />
      )}
    </>
  )
}

export function Creature({ id, size = 44 }: { id: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="inline-block align-middle">
      {id === 'slime' && (
        <g>
          <path d="M50 20 C74 20 82 42 82 60 C82 82 66 88 50 88 C34 88 18 82 18 60 C18 42 26 20 50 20 Z" fill="#66bb6a" stroke="#2e7d32" strokeWidth="2" />
          <path d="M32 24 q6 -12 12 0" fill="none" stroke="#2e7d32" strokeWidth="3" strokeLinecap="round" />
          <Face />
        </g>
      )}
      {id === 'spike' && (
        <g>
          <polygon points="50,8 40,26 60,26" fill="#7e57c2" />
          <polygon points="30,16 26,30 42,26" fill="#7e57c2" />
          <polygon points="70,16 74,30 58,26" fill="#7e57c2" />
          <ellipse cx="50" cy="58" rx="32" ry="30" fill="#9575cd" stroke="#5e35b1" strokeWidth="2" />
          <Face mouth="o" />
        </g>
      )}
      {id === 'ears' && (
        <g>
          <circle cx="26" cy="30" r="12" fill="#42a5f5" />
          <circle cx="74" cy="30" r="12" fill="#42a5f5" />
          <circle cx="26" cy="30" r="6" fill="#bbdefb" />
          <circle cx="74" cy="30" r="6" fill="#bbdefb" />
          <ellipse cx="50" cy="58" rx="30" ry="30" fill="#64b5f6" stroke="#1976d2" strokeWidth="2" />
          <Face />
        </g>
      )}
      {id === 'horn' && (
        <g>
          <polygon points="50,6 44,28 56,28" fill="#ffca28" stroke="#f9a825" strokeWidth="1.5" />
          <path d="M50 22 C76 22 84 44 82 62 C80 84 62 90 50 90 C38 90 20 84 18 62 C16 44 24 22 50 22 Z" fill="#ff8a65" stroke="#e64a19" strokeWidth="2" />
          <Face />
        </g>
      )}
      {id === 'star' && (
        <g>
          <polygon points="50,10 61,38 92,38 67,57 76,88 50,69 24,88 33,57 8,38 39,38" fill="#ec407a" stroke="#c2185b" strokeWidth="2" strokeLinejoin="round" />
          <g transform="translate(0,6)"><Face /></g>
        </g>
      )}
      {id === 'bot' && (
        <g>
          <line x1="50" y1="8" x2="50" y2="20" stroke="#78909c" strokeWidth="3" />
          <circle cx="50" cy="8" r="5" fill="#ff5252" />
          <rect x="22" y="24" width="56" height="52" rx="12" fill="#90a4ae" stroke="#546e7a" strokeWidth="2" />
          <rect x="30" y="44" width="40" height="20" rx="6" fill="#263238" />
          <circle cx="41" cy="54" r="5" fill="#4fc3f7" />
          <circle cx="59" cy="54" r="5" fill="#4fc3f7" />
          <rect x="40" y="70" width="20" height="4" rx="2" fill="#546e7a" />
        </g>
      )}
    </svg>
  )
}

// Token dạng "creature:slime". Trả về id nếu là token nhân vật, ngược lại null.
export function creatureIdOf(token: string): string | null {
  return token.startsWith('creature:') ? token.slice('creature:'.length) : null
}

// Hiển thị một "glyph": nhân vật SVG nếu là token, còn lại là emoji.
export function Glyph({ token, size = 40 }: { token: string; size?: number }) {
  const cid = creatureIdOf(token)
  if (cid) return <Creature id={cid} size={size} />
  return (
    <span className="inline-block leading-none" style={{ fontSize: size * 0.86 }}>
      {token}
    </span>
  )
}
