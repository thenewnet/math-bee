import { useEffect, useMemo, useRef, useState } from 'react'
import type { Lesson, Question } from '../types'
import { generateQuestions } from '../engine/generators'
import { QuestionView } from '../components/QuestionView'
import { OptionButton } from '../components/OptionButton'
import { Stars } from '../components/Stars'
import { Mascot } from '../components/Mascot'
import { Confetti } from '../components/Confetti'
import { playCelebrate, playCorrect, playStar, playTap, playWrong, speak, unlockAudio } from '../audio/sound'

const PRAISE = ['Giỏi quá!', 'Chính xác!', 'Tuyệt vời!', 'Đúng rồi!', 'Xuất sắc!', 'Bé thông minh ghê!']
const RETRY = ['Thử lại nhé!', 'Gần đúng rồi, cố lên!', 'Chọn lại nào!']

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
  onDone: (stars: number) => void
}) {
  const questions = useMemo<Question[]>(() => generateQuestions(lesson), [lesson])
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

  const q = questions[idx]
  const total = questions.length

  useEffect(() => {
    // đọc câu hỏi khi chuyển câu
    const t = window.setTimeout(() => speak(q?.prompt ?? ''), 250)
    return () => window.clearTimeout(t)
  }, [q])

  useEffect(() => () => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current)
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
    setConfetti((c) => c + 1)
    playCelebrate()
    const msg = stars === 3 ? 'Hoàn hảo! Bé được 3 sao!' : stars === 2 ? 'Làm tốt lắm!' : 'Hoàn thành rồi!'
    window.setTimeout(() => speak(msg), 300)
    onDone(stars)
  }

  function choose(optionId: string) {
    if (solved || finished) return
    unlockAudio()
    playTap()
    if (optionId === q.answer) {
      if (!mistakeRef.current) {
        perfectRef.current += 1
        setPerfect((p) => p + 1)
      }
      setSolved(true)
      playCorrect()
      const praise = PRAISE[Math.floor(Math.random() * PRAISE.length)]
      setFeedback(praise)
      window.setTimeout(() => speak(praise), 120)
      setConfetti((c) => c + 1)
      advanceTimer.current = window.setTimeout(next, 1400)
    } else {
      mistakeRef.current = true
      setWrongIds((prev) => new Set(prev).add(optionId))
      playWrong()
      const r = RETRY[Math.floor(Math.random() * RETRY.length)]
      setFeedback(r)
      window.setTimeout(() => speak(r), 120)
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
    <div className="flex min-h-full flex-col p-4">
      <Confetti trigger={confetti} />
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
        className="mb-3 flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-center text-lg font-extrabold text-ink shadow"
      >
        <span>{q.prompt}</span>
        <span className="text-xl">🔊</span>
      </button>

      {/* visual */}
      <div className="mb-4">
        <QuestionView q={q} />
      </div>

      {/* feedback bubble */}
      <div className="mb-2 h-7 text-center text-lg font-extrabold">
        {feedback && (
          <span className={solved ? 'text-grass-dark' : 'text-coral'}>{feedback}</span>
        )}
      </div>

      {/* options */}
      <div
        className={`grid gap-3 ${q.options.length <= 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}
      >
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
              disabled={solved || wrongIds.has(opt.id)}
              onClick={() => {
                if (isAnswer && !solved) playStar()
                choose(opt.id)
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
