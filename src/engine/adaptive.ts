import type { InterestTheme, Lesson, Question, StatsMap, LessonStat } from '../types'
import { ALL_LESSONS } from '../data/curriculum'
import { generateQuestions } from './generators'

// Các dạng bài có lựa chọn (dùng cho luyện tập thích ứng). Bỏ qua tô số / tháp
// hồng / ôn tập vì cách chơi khác.
const OPTION_ACTIVITIES = new Set([
  'count', 'recognizeDigit', 'digitToQuantity', 'compareQuantity', 'ordinal',
  'countTo10', 'sequence', 'compose', 'decompose', 'add', 'subtract', 'shape',
  'pattern', 'sortSize', 'spatial', 'solid', 'goldenBeads', 'hundredBoard', 'snake',
])

export const ACTIVITY_LABELS: Record<string, string> = {
  count: 'Đếm số lượng',
  recognizeDigit: 'Nhận biết chữ số',
  digitToQuantity: 'Số ↔ số lượng',
  compareQuantity: 'So sánh nhiều/ít',
  ordinal: 'Số thứ tự',
  countTo10: 'Đếm đến 10',
  sequence: 'Dãy số',
  compose: 'Gộp nhóm',
  decompose: 'Tách nhóm',
  add: 'Phép cộng',
  subtract: 'Phép trừ',
  shape: 'Hình học',
  pattern: 'Quy luật',
  sortSize: 'So sánh kích thước',
  spatial: 'Phương hướng & thời gian',
  solid: 'Khối 3 chiều',
  trace: 'Tập tô chữ số',
  seriation: 'Tháp Hồng',
  goldenBeads: 'Hạt vàng thập phân',
  hundredBoard: 'Bảng 100',
  snake: 'Con rắn cộng',
  review: 'Ôn tập chặng',
}

export function lessonAccuracy(stat?: LessonStat): number | null {
  if (!stat || stat.total === 0) return null
  return stat.correct / stat.total
}

const ABILITY = [
  { min: 0, key: 'new', label: 'Đang làm quen', emoji: '🌱' },
  { min: 0.5, key: 'ok', label: 'Khá', emoji: '🙂' },
  { min: 0.75, key: 'good', label: 'Vững vàng', emoji: '💪' },
  { min: 0.9, key: 'great', label: 'Xuất sắc', emoji: '🏆' },
]

export function abilityLevel(stats: StatsMap) {
  let c = 0, t = 0
  for (const s of Object.values(stats)) {
    c += s.correct
    t += s.total
  }
  const acc = t ? c / t : 0
  let lvl = ABILITY[0]
  for (const a of ABILITY) if (acc >= a.min) lvl = a
  return { ...lvl, accuracy: t ? acc : null, correct: c, total: t }
}

export interface ActivityStat {
  activity: string
  label: string
  correct: number
  total: number
  accuracy: number
}

// Gộp độ chính xác theo từng dạng bài (để chỉ ra kỹ năng còn yếu).
export function activityStats(stats: StatsMap): ActivityStat[] {
  const map = new Map<string, { c: number; t: number }>()
  for (const l of ALL_LESSONS) {
    const s = stats[l.id]
    if (!s || s.total === 0) continue
    const cur = map.get(l.activity) ?? { c: 0, t: 0 }
    cur.c += s.correct
    cur.t += s.total
    map.set(l.activity, cur)
  }
  const out: ActivityStat[] = []
  for (const [activity, { c, t }] of map) {
    out.push({ activity, label: ACTIVITY_LABELS[activity] ?? activity, correct: c, total: t, accuracy: t ? c / t : 0 })
  }
  return out.sort((a, b) => a.accuracy - b.accuracy)
}

export type Recommendation =
  | { type: 'review'; lesson: Lesson; accuracy: number }
  | { type: 'learn'; lesson: Lesson }
  | { type: 'practice' }

// Gợi ý việc nên làm tiếp cho bé, dựa trên đúng/sai.
export function recommend(stats: StatsMap, unlockedIds: Set<string>): Recommendation {
  // 1) Ôn lại bài đã học nhưng còn yếu (độ chính xác < 60%)
  let weak: { lesson: Lesson; acc: number } | null = null
  for (const l of ALL_LESSONS) {
    const s = stats[l.id]
    const acc = lessonAccuracy(s)
    if (s && s.plays > 0 && acc !== null && acc < 0.6) {
      if (!weak || acc < weak.acc) weak = { lesson: l, acc }
    }
  }
  if (weak) return { type: 'review', lesson: weak.lesson, accuracy: weak.acc }

  // 2) Học tiếp bài mới đầu tiên đã mở khoá mà chưa hoàn thành
  for (const l of ALL_LESSONS) {
    if (unlockedIds.has(l.id) && !((stats[l.id]?.stars ?? 0) > 0)) {
      return { type: 'learn', lesson: l }
    }
  }

  // 3) Đã ổn hết -> luyện tập thích ứng
  return { type: 'practice' }
}

// Tạo bộ câu hỏi luyện tập thích ứng: ưu tiên các bài bé còn yếu.
export function buildAdaptiveQuestions(
  stats: StatsMap,
  unlockedLessons: Lesson[],
  themes: InterestTheme[] | undefined,
  count = 10,
): Question[] {
  const cands = unlockedLessons.filter((l) => OPTION_ACTIVITIES.has(l.activity))
  if (cands.length === 0) return []
  const pool = cands.map((l) => {
    const acc = lessonAccuracy(stats[l.id]) ?? 0.5 // chưa làm => trọng số trung bình
    return { l, w: 1 - acc + 0.15 } // càng yếu càng dễ được chọn
  })
  const picks: Lesson[] = []
  const n = Math.min(5, pool.length)
  for (let k = 0; k < n; k++) {
    const total = pool.reduce((a, x) => a + x.w, 0)
    let r = Math.random() * total
    let idx = 0
    for (let i = 0; i < pool.length; i++) {
      r -= pool[i].w
      if (r <= 0) {
        idx = i
        break
      }
    }
    picks.push(pool[idx].l)
    pool.splice(idx, 1)
  }
  const qs: Question[] = []
  for (const l of picks) qs.push(...generateQuestions(l, themes).slice(0, 2))
  for (let i = qs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[qs[i], qs[j]] = [qs[j], qs[i]]
  }
  return qs.slice(0, count)
}
