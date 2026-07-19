// ---- Core domain types for Math Bee ----

export type AgeBand = 'be' | 'nho' | 'lon' | 'tien-th'
// be: 3-4 tuổi, nho: 4-5 tuổi, lon: 5-6 tuổi, tien-th: tiền tiểu học

export const AGE_BANDS: Record<AgeBand, { label: string; range: string; order: number }> = {
  be: { label: 'Mầm non bé', range: '3 - 4 tuổi', order: 1 },
  nho: { label: 'Mầm non nhỡ', range: '4 - 5 tuổi', order: 2 },
  lon: { label: 'Mầm non lớn', range: '5 - 6 tuổi', order: 3 },
  'tien-th': { label: 'Tiền tiểu học', range: '5 - 6 tuổi', order: 4 },
}

// Chủ đề yêu thích của bé — đổi hình minh hoạ khi đếm/cộng/trừ và avatar.
export type InterestTheme = 'classic' | 'robot' | 'hero' | 'monster' | 'car'

export const INTEREST_THEMES: Record<
  InterestTheme,
  { label: string; emoji: string; desc: string }
> = {
  classic: { label: 'Vui nhộn', emoji: '🐝', desc: 'Hoa quả, con vật, đồ chơi' },
  robot: { label: 'Robot', emoji: '🤖', desc: 'Robot, phi thuyền, máy móc' },
  hero: { label: 'Siêu nhân', emoji: '🦸', desc: 'Siêu anh hùng, sức mạnh' },
  monster: { label: 'Thú cưng quái vật', emoji: '👾', desc: 'Quái vật, rồng, sinh vật' },
  car: { label: 'Xe cộ', emoji: '🚗', desc: 'Ô tô, xe tải, xe buýt, xe đua' },
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
  | 'solid' // nhận biết khối 3 chiều (cầu, trụ, lập phương, chữ nhật)
  | 'trace' // tập tô chữ số (chữ số nhám Montessori)
  | 'goldenBeads' // hệ thập phân hạt vàng (đơn vị – chục – trăm)
  | 'hundredBoard' // bảng 100
  | 'snake' // trò "con rắn cộng" (cộng chuỗi thanh hạt)
  | 'seriation' // xếp thứ tự kích thước kiểu Tháp Hồng
  | 'review' // ôn tập cuối chặng (tổng hợp các dạng bài trong chặng)

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
  theme?: InterestTheme // (cũ) chủ đề đơn — giữ để tương thích
  themes?: InterestTheme[] // chủ đề yêu thích (có thể chọn nhiều)
  montessori?: boolean // bật chế độ học cụ Montessori
  createdAt: number
}

// Danh sách chủ đề hiệu lực của một hồ sơ (tương thích dữ liệu cũ).
export function profileThemes(p: Pick<ChildProfile, 'themes' | 'theme'>): InterestTheme[] {
  if (p.themes && p.themes.length) return p.themes
  if (p.theme) return [p.theme]
  return ['classic']
}

// map lessonId -> số sao đạt cao nhất (0..3); có mặt = đã hoàn thành
export type ProgressMap = Record<string, number>

// Thống kê học tập cho mỗi bài (phục vụ báo cáo phụ huynh)
export interface LessonStat {
  stars: number // số sao cao nhất đạt được (0..3)
  plays: number // số lần chơi
  correct: number // tổng số câu đúng ngay lần đầu (cộng dồn)
  total: number // tổng số câu đã làm (cộng dồn)
  lastPlayed: number // timestamp lần chơi gần nhất
}
export type StatsMap = Record<string, LessonStat>

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
  | { kind: 'solid'; solidId: string; name: string }
  | { kind: 'trace'; value: number }
  | { kind: 'goldenBeads'; value: number }
  | { kind: 'hundredBoard'; missing: number }
  | { kind: 'snake'; bars: number[] }
  | { kind: 'seriation'; sizes: number[] }
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
