import { CURRICULUM, ALL_LESSONS } from '../data/curriculum'
import { useStore } from '../store/store'
import { Mascot } from '../components/Mascot'

export function Rewards({ onBack }: { onBack: () => void }) {
  const { starsFor, totalStars } = useStore()
  const stars = totalStars()
  const doneCount = ALL_LESSONS.filter((l) => starsFor(l.id) > 0).length

  const unitBadges = CURRICULUM.map((u) => ({
    id: u.id,
    emoji: u.emoji,
    title: u.title,
    earned: u.lessons.every((l) => starsFor(l.id) > 0),
  }))

  const milestones = [
    { id: 'm1', emoji: '🌟', title: 'Ngôi sao nhí', need: 5, earned: stars >= 5 },
    { id: 'm2', emoji: '🏅', title: 'Chăm học', need: 15, earned: stars >= 15 },
    { id: 'm3', emoji: '🏆', title: 'Nhà vô địch', need: 30, earned: stars >= 30 },
    { id: 'm4', emoji: '👑', title: 'Vua Toán học', need: 60, earned: stars >= 60 },
  ]

  return (
    <div className="mx-auto max-w-lg p-4 pb-10">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl shadow active:scale-95"
        >
          ⬅️
        </button>
        <h1 className="text-2xl font-extrabold text-honey-dark">Thành tích của bé</h1>
      </div>

      <div className="mb-5 flex items-center gap-3 rounded-3xl bg-gradient-to-r from-honey to-honey-dark p-4 text-white shadow-lg">
        <Mascot mood="cheer" size={72} />
        <div>
          <div className="text-3xl font-extrabold">⭐ {stars}</div>
          <div className="text-sm font-bold opacity-90">Đã hoàn thành {doneCount} bài học</div>
        </div>
      </div>

      <h2 className="mb-2 text-lg font-extrabold text-ink">🎖️ Huy hiệu điểm số</h2>
      <div className="mb-6 grid grid-cols-4 gap-3">
        {milestones.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col items-center gap-1 rounded-2xl bg-white p-3 text-center shadow ${
              m.earned ? '' : 'opacity-40 grayscale'
            }`}
          >
            <span className="text-3xl">{m.emoji}</span>
            <span className="text-[11px] font-extrabold leading-tight text-ink">{m.title}</span>
            <span className="text-[10px] font-bold text-ink/50">{m.need}⭐</span>
          </div>
        ))}
      </div>

      <h2 className="mb-2 text-lg font-extrabold text-ink">🏵️ Huy hiệu chặng học</h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {unitBadges.map((b) => (
          <div
            key={b.id}
            className={`flex flex-col items-center gap-1 rounded-2xl bg-white p-3 text-center shadow ${
              b.earned ? '' : 'opacity-40 grayscale'
            }`}
          >
            <span className="text-3xl">{b.earned ? b.emoji : '🔒'}</span>
            <span className="text-[10px] font-extrabold leading-tight text-ink">{b.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
