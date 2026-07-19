import { useState } from 'react'
import type { Lesson, Question, Unit } from '../types'
import { AGE_BANDS, INTEREST_THEMES, profileThemes } from '../types'
import { CURRICULUM, ALL_LESSONS } from '../data/curriculum'
import { useStore } from '../store/store'
import { recommend, buildAdaptiveQuestions } from '../engine/adaptive'
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
  onStartPractice,
  onOpenSettings,
  onOpenRewards,
}: {
  onOpenLesson: (lesson: Lesson) => void
  onStartPractice: (questions: Question[]) => void
  onOpenSettings: () => void
  onOpenRewards: () => void
}) {
  const { active, stats, starsFor, totalStars } = useStore()

  // Mở khoá tuyến tính: bài đầu luôn mở; bài sau mở khi bài trước đã hoàn thành.
  const unlocked = new Set<string>()
  for (let i = 0; i < ALL_LESSONS.length; i++) {
    if (i === 0 || starsFor(ALL_LESSONS[i - 1].id) > 0) unlocked.add(ALL_LESSONS[i].id)
  }
  const doneCount = ALL_LESSONS.filter((l) => starsFor(l.id) > 0).length

  // Lộ trình thích ứng theo khả năng của bé
  const themes = active ? profileThemes(active) : undefined
  const rec = recommend(stats, unlocked)
  const unlockedLessons = ALL_LESSONS.filter((l) => unlocked.has(l.id))
  const runPractice = () => onStartPractice(buildAdaptiveQuestions(stats, unlockedLessons, themes))

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
          {(() => {
            const first = active ? profileThemes(active).find((t) => t !== 'classic') : undefined
            return first ? (
              <span className="absolute -bottom-1 -right-1 text-2xl anim-bounce">
                {INTEREST_THEMES[first].emoji}
              </span>
            ) : null
          })()}
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

      {/* Gợi ý thích ứng theo khả năng của bé */}
      <div className="mx-4 mb-4 rounded-3xl bg-white p-4 shadow-md">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xl">🧭</span>
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-ink/60">
            Gợi ý cho bé hôm nay
          </h3>
        </div>
        {rec.type === 'review' ? (
          <RecCard
            emoji="🔁"
            title={`Ôn lại: ${rec.lesson.title}`}
            sub={`Bé làm đúng ${Math.round(rec.accuracy * 100)}% — luyện thêm cho vững nhé`}
            action="Ôn ngay"
            color="from-berry to-grape"
            onClick={() => onOpenLesson(rec.lesson)}
          />
        ) : rec.type === 'learn' ? (
          <RecCard
            emoji={rec.lesson.emoji}
            title={`Học tiếp: ${rec.lesson.title}`}
            sub="Bài tiếp theo trong lộ trình của bé"
            action="Học ngay"
            color="from-honey to-honey-dark"
            onClick={() => onOpenLesson(rec.lesson)}
          />
        ) : (
          <RecCard
            emoji="🎯"
            title="Luyện tập thích ứng"
            sub="Bé đã học tốt! Ôn tổng hợp theo khả năng nào"
            action="Bắt đầu"
            color="from-grass to-grass-dark"
            onClick={runPractice}
          />
        )}
        {rec.type !== 'practice' && (
          <button
            onClick={runPractice}
            className="mt-2 w-full rounded-2xl border-2 border-dashed border-grass/50 py-2.5 text-sm font-extrabold text-grass-dark active:scale-95"
          >
            🎯 Luyện tập thích ứng (ôn phần yếu)
          </button>
        )}
      </div>

      {/* curriculum path — sắp theo: Cần học tiếp -> Đã hoàn thành -> Chặng tiếp theo */}
      <div className="flex flex-col gap-5 px-4">
        {(() => {
          const isDone = (u: Unit) => u.lessons.every((l) => starsFor(l.id) > 0)
          const isUnlocked = (u: Unit) => u.lessons.some((l) => unlocked.has(l.id))
          const current = CURRICULUM.filter((u) => isUnlocked(u) && !isDone(u))
          const done = CURRICULUM.filter((u) => isDone(u))
          const locked = CURRICULUM.filter((u) => !isUnlocked(u))

          const section = (
            label: string,
            emoji: string,
            units: Unit[],
            defaultOpen: boolean,
          ) =>
            units.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="mt-1 flex items-center gap-2 px-1">
                  <span className="text-lg">{emoji}</span>
                  <h3 className="text-sm font-extrabold uppercase tracking-wide text-ink/50">
                    {label}
                  </h3>
                  <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-extrabold text-ink/50">
                    {units.length}
                  </span>
                  <div className="h-0.5 flex-1 rounded-full bg-ink/10" />
                </div>
                {units.map((unit) => (
                  <UnitCard
                    key={unit.id}
                    unit={unit}
                    unlocked={unlocked}
                    starsFor={starsFor}
                    onOpenLesson={onOpenLesson}
                    defaultOpen={defaultOpen}
                  />
                ))}
              </div>
            )

          return (
            <>
              {section('Cần học tiếp', '🎯', current, true)}
              {section('Đã hoàn thành', '✅', done, false)}
              {section('Chặng tiếp theo', '🔒', locked, false)}
            </>
          )
        })()}
      </div>
      <p className="mt-6 px-6 text-center text-xs font-semibold text-ink/40">
        Giáo trình bám khung "Làm quen với Toán" — Chương trình GD Mầm non
      </p>
    </div>
  )
}

function RecCard({
  emoji,
  title,
  sub,
  action,
  color,
  onClick,
}: {
  emoji: string
  title: string
  sub: string
  action: string
  color: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r ${color} p-3 text-left text-white shadow active:scale-95`}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/25 text-2xl">
        {emoji}
      </span>
      <div className="flex-1">
        <div className="text-base font-extrabold leading-tight">{title}</div>
        <div className="text-xs font-bold opacity-90">{sub}</div>
      </div>
      <span className="shrink-0 rounded-full bg-white/25 px-3 py-1.5 text-xs font-extrabold">
        {action} ➜
      </span>
    </button>
  )
}

function UnitCard({
  unit,
  unlocked,
  starsFor,
  onOpenLesson,
  defaultOpen = true,
}: {
  unit: Unit
  unlocked: Set<string>
  starsFor: (id: string) => number
  onOpenLesson: (l: Lesson) => void
  defaultOpen?: boolean
}) {
  const c = COLOR[unit.color] ?? COLOR.honey
  const unitDone = unit.lessons.filter((l) => starsFor(l.id) > 0).length
  const unitStars = unit.lessons.reduce((a, l) => a + starsFor(l.id), 0)
  const unitUnlocked = unit.lessons.some((l) => unlocked.has(l.id))
  const fullyDone = unitDone === unit.lessons.length

  // Nhóm "Cần học tiếp" mở sẵn; "Đã hoàn thành" và "Chặng tiếp theo" thu gọn.
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className={`overflow-hidden rounded-3xl ${c.soft} shadow-md`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center gap-3 bg-gradient-to-r ${c.grad} p-4 text-left text-white active:brightness-95`}
      >
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/25 text-2xl">
          {unitUnlocked ? unit.emoji : '🔒'}
          {fullyDone && (
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-grass-dark shadow">
              ✓
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/25 px-2 py-0.5 text-[11px] font-extrabold">
              Chặng {unit.order}
            </span>
            <span className="text-[11px] font-bold opacity-90">{AGE_BANDS[unit.ageBand].label}</span>
          </div>
          <h2 className="text-lg font-extrabold leading-tight">{unit.title}</h2>
          {fullyDone && !open ? (
            <p className="text-xs font-bold opacity-90">
              ⭐ {unitStars} • Đã hoàn thành — chạm để xem lại
            </p>
          ) : (
            <p className="text-xs font-bold opacity-90">{unit.subtitle}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-extrabold">
            {unitDone}/{unit.lessons.length}
          </span>
          <span className={`text-lg leading-none transition-transform ${open ? 'rotate-180' : ''}`}>
            ⌄
          </span>
        </div>
      </button>

      {open && (
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
      )}
    </section>
  )
}
