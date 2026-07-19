import { useState } from 'react'
import type { AgeBand } from '../types'
import { AGE_BANDS } from '../types'
import { useStore } from '../store/store'
import { Mascot } from '../components/Mascot'
import { speak, unlockAudio } from '../audio/sound'

const AVATARS = ['🦊', '🐰', '🐨', '🐯', '🦁', '🐼', '🐸', '🐵', '🦄', '🐧', '🐷', '🐥']
const BAND_ORDER: AgeBand[] = ['be', 'nho', 'lon', 'tien-th']

export function Onboarding({ onDone }: { onDone: () => void }) {
  const { addProfile } = useStore()
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(AVATARS[0])
  const [band, setBand] = useState<AgeBand>('lon')

  function submit() {
    unlockAudio()
    addProfile(name, avatar, band)
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
        <label className="mb-2 block text-sm font-extrabold text-ink">Chọn nhân vật</label>
        <div className="grid grid-cols-6 gap-2">
          {AVATARS.map((a) => (
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
          Có thể đổi độ tuổi bất kỳ lúc nào trong phần cài đặt.
        </p>
      </div>

      <button
        onClick={submit}
        className="mt-1 rounded-2xl bg-gradient-to-b from-honey to-honey-dark py-4 text-xl font-extrabold text-white shadow-lg active:scale-95"
      >
        Bắt đầu học 🎉
      </button>
    </div>
  )
}
