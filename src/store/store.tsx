import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { AgeBand, ChildProfile, InterestTheme, LessonStat, StatsMap } from '../types'
import { setSoundOn, setVoiceOn } from '../audio/sound'

const K_PROFILES = 'mathbee.profiles'
const K_ACTIVE = 'mathbee.active'
const K_STATS = 'mathbee.stats.v2' // { [childId]: StatsMap }
const K_SETTINGS = 'mathbee.settings'

interface Settings {
  sound: boolean
  voice: boolean
  pin?: string // mã PIN bảo vệ khu quản trị (rỗng = chưa đặt)
  unlockAll?: boolean // (quản trị) mở khoá TẤT CẢ bài để kiểm tra — chỉ vào được qua khu quản trị
}

interface AppState {
  profiles: ChildProfile[]
  activeId: string | null
  active: ChildProfile | null
  stats: StatsMap // của trẻ đang chọn
  settings: Settings
  addProfile: (
    name: string,
    avatar: string,
    ageBand: AgeBand,
    themes?: InterestTheme[],
    montessori?: boolean,
  ) => ChildProfile
  updateProfile: (id: string, patch: Partial<ChildProfile>) => void
  removeProfile: (id: string) => void
  setActive: (id: string) => void
  recordResult: (lessonId: string, stars: number, correct: number, total: number) => void
  starsFor: (lessonId: string) => number
  statFor: (lessonId: string) => LessonStat | undefined
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
  const [allStats, setAllStats] = useState<Record<string, StatsMap>>(() => load(K_STATS, {}))
  const [settings, setSettingsState] = useState<Settings>(() =>
    load(K_SETTINGS, { sound: true, voice: true }),
  )

  useEffect(() => save(K_PROFILES, profiles), [profiles])
  useEffect(() => save(K_ACTIVE, activeId), [activeId])
  useEffect(() => save(K_STATS, allStats), [allStats])
  useEffect(() => {
    save(K_SETTINGS, settings)
    setSoundOn(settings.sound)
    setVoiceOn(settings.voice)
  }, [settings])

  const active = useMemo(
    () => profiles.find((p) => p.id === activeId) ?? null,
    [profiles, activeId],
  )
  const stats = useMemo<StatsMap>(
    () => (activeId ? allStats[activeId] ?? {} : {}),
    [allStats, activeId],
  )

  const addProfile = useCallback(
    (
      name: string,
      avatar: string,
      ageBand: AgeBand,
      themes: InterestTheme[] = ['classic'],
      montessori = false,
    ) => {
      const p: ChildProfile = {
        id: genId(),
        name: name.trim() || 'Bé',
        avatar,
        ageBand,
        themes: themes.length ? themes : ['classic'],
        montessori,
        createdAt: Date.now(),
      }
      setProfiles((prev) => [...prev, p])
      setActiveId(p.id)
      return p
    },
    [],
  )

  const updateProfile = useCallback((id: string, patch: Partial<ChildProfile>) => {
    setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }, [])

  const removeProfile = useCallback((id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id))
    setAllStats((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setActiveId((cur) => (cur === id ? null : cur))
  }, [])

  const setActive = useCallback((id: string) => setActiveId(id), [])

  const recordResult = useCallback(
    (lessonId: string, stars: number, correct: number, total: number) => {
      if (!activeId) return
      setAllStats((prev) => {
        const childStats = prev[activeId] ?? {}
        const cur = childStats[lessonId]
        const merged: LessonStat = {
          stars: Math.max(cur?.stars ?? 0, stars),
          plays: (cur?.plays ?? 0) + 1,
          correct: (cur?.correct ?? 0) + correct,
          total: (cur?.total ?? 0) + total,
          lastPlayed: Date.now(),
        }
        return { ...prev, [activeId]: { ...childStats, [lessonId]: merged } }
      })
    },
    [activeId],
  )

  const starsFor = useCallback((lessonId: string) => stats[lessonId]?.stars ?? 0, [stats])
  const statFor = useCallback((lessonId: string) => stats[lessonId], [stats])
  const totalStars = useCallback(
    () => Object.values(stats).reduce((a, s) => a + (s.stars ?? 0), 0),
    [stats],
  )
  const setSettings = useCallback(
    (patch: Partial<Settings>) => setSettingsState((s) => ({ ...s, ...patch })),
    [],
  )

  const value: AppState = {
    profiles,
    activeId,
    active,
    stats,
    settings,
    addProfile,
    updateProfile,
    removeProfile,
    setActive,
    recordResult,
    starsFor,
    statFor,
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
