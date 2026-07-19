import type { Unit } from '../types'

// ---------------------------------------------------------------------------
// GIÁO TRÌNH LÀM QUEN TOÁN — LỘ TRÌNH KHOA HỌC THEO ĐỘ TUỔI (xem docs/GIAO-TRINH.md)
// Bám khung "Làm quen với một số khái niệm sơ đẳng về toán" (CT GDMN) và mạch
// số học lớp 1 (phạm vi 10–20) cho giai đoạn tiền tiểu học.
//
// Trật tự các chặng = trật tự HỌC & MỞ KHOÁ (theo thứ tự mảng này). Được sắp xếp
// theo 5 giai đoạn phát triển, mỗi chặng mới đặt NGAY SAU kỹ năng tiên quyết:
//
//   A. Mẫu giáo bé  (3–4):  1 Đếm 1–5 · 2 Nhiều–Ít · 3 Hình 2D
//   B. Mẫu giáo nhỡ (4–5):  4 Đếm đến 10 · 5 Quy luật · 6 Phương hướng · 7 Đo lường
//   C. Mẫu giáo lớn (5–6):  8 Đếm đến 20 · 9 So sánh trong 10 · 10 Gộp–Tách · 11 Gộp–Tách nâng cao
//   D. Tiền tiểu học:       12 Cộng · 13 Cộng thành thạo · 14 Trừ · 15 Trừ thành thạo · 16 Đếm cách/lùi
//   E. Bổ trợ Montessori:   17 Khối 3D · 18 Tập tô số · 19 Hạt vàng & Bảng 100
// ---------------------------------------------------------------------------

export const CURRICULUM: Unit[] = [
  // ===================== A. MẪU GIÁO BÉ (3–4 tuổi) =====================
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

  // ===================== B. MẪU GIÁO NHỠ (4–5 tuổi) =====================
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
      { id: 'u5l4', title: 'Phân loại đồ vật', emoji: '🧺', activity: 'sort', skill: 'Phân loại đồ vật vào đúng nhóm theo dấu hiệu', config: { questions: 5 } },
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
      { id: 'u7l4', title: 'Tháp Hồng', emoji: '🩷', activity: 'seriation', skill: 'Xếp thứ tự kích thước từ nhỏ đến lớn (Montessori)', config: { questions: 6 } },
    ],
  },

  // ===================== C. MẪU GIÁO LỚN (5–6 tuổi) =====================
  {
    id: 'u14',
    order: 8,
    title: 'Đếm đến 20',
    subtitle: 'Đếm và nhận biết số lượng 11 – 20',
    emoji: '🌟',
    color: 'sky',
    ageBand: 'lon',
    goal: 'Mở rộng phạm vi đếm lên 20; nhận biết số liền trước – liền sau.',
    lessons: [
      { id: 'u14l1', title: 'Đếm 11 – 15', emoji: '🍇', activity: 'count', skill: 'Đếm số lượng 11–15', config: { min: 11, max: 15, questions: 6, theme: 'fruit' } },
      { id: 'u14l2', title: 'Đếm 16 – 20', emoji: '🐠', activity: 'count', skill: 'Đếm số lượng 16–20', config: { min: 16, max: 20, questions: 6, theme: 'sea' } },
      { id: 'u14l3', title: 'Số liền sau', emoji: '👉', activity: 'sequence', skill: 'Tìm số liền sau (trong 20)', config: { min: 1, max: 20, questions: 6, variant: 'next' } },
      { id: 'u14l4', title: 'Số liền trước', emoji: '👈', activity: 'sequence', skill: 'Tìm số liền trước (trong 20)', config: { min: 1, max: 20, questions: 6, variant: 'prev' } },
    ],
  },
  {
    id: 'u16',
    order: 9,
    title: 'So sánh trong 10',
    subtitle: 'Nhiều hơn – ít hơn – bằng nhau (phạm vi 10)',
    emoji: '🔎',
    color: 'honey',
    ageBand: 'lon',
    goal: 'Mở rộng kỹ năng so sánh số lượng hai nhóm lên phạm vi 10.',
    lessons: [
      { id: 'u16l1', title: 'Nhiều hơn (trong 10)', emoji: '➕', activity: 'compareQuantity', skill: 'Tìm nhóm nhiều hơn (phạm vi 10)', config: { min: 2, max: 10, questions: 6, variant: 'more' } },
      { id: 'u16l2', title: 'Ít hơn (trong 10)', emoji: '➖', activity: 'compareQuantity', skill: 'Tìm nhóm ít hơn (phạm vi 10)', config: { min: 2, max: 10, questions: 6, variant: 'less' } },
      { id: 'u16l3', title: 'Bằng nhau chưa?', emoji: '🟰', activity: 'compareQuantity', skill: 'Nhận biết hai nhóm bằng nhau (phạm vi 10)', config: { min: 2, max: 10, questions: 6, variant: 'equal' } },
      { id: 'u16l4', title: 'Thêm cho đủ', emoji: '➕', activity: 'addToCount', skill: 'Thêm cho đủ số lượng yêu cầu (tạo sự bằng nhau, ≤10)', config: { questions: 6, max: 10 } },
    ],
  },
  {
    id: 'u8',
    order: 10,
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
    id: 'u19',
    order: 11,
    title: 'Gộp – Tách nâng cao',
    subtitle: 'Các cách tách của 6 và của 10',
    emoji: '🧩',
    color: 'berry',
    ageBand: 'lon',
    goal: 'Thành thạo gộp – tách trong 10; ghi nhớ các cặp số tạo thành 6 và 10.',
    lessons: [
      { id: 'u19l1', title: 'Gộp trong 10', emoji: '🧺', activity: 'compose', skill: 'Gộp hai nhóm ≤10', config: { max: 10, questions: 6, theme: 'sea' } },
      { id: 'u19l2', title: 'Các cách tách của 6', emoji: '🎲', activity: 'decompose', skill: 'Các cách tách số 6', config: { max: 6, questions: 6, theme: 'party' } },
      { id: 'u19l3', title: 'Các cách tách của 10', emoji: '🔟', activity: 'decompose', skill: 'Các cách tách số 10', config: { max: 10, questions: 8, theme: 'fruit' } },
    ],
  },

  // ===================== D. TIỀN TIỂU HỌC =====================
  {
    id: 'u9',
    order: 12,
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
    id: 'u17',
    order: 13,
    title: 'Bé cộng thành thạo',
    subtitle: 'Luyện phép cộng nhiều chủ đề trong 10',
    emoji: '🧮',
    color: 'grass',
    ageBand: 'tien-th',
    goal: 'Luyện cộng thành thạo trong phạm vi 10 với nhiều bối cảnh khác nhau.',
    lessons: [
      { id: 'u17l1', title: 'Cộng trong 5', emoji: '🍪', activity: 'add', skill: 'Luyện phép cộng ≤5', config: { max: 5, questions: 8, theme: 'food' } },
      { id: 'u17l2', title: 'Cộng trong 10', emoji: '🐠', activity: 'add', skill: 'Luyện phép cộng ≤10', config: { max: 10, questions: 8, theme: 'sea' } },
      { id: 'u17l3', title: 'Cộng vui hội', emoji: '🎉', activity: 'add', skill: 'Luyện phép cộng ≤10 (chủ đề lễ hội)', config: { max: 10, questions: 8, theme: 'party' } },
    ],
  },
  {
    id: 'u10',
    order: 14,
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
    id: 'u18',
    order: 15,
    title: 'Bé trừ thành thạo',
    subtitle: 'Luyện phép trừ nhiều chủ đề trong 10',
    emoji: '✂️',
    color: 'coral',
    ageBand: 'tien-th',
    goal: 'Luyện trừ thành thạo trong phạm vi 10 với nhiều bối cảnh khác nhau.',
    lessons: [
      { id: 'u18l1', title: 'Trừ trong 5', emoji: '🍎', activity: 'subtract', skill: 'Luyện phép trừ trong 5', config: { max: 5, questions: 8, theme: 'fruit' } },
      { id: 'u18l2', title: 'Trừ trong 10', emoji: '🐶', activity: 'subtract', skill: 'Luyện phép trừ trong 10', config: { max: 10, questions: 8, theme: 'animal' } },
      { id: 'u18l3', title: 'Trừ trong vườn', emoji: '🌸', activity: 'subtract', skill: 'Luyện phép trừ trong 10 (chủ đề thiên nhiên)', config: { max: 10, questions: 8, theme: 'nature' } },
    ],
  },
  {
    id: 'u15',
    order: 16,
    title: 'Đếm cách & Đếm lùi',
    subtitle: 'Đếm nhảy 2, nhảy 5 và đếm ngược',
    emoji: '🦘',
    color: 'grape',
    ageBand: 'tien-th',
    goal: 'Đếm cách 2, cách 5 và đếm lùi — nền tảng cho nhân, chia sau này.',
    lessons: [
      { id: 'u15l1', title: 'Đếm cách 2', emoji: '2️⃣', activity: 'sequence', skill: 'Đếm cách 2 trong phạm vi 20', config: { min: 0, max: 20, questions: 6, variant: 'skip2' } },
      { id: 'u15l2', title: 'Đếm cách 5', emoji: '5️⃣', activity: 'sequence', skill: 'Đếm cách 5 trong phạm vi 20', config: { min: 0, max: 20, questions: 6, variant: 'skip5' } },
      { id: 'u15l3', title: 'Đếm lùi từ 10', emoji: '🚀', activity: 'sequence', skill: 'Đếm lùi trong phạm vi 10', config: { min: 0, max: 10, questions: 6, variant: 'desc' } },
    ],
  },

  // ===================== E. BỔ TRỢ MONTESSORI =====================
  {
    id: 'u11',
    order: 17,
    title: 'Khối hình học 3 chiều',
    subtitle: 'Cầu, lập phương, chữ nhật, trụ, nón, kim tự tháp',
    emoji: '📦',
    color: 'sky',
    ageBand: 'tien-th',
    goal: 'Nhận biết, gọi tên bộ khối hình học (Montessori) và liên hệ đồ vật thật.',
    lessons: [
      { id: 'u11l1', title: 'Khối cầu & lập phương', emoji: '🔵', activity: 'solid', skill: 'Nhận biết khối cầu, khối lập phương', config: { questions: 6, variant: 'basic2' } },
      { id: 'u11l2', title: 'Trụ & hộp chữ nhật', emoji: '🟦', activity: 'solid', skill: 'Nhận biết khối trụ, khối chữ nhật', config: { questions: 6, variant: 'basic4' } },
      { id: 'u11l3', title: 'Nón & kim tự tháp', emoji: '🔺', activity: 'solid', skill: 'Nhận biết đủ 6 khối hình học', config: { questions: 8, variant: 'all' } },
    ],
  },
  {
    id: 'u12',
    order: 18,
    title: 'Tập tô chữ số',
    subtitle: 'Chữ số nhám Montessori: tô theo nét số 0 – 9',
    emoji: '✍️',
    color: 'berry',
    ageBand: 'lon',
    goal: 'Ghi nhớ hình dạng và thứ tự nét viết các chữ số bằng cách tô theo (Montessori).',
    lessons: [
      { id: 'u12l1', title: 'Tô số 0 – 4', emoji: '✏️', activity: 'trace', skill: 'Tô theo nét các số 0–4', config: { min: 0, max: 4 } },
      { id: 'u12l2', title: 'Tô số 5 – 9', emoji: '🖍️', activity: 'trace', skill: 'Tô theo nét các số 5–9', config: { min: 5, max: 9 } },
    ],
  },
  {
    id: 'u13',
    order: 19,
    title: 'Montessori nâng cao',
    subtitle: 'Hạt vàng thập phân, bảng 100, con rắn cộng',
    emoji: '🟡',
    color: 'honey',
    ageBand: 'tien-th',
    goal: 'Làm quen số đến 100, hàng chục – đơn vị và cộng chuỗi bằng học cụ Montessori.',
    lessons: [
      { id: 'u13l1', title: 'Hạt vàng: chục & đơn vị', emoji: '🟡', activity: 'goldenBeads', skill: 'Đọc số hai chữ số qua hạt vàng (10–99)', config: { min: 10, max: 99, questions: 8 } },
      { id: 'u13l2', title: 'Bảng 100', emoji: '💯', activity: 'hundredBoard', skill: 'Nhận biết vị trí số trên bảng 100', config: { questions: 8 } },
      { id: 'u13l3', title: 'Con rắn cộng', emoji: '🐍', activity: 'snake', skill: 'Cộng chuỗi thanh hạt (tổng ≤ 18)', config: { max: 18, questions: 8 } },
    ],
  },
  {
    id: 'u20',
    order: 20,
    title: 'Toán tư duy — Luyện thi lớp 1',
    subtitle: 'Nối, tìm khác biệt, quy luật — dạng đề trường chất lượng cao',
    emoji: '🧠',
    color: 'berry',
    ageBand: 'tien-th',
    goal: 'Rèn quan sát, so sánh, suy luận qua các dạng bài thi vào lớp 1 (nối tương ứng, tìm hình khác biệt, quy luật).',
    lessons: [
      { id: 'u20l1', title: 'Nối số với số lượng', emoji: '🔗', activity: 'match', skill: 'Nối chữ số với nhóm có đúng số lượng', config: { questions: 5, variant: 'digitQuantity', max: 5 } },
      { id: 'u20l2', title: 'Nối cặp số bằng 10', emoji: '🤝', activity: 'match', skill: 'Nối hai số có tổng bằng 10 (bạn của 10)', config: { questions: 5, variant: 'sumTen' } },
      { id: 'u20l3', title: 'Tìm hình khác biệt', emoji: '🔍', activity: 'oddOne', skill: 'Tìm hình khác nhóm với các hình còn lại', config: { questions: 6 } },
      { id: 'u20l4', title: 'Tìm quy luật', emoji: '🧩', activity: 'pattern', skill: 'Quan sát và tiếp nối quy luật (ABC)', config: { questions: 6, variant: 'abc' } },
      { id: 'u20l5', title: 'Ô còn thiếu (ma trận)', emoji: '🔲', activity: 'matrix', skill: 'Quan sát lưới theo quy luật, chọn ô còn thiếu', config: { questions: 6 } },
      { id: 'u20l6', title: 'Đếm hình', emoji: '🔺', activity: 'shapeCount', skill: 'Đếm số hình theo loại (đếm hình tổng hợp)', config: { questions: 6, min: 4, max: 7 } },
    ],
  },
]

// Thêm bài "Ôn tập cuối chặng" vào cuối mỗi chặng (trừ chặng tập tô).
for (const u of CURRICULUM) {
  if (u.lessons.every((l) => l.activity === 'trace')) continue
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
