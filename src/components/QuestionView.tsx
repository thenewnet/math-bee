import type { Question } from '../types'
import { ObjectGroup } from './ObjectGroup'
import { Shape } from './Shape'

const SHAPE_ASK: Record<string, string> = {
  circle: 'hình tròn',
  square: 'hình vuông',
  triangle: 'hình tam giác',
  rectangle: 'hình chữ nhật',
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[150px] w-full items-center justify-center rounded-3xl bg-white/70 p-4 shadow-inner">
      {children}
    </div>
  )
}

export function QuestionView({ q }: { q: Question }) {
  const r = q.render
  switch (r.kind) {
    case 'objects':
      return (
        <Panel>
          <ObjectGroup icon={r.icon} count={r.count} size="lg" />
        </Panel>
      )

    case 'twoGroups':
      return (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex min-h-[150px] items-center justify-center rounded-3xl bg-sky/15 p-3 shadow-inner">
            <ObjectGroup icon={r.left.icon} count={r.left.count} />
          </div>
          <div className="flex min-h-[150px] items-center justify-center rounded-3xl bg-berry/15 p-3 shadow-inner">
            <ObjectGroup icon={r.right.icon} count={r.right.count} />
          </div>
        </div>
      )

    case 'compose':
      return (
        <Panel>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="rounded-2xl bg-sky/15 p-2">
              <ObjectGroup icon={r.icon} count={r.a} />
            </div>
            <span className="text-4xl font-extrabold text-honey-dark">➕</span>
            <div className="rounded-2xl bg-grass/15 p-2">
              <ObjectGroup icon={r.icon} count={r.b} />
            </div>
          </div>
        </Panel>
      )

    case 'addExpr':
      return (
        <Panel>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <ObjectGroup icon={r.icon} count={r.a} />
            <span className="text-4xl font-extrabold text-honey-dark">＋</span>
            <ObjectGroup icon={r.icon} count={r.b} />
            <span className="text-4xl font-extrabold text-honey-dark">＝</span>
            <span className="text-5xl font-extrabold text-ink">?</span>
          </div>
        </Panel>
      )

    case 'decompose':
      return (
        <Panel>
          <div className="text-center">
            <ObjectGroup icon={r.icon} count={r.total} crossed={r.known} />
            <p className="mt-3 text-sm font-bold text-ink/70">
              Gạch bỏ {r.known} cái, còn lại mấy cái?
            </p>
          </div>
        </Panel>
      )

    case 'subExpr':
      return (
        <Panel>
          <div className="text-center">
            <ObjectGroup icon={r.icon} count={r.total} crossed={r.take} />
            <p className="mt-3 text-sm font-bold text-ink/70">
              {r.total} bớt {r.take} còn lại mấy?
            </p>
          </div>
        </Panel>
      )

    case 'ordinalRow':
      return (
        <Panel>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="shrink-0 text-2xl">🏁</span>
            {r.items.map((it, i) => (
              <div key={i} className="flex shrink-0 flex-col items-center">
                <span className="text-4xl anim-pop" style={{ animationDelay: `${i * 0.06}s` }}>
                  {it}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      )

    case 'pattern':
      return (
        <Panel>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {r.sequence.map((s, i) =>
              s === '?' ? (
                <span
                  key={i}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-dashed border-honey text-3xl font-extrabold text-honey-dark anim-bounce"
                >
                  ?
                </span>
              ) : (
                <span key={i} className="text-4xl">
                  {s}
                </span>
              ),
            )}
          </div>
        </Panel>
      )

    case 'sizeRow':
      return (
        <Panel>
          <div className="flex items-end justify-center gap-6">
            {r.items.map((it, i) => (
              <span key={i} className="leading-none" style={{ fontSize: `${it.scale * 3.5 + 1}rem` }}>
                {it.icon}
              </span>
            ))}
          </div>
        </Panel>
      )

    case 'shape':
      return (
        <Panel>
          <div className="flex flex-col items-center gap-2">
            <Shape kind={r.target} size={110} />
            <span className="text-lg font-extrabold text-ink">{SHAPE_ASK[r.target]}</span>
          </div>
        </Panel>
      )

    case 'digit':
      return (
        <Panel>
          <span className="text-8xl font-extrabold text-honey-dark text-shadow-kid anim-pop">
            {r.value}
          </span>
        </Panel>
      )

    case 'sequence':
      return (
        <Panel>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {r.sequence.map((n, i) =>
              n === null ? (
                <span
                  key={i}
                  className="flex h-16 w-14 items-center justify-center rounded-2xl border-4 border-dashed border-honey text-3xl font-extrabold text-honey-dark anim-bounce"
                >
                  ?
                </span>
              ) : (
                <span
                  key={i}
                  className="flex h-16 w-14 items-center justify-center rounded-2xl bg-honey/20 text-3xl font-extrabold text-ink shadow-sm"
                >
                  {n}
                </span>
              ),
            )}
          </div>
        </Panel>
      )

    case 'spatial': {
      const [emoji, pos] = r.scene.split('|')
      if (r.ask === 'time') {
        return (
          <Panel>
            <span className="text-8xl anim-pop">{emoji}</span>
          </Panel>
        )
      }
      if (r.ask === 'updown') {
        return (
          <div className="relative flex h-[180px] w-full flex-col rounded-3xl bg-gradient-to-b from-sky/25 to-grass/25 p-3 shadow-inner">
            <div className="flex h-1/2 items-center justify-center">
              {pos === 'top' && <span className="text-6xl anim-pop">{emoji}</span>}
            </div>
            <div className="h-1 w-full rounded-full bg-ink/20" />
            <div className="flex h-1/2 items-center justify-center">
              {pos === 'bottom' && <span className="text-6xl anim-pop">{emoji}</span>}
            </div>
          </div>
        )
      }
      // leftright
      return (
        <div className="relative flex h-[180px] w-full items-center rounded-3xl bg-gradient-to-r from-sky/25 to-berry/25 p-3 shadow-inner">
          <div className="flex w-1/2 items-center justify-center">
            {pos === 'left' && <span className="text-6xl anim-pop">{emoji}</span>}
          </div>
          <div className="h-full w-1 rounded-full bg-ink/20" />
          <div className="flex w-1/2 items-center justify-center">
            {pos === 'right' && <span className="text-6xl anim-pop">{emoji}</span>}
          </div>
        </div>
      )
    }

    default:
      return null
  }
}
