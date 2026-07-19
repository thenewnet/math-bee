import { CURRICULUM } from '../data/curriculum'
import { AGE_BANDS } from '../types'
import { useStore } from '../store/store'
import { abilityLevel, activityStats } from '../engine/adaptive'

export function Report({ onBack }: { onBack: () => void }) {
  const { active, stats, statFor } = useStore()
  const ability = abilityLevel(stats)
  const weakSkills = activityStats(stats).slice(0, 4)

  // Tổng hợp toàn bộ
  let doneAll = 0
  let lessonsAll = 0
  let starsAll = 0
  let correctAll = 0
  let totalAll = 0
  for (const u of CURRICULUM) {
    for (const l of u.lessons) {
      lessonsAll++
      const s = statFor(l.id)
      if (s) {
        if (s.stars > 0) doneAll++
        starsAll += s.stars
        correctAll += s.correct
        totalAll += s.total
      }
    }
  }
  const accAll = totalAll ? Math.round((correctAll / totalAll) * 100) : 0

  return (
    <div className="mx-auto max-w-lg p-4 pb-10">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl shadow active:scale-95"
        >
          ⬅️
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-honey-dark">Báo cáo học tập</h1>
          <p className="text-xs font-bold text-ink/50">
            {active?.avatar} {active?.name} • {active ? AGE_BANDS[active.ageBand].label : ''}
          </p>
        </div>
      </div>

      {/* tổng quan */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        <Stat label="Bài hoàn thành" value={`${doneAll}/${lessonsAll}`} emoji="✅" />
        <Stat label="Sao đạt được" value={`${starsAll}`} emoji="⭐" />
        <Stat label="Độ chính xác" value={`${accAll}%`} emoji="🎯" />
      </div>

      {totalAll === 0 && (
        <div className="mb-5 rounded-2xl bg-white p-4 text-center text-sm font-bold text-ink/60 shadow">
          Bé chưa làm bài nào. Hãy cùng bé bắt đầu học nhé! 🐝
        </div>
      )}

      {/* mức năng lực + kỹ năng cần luyện thêm */}
      {totalAll > 0 && (
        <>
          <div className="mb-4 flex items-center gap-3 rounded-3xl bg-gradient-to-r from-grape to-berry p-4 text-white shadow">
            <span className="text-4xl">{ability.emoji}</span>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide opacity-90">
                Mức năng lực
              </div>
              <div className="text-xl font-extrabold">{ability.label}</div>
              <div className="text-xs font-bold opacity-90">
                Trả lời đúng {ability.accuracy !== null ? Math.round(ability.accuracy * 100) : 0}% ngay lần đầu
              </div>
            </div>
          </div>

          {weakSkills.length > 0 && (
            <div className="mb-5 rounded-3xl bg-white p-4 shadow">
              <h2 className="mb-2 text-base font-extrabold text-ink">🧩 Kỹ năng — nên luyện thêm</h2>
              <div className="flex flex-col gap-2">
                {weakSkills.map((s) => {
                  const pct = Math.round(s.accuracy * 100)
                  const weak = pct < 70
                  return (
                    <div key={s.activity} className="flex items-center gap-2">
                      <span className="w-40 shrink-0 truncate text-sm font-bold text-ink">
                        {s.label}
                      </span>
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-black/5">
                        <div
                          className={`h-full rounded-full ${weak ? 'bg-coral' : 'bg-grass'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className={`w-10 text-right text-xs font-extrabold ${weak ? 'text-coral' : 'text-grass-dark'}`}>
                        {pct}%
                      </span>
                    </div>
                  )
                })}
              </div>
              <p className="mt-2 text-[11px] font-semibold text-ink/40">
                Mục màu đỏ (dưới 70%) là phần bé còn yếu — dùng "Luyện tập thích ứng" ở trang chính để ôn.
              </p>
            </div>
          )}
        </>
      )}

      {/* theo từng chặng */}
      <h2 className="mb-2 text-lg font-extrabold text-ink">Chi tiết theo chặng</h2>
      <div className="flex flex-col gap-3">
        {CURRICULUM.map((u) => {
          const played = u.lessons.filter((l) => statFor(l.id))
          const done = u.lessons.filter((l) => (statFor(l.id)?.stars ?? 0) > 0).length
          const stars = u.lessons.reduce((a, l) => a + (statFor(l.id)?.stars ?? 0), 0)
          const maxStars = u.lessons.length * 3
          const correct = u.lessons.reduce((a, l) => a + (statFor(l.id)?.correct ?? 0), 0)
          const total = u.lessons.reduce((a, l) => a + (statFor(l.id)?.total ?? 0), 0)
          const acc = total ? Math.round((correct / total) * 100) : 0
          const pct = Math.round((done / u.lessons.length) * 100)
          return (
            <div key={u.id} className="rounded-2xl bg-white p-3 shadow">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{u.emoji}</span>
                <div className="flex-1">
                  <div className="text-sm font-extrabold text-ink">
                    Chặng {u.order}. {u.title}
                  </div>
                  <div className="text-[11px] font-bold text-ink/50">
                    {done}/{u.lessons.length} bài • {stars}/{maxStars} ⭐
                    {played.length > 0 && ` • chính xác ${acc}%`}
                  </div>
                </div>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-black/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-grass to-grass-dark transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-5 text-center text-xs font-semibold text-ink/40">
        "Độ chính xác" tính theo số câu bé trả lời đúng ngay lần đầu.
      </p>
    </div>
  )
}

function Stat({ label, value, emoji }: { label: string; value: string; emoji: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-2xl bg-white p-3 text-center shadow">
      <span className="text-2xl">{emoji}</span>
      <span className="text-xl font-extrabold text-ink">{value}</span>
      <span className="text-[10px] font-bold leading-tight text-ink/50">{label}</span>
    </div>
  )
}
