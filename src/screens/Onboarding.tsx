import { useState } from 'react'
import type { AgeBand, InterestTheme } from '../types'
import { AGE_BANDS, INTEREST_THEMES } from '../types'
import { THEME_AVATARS } from '../engine/themes'
import { useStore } from '../store/store'
import { Mascot } from '../components/Mascot'
import { speak, unlockAudio } from '../audio/sound'

const BAND_ORDER: AgeBand[] = ['be', 'nho', 'lon', 'tien-th']
const THEME_ORDER: InterestTheme[] = ['classic', 'robot', 'hero', 'monster']

export function Onboarding({ onDone }: { onDone: () => void }) {
  const { addProfile } = useStore()
  const [name, setName] = useState('')
  const [themes, setThemes] = useState<InterestTheme[]>(['classic'])
  const [avatar, setAvatar] = useState(THEME_AVATARS.classic[0])
  const [band, setBand] = useState<AgeBand>('lon')
  const [montessori, setMontessori] = useState(false)

  const activeThemes = themes.filter((t) => t !== 'classic')
  const avatarThemes = activeThemes.length ? activeThemes : (['classic'] as InterestTheme[])
  const avatars = [...new Set(avatarThemes.flatMap((t) => THEME_AVATARS[t]))]

  function toggleTheme(t: InterestTheme) {
    setThemes((prev) => {
      let next: InterestTheme[]
      if (t === 'classic') next = ['classic']
      else {
        const base = prev.filter((x) => x !== 'classic')
        next = base.includes(t) ? base.filter((x) => x !== t) : [...base, t]
        if (next.length === 0) next = ['classic']
      }
      // đảm bảo avatar thuộc bộ chủ đề mới
      const at = next.filter((x) => x !== 'classic')
      const list = (at.length ? at : ['classic']).flatMap((x) => THEME_AVATARS[x as InterestTheme])
      if (!list.includes(avatar)) setAvatar(list[0])
      return next
    })
  }

  function submit() {
    unlockAudio()
    addProfile(name, avatar, band, themes, montessori)
    speak(`Xin chào ${name || 'bé'}! Cùng học toán nào!`)
    onDone()
  }

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col gap-5 p-5">
      <div className="mt-2 flex flex-col items-center text-center">
        <Mascot mood="cheer" message="Chào bé! Mình là ong Bee!" />
        <h1 className="mt-3 text-2xl font-extrabold text-honey-dark">Bé Vui Học Toán</h1>
        <p className="text-sm font-bold text-ink/60">Tạo hồ sơ cho bé để bắt đầu</p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-extrabold text-ink">Tên của bé</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên bé..."
          maxLength={16}
          className="w-full rounded-2xl border-4 border-honey/40 bg-white px-4 py-3 text-lg font-bold text-ink outline-none focus:border-honey"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-extrabold text-ink">
          Bé thích chủ đề nào? <span className="font-bold text-ink/50">(chọn được nhiều)</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {THEME_ORDER.map((t) => {
            const on = themes.includes(t)
            return (
              <button
                key={t}
                onClick={() => toggleTheme(t)}
                className={`relative flex items-center gap-2 rounded-2xl border-4 p-3 text-left transition ${
                  on ? 'border-honey bg-honey/20' : 'border-white bg-white'
                }`}
              >
                <span className="text-3xl">{INTEREST_THEMES[t].emoji}</span>
                <div>
                  <div className="text-sm font-extrabold text-ink">{INTEREST_THEMES[t].label}</div>
                  <div className="text-[10px] font-bold leading-tight text-ink/50">
                    {INTEREST_THEMES[t].desc}
                  </div>
                </div>
                {on && (
                  <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-honey text-[11px] text-white">
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-extrabold text-ink">Chọn nhân vật</label>
        <div className="grid grid-cols-6 gap-2">
          {avatars.map((a) => (
            <button
              key={a}
              onClick={() => setAvatar(a)}
              className={`flex aspect-square items-center justify-center rounded-2xl text-3xl transition ${
                avatar === a ? 'scale-110 bg-honey/30 ring-4 ring-honey' : 'bg-white'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-extrabold text-ink">Độ tuổi của bé</label>
        <div className="grid grid-cols-2 gap-2">
          {BAND_ORDER.map((b) => (
            <button
              key={b}
              onClick={() => setBand(b)}
              className={`rounded-2xl border-4 p-3 text-left transition ${
                band === b ? 'border-honey bg-honey/20' : 'border-white bg-white'
              }`}
            >
              <div className="text-base font-extrabold text-ink">{AGE_BANDS[b].label}</div>
              <div className="text-xs font-bold text-ink/60">{AGE_BANDS[b].range}</div>
            </button>
          ))}
        </div>
        <p className="mt-2 text-center text-xs font-semibold text-ink/50">
          Có thể đổi độ tuổi và chủ đề bất kỳ lúc nào trong phần cài đặt.
        </p>
      </div>

      <button
        onClick={() => setMontessori((v) => !v)}
        className={`flex items-center gap-3 rounded-2xl border-4 p-3 text-left transition ${
          montessori ? 'border-grass bg-grass/15' : 'border-white bg-white'
        }`}
      >
        <span className="text-3xl">🧩</span>
        <div className="flex-1">
          <div className="text-sm font-extrabold text-ink">Chế độ Montessori</div>
          <div className="text-[11px] font-bold leading-tight text-ink/55">
            Học bằng thanh số & hạt cườm, phản hồi điềm đạm, có bài tập tô chữ số
          </div>
        </div>
        <span
          className={`relative h-7 w-12 shrink-0 rounded-full transition ${montessori ? 'bg-grass' : 'bg-black/20'}`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${montessori ? 'left-[22px]' : 'left-0.5'}`}
          />
        </span>
      </button>

      <button
        onClick={submit}
        className="mt-1 rounded-2xl bg-gradient-to-b from-honey to-honey-dark py-4 text-xl font-extrabold text-white shadow-lg active:scale-95"
      >
        Bắt đầu học 🎉
      </button>
    </div>
  )
}
