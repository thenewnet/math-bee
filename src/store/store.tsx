import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { AgeBand, ChildProfile, ProgressMap } from '../types'
import { setSoundOn, setVoiceOn } from '../audio/sound'

const K_PROFILES = 'mathbee.profiles'
const K_ACTIVE = 'mathbee.active'
const K_PROGRESS = 'mathbee.progress' // { [childId]: ProgressMap }
const K_SETTINGS = 'mathbee.settings'

interface Settings {
  sound: boolean
  voice: boolean
}

interface AppState {
  profiles: ChildProfile[]
  activeId: string | null
  active: ChildProfile | null
  progress: ProgressMap // của trẻ đang chọn
  settings: Settings
  addProfile: (name: string, avatar: string, ageBand: AgeBand) => ChildProfile
  updateProfile: (id: string, patch: Partial<ChildProfile>) => void
  removeProfile: (id: string) => void
  setActive: (id: string) => void
  recordStars: (lessonId: string, stars: number) => void
  starsFor: (lessonId: string) => number
  totalStars: () => number
  setSettings: (patch: Partial<Settings>) => void
}

const Ctx = createContext<AppState | null>(null)

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}
function genId(): string {
  return 'c' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4)
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<ChildProfile[]>(() => load(K_PROFILES, []))
  const [activeId, setActiveId] = useState<string | null>(() => load(K_ACTIVE, null))
  const [allProgress, setAllProgress] = useState<Record<string, ProgressMap>>(() =>
    load(K_PROGRESS, {}),
  )
  const [settings, setSettingsState] = useState<Settings>(() =>
    load(K_SETTINGS, { sound: true, voice: true }),
  )

  useEffect(() => save(K_PROFILES, profiles), [profiles])
  useEffect(() => save(K_ACTIVE, activeId), [activeId])
  useEffect(() => save(K_PROGRESS, allProgress), [allProgress])
  useEffect(() => {
    save(K_SETTINGS, settings)
    setSoundOn(settings.sound)
    setVoiceOn(settings.voice)
  }, [settings])

  const active = useMemo(
    () => profiles.find((p) => p.id === activeId) ?? null,
    [profiles, activeId],
  )
  const progress = useMemo<ProgressMap>(
    () => (activeId ? allProgress[activeId] ?? {} : {}),
    [allProgress, activeId],
  )

  const addProfile = useCallback((name: string, avatar: string, ageBand: AgeBand) => {
    const p: ChildProfile = { id: genId(), name: name.trim() || 'Bé', avatar, ageBand, createdAt: Date.now() }
    setProfiles((prev) => [...prev, p])
    setActiveId(p.id)
    return p
  }, [])

  const updateProfile = useCallback((id: string, patch: Partial<ChildProfile>) => {
    setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }, [])

  const removeProfile = useCallback((id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id))
    setAllProgress((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setActiveId((cur) => (cur === id ? null : cur))
  }, [])

  const setActive = useCallback((id: string) => setActiveId(id), [])

  const recordStars = useCallback(
    (lessonId: string, stars: number) => {
      if (!activeId) return
      setAllProgress((prev) => {
        const childProg = prev[activeId] ?? {}
        const best = Math.max(childProg[lessonId] ?? 0, stars)
        return { ...prev, [activeId]: { ...childProg, [lessonId]: best } }
      })
    },
    [activeId],
  )

  const starsFor = useCallback((lessonId: string) => progress[lessonId] ?? 0, [progress])
  const totalStars = useCallback(
    () => Object.values(progress).reduce((a, b) => a + b, 0),
    [progress],
  )
  const setSettings = useCallback(
    (patch: Partial<Settings>) => setSettingsState((s) => ({ ...s, ...patch })),
    [],
  )

  const value: AppState = {
    profiles,
    activeId,
    active,
    progress,
    settings,
    addProfile,
    updateProfile,
    removeProfile,
    setActive,
    recordStars,
    starsFor,
    totalStars,
    setSettings,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore(): AppState {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore must be used within StoreProvider')
  return v
}
