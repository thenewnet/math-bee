import { useState } from 'react'
import type { Lesson, Question } from './types'
import { useStore } from './store/store'
import { Onboarding } from './screens/Onboarding'
import { Home } from './screens/Home'
import { LessonPlayer } from './screens/LessonPlayer'
import { Rewards } from './screens/Rewards'
import { Settings } from './screens/Settings'
import { Report } from './screens/Report'
import { PinGate } from './components/PinGate'

type Screen = 'home' | 'lesson' | 'rewards' | 'settings' | 'report' | 'onboarding'

// Bài luyện tập thích ứng (không thuộc giáo trình, không ghi sao)
const PRACTICE_LESSON: Lesson = {
  id: 'practice-adaptive',
  title: 'Luyện tập thích ứng',
  emoji: '🎯',
  activity: 'count',
  skill: 'Ôn luyện theo khả năng',
  config: {},
}

export default function App() {
  const { profiles, active, recordResult, settings } = useStore()
  const [screen, setScreen] = useState<Screen>('home')
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [override, setOverride] = useState<Question[] | null>(null)
  const [adminUnlocked, setAdminUnlocked] = useState(false)

  // Chưa có hồ sơ nào, hoặc chưa chọn bé nào => tạo hồ sơ
  if (profiles.length === 0 || !active || screen === 'onboarding') {
    return (
      <main className="min-h-full">
        <Onboarding onDone={() => setScreen('home')} />
      </main>
    )
  }

  function goHome() {
    setScreen('home')
    setAdminUnlocked(false) // đóng khu quản trị khi về trang chính
  }

  function openLesson(l: Lesson) {
    setLesson(l)
    setOverride(null)
    setScreen('lesson')
  }

  function startPractice(qs: Question[]) {
    if (qs.length === 0) return
    setLesson(PRACTICE_LESSON)
    setOverride(qs)
    setScreen('lesson')
  }

  // Khu quản trị được bảo vệ bằng PIN (nếu đã đặt)
  const needPin = screen === 'settings' && !!settings.pin && !adminUnlocked

  return (
    <main className="min-h-full">
      {screen === 'home' && (
        <Home
          onOpenLesson={openLesson}
          onStartPractice={startPractice}
          onOpenSettings={() => {
            if (!settings.pin) setAdminUnlocked(true) // chưa đặt PIN thì vào thẳng
            setScreen('settings')
          }}
          onOpenRewards={() => setScreen('rewards')}
        />
      )}

      {screen === 'lesson' && lesson && (
        <LessonPlayer
          key={lesson.id + (override ? '-practice' : '')}
          lesson={lesson}
          questionsOverride={override ?? undefined}
          onExit={goHome}
          onDone={(stars, correct, total) => {
            if (!override) recordResult(lesson.id, stars, correct, total)
          }}
        />
      )}

      {screen === 'rewards' && <Rewards onBack={goHome} />}

      {screen === 'settings' &&
        (needPin ? (
          <PinGate pin={settings.pin!} onSuccess={() => setAdminUnlocked(true)} onCancel={goHome} />
        ) : (
          <Settings
            onBack={goHome}
            onAddChild={() => setScreen('onboarding')}
            onOpenReport={() => setScreen('report')}
          />
        ))}

      {screen === 'report' && <Report onBack={() => setScreen('settings')} />}
    </main>
  )
}
