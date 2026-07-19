import { useState } from 'react'
import type { Lesson } from './types'
import { useStore } from './store/store'
import { Onboarding } from './screens/Onboarding'
import { Home } from './screens/Home'
import { LessonPlayer } from './screens/LessonPlayer'
import { Rewards } from './screens/Rewards'
import { Settings } from './screens/Settings'
import { Report } from './screens/Report'

type Screen = 'home' | 'lesson' | 'rewards' | 'settings' | 'report' | 'onboarding'

export default function App() {
  const { profiles, active, recordResult } = useStore()
  const [screen, setScreen] = useState<Screen>('home')
  const [lesson, setLesson] = useState<Lesson | null>(null)

  // Chưa có hồ sơ nào, hoặc chưa chọn bé nào => tạo hồ sơ
  if (profiles.length === 0 || !active || screen === 'onboarding') {
    return (
      <main className="min-h-full">
        <Onboarding onDone={() => setScreen('home')} />
      </main>
    )
  }

  return (
    <main className="min-h-full">
      {screen === 'home' && (
        <Home
          onOpenLesson={(l) => {
            setLesson(l)
            setScreen('lesson')
          }}
          onOpenSettings={() => setScreen('settings')}
          onOpenRewards={() => setScreen('rewards')}
        />
      )}

      {screen === 'lesson' && lesson && (
        <LessonPlayer
          key={lesson.id}
          lesson={lesson}
          onExit={() => setScreen('home')}
          onDone={(stars, correct, total) => recordResult(lesson.id, stars, correct, total)}
        />
      )}

      {screen === 'rewards' && <Rewards onBack={() => setScreen('home')} />}

      {screen === 'settings' && (
        <Settings
          onBack={() => setScreen('home')}
          onAddChild={() => setScreen('onboarding')}
          onOpenReport={() => setScreen('report')}
        />
      )}

      {screen === 'report' && <Report onBack={() => setScreen('settings')} />}
    </main>
  )
}
