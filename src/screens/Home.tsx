import type { Lesson, Unit } from '../types'
import { AGE_BANDS, INTEREST_THEMES } from '../types'
import { CURRICULUM, ALL_LESSONS } from '../data/curriculum'
import { useStore } from '../store/store'
import { Stars } from '../components/Stars'
import { BeeSvg } from '../components/Mascot'
import { speak } from '../audio/sound'

const COLOR: Record<string, { grad: string; soft: string; text: string; ring: string }> = {
  honey: { grad: 'from-honey to-honey-dark', soft: 'bg-honey/15', text: 'text-honey-dark', ring: 'ring-honey' },
  sky: { grad: 'from-sky to-sky-dark', soft: 'bg-sky/15', text: 'text-sky-dark', ring: 'ring-sky' },
  grass: { grad: 'from-grass to-grass-dark', soft: 'bg-grass/15', text: 'text-grass-dark', ring: 'ring-grass' },
  coral: { grad: 'from-coral to-berry', soft: 'bg-coral/15', text: 'text-coral', ring: 'ring-coral' },
  berry: { grad: 'from-berry to-grape', soft: 'bg-berry/15', text: 'text-berry', ring: 'ring-berry' },
  grape: { grad: 'from-grape to-sky-dark', soft: 'bg-grape/15', text: 'text-grape', ring: 'ring-grape' },
}

export function Home({
  onOpenLesson,
  onOpenSettings,
  onOpenRewards,
}: {
  onOpenLesson: (lesson: Lesson) => void
  onOpenSettings: () => void
  onOpenRewards: () => void
}) {
  const { active, starsFor, totalStars } = useStore()

  // Mở khoá tuyến tính: bài đầu luôn mở; bài sau mở khi bài trước đã hoàn thành.
  const unlocked = new Set<string>()
  for (let i = 0; i < ALL_LESSONS.length; i++) {
    if (i === 0 || starsFor(ALL_LESSONS[i - 1].id) > 0) unlocked.add(ALL_LESSONS[i].id)
  }
  const doneCount = ALL_LESSONS.filter((l) => starsFor(l.id) > 0).length

  return (
    <div className="mx-auto max-w-lg pb-8">
      {/* header */}
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-gradient-to-b from-cream to-cream/80 px-4 py-3 backdrop-blur">
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow active:scale-95"
        >
          <span className="text-2xl">{active?.avatar}</span>
          <div className="text-left leading-tight">
            <div className="text-sm font-extrabold text-ink">{active?.name}</div>
            <div className="text-[10px] font-bold text-ink/50">
              {active ? AGE_BANDS[active.ageBand].label : ''}
            </div>
          </div>
        </button>
        <div className="flex-1" />
        <button
          onClick={onOpenRewards}
          className="flex items-center gap-1 rounded-full bg-white px-3 py-2 font-extrabold text-honey-dark shadow active:scale-95"
        >
          ⭐ <span>{totalStars()}</span>
        </button>
        <button
          onClick={onOpenSettings}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow active:scale-95"
          aria-label="Cài đặt"
        >
          ⚙️
        </button>
      </header>

      {/* progress banner */}
      <div className="mx-4 mb-4 mt-2 flex items-center gap-3 rounded-3xl bg-gradient-to-r from-honey to-honey-dark p-4 text-white shadow-lg">
        <div className="relative shrink-0">
          <BeeSvg size={64} />
          {active?.theme && active.theme !== 'classic' && (
            <span className="absolute -bottom-1 -right-1 text-2xl anim-bounce">
              {INTEREST_THEMES[active.theme].emoji}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="text-lg font-extrabold">Chào {active?.name}! 🌟</div>
          <div className="text-sm font-bold opacity-90">
            Đã hoàn thành {doneCount}/{ALL_LESSONS.length} bài học
          </div>
          <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-white/30">
            <div
              className="h-full rounded-full bg-white transition-all"
              style={{ width: `${(doneCount / ALL_LESSONS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* curriculum path */}
      <div className="flex flex-col gap-5 px-4">
        {CURRICULUM.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            unlocked={unlocked}
            starsFor={starsFor}
            onOpenLesson={onOpenLesson}
          />
        ))}
      </div>
      <p className="mt-6 px-6 text-center text-xs font-semibold text-ink/40">
        Giáo trình bám khung "Làm quen với Toán" — Chương trình GD Mầm non
      </p>
    </div>
  )
}

function UnitCard({
  unit,
  unlocked,
  starsFor,
  onOpenLesson,
}: {
  unit: Unit
  unlocked: Set<string>
  starsFor: (id: string) => number
  onOpenLesson: (l: Lesson) => void
}) {
  const c = COLOR[unit.color] ?? COLOR.honey
  const unitDone = unit.lessons.filter((l) => starsFor(l.id) > 0).length
  const unitUnlocked = unit.lessons.some((l) => unlocked.has(l.id))

  return (
    <section className={`overflow-hidden rounded-3xl ${c.soft} shadow-md`}>
      <div className={`flex items-center gap-3 bg-gradient-to-r ${c.grad} p-4 text-white`}>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/25 text-2xl">
          {unitUnlocked ? unit.emoji : '🔒'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/25 px-2 py-0.5 text-[11px] font-extrabold">
              Chặng {unit.order}
            </span>
            <span className="text-[11px] font-bold opacity-90">{AGE_BANDS[unit.ageBand].label}</span>
          </div>
          <h2 className="text-lg font-extrabold leading-tight">{unit.title}</h2>
          <p className="text-xs font-bold opacity-90">{unit.subtitle}</p>
        </div>
        <div className="text-right text-xs font-extrabold">
          {unitDone}/{unit.lessons.length}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
        {unit.lessons.map((lesson) => {
          const isUnlocked = unlocked.has(lesson.id)
          const stars = starsFor(lesson.id)
          return (
            <button
              key={lesson.id}
              disabled={!isUnlocked}
              onClick={() => {
                speak(lesson.title)
                onOpenLesson(lesson)
              }}
              className={`relative flex flex-col items-center gap-1 rounded-2xl border-4 bg-white p-3 text-center shadow-sm transition active:scale-95 ${
                isUnlocked ? 'border-white ' + (stars > 0 ? c.ring + ' ring-2' : '') : 'border-black/5 opacity-60'
              }`}
            >
              <span className="text-4xl">{isUnlocked ? lesson.emoji : '🔒'}</span>
              <span className="text-xs font-extrabold leading-tight text-ink">{lesson.title}</span>
              <Stars value={stars} size="sm" />
            </button>
          )
        })}
      </div>
    </section>
  )
}
