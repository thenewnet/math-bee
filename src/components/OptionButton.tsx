import { useState, type CSSProperties } from 'react'
import type { Option } from '../types'
import { Shape } from './Shape'
import { ObjectGroup } from './ObjectGroup'
import { Glyph } from './Creatures'
import { BeadBar } from './Montessori'

type State = 'idle' | 'correct' | 'wrong' | 'dim'

const PARTICLES = Array.from({ length: 6 }, (_, i) => {
  const a = (i / 6) * Math.PI * 2
  return { tx: Math.round(Math.cos(a) * 48), ty: Math.round(Math.sin(a) * 48), e: i % 2 ? '✨' : '⭐' }
})

export function OptionButton({
  option,
  state,
  onClick,
  disabled,
  montessori = false,
}: {
  option: Option
  state: State
  onClick: () => void
  disabled?: boolean
  montessori?: boolean
}) {
  const [burst, setBurst] = useState(0)

  const base =
    'relative flex flex-col items-center justify-center rounded-3xl border-4 bg-white p-3 shadow-md transition-transform duration-100 active:scale-90 min-h-[100px] sm:min-h-[124px]'
  const stateCls =
    state === 'correct'
      ? 'border-grass ring-4 ring-grass/30 bg-grass/10 anim-ring'
      : state === 'wrong'
        ? 'border-coral bg-coral/10 anim-shake'
        : state === 'dim'
          ? 'border-black/5 opacity-45'
          : 'border-honey/40 hover:border-honey'

  // Với bài so sánh kích thước: phóng emoji theo tỉ lệ để thấy rõ to/nhỏ
  const emojiPx = option.scale ? Math.round(option.scale * 66 + 26) : 62

  return (
    <button
      className={`${base} ${stateCls}`}
      onClick={() => {
        setBurst((b) => b + 1)
        onClick()
      }}
      disabled={disabled}
      type="button"
    >
      {option.digit !== undefined && (
        <span className="text-6xl font-extrabold text-ink text-shadow-kid sm:text-7xl">
          {option.digit}
        </span>
      )}
      {option.shape && <Shape kind={option.shape} size={92} />}
      {option.objects &&
        (montessori ? (
          <BeadBar n={option.objects.count} bead={20} />
        ) : (
          <ObjectGroup icon={option.objects.icon} count={option.objects.count} size="sm" />
        ))}
      {option.digit === undefined && !option.shape && !option.objects && option.emoji && (
        <Glyph token={option.emoji} size={emojiPx} />
      )}
      {option.label && <span className="mt-1 text-lg font-extrabold text-ink sm:text-xl">{option.label}</span>}

      {state === 'correct' && <span className="absolute -right-2 -top-2 text-3xl">✅</span>}
      {state === 'wrong' && <span className="absolute -right-2 -top-2 text-3xl">❌</span>}

      {/* hiệu ứng bung sao khi chạm */}
      {burst > 0 && (
        <span key={burst} className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="tap-particle absolute text-xl"
              style={{ ['--tx' as string]: `${p.tx}px`, ['--ty' as string]: `${p.ty}px` } as CSSProperties}
            >
              {p.e}
            </span>
          ))}
        </span>
      )}
    </button>
  )
}
