// ---- Core domain types for Math Bee ----

export type AgeBand = 'be' | 'nho' | 'lon' | 'tien-th'
// be: 3-4 tuổi, nho: 4-5 tuổi, lon: 5-6 tuổi, tien-th: tiền tiểu học

export const AGE_BANDS: Record<AgeBand, { label: string; range: string; order: number }> = {
  be: { label: 'Mầm non bé', range: '3 - 4 tuổi', order: 1 },
  nho: { label: 'Mầm non nhỡ', range: '4 - 5 tuổi', order: 2 },
  lon: { label: 'Mầm non lớn', range: '5 - 6 tuổi', order: 3 },
  'tien-th': { label: 'Tiền tiểu học', range: '5 - 6 tuổi', order: 4 },
}

export type ActivityType =
  | 'count' // đếm số lượng đồ vật
  | 'recognizeDigit' // nhận biết chữ số (chọn số đúng)
  | 'digitToQuantity' // cho chữ số -> chọn nhóm đúng số lượng
  | 'compareQuantity' // nhiều hơn / ít hơn / bằng nhau
  | 'ordinal' // số thứ tự
  | 'countTo10' // đếm và chọn số trong phạm vi 10
  | 'compose' // gộp hai nhóm
  | 'decompose' // tách một nhóm
  | 'add' // phép cộng trong 10
  | 'subtract' // phép trừ trong 10
  | 'shape' // nhận biết hình
  | 'pattern' // xếp theo quy luật
  | 'sortSize' // so sánh kích thước (to/nhỏ, dài/ngắn, cao/thấp)
  | 'spatial' // định hướng không gian
  | 'sequence' // đếm tiếp / số còn thiếu trong dãy

export interface LessonConfig {
  min?: number
  max?: number
  questions?: number
  theme?: string // gợi ý bộ icon
  variant?: string // biến thể cho một số activity
}

export interface Lesson {
  id: string
  title: string
  emoji: string
  activity: ActivityType
  skill: string // mô tả kỹ năng theo giáo trình
  config: LessonConfig
}

export interface Unit {
  id: string
  order: number
  title: string
  subtitle: string
  emoji: string
  color: string // tên màu trong theme
  ageBand: AgeBand
  goal: string // mục tiêu chặng theo CT GDMN
  lessons: Lesson[]
}

export interface ChildProfile {
  id: string
  name: string
  avatar: string // emoji
  ageBand: AgeBand
  createdAt: number
}

// map lessonId -> số sao đạt cao nhất (0..3); có mặt = đã hoàn thành
export type ProgressMap = Record<string, number>

export interface Question {
  id: string
  prompt: string // câu hỏi hiển thị + đọc to
  render: QuestionRender
  options: Option[]
  answer: string // id đáp án đúng
}

export type QuestionRender =
  | { kind: 'objects'; icon: string; count: number }
  | { kind: 'twoGroups'; left: { icon: string; count: number }; right: { icon: string; count: number } }
  | { kind: 'compose'; icon: string; a: number; b: number }
  | { kind: 'decompose'; icon: string; total: number; known: number }
  | { kind: 'addExpr'; icon: string; a: number; b: number }
  | { kind: 'subExpr'; icon: string; total: number; take: number }
  | { kind: 'ordinalRow'; items: string[]; targetIndex: number }
  | { kind: 'pattern'; sequence: string[] }
  | { kind: 'sizeRow'; items: { icon: string; scale: number }[]; ask: string }
  | { kind: 'spatial'; scene: string; ask: string }
  | { kind: 'shape'; target: string }
  | { kind: 'digit'; value: number }
  | { kind: 'sequence'; sequence: (number | null)[] }

export interface Option {
  id: string
  // hiển thị lựa chọn: có thể là số, chữ, hình, hoặc nhóm đồ vật
  label?: string
  digit?: number
  shape?: string
  objects?: { icon: string; count: number }
  emoji?: string
  scale?: number // dùng cho lựa chọn so sánh kích thước
}
