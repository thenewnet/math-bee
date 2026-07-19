import { useState } from 'react'
import type { Lesson } from './types'
import { useStore } from './store/store'
import { Onboarding } from './screens/Onboarding'
import { Home } from './screens/Home'
import { LessonPlayer } from './screens/LessonPlayer'
import { Rewards } from './screens/Rewards'
import { Settings } from './screens/Settings'

type Screen = 'home' | 'lesson' | 'rewards' | 'settings' | 'onboarding'

export default function App() {
  const { profiles, active, recordStars } = useStore()
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
          onDone={(stars) => recordStars(lesson.id, stars)}
        />
      )}

      {screen === 'rewards' && <Rewards onBack={() => setScreen('home')} />}

      {screen === 'settings' && (
        <Settings onBack={() => setScreen('home')} onAddChild={() => setScreen('onboarding')} />
      )}
    </main>
  )
}
