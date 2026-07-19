import type { Option } from '../types'
import { Shape } from './Shape'
import { ObjectGroup } from './ObjectGroup'

type State = 'idle' | 'correct' | 'wrong' | 'dim'

export function OptionButton({
  option,
  state,
  onClick,
  disabled,
}: {
  option: Option
  state: State
  onClick: () => void
  disabled?: boolean
}) {
  const base =
    'relative flex flex-col items-center justify-center rounded-3xl border-4 bg-white p-3 shadow-md transition-transform active:scale-95 min-h-[92px]'
  const stateCls =
    state === 'correct'
      ? 'border-grass ring-4 ring-grass/30 bg-grass/10'
      : state === 'wrong'
        ? 'border-coral bg-coral/10 anim-shake'
        : state === 'dim'
          ? 'border-black/5 opacity-45'
          : 'border-honey/40 hover:border-honey'

  return (
    <button className={`${base} ${stateCls}`} onClick={onClick} disabled={disabled} type="button">
      {option.digit !== undefined && (
        <span className="text-5xl font-extrabold text-ink text-shadow-kid sm:text-6xl">
          {option.digit}
        </span>
      )}
      {option.shape && <Shape kind={option.shape} size={72} />}
      {option.objects && <ObjectGroup icon={option.objects.icon} count={option.objects.count} size="sm" />}
      {!option.digit && !option.shape && !option.objects && option.emoji && (
        <span
          className="leading-none"
          style={{ fontSize: option.scale ? `${2.4 * option.scale + 1.2}rem` : '2.8rem' }}
        >
          {option.emoji}
        </span>
      )}
      {option.label && <span className="mt-1 text-base font-bold text-ink">{option.label}</span>}

      {state === 'correct' && <span className="absolute -right-2 -top-2 text-2xl">✅</span>}
      {state === 'wrong' && <span className="absolute -right-2 -top-2 text-2xl">❌</span>}
    </button>
  )
}
