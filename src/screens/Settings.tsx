import { useState } from 'react'
import type { AgeBand, InterestTheme } from '../types'
import { AGE_BANDS, INTEREST_THEMES, profileThemes } from '../types'
import { THEME_AVATARS } from '../engine/themes'
import { useStore } from '../store/store'

const BAND_ORDER: AgeBand[] = ['be', 'nho', 'lon', 'tien-th']
const THEME_ORDER: InterestTheme[] = ['classic', 'robot', 'hero', 'monster', 'car']

export function Settings({
  onBack,
  onAddChild,
  onOpenReport,
}: {
  onBack: () => void
  onAddChild: () => void
  onOpenReport: () => void
}) {
  const { profiles, activeId, active, setActive, updateProfile, removeProfile, settings, setSettings } =
    useStore()
  const [confirmDel, setConfirmDel] = useState<string | null>(null)
  const [pinInput, setPinInput] = useState('')

  return (
    <div className="mx-auto max-w-lg p-4 pb-10">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl shadow active:scale-95"
        >
          ⬅️
        </button>
        <h1 className="text-2xl font-extrabold text-honey-dark">Khu quản trị</h1>
      </div>

      {/* Mã PIN bảo vệ */}
      <section className="mb-5 rounded-3xl bg-white p-4 shadow">
        <h2 className="mb-2 text-base font-extrabold text-ink">🔒 Mã PIN khu quản trị</h2>
        <p className="mb-3 text-xs font-bold text-ink/50">
          {settings.pin
            ? 'Đang bảo vệ — bé sẽ không tự vào được khu này.'
            : 'Chưa đặt PIN. Đặt mã 4 số để chỉ phụ huynh vào được.'}
        </p>
        <div className="flex items-center gap-2">
          <input
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
            inputMode="numeric"
            placeholder="Nhập 4 số"
            className="w-32 rounded-xl border-4 border-honey/40 bg-white px-3 py-2 text-center text-lg font-extrabold tracking-widest text-ink outline-none focus:border-honey"
          />
          <button
            onClick={() => {
              if (pinInput.length === 4) {
                setSettings({ pin: pinInput })
                setPinInput('')
              }
            }}
            disabled={pinInput.length !== 4}
            className="rounded-xl bg-honey px-4 py-2 text-sm font-extrabold text-white disabled:opacity-40"
          >
            {settings.pin ? 'Đổi PIN' : 'Đặt PIN'}
          </button>
          {settings.pin && (
            <button
              onClick={() => setSettings({ pin: undefined })}
              className="rounded-xl bg-black/10 px-3 py-2 text-sm font-extrabold text-ink/70"
            >
              Bỏ PIN
            </button>
          )}
        </div>
      </section>

      {/* Báo cáo cho phụ huynh */}
      <button
        onClick={onOpenReport}
        className="mb-5 flex w-full items-center gap-3 rounded-3xl bg-gradient-to-r from-sky to-sky-dark p-4 text-left text-white shadow active:scale-95"
      >
        <span className="text-3xl">📊</span>
        <div className="flex-1">
          <div className="text-base font-extrabold">Báo cáo học tập</div>
          <div className="text-xs font-bold opacity-90">Xem tiến độ & độ chính xác của bé</div>
        </div>
        <span className="text-xl">➜</span>
      </button>

      {/* Âm thanh */}
      <section className="mb-5 rounded-3xl bg-white p-4 shadow">
        <h2 className="mb-3 text-base font-extrabold text-ink">🔊 Âm thanh</h2>
        <Toggle
          label="Hiệu ứng âm thanh"
          value={settings.sound}
          onChange={(v) => setSettings({ sound: v })}
        />
        <div className="h-2" />
        <Toggle
          label="Giọng đọc tiếng Việt"
          value={settings.voice}
          onChange={(v) => setSettings({ voice: v })}
        />
      </section>

      {/* Chế độ kiểm tra (chỉ hiện trong khu quản trị — bé không vào được) */}
      <section className="mb-5 rounded-3xl bg-white p-4 shadow">
        <h2 className="mb-2 text-base font-extrabold text-ink">🧪 Chế độ kiểm tra</h2>
        <p className="mb-3 text-xs font-bold text-ink/50">
          Mở khoá tất cả bài học để xem trước/kiểm tra. Chỉ dành cho người lớn — nên tắt lại
          khi cho bé học để giữ lộ trình mở khoá tuần tự.
        </p>
        <Toggle
          label="Mở khoá tất cả bài (để kiểm tra)"
          value={!!settings.unlockAll}
          onChange={(v) => setSettings({ unlockAll: v })}
        />
      </section>

      {/* Hồ sơ trẻ */}
      <section className="mb-5 rounded-3xl bg-white p-4 shadow">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-ink">👦 Hồ sơ của bé</h2>
          <button
            onClick={onAddChild}
            className="rounded-full bg-honey px-3 py-1.5 text-sm font-extrabold text-white active:scale-95"
          >
            + Thêm bé
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {profiles.map((p) => (
            <div
              key={p.id}
              className={`rounded-2xl border-4 p-3 ${
                p.id === activeId ? 'border-honey bg-honey/10' : 'border-black/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{p.avatar}</span>
                <div className="flex-1">
                  <div className="text-base font-extrabold text-ink">{p.name}</div>
                  <div className="text-xs font-bold text-ink/50">{AGE_BANDS[p.ageBand].label}</div>
                </div>
                {p.id !== activeId ? (
                  <button
                    onClick={() => setActive(p.id)}
                    className="rounded-full bg-sky px-3 py-1.5 text-xs font-extrabold text-white active:scale-95"
                  >
                    Chọn
                  </button>
                ) : (
                  <span className="rounded-full bg-grass px-3 py-1.5 text-xs font-extrabold text-white">
                    Đang chọn
                  </span>
                )}
              </div>

              {/* đổi chủ đề yêu thích (chọn nhiều) */}
              {(() => {
                const cur = profileThemes(p)
                const toggle = (t: InterestTheme) => {
                  let next: InterestTheme[]
                  if (t === 'classic') next = ['classic']
                  else {
                    const base = cur.filter((x) => x !== 'classic')
                    next = base.includes(t) ? base.filter((x) => x !== t) : [...base, t]
                    if (next.length === 0) next = ['classic']
                  }
                  const at = next.filter((x) => x !== 'classic')
                  const list = (at.length ? at : ['classic']).flatMap(
                    (x) => THEME_AVATARS[x as InterestTheme],
                  )
                  updateProfile(p.id, {
                    themes: next,
                    avatar: list.includes(p.avatar) ? p.avatar : list[0],
                  })
                }
                const at = cur.filter((x) => x !== 'classic')
                const avatarList = [
                  ...new Set((at.length ? at : ['classic']).flatMap((x) => THEME_AVATARS[x as InterestTheme])),
                ]
                return (
                  <>
                    <div className="mt-3">
                      <div className="mb-1 text-[11px] font-extrabold text-ink/60">
                        Chủ đề (chọn nhiều)
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {THEME_ORDER.map((t) => (
                          <button
                            key={t}
                            onClick={() => toggle(t)}
                            className={`flex flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10px] font-extrabold ${
                              cur.includes(t) ? 'bg-honey text-white' : 'bg-black/5 text-ink/70'
                            }`}
                          >
                            <span className="text-lg">{INTEREST_THEMES[t].emoji}</span>
                            {INTEREST_THEMES[t].label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {avatarList.map((a) => (
                        <button
                          key={a}
                          onClick={() => updateProfile(p.id, { avatar: a })}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg ${
                            p.avatar === a ? 'bg-honey/30 ring-2 ring-honey' : 'bg-black/5'
                          }`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </>
                )
              })()}

              {/* đổi độ tuổi */}
              <div className="mt-3 grid grid-cols-4 gap-1.5">
                {BAND_ORDER.map((b) => (
                  <button
                    key={b}
                    onClick={() => updateProfile(p.id, { ageBand: b })}
                    className={`rounded-lg py-1.5 text-[11px] font-extrabold ${
                      p.ageBand === b ? 'bg-honey text-white' : 'bg-black/5 text-ink/70'
                    }`}
                  >
                    {AGE_BANDS[b].range}
                  </button>
                ))}
              </div>

              {/* chế độ Montessori */}
              <button
                onClick={() => updateProfile(p.id, { montessori: !p.montessori })}
                className="mt-3 flex w-full items-center justify-between rounded-lg bg-black/5 px-3 py-2"
              >
                <span className="flex items-center gap-1.5 text-xs font-extrabold text-ink">
                  🧩 Chế độ Montessori
                </span>
                <span
                  className={`relative h-6 w-11 rounded-full transition ${p.montessori ? 'bg-grass' : 'bg-black/20'}`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${p.montessori ? 'left-[22px]' : 'left-0.5'}`}
                  />
                </span>
              </button>

              {/* xoá */}
              <div className="mt-3 text-right">
                {confirmDel === p.id ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="text-xs font-bold text-coral">Xoá bé này?</span>
                    <button
                      onClick={() => {
                        removeProfile(p.id)
                        setConfirmDel(null)
                      }}
                      className="rounded-full bg-coral px-3 py-1 text-xs font-extrabold text-white"
                    >
                      Xoá
                    </button>
                    <button
                      onClick={() => setConfirmDel(null)}
                      className="rounded-full bg-black/10 px-3 py-1 text-xs font-extrabold text-ink"
                    >
                      Huỷ
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => setConfirmDel(p.id)}
                    className="text-xs font-bold text-coral/80 underline"
                  >
                    Xoá hồ sơ
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="text-center text-xs font-semibold text-ink/40">
        Math Bee • Bé đang học: {active?.name} • Dữ liệu lưu ngay trên thiết bị
      </p>
    </div>
  )
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between rounded-2xl bg-black/5 px-4 py-3"
    >
      <span className="font-bold text-ink">{label}</span>
      <span
        className={`relative h-7 w-12 rounded-full transition ${value ? 'bg-grass' : 'bg-black/20'}`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
            value ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  )
}
