import { useEffect, useMemo, useRef, useState } from 'react'
import type { Lesson, Question } from '../types'
import { profileThemes } from '../types'
import { generateQuestions } from '../engine/generators'
import { QuestionView } from '../components/QuestionView'
import { OptionButton } from '../components/OptionButton'
import { TraceNumber } from '../components/TraceNumber'
import { PinkTower } from '../components/PinkTower'
import { Stars } from '../components/Stars'
import { Mascot } from '../components/Mascot'
import { Confetti } from '../components/Confetti'
import { useStore } from '../store/store'
import { playCelebrate, playCorrect, playStar, playTap, playWrong, speak, unlockAudio } from '../audio/sound'

const PRAISE = ['Giỏi quá!', 'Chính xác!', 'Tuyệt vời!', 'Đúng rồi!', 'Xuất sắc!', 'Bé thông minh ghê!']
const RETRY = ['Thử lại nhé!', 'Gần đúng rồi, cố lên!', 'Chọn lại nào!']

const SHAPE_NAMES: Record<string, string> = {
  circle: 'hình tròn',
  square: 'hình vuông',
  triangle: 'hình tam giác',
  rectangle: 'hình chữ nhật',
}

// Nội dung đọc to khi bé chọn (để luyện đọc & nhớ)
function optionSpoken(opt: { digit?: number; label?: string; shape?: string; objects?: { count: number } }): string {
  if (opt.digit !== undefined) return String(opt.digit)
  if (opt.label) return opt.label
  if (opt.shape) return SHAPE_NAMES[opt.shape] ?? ''
  if (opt.objects) return String(opt.objects.count)
  return ''
}

function starFor(perfect: number, total: number): number {
  if (total === 0) return 1
  const ratio = perfect / total
  if (ratio >= 0.999) return 3
  if (ratio >= 0.6) return 2
  return 1
}

export function LessonPlayer({
  lesson,
  onExit,
  onDone,
}: {
  lesson: Lesson
  onExit: () => void
  onDone: (stars: number, correct: number, total: number) => void
}) {
  const { active } = useStore()
  const themes = active ? profileThemes(active) : undefined
  const themesKey = themes?.join(',') ?? ''
  const montessori = !!active?.montessori
  const questions = useMemo<Question[]>(
    () => generateQuestions(lesson, themes),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lesson, themesKey],
  )
  const [idx, setIdx] = useState(0)
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set())
  const [solved, setSolved] = useState(false)
  const [perfect, setPerfect] = useState(0)
  const perfectRef = useRef(0)
  const mistakeRef = useRef(false)
  const [finished, setFinished] = useState(false)
  const [confetti, setConfetti] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const advanceTimer = useRef<number | null>(null)
  const [locked, setLocked] = useState(false) // tạm khoá 3s khi bé đoán liên tục
  const wrongStreak = useRef(0)
  const lockTimer = useRef<number | null>(null)

  const q = questions[idx]
  const total = questions.length

  useEffect(() => {
    // đọc câu hỏi khi chuyển câu
    const t = window.setTimeout(() => speak(q?.prompt ?? ''), 250)
    return () => window.clearTimeout(t)
  }, [q])

  useEffect(() => () => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current)
    if (lockTimer.current) window.clearTimeout(lockTimer.current)
  }, [])

  function next() {
    if (idx + 1 >= total) {
      finish(starFor(perfectRef.current, total))
    } else {
      setIdx((i) => i + 1)
      setWrongIds(new Set())
      setSolved(false)
      mistakeRef.current = false
      setFeedback(null)
    }
  }

  function finish(stars: number) {
    setFinished(true)
    if (!montessori) setConfetti((c) => c + 1)
    playCelebrate()
    const msg = stars === 3 ? 'Hoàn hảo! Bé được 3 sao!' : stars === 2 ? 'Làm tốt lắm!' : 'Hoàn thành rồi!'
    window.setTimeout(() => speak(msg), 300)
    onDone(stars, perfectRef.current, total)
  }

  function choose(optionId: string) {
    if (solved || finished || locked) return
    unlockAudio()
    playTap()
    const opt = q.options.find((o) => o.id === optionId)
    const said = opt ? optionSpoken(opt) : ''
    if (optionId === q.answer) {
      wrongStreak.current = 0
      if (!mistakeRef.current) {
        perfectRef.current += 1
        setPerfect((p) => p + 1)
      }
      setSolved(true)
      playCorrect()
      const praise = PRAISE[Math.floor(Math.random() * PRAISE.length)]
      setFeedback(praise)
      // đọc kết quả bé chọn rồi khen (luyện đọc & nhớ)
      speak(said ? `${said}. ${praise}` : praise)
      if (!montessori) setConfetti((c) => c + 1)
      advanceTimer.current = window.setTimeout(next, montessori ? 1000 : 1500)
    } else {
      mistakeRef.current = true
      wrongStreak.current += 1
      setWrongIds((prev) => new Set(prev).add(optionId))
      playWrong()
      const r = RETRY[Math.floor(Math.random() * RETRY.length)]
      setFeedback(r)
      // đoán liên tục 3 lần sai => tạm khoá, đọc lời nhắc (bé chưa biết đọc).
      // Mở lại khi ĐÃ đủ 3 giây VÀ đã đọc xong câu (nếu câu dài hơn thì chờ hết).
      if (wrongStreak.current >= 3) {
        setLocked(true)
        setFeedback(null)
        const warn =
          'Bé ơi, hãy bình tĩnh suy nghĩ nhé! Đừng chọn bừa. Con hãy nhìn và đếm thật kỹ, rồi chọn đáp án đúng.'
        let timeDone = false
        let speechDone = false
        const tryUnlock = () => {
          if (timeDone && speechDone) {
            setLocked(false)
            wrongStreak.current = 0
          }
        }
        speak(warn, () => {
          speechDone = true
          tryUnlock()
        })
        lockTimer.current = window.setTimeout(() => {
          timeDone = true
          tryUnlock()
        }, 3000)
        // chốt an toàn: dù có trục trặc giọng đọc cũng mở lại sau tối đa 12 giây
        window.setTimeout(() => {
          if (!timeDone || !speechDone) {
            setLocked(false)
            wrongStreak.current = 0
          }
        }, 12000)
      } else {
        speak(said ? `${said}. ${r}` : r)
      }
    }
  }

  // đã hoàn thành => màn hình kết quả
  if (finished) {
    const stars = starFor(perfect, total)
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-6 p-6 text-center">
        <Confetti trigger={confetti} />
        <h2 className="text-2xl font-extrabold text-honey-dark">Hoàn thành bài học!</h2>
        <div className="anim-pop">
          <Mascot mood="cheer" message={stars === 3 ? 'Bé giỏi tuyệt vời!' : 'Cố lên nào!'} size={120} />
        </div>
        <div className="anim-star">
          <Stars value={stars} size="lg" />
        </div>
        <p className="text-lg font-bold text-ink">
          Đúng {perfect}/{total} câu ngay lần đầu
        </p>
        <div className="flex gap-3">
          <button
            onClick={onExit}
            className="rounded-2xl bg-honey px-8 py-3 text-lg font-extrabold text-white shadow-lg active:scale-95"
          >
            Về bản đồ
          </button>
        </div>
      </div>
    )
  }

  if (!q) return null

  return (
    <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col p-4 sm:p-6">
      <Confetti trigger={confetti} />

      {/* Lớp phủ tạm khoá 3s khi bé đoán liên tục */}
      {locked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-6 backdrop-blur-sm">
          <div className="anim-pop flex max-w-xs flex-col items-center gap-3 rounded-3xl bg-white p-6 text-center shadow-2xl">
            <span className="text-6xl anim-bounce">🤔</span>
            <h3 className="text-xl font-extrabold text-coral">Bình tĩnh suy nghĩ nhé!</h3>
            <p className="text-sm font-bold text-ink/70">Đừng đoán — hãy đếm/nhìn thật kỹ rồi chọn.</p>
            <div className="relative mt-1 h-2.5 w-full overflow-hidden rounded-full bg-black/10">
              <div className="anim-indeterminate rounded-full bg-honey" />
            </div>
          </div>
        </div>
      )}

      {/* header */}
      <div className="mb-3 flex items-center gap-3">
        <button
          onClick={onExit}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl shadow active:scale-95"
          aria-label="Thoát"
        >
          ✖️
        </button>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-white/70 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-honey to-honey-dark transition-all"
            style={{ width: `${((idx + (solved ? 1 : 0)) / total) * 100}%` }}
          />
        </div>
        <div className="rounded-full bg-white px-3 py-1 text-sm font-extrabold text-ink shadow">
          {idx + 1}/{total}
        </div>
      </div>

      {/* prompt */}
      <button
        onClick={() => speak(q.prompt)}
        className="mb-4 flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-4 text-center text-xl font-extrabold text-ink shadow sm:text-2xl"
      >
        <span>{q.prompt}</span>
        <span className="text-xl">🔊</span>
      </button>

      {q.render.kind === 'trace' || q.render.kind === 'seriation' ? (
        /* Bài tương tác trực tiếp (Montessori) — không có lựa chọn */
        <div className="mt-2 flex flex-col items-center">
          {q.render.kind === 'trace' ? (
            <TraceNumber
              key={q.id}
              value={q.render.value}
              onComplete={() => {
                if (!solved) choose(q.answer)
              }}
            />
          ) : (
            <PinkTower
              key={q.id}
              sizes={q.render.sizes}
              onComplete={() => {
                if (!solved) choose(q.answer)
              }}
            />
          )}
          <div className="mt-3 h-7 text-center text-lg font-extrabold">
            {feedback && <span className="text-grass-dark">{feedback}</span>}
          </div>
        </div>
      ) : (
        <>
          {/* visual */}
          <div className="mb-4">
            <QuestionView q={q} montessori={montessori} />
          </div>

          {/* feedback bubble */}
          <div className="mb-2 h-7 text-center text-lg font-extrabold">
            {feedback && (
              <span className={solved ? 'text-grass-dark' : 'text-coral'}>{feedback}</span>
            )}
          </div>

          {/* options */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">

            {q.options.map((opt) => {
              const isAnswer = opt.id === q.answer
              const state = solved
                ? isAnswer
                  ? 'correct'
                  : 'dim'
                : wrongIds.has(opt.id)
                  ? 'wrong'
                  : 'idle'
              return (
                <OptionButton
                  key={opt.id}
                  option={opt}
                  state={state}
                  montessori={montessori}
                  disabled={solved || locked || wrongIds.has(opt.id)}
                  onClick={() => {
                    if (isAnswer && !solved && !montessori) playStar()
                    choose(opt.id)
                  }}
                />
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
