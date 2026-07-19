// Khối 3 chiều vẽ nổi bằng SVG (phong cách đẳng cự) — bộ khối hình học Montessori.

export interface SolidDef {
  id: string
  name: string
  objects: string[] // đồ vật thật liên hệ (dùng gợi ý)
}

export const GEO_SOLIDS: SolidDef[] = [
  { id: 'cau', name: 'khối cầu', objects: ['⚽', '🏀', '🍊', '🌐'] },
  { id: 'lapphuong', name: 'khối lập phương', objects: ['🎲', '🧊', '🧀'] },
  { id: 'hopchunhat', name: 'khối chữ nhật', objects: ['📦', '📚', '🧱'] },
  { id: 'tru', name: 'khối trụ', objects: ['🥫', '🥤', '🔋'] },
  { id: 'non', name: 'khối nón', objects: ['🍦', '🎉', '📣'] },
  { id: 'thap', name: 'kim tự tháp', objects: ['⛺', '🏔️'] },
]

export function Solid3D({ kind, size = 120 }: { kind: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="anim-pop">
      {kind === 'cau' && (
        <>
          <defs>
            <radialGradient id="s-cau" cx="38%" cy="32%" r="70%">
              <stop offset="0%" stopColor="#ffe082" />
              <stop offset="55%" stopColor="#ffb300" />
              <stop offset="100%" stopColor="#ef6c00" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="52" r="34" fill="url(#s-cau)" stroke="rgba(0,0,0,0.1)" />
          <ellipse cx="40" cy="40" rx="10" ry="6" fill="#ffffff" opacity="0.4" />
        </>
      )}

      {kind === 'lapphuong' && (
        <>
          <polygon points="50,18 80,34 50,50 20,34" fill="#64b5f6" stroke="rgba(0,0,0,0.12)" />
          <polygon points="20,34 50,50 50,82 20,66" fill="#1565c0" stroke="rgba(0,0,0,0.12)" />
          <polygon points="80,34 50,50 50,82 80,66" fill="#1e88e5" stroke="rgba(0,0,0,0.12)" />
        </>
      )}

      {kind === 'hopchunhat' && (
        <>
          <polygon points="50,12 78,26 50,40 22,26" fill="#ce93d8" stroke="rgba(0,0,0,0.12)" />
          <polygon points="22,26 50,40 50,88 22,74" fill="#6a1b9a" stroke="rgba(0,0,0,0.12)" />
          <polygon points="78,26 50,40 50,88 78,74" fill="#8e24aa" stroke="rgba(0,0,0,0.12)" />
        </>
      )}

      {kind === 'tru' && (
        <>
          <path d="M24,28 L24,72 A26,10 0 0 0 76,72 L76,28 Z" fill="#43a047" stroke="rgba(0,0,0,0.12)" />
          <ellipse cx="50" cy="28" rx="26" ry="10" fill="#81c784" stroke="rgba(0,0,0,0.12)" />
        </>
      )}

      {kind === 'non' && (
        <>
          <path d="M50,16 L22,74 A28,9 0 0 0 78,74 Z" fill="#fbc02d" stroke="rgba(0,0,0,0.12)" />
          <path d="M50,16 L22,74 A28,9 0 0 1 50,65 Z" fill="#f9a825" opacity="0.65" />
        </>
      )}

      {kind === 'thap' && (
        <>
          <polygon points="50,14 18,66 50,86" fill="#a1887f" stroke="rgba(0,0,0,0.12)" />
          <polygon points="50,14 82,66 50,86" fill="#d7ccc8" stroke="rgba(0,0,0,0.12)" />
        </>
      )}
    </svg>
  )
}
