import type { Unit } from '../types'

// ---------------------------------------------------------------------------
// GIÁO TRÌNH LÀM QUEN TOÁN — 10 CHẶNG (xem docs/GIAO-TRINH.md)
// Bám khung "Làm quen với một số khái niệm sơ đẳng về toán" (CT GDMN)
// và mạch số học lớp 1 (phạm vi 10) cho giai đoạn tiền tiểu học.
// ---------------------------------------------------------------------------

export const CURRICULUM: Unit[] = [
  {
    id: 'u1',
    order: 1,
    title: 'Bé đếm 1 – 5',
    subtitle: 'Đếm và nhận biết chữ số 1 đến 5',
    emoji: '🍎',
    color: 'coral',
    ageBand: 'be',
    goal: 'Đếm, nhận biết số lượng và chữ số trong phạm vi 5.',
    lessons: [
      { id: 'u1l1', title: 'Đếm 1, 2, 3', emoji: '🖐️', activity: 'count', skill: 'Đếm số lượng trong phạm vi 3', config: { min: 1, max: 3, questions: 6, theme: 'fruit' } },
      { id: 'u1l2', title: 'Đếm đến 5', emoji: '✋', activity: 'count', skill: 'Đếm số lượng trong phạm vi 5', config: { min: 1, max: 5, questions: 6, theme: 'animal' } },
      { id: 'u1l3', title: 'Nhận mặt chữ số', emoji: '🔢', activity: 'recognizeDigit', skill: 'Chọn chữ số ứng với số lượng (1–5)', config: { min: 1, max: 5, questions: 6, theme: 'toy' } },
      { id: 'u1l4', title: 'Số nào bấy nhiêu', emoji: '🎯', activity: 'digitToQuantity', skill: 'Chọn nhóm đồ vật ứng với chữ số (1–5)', config: { min: 1, max: 5, questions: 6, theme: 'food' } },
    ],
  },
  {
    id: 'u2',
    order: 2,
    title: 'Nhiều hơn – Ít hơn',
    subtitle: 'So sánh số lượng hai nhóm',
    emoji: '⚖️',
    color: 'sky',
    ageBand: 'be',
    goal: 'Xếp tương ứng 1–1; so sánh nhiều hơn – ít hơn – bằng nhau.',
    lessons: [
      { id: 'u2l1', title: 'Bên nào nhiều hơn?', emoji: '➕', activity: 'compareQuantity', skill: 'Tìm nhóm nhiều hơn (phạm vi 5)', config: { min: 1, max: 5, questions: 6, variant: 'more' } },
      { id: 'u2l2', title: 'Bên nào ít hơn?', emoji: '➖', activity: 'compareQuantity', skill: 'Tìm nhóm ít hơn (phạm vi 5)', config: { min: 1, max: 5, questions: 6, variant: 'less' } },
      { id: 'u2l3', title: 'Bằng nhau chưa?', emoji: '🟰', activity: 'compareQuantity', skill: 'Nhận biết hai nhóm bằng nhau', config: { min: 1, max: 6, questions: 6, variant: 'equal' } },
    ],
  },
  {
    id: 'u3',
    order: 3,
    title: 'Thế giới hình khối',
    subtitle: 'Hình tròn, vuông, tam giác, chữ nhật',
    emoji: '🔷',
    color: 'grape',
    ageBand: 'be',
    goal: 'Nhận biết, gọi tên các hình hình học cơ bản.',
    lessons: [
      { id: 'u3l1', title: 'Hình tròn & vuông', emoji: '⭕', activity: 'shape', skill: 'Nhận biết hình tròn, hình vuông', config: { questions: 6, variant: 'basic2' } },
      { id: 'u3l2', title: 'Tam giác & chữ nhật', emoji: '🔺', activity: 'shape', skill: 'Nhận biết hình tam giác, hình chữ nhật', config: { questions: 6, variant: 'basic4' } },
      { id: 'u3l3', title: 'Tìm đúng hình', emoji: '🔎', activity: 'shape', skill: 'Phân biệt 4 hình cơ bản', config: { questions: 8, variant: 'all' } },
    ],
  },
  {
    id: 'u4',
    order: 4,
    title: 'Đếm đến 10 & Số thứ tự',
    subtitle: 'Đếm, chữ số và thứ tự trong phạm vi 10',
    emoji: '🔟',
    color: 'honey',
    ageBand: 'nho',
    goal: 'Đếm đến 10; nhận biết chữ số và số thứ tự trong phạm vi 10.',
    lessons: [
      { id: 'u4l1', title: 'Đếm 6, 7, 8', emoji: '🐟', activity: 'count', skill: 'Đếm số lượng 6–8', config: { min: 6, max: 8, questions: 6, theme: 'sea' } },
      { id: 'u4l2', title: 'Đếm đến 10', emoji: '🎈', activity: 'countTo10', skill: 'Đếm và chọn số trong phạm vi 10', config: { min: 5, max: 10, questions: 8, theme: 'party' } },
      { id: 'u4l3', title: 'Số còn thiếu', emoji: '🧩', activity: 'sequence', skill: 'Điền số còn thiếu trong dãy đếm 1–10', config: { min: 1, max: 10, questions: 6 } },
      { id: 'u4l4', title: 'Ai đứng thứ mấy?', emoji: '🏁', activity: 'ordinal', skill: 'Nhận biết số thứ tự thứ 1 đến thứ 5', config: { min: 3, max: 6, questions: 6 } },
    ],
  },
  {
    id: 'u5',
    order: 5,
    title: 'Quy luật & Phân loại',
    subtitle: 'Xếp theo quy tắc, tìm hình tiếp theo',
    emoji: '🌈',
    color: 'berry',
    ageBand: 'nho',
    goal: 'Nhận ra và tiếp nối quy luật sắp xếp (AB, AABB, ABC).',
    lessons: [
      { id: 'u5l1', title: 'Tiếp theo là gì? (AB)', emoji: '🔁', activity: 'pattern', skill: 'Tiếp nối quy luật AB', config: { questions: 6, variant: 'ab' } },
      { id: 'u5l2', title: 'Quy luật AABB', emoji: '🔂', activity: 'pattern', skill: 'Tiếp nối quy luật AABB', config: { questions: 6, variant: 'aabb' } },
      { id: 'u5l3', title: 'Quy luật ABC', emoji: '🎨', activity: 'pattern', skill: 'Tiếp nối quy luật ABC', config: { questions: 6, variant: 'abc' } },
    ],
  },
  {
    id: 'u6',
    order: 6,
    title: 'Phương hướng & Thời gian',
    subtitle: 'Trên – dưới, trái – phải, các buổi trong ngày',
    emoji: '🧭',
    color: 'sky',
    ageBand: 'nho',
    goal: 'Định hướng không gian và làm quen thứ tự thời gian.',
    lessons: [
      { id: 'u6l1', title: 'Trên hay Dưới?', emoji: '⬆️', activity: 'spatial', skill: 'Xác định phía trên – phía dưới', config: { questions: 6, variant: 'updown' } },
      { id: 'u6l2', title: 'Trái hay Phải?', emoji: '↔️', activity: 'spatial', skill: 'Xác định phía trái – phía phải', config: { questions: 6, variant: 'leftright' } },
      { id: 'u6l3', title: 'Buổi trong ngày', emoji: '🌤️', activity: 'spatial', skill: 'Thứ tự sáng – trưa – chiều – tối', config: { questions: 6, variant: 'time' } },
    ],
  },
  {
    id: 'u7',
    order: 7,
    title: 'Bé đo lường',
    subtitle: 'To – nhỏ, dài – ngắn, cao – thấp',
    emoji: '📏',
    color: 'grass',
    ageBand: 'nho',
    goal: 'So sánh kích thước 2–3 đối tượng và diễn đạt kết quả.',
    lessons: [
      { id: 'u7l1', title: 'To và Nhỏ', emoji: '🐘', activity: 'sortSize', skill: 'So sánh to – nhỏ', config: { questions: 6, variant: 'big' } },
      { id: 'u7l2', title: 'Dài và Ngắn', emoji: '✏️', activity: 'sortSize', skill: 'So sánh dài – ngắn', config: { questions: 6, variant: 'long' } },
      { id: 'u7l3', title: 'Cao và Thấp', emoji: '🦒', activity: 'sortSize', skill: 'So sánh cao – thấp', config: { questions: 6, variant: 'tall' } },
    ],
  },
  {
    id: 'u8',
    order: 8,
    title: 'Gộp – Tách trong 10',
    subtitle: 'Nền tảng của phép cộng và phép trừ',
    emoji: '🤝',
    color: 'grape',
    ageBand: 'lon',
    goal: 'Gộp và tách một nhóm đối tượng trong phạm vi 10 bằng nhiều cách.',
    lessons: [
      { id: 'u8l1', title: 'Gộp hai nhóm', emoji: '🧺', activity: 'compose', skill: 'Gộp hai nhóm, đếm tất cả (≤10)', config: { max: 10, questions: 6, theme: 'fruit' } },
      { id: 'u8l2', title: 'Tách một nhóm', emoji: '✂️', activity: 'decompose', skill: 'Tách nhóm thành hai phần (≤10)', config: { max: 10, questions: 6, theme: 'animal' } },
      { id: 'u8l3', title: 'Cách tách của 5', emoji: '🖐️', activity: 'decompose', skill: 'Các cách tách số 5', config: { max: 5, questions: 6, theme: 'toy' } },
    ],
  },
  {
    id: 'u9',
    order: 9,
    title: 'Phép cộng trong 10',
    subtitle: 'Thêm vào và đếm tất cả',
    emoji: '➕',
    color: 'grass',
    ageBand: 'tien-th',
    goal: 'Bước đầu thực hiện phép cộng trong phạm vi 10 bằng trực quan.',
    lessons: [
      { id: 'u9l1', title: 'Cộng trong 5', emoji: '🍓', activity: 'add', skill: 'Phép cộng có kết quả ≤5', config: { max: 5, questions: 8, theme: 'fruit' } },
      { id: 'u9l2', title: 'Cộng trong 10', emoji: '🐥', activity: 'add', skill: 'Phép cộng có kết quả ≤10', config: { max: 10, questions: 8, theme: 'animal' } },
      { id: 'u9l3', title: 'Cộng với chữ số', emoji: '🧮', activity: 'add', skill: 'Đọc phép cộng bằng ký hiệu', config: { max: 10, questions: 8, theme: 'toy', variant: 'symbol' } },
    ],
  },
  {
    id: 'u10',
    order: 10,
    title: 'Phép trừ trong 10',
    subtitle: 'Bớt đi và đếm còn lại',
    emoji: '➖',
    color: 'coral',
    ageBand: 'tien-th',
    goal: 'Bước đầu thực hiện phép trừ trong phạm vi 10 bằng trực quan.',
    lessons: [
      { id: 'u10l1', title: 'Trừ trong 5', emoji: '🍪', activity: 'subtract', skill: 'Phép trừ trong phạm vi 5', config: { max: 5, questions: 8, theme: 'food' } },
      { id: 'u10l2', title: 'Trừ trong 10', emoji: '🎈', activity: 'subtract', skill: 'Phép trừ trong phạm vi 10', config: { max: 10, questions: 8, theme: 'party' } },
      { id: 'u10l3', title: 'Trừ với chữ số', emoji: '🧮', activity: 'subtract', skill: 'Đọc phép trừ bằng ký hiệu', config: { max: 10, questions: 8, theme: 'toy', variant: 'symbol' } },
    ],
  },
  {
    id: 'u11',
    order: 11,
    title: 'Khối 3 chiều',
    subtitle: 'Khối cầu, khối trụ, khối lập phương, khối chữ nhật',
    emoji: '📦',
    color: 'sky',
    ageBand: 'tien-th',
    goal: 'Nhận biết, gọi tên các khối và liên hệ với đồ vật quen thuộc.',
    lessons: [
      { id: 'u11l1', title: 'Khối cầu & lập phương', emoji: '⚽', activity: 'solid', skill: 'Nhận biết khối cầu, khối lập phương', config: { questions: 6, variant: 'basic2' } },
      { id: 'u11l2', title: 'Khối trụ & chữ nhật', emoji: '🥫', activity: 'solid', skill: 'Nhận biết khối trụ, khối chữ nhật', config: { questions: 6, variant: 'basic4' } },
      { id: 'u11l3', title: 'Đồ vật quanh bé', emoji: '🔍', activity: 'solid', skill: 'Liên hệ khối với đồ vật thật', config: { questions: 8, variant: 'all' } },
    ],
  },
]

// Thêm bài "Ôn tập cuối chặng" vào cuối mỗi chặng (tổng hợp các dạng bài đã học).
for (const u of CURRICULUM) {
  u.lessons.push({
    id: `${u.id}lR`,
    title: 'Ôn tập chặng',
    emoji: '🎓',
    activity: 'review',
    skill: `Ôn tập tổng hợp: ${u.title}`,
    config: { questions: 8 },
  })
}

export const ALL_LESSONS = CURRICULUM.flatMap((u) =>
  u.lessons.map((l) => ({ ...l, unitId: u.id })),
)

export function totalLessons(): number {
  return ALL_LESSONS.length
}

export function unitById(id: string): Unit | undefined {
  return CURRICULUM.find((u) => u.id === id)
}
