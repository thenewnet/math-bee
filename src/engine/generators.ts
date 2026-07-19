import type { InterestTheme, Lesson, MatchPair, Option, Question, SortBin, SortItem } from '../types'
import { pickFrom, resolveIcons, THEMES } from './themes'
import { CURRICULUM } from '../data/curriculum'
import { GEO_SOLIDS } from '../components/Solid3D'

// ---------- Tiện ích ----------
function rint(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
let uid = 0
function nid(prefix = 'q'): string {
  uid += 1
  return `${prefix}${uid}`
}

// 4 lựa chọn chữ số khác nhau, có chứa đáp án đúng, nằm trong [lo, hi]
function digitOptions(correct: number, lo: number, hi: number, k = 4): Option[] {
  const set = new Set<number>([correct])
  let guard = 0
  const rangeLo = Math.max(0, Math.min(lo, correct - 3))
  const rangeHi = Math.max(hi, correct + 3)
  while (set.size < k && guard < 50) {
    guard++
    const v = rint(rangeLo, rangeHi)
    if (v >= 0) set.add(v)
  }
  return shuffle([...set]).map((d) => ({ id: `d${d}`, digit: d }))
}

// ---------- Hằng số ----------
export const SHAPES = [
  { id: 'circle', name: 'hình tròn' },
  { id: 'square', name: 'hình vuông' },
  { id: 'triangle', name: 'hình tam giác' },
  { id: 'rectangle', name: 'hình chữ nhật' },
]

const ORDINAL_WORDS = ['thứ nhất', 'thứ hai', 'thứ ba', 'thứ tư', 'thứ năm', 'thứ sáu']
const TIME_OF_DAY = [
  { id: 'sang', emoji: '🌅', name: 'Buổi sáng' },
  { id: 'trua', emoji: '☀️', name: 'Buổi trưa' },
  { id: 'chieu', emoji: '🌇', name: 'Buổi chiều' },
  { id: 'toi', emoji: '🌙', name: 'Buổi tối' },
]

// =====================================================================
//  Các bộ sinh câu hỏi theo dạng bài
// =====================================================================

function genCount(l: Lesson, themes?: InterestTheme[]): Question[] {
  const { min = 1, max = 5, questions = 6, theme } = l.config
  const icons = resolveIcons(themes, theme)
  const out: Question[] = []
  for (let i = 0; i < questions; i++) {
    const icon = pickFrom(icons)
    const count = rint(min, max)
    out.push({
      id: nid(),
      prompt: `Đếm xem có bao nhiêu ${'?'}`.replace('?', 'tất cả?'),
      render: { kind: 'objects', icon, count },
      options: digitOptions(count, min, max),
      answer: `d${count}`,
    })
  }
  return out
}

function genDigitToQuantity(l: Lesson, themes?: InterestTheme[]): Question[] {
  const { min = 1, max = 5, questions = 6, theme } = l.config
  const icons = resolveIcons(themes, theme)
  const out: Question[] = []
  for (let i = 0; i < questions; i++) {
    const icon = pickFrom(icons)
    const value = rint(min, max)
    const counts = new Set<number>([value])
    while (counts.size < 4) counts.add(rint(Math.max(1, min), max + 1))
    const options: Option[] = shuffle([...counts]).map((c) => ({
      id: `g${c}`,
      objects: { icon, count: c },
    }))
    out.push({
      id: nid(),
      prompt: `Chọn nhóm có ${value} ${'đồ vật'}`,
      render: { kind: 'digit', value },
      options,
      answer: `g${value}`,
    })
  }
  return out
}

function genCompare(l: Lesson, themes?: InterestTheme[]): Question[] {
  const { min = 1, max = 5, questions = 6, variant = 'more' } = l.config
  const out: Question[] = []
  const icons = resolveIcons(themes, 'animal')
  for (let i = 0; i < questions; i++) {
    const leftIcon = icons[i % icons.length]
    const rightIcon = icons[(i + 3) % icons.length]
    let a = rint(min, max)
    let b = rint(min, max)
    if (variant === 'equal') {
      // 50% cho bằng nhau
      if (Math.random() < 0.5) b = a
      else while (b === a) b = rint(min, max)
      out.push({
        id: nid(),
        prompt: 'Hai bên có bằng nhau không?',
        render: { kind: 'twoGroups', left: { icon: leftIcon, count: a }, right: { icon: rightIcon, count: b } },
        options: shuffle([
          { id: 'yes', label: 'Bằng nhau', emoji: '🟰' },
          { id: 'no', label: 'Không bằng', emoji: '❌' },
        ]),
        answer: a === b ? 'yes' : 'no',
      })
    } else {
      while (b === a) b = rint(min, max)
      const leftMore = a > b
      const wantMore = variant === 'more'
      const answer = leftMore === wantMore ? 'left' : 'right'
      out.push({
        id: nid(),
        prompt: wantMore ? 'Bên nào có NHIỀU hơn?' : 'Bên nào có ÍT hơn?',
        render: { kind: 'twoGroups', left: { icon: leftIcon, count: a }, right: { icon: rightIcon, count: b } },
        options: [
          { id: 'left', label: 'Bên trái', emoji: leftIcon },
          { id: 'right', label: 'Bên phải', emoji: rightIcon },
        ],
        answer,
      })
    }
  }
  return out
}

function genCountTo10(l: Lesson, themes?: InterestTheme[]): Question[] {
  const { min = 5, max = 10, questions = 8, theme } = l.config
  const icons = resolveIcons(themes, theme)
  const out: Question[] = []
  for (let i = 0; i < questions; i++) {
    const icon = pickFrom(icons)
    const count = rint(min, max)
    out.push({
      id: nid(),
      prompt: 'Có tất cả bao nhiêu?',
      render: { kind: 'objects', icon, count },
      options: digitOptions(count, 1, 10),
      answer: `d${count}`,
    })
  }
  return out
}

function genSequence(l: Lesson): Question[] {
  const { min = 1, max = 10, questions = 6, variant = 'asc' } = l.config
  const out: Question[] = []

  // "Số liền trước / liền sau": dãy ngắn chỉ 2 ô, ẩn ô cần tìm.
  if (variant === 'next' || variant === 'prev') {
    for (let i = 0; i < questions; i++) {
      const isNext = variant === 'next'
      const n = isNext ? rint(min, max - 1) : rint(min + 1, max)
      const answerVal = isNext ? n + 1 : n - 1
      const seq: (number | null)[] = isNext ? [n, null] : [null, n]
      out.push({
        id: nid(),
        prompt: isNext ? `Số liền SAU số ${n} là số nào?` : `Số liền TRƯỚC số ${n} là số nào?`,
        render: { kind: 'sequence', sequence: seq },
        options: digitOptions(answerVal, Math.max(0, min - 1), max + 1),
        answer: `d${answerVal}`,
      })
    }
    return out
  }

  // Dãy đếm: bước nhảy (đếm cách) và chiều (đếm lùi) theo variant.
  const step = variant === 'skip2' ? 2 : variant === 'skip5' ? 5 : 1
  const desc = variant === 'desc'
  const len = step >= 5 ? 4 : 5
  const span = step * (len - 1)
  for (let i = 0; i < questions; i++) {
    // chọn số bắt đầu sao cho cả dãy nằm trong [min, max]
    const start = desc
      ? rint(Math.min(max, min + span), max)
      : rint(min, Math.max(min, max - span))
    const seq: (number | null)[] = []
    for (let k = 0; k < len; k++) seq.push(desc ? start - step * k : start + step * k)
    const missIndex = rint(1, len - 2) // không ẩn số đầu/cuối cho dễ suy luận
    const answerVal = seq[missIndex] as number
    seq[missIndex] = null
    const prompt =
      step > 1
        ? `Đếm cách ${step}: số nào còn thiếu?`
        : desc
          ? 'Đếm lùi: số nào còn thiếu?'
          : 'Số nào còn thiếu trong dãy?'
    out.push({
      id: nid(),
      prompt,
      render: { kind: 'sequence', sequence: seq },
      options: digitOptions(answerVal, Math.max(0, min), max),
      answer: `d${answerVal}`,
    })
  }
  return out
}

function genOrdinal(l: Lesson, themes?: InterestTheme[]): Question[] {
  const { min = 3, max = 6, questions = 6 } = l.config
  const out: Question[] = []
  const pool = resolveIcons(themes, 'animal')
  for (let i = 0; i < questions; i++) {
    const n = rint(min, max)
    const items = shuffle(pool).slice(0, n)
    const targetIndex = rint(0, n - 1)
    const options: Option[] = shuffle(items).slice(0, 4).map((e, idx) => ({
      id: `o${idx}_${e}`,
      emoji: e,
    }))
    // đảm bảo đáp án đúng nằm trong options
    const targetEmoji = items[targetIndex]
    if (!options.some((o) => o.emoji === targetEmoji)) {
      options[0] = { id: `o0_${targetEmoji}`, emoji: targetEmoji }
    }
    const ans = options.find((o) => o.emoji === targetEmoji)!
    out.push({
      id: nid(),
      prompt: `Đếm từ trái sang, bạn đứng ${ORDINAL_WORDS[targetIndex]} là ai?`,
      render: { kind: 'ordinalRow', items, targetIndex },
      options,
      answer: ans.id,
    })
  }
  return out
}

function genCompose(l: Lesson, themes?: InterestTheme[]): Question[] {
  const { max = 10, questions = 6, theme } = l.config
  const icons = resolveIcons(themes, theme)
  const out: Question[] = []
  for (let i = 0; i < questions; i++) {
    const icon = pickFrom(icons)
    const a = rint(1, Math.max(1, max - 1))
    const b = rint(1, Math.max(1, max - a))
    const total = a + b
    out.push({
      id: nid(),
      prompt: `Gộp ${a} và ${b} lại có tất cả bao nhiêu?`,
      render: { kind: 'compose', icon, a, b },
      options: digitOptions(total, 1, max),
      answer: `d${total}`,
    })
  }
  return out
}

function genDecompose(l: Lesson, themes?: InterestTheme[]): Question[] {
  const { max = 10, questions = 6, theme } = l.config
  const icons = resolveIcons(themes, theme)
  const out: Question[] = []
  for (let i = 0; i < questions; i++) {
    const icon = pickFrom(icons)
    const total = rint(2, max)
    const known = rint(1, total - 1)
    const rest = total - known
    out.push({
      id: nid(),
      prompt: `Có ${total} cái, lấy đi ${known} thì còn phần kia là mấy?`,
      render: { kind: 'decompose', icon, total, known },
      options: digitOptions(rest, 1, max),
      answer: `d${rest}`,
    })
  }
  return out
}

function genAdd(l: Lesson, themes?: InterestTheme[]): Question[] {
  const { max = 10, questions = 8, theme } = l.config
  const icons = resolveIcons(themes, theme)
  const out: Question[] = []
  for (let i = 0; i < questions; i++) {
    const icon = pickFrom(icons)
    const a = rint(1, Math.max(1, max - 1))
    const b = rint(1, Math.max(1, max - a))
    const total = a + b
    out.push({
      id: nid(),
      prompt: `${a} cộng ${b} bằng mấy?`,
      render: { kind: 'addExpr', icon, a, b },
      options: digitOptions(total, 1, max),
      answer: `d${total}`,
    })
  }
  return out
}

function genSubtract(l: Lesson, themes?: InterestTheme[]): Question[] {
  const { max = 10, questions = 8, theme } = l.config
  const icons = resolveIcons(themes, theme)
  const out: Question[] = []
  for (let i = 0; i < questions; i++) {
    const icon = pickFrom(icons)
    const total = rint(2, max)
    const take = rint(1, total - 1)
    const rest = total - take
    out.push({
      id: nid(),
      prompt: `${total} bớt ${take} còn lại mấy?`,
      render: { kind: 'subExpr', icon, total, take },
      options: digitOptions(rest, 0, max),
      answer: `d${rest}`,
    })
  }
  return out
}

function genShape(l: Lesson): Question[] {
  const { questions = 6, variant = 'all' } = l.config
  let pool = SHAPES
  if (variant === 'basic2') pool = SHAPES.slice(0, 2)
  else if (variant === 'basic4') pool = SHAPES.slice(0, 4)
  const out: Question[] = []
  for (let i = 0; i < questions; i++) {
    const target = pool[i % pool.length]
    const others = shuffle(SHAPES.filter((s) => s.id !== target.id))
    const opts = shuffle([target, ...others.slice(0, 3)])
    out.push({
      id: nid(),
      prompt: `Đâu là ${target.name}?`,
      render: { kind: 'shape', target: target.id },
      options: opts.map((s) => ({ id: s.id, shape: s.id })),
      answer: target.id,
    })
  }
  return out
}

function genPattern(l: Lesson): Question[] {
  const { questions = 6, variant = 'ab' } = l.config
  const out: Question[] = []
  const symbolSets = [
    ['🔴', '🔵', '🟡'],
    ['🟥', '🟩', '🟦'],
    ['⭐', '❤️', '🔶'],
    ['🍎', '🍌', '🍇'],
  ]
  for (let i = 0; i < questions; i++) {
    const syms = shuffle(symbolSets[i % symbolSets.length])
    const [x, y, z] = syms
    let base: string[]
    if (variant === 'ab') base = [x, y]
    else if (variant === 'aabb') base = [x, x, y, y]
    else base = [x, y, z] // abc
    // dãy hiển thị dài ~ 6-7 phần tử rồi tới dấu ?
    const seq: string[] = []
    const showLen = variant === 'abc' ? 6 : variant === 'aabb' ? 6 : 6
    for (let k = 0; k < showLen; k++) seq.push(base[k % base.length])
    const next = base[showLen % base.length]
    seq.push('?')
    const options: Option[] = shuffle(syms).map((e) => ({ id: `p_${e}`, emoji: e }))
    out.push({
      id: nid(),
      prompt: 'Ô tiếp theo là hình nào?',
      render: { kind: 'pattern', sequence: seq },
      options,
      answer: `p_${next}`,
    })
  }
  return out
}

function genSortSize(l: Lesson): Question[] {
  const { questions = 6, variant = 'big' } = l.config
  const out: Question[] = []
  const sets: Record<string, string[]> = {
    big: ['🐘', '🐭', '🐶', '🐜', '🦁', '🐤'],
    long: ['🐍', '✏️', '🥕', '🧵', '🚂', '🌭'],
    tall: ['🦒', '🌲', '🏢', '🗼', '🌷', '🍄'],
  }
  const icons = sets[variant] ?? sets.big
  const askBig =
    variant === 'big' ? 'TO nhất' : variant === 'long' ? 'DÀI nhất' : 'CAO nhất'
  const askSmall =
    variant === 'big' ? 'NHỎ nhất' : variant === 'long' ? 'NGẮN nhất' : 'THẤP nhất'
  for (let i = 0; i < questions; i++) {
    const icon = icons[i % icons.length]
    // chênh lệch rõ ràng để bé dễ nhận biết to nhất / nhỏ nhất
    const scales = shuffle([0.42, 0.72, 1.2])
    const items = scales.map((s) => ({ icon, scale: s }))
    const wantBig = i % 2 === 0
    const targetScale = wantBig ? Math.max(...scales) : Math.min(...scales)
    const options: Option[] = items.map((it, idx) => ({
      id: `s${idx}`,
      emoji: it.icon,
      scale: it.scale,
    }))
    const ans = options.find((o) => o.scale === targetScale)!
    out.push({
      id: nid(),
      prompt: `Cái nào ${wantBig ? askBig : askSmall}?`,
      render: { kind: 'sizeRow', items, ask: wantBig ? askBig : askSmall },
      options,
      answer: ans.id,
    })
  }
  return out
}

function genSpatial(l: Lesson): Question[] {
  const { questions = 6, variant = 'updown' } = l.config
  const out: Question[] = []
  if (variant === 'time') {
    for (let i = 0; i < questions; i++) {
      const t = TIME_OF_DAY[i % TIME_OF_DAY.length]
      const options = shuffle(TIME_OF_DAY).map((x) => ({ id: x.id, label: x.name, emoji: x.emoji }))
      out.push({
        id: nid(),
        prompt: 'Đây là buổi nào trong ngày?',
        render: { kind: 'spatial', scene: `time|${t.emoji}`, ask: 'time' },
        options,
        answer: t.id,
      })
    }
    return out
  }
  const objs = ['🐱', '🎈', '⚽', '🍎', '🚗', '🐦', '⭐', '🌼']
  for (let i = 0; i < questions; i++) {
    const obj = objs[i % objs.length]
    if (variant === 'updown') {
      const top = Math.random() < 0.5
      out.push({
        id: nid(),
        prompt: `${obj} đang ở phía nào?`,
        render: { kind: 'spatial', scene: `${obj}|${top ? 'top' : 'bottom'}`, ask: 'updown' },
        options: [
          { id: 'top', label: 'Phía trên', emoji: '⬆️' },
          { id: 'bottom', label: 'Phía dưới', emoji: '⬇️' },
        ],
        answer: top ? 'top' : 'bottom',
      })
    } else {
      const left = Math.random() < 0.5
      out.push({
        id: nid(),
        prompt: `${obj} đang ở bên nào?`,
        render: { kind: 'spatial', scene: `${obj}|${left ? 'left' : 'right'}`, ask: 'leftright' },
        options: [
          { id: 'left', label: 'Bên trái', emoji: '⬅️' },
          { id: 'right', label: 'Bên phải', emoji: '➡️' },
        ],
        answer: left ? 'left' : 'right',
      })
    }
  }
  return out
}

function genSolid(l: Lesson): Question[] {
  const { questions = 6, variant = 'all' } = l.config
  let pool = GEO_SOLIDS
  if (variant === 'basic2') pool = [GEO_SOLIDS[0], GEO_SOLIDS[1]] // cầu, lập phương
  else if (variant === 'basic4') pool = GEO_SOLIDS.slice(0, 4)
  const out: Question[] = []
  for (let i = 0; i < questions; i++) {
    const target = pool[i % pool.length]
    const others = shuffle(GEO_SOLIDS.filter((s) => s.id !== target.id)).slice(0, 3)
    const options: Option[] = shuffle([target, ...others]).map((s) => ({ id: s.id, label: s.name }))
    out.push({
      id: nid(),
      prompt: 'Đây là khối gì?',
      render: { kind: 'solid', solidId: target.id, name: target.name },
      options,
      answer: target.id,
    })
  }
  return out
}

function genTrace(l: Lesson): Question[] {
  const { min = 0, max = 9, questions } = l.config
  const digits: number[] = []
  for (let d = min; d <= max; d++) digits.push(d)
  const chosen = questions ? digits.slice(0, questions) : digits
  return chosen.map((d) => ({
    id: nid(),
    prompt: `Tô theo số ${d}`,
    render: { kind: 'trace', value: d },
    options: [],
    answer: 'done',
  }))
}

function genGoldenBeads(l: Lesson): Question[] {
  const { min = 10, max = 99, questions = 8 } = l.config
  const out: Question[] = []
  for (let i = 0; i < questions; i++) {
    const value = rint(min, max)
    // đáp án nhiễu: đảo chữ số, ±1, ±10
    const cand = new Set<number>([value, value + 1, value - 1, value + 10, value - 10])
    const swapped = Number(String(value).padStart(2, '0').split('').reverse().join(''))
    if (swapped !== value) cand.add(swapped)
    const opts = shuffle([...cand].filter((v) => v >= 0 && v <= max + 10 && v !== value)).slice(0, 3)
    const options: Option[] = shuffle([value, ...opts]).map((d) => ({ id: `d${d}`, digit: d }))
    out.push({
      id: nid(),
      prompt: 'Đây là số bao nhiêu?',
      render: { kind: 'goldenBeads', value },
      options,
      answer: `d${value}`,
    })
  }
  return out
}

function genHundredBoard(l: Lesson): Question[] {
  const { questions = 8 } = l.config
  const out: Question[] = []
  for (let i = 0; i < questions; i++) {
    const missing = rint(2, 99)
    const cand = new Set<number>([missing, missing + 1, missing - 1, missing + 10, missing - 10])
    const opts = shuffle([...cand].filter((v) => v >= 1 && v <= 100 && v !== missing)).slice(0, 3)
    const options: Option[] = shuffle([missing, ...opts]).map((d) => ({ id: `d${d}`, digit: d }))
    out.push({
      id: nid(),
      prompt: 'Ô còn thiếu là số mấy?',
      render: { kind: 'hundredBoard', missing },
      options,
      answer: `d${missing}`,
    })
  }
  return out
}

function genSnake(l: Lesson): Question[] {
  const { max = 18, questions = 8 } = l.config
  const out: Question[] = []
  for (let i = 0; i < questions; i++) {
    const bars: number[] = []
    const n = rint(2, 4)
    let sum = 0
    for (let k = 0; k < n; k++) {
      const v = rint(1, 9)
      if (sum + v > max) break
      bars.push(v)
      sum += v
    }
    if (bars.length < 2) bars.push(1), (sum += 1)
    out.push({
      id: nid(),
      prompt: 'Con rắn dài bao nhiêu hạt?',
      render: { kind: 'snake', bars },
      options: digitOptions(sum, 2, max),
      answer: `d${sum}`,
    })
  }
  return out
}

function genSeriation(l: Lesson): Question[] {
  const { questions = 6 } = l.config
  const pool = [0.32, 0.46, 0.6, 0.74, 0.9, 1.05]
  const out: Question[] = []
  for (let i = 0; i < questions; i++) {
    const count = rint(3, 4)
    const sizes = shuffle(pool).slice(0, count)
    out.push({
      id: nid(),
      prompt: 'Xếp tháp: chạm khối nhỏ nhất đến lớn nhất',
      render: { kind: 'seriation', sizes },
      options: [],
      answer: 'done',
    })
  }
  return out
}

// Toán tư duy — "Nối": nối chữ số với nhóm đồ vật, hoặc nối cặp số có tổng 10.
function genMatch(l: Lesson, themes?: InterestTheme[]): Question[] {
  const { questions = 5, variant = 'digitQuantity', max = 5, theme } = l.config
  const icons = resolveIcons(themes, theme)
  const out: Question[] = []
  const K = 3 // số cặp mỗi câu (vừa sức trẻ mầm non)
  for (let i = 0; i < questions; i++) {
    let pairs: MatchPair[]
    if (variant === 'sumTen') {
      // nối hai số cộng lại bằng 10 ("bạn của 10") — luyện tách/gộp 10
      const bases = shuffle([1, 2, 3, 4]).slice(0, K)
      pairs = bases.map((a, idx) => ({
        id: `m${idx}`,
        left: { kind: 'digit', value: a },
        right: { kind: 'digit', value: 10 - a },
      }))
    } else {
      // digitQuantity: nối chữ số với nhóm có đúng số lượng
      const counts = shuffle(Array.from({ length: max }, (_, k) => k + 1)).slice(0, K)
      const icon = pickFrom(icons)
      pairs = counts.map((c, idx) => ({
        id: `m${idx}`,
        left: { kind: 'digit', value: c },
        right: { kind: 'objects', icon, count: c },
      }))
    }
    out.push({
      id: nid(),
      prompt: variant === 'sumTen' ? 'Nối hai số cộng lại bằng 10' : 'Nối mỗi số với nhóm có đúng số lượng',
      render: { kind: 'match', pairs },
      options: [],
      answer: 'done',
    })
  }
  return out
}

// Toán tư duy — "Tìm hình khác biệt": 3 hình cùng nhóm + 1 hình khác nhóm.
function genOddOne(l: Lesson): Question[] {
  const { questions = 6 } = l.config
  const groups = Object.values(THEMES)
  const out: Question[] = []
  for (let i = 0; i < questions; i++) {
    const [gA, gB] = shuffle(groups).slice(0, 2)
    const same = shuffle(gA).slice(0, 3)
    let odd = pickFrom(gB)
    let guard = 0
    while (same.includes(odd) && guard < 20) {
      odd = pickFrom(gB)
      guard++
    }
    const options: Option[] = shuffle(
      [...same, odd].map((e, idx) => ({ id: `o${idx}_${e}`, emoji: e })),
    )
    const ans = options.find((o) => o.emoji === odd)!
    out.push({
      id: nid(),
      prompt: 'Tìm hình KHÁC với các hình còn lại',
      render: { kind: 'oddOne', hint: '🔍' },
      options,
      answer: ans.id,
    })
  }
  return out
}

// Toán tư duy — "Ma trận quy luật": lưới 2×3 lặp quy luật, chọn ô còn thiếu.
function genMatrix(l: Lesson): Question[] {
  const { questions = 6 } = l.config
  const symbolSets = [
    ['🔴', '🔵', '🟡'],
    ['🟥', '🟩', '🟦'],
    ['⭐', '❤️', '🔶'],
    ['🍎', '🍌', '🍇'],
  ]
  const cols = 3
  const rows = 2
  const out: Question[] = []
  for (let i = 0; i < questions; i++) {
    const base = shuffle(symbolSets[i % symbolSets.length]) // 3 ký hiệu khác nhau
    const grid: string[] = []
    for (let k = 0; k < cols * rows; k++) grid.push(base[k % base.length])
    const hideIdx = rint(0, cols * rows - 1)
    const answerSym = grid[hideIdx]
    const cells: (string | null)[] = grid.map((s, idx) => (idx === hideIdx ? null : s))
    const options: Option[] = shuffle(base).map((e) => ({ id: `p_${e}`, emoji: e }))
    out.push({
      id: nid(),
      prompt: 'Ô còn thiếu là hình nào?',
      render: { kind: 'matrix', cells, cols },
      options,
      answer: `p_${answerSym}`,
    })
  }
  return out
}

// Toán tư duy — "Đếm hình theo loại": có bao nhiêu hình tam giác?
function genShapeCount(l: Lesson): Question[] {
  const { questions = 6, min = 4, max = 7 } = l.config
  const shapeIds = SHAPES.map((s) => s.id)
  const out: Question[] = []
  for (let i = 0; i < questions; i++) {
    const total = rint(min, max)
    const target = shapeIds[i % shapeIds.length]
    const targetCount = rint(1, Math.max(1, total - 1)) // luôn có ít nhất 1 hình khác
    const shapes: string[] = []
    for (let k = 0; k < targetCount; k++) shapes.push(target)
    const others = shapeIds.filter((s) => s !== target)
    for (let k = targetCount; k < total; k++) shapes.push(others[rint(0, others.length - 1)])
    const targetName = SHAPES.find((s) => s.id === target)!.name
    out.push({
      id: nid(),
      prompt: `Có bao nhiêu ${targetName}?`,
      render: { kind: 'shapeCount', shapes: shuffle(shapes), target },
      options: digitOptions(targetCount, 1, total),
      answer: `d${targetCount}`,
    })
  }
  return out
}

// Tương tác — "Vẽ thêm cho đủ": bắt đầu có `current`, thêm cho đủ `target`.
function genAddToCount(l: Lesson, themes?: InterestTheme[]): Question[] {
  const { questions = 6, max = 8, theme } = l.config
  const icons = resolveIcons(themes, theme)
  const out: Question[] = []
  for (let i = 0; i < questions; i++) {
    const target = rint(3, max)
    const current = rint(1, target - 1)
    out.push({
      id: nid(),
      prompt: `Thêm cho đủ ${target}`,
      render: { kind: 'addToCount', icon: pickFrom(icons), current, target },
      options: [],
      answer: 'done',
    })
  }
  return out
}

// Tương tác — "Phân loại": bỏ mỗi đồ vật vào đúng nhóm (2 nhóm).
function genSort(l: Lesson): Question[] {
  const { questions = 5 } = l.config
  const CATS = [
    { id: 'fruit', label: 'Hoa quả', emoji: '🍎', items: THEMES.fruit },
    { id: 'animal', label: 'Con vật', emoji: '🐶', items: THEMES.animal },
    { id: 'sea', label: 'Dưới biển', emoji: '🐟', items: THEMES.sea },
    { id: 'toy', label: 'Đồ chơi', emoji: '🧸', items: THEMES.toy },
  ]
  const out: Question[] = []
  for (let i = 0; i < questions; i++) {
    const [ca, cb] = shuffle(CATS).slice(0, 2)
    const bins: SortBin[] = [
      { id: ca.id, label: ca.label, emoji: ca.emoji },
      { id: cb.id, label: cb.label, emoji: cb.emoji },
    ]
    // tránh trùng emoji giữa 2 nhóm để không gây nhập nhằng
    const aItems = shuffle(ca.items.filter((e) => !cb.items.includes(e))).slice(0, 3)
    const bItems = shuffle(cb.items.filter((e) => !ca.items.includes(e) && !aItems.includes(e))).slice(0, 3)
    const items: SortItem[] = shuffle([
      ...aItems.map((e, k) => ({ id: `a${k}_${e}`, emoji: e, bin: ca.id })),
      ...bItems.map((e, k) => ({ id: `b${k}_${e}`, emoji: e, bin: cb.id })),
    ])
    out.push({
      id: nid(),
      prompt: 'Phân loại: bỏ mỗi hình vào đúng nhóm',
      render: { kind: 'sort', items, bins },
      options: [],
      answer: 'done',
    })
  }
  return out
}

// Ôn tập cuối chặng: trộn các câu hỏi từ những bài trong cùng chặng.
function genReview(l: Lesson, themes?: InterestTheme[]): Question[] {
  const { questions = 8 } = l.config
  const unit = CURRICULUM.find((u) => u.lessons.some((x) => x.id === l.id))
  if (!unit) return genCount(l, themes)
  const siblings = unit.lessons.filter((x) => x.activity !== 'review')
  const pooled: Question[] = []
  for (const s of siblings) {
    const qs = generateQuestions(s, themes)
    pooled.push(...qs.slice(0, 2))
  }
  return shuffle(pooled).slice(0, questions)
}

// =====================================================================
export function generateQuestions(lesson: Lesson, themes?: InterestTheme[]): Question[] {
  switch (lesson.activity) {
    case 'count':
      return genCount(lesson, themes)
    case 'recognizeDigit':
      return genCount(lesson, themes)
    case 'digitToQuantity':
      return genDigitToQuantity(lesson, themes)
    case 'compareQuantity':
      return genCompare(lesson, themes)
    case 'countTo10':
      return genCountTo10(lesson, themes)
    case 'sequence':
      return genSequence(lesson)
    case 'ordinal':
      return genOrdinal(lesson, themes)
    case 'compose':
      return genCompose(lesson, themes)
    case 'decompose':
      return genDecompose(lesson, themes)
    case 'add':
      return genAdd(lesson, themes)
    case 'subtract':
      return genSubtract(lesson, themes)
    case 'shape':
      return genShape(lesson)
    case 'pattern':
      return genPattern(lesson)
    case 'sortSize':
      return genSortSize(lesson)
    case 'spatial':
      return genSpatial(lesson)
    case 'solid':
      return genSolid(lesson)
    case 'trace':
      return genTrace(lesson)
    case 'goldenBeads':
      return genGoldenBeads(lesson)
    case 'hundredBoard':
      return genHundredBoard(lesson)
    case 'snake':
      return genSnake(lesson)
    case 'seriation':
      return genSeriation(lesson)
    case 'match':
      return genMatch(lesson, themes)
    case 'oddOne':
      return genOddOne(lesson)
    case 'matrix':
      return genMatrix(lesson)
    case 'shapeCount':
      return genShapeCount(lesson)
    case 'addToCount':
      return genAddToCount(lesson, themes)
    case 'sort':
      return genSort(lesson)
    case 'review':
      return genReview(lesson, themes)
    default:
      return genCount(lesson, themes)
  }
}
