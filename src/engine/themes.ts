import type { InterestTheme } from '../types'

// Bộ icon (emoji) theo chủ đề, dùng cho các bài đếm / cộng / trừ.
export const THEMES: Record<string, string[]> = {
  fruit: ['🍎', '🍓', '🍌', '🍊', '🍇', '🍉', '🍑', '🥝'],
  animal: ['🐶', '🐱', '🐰', '🐥', '🐸', '🐢', '🐷', '🐘'],
  sea: ['🐟', '🐠', '🐙', '🦀', '🐬', '🐳', '🦑', '🐚'],
  toy: ['🧸', '🎠', '🪀', '🎈', '🧩', '🚗', '🪁', '⚽'],
  food: ['🍪', '🍰', '🧁', '🍭', '🍩', '🍬', '🥨', '🍿'],
  party: ['🎈', '🎁', '🎉', '⭐', '🎀', '🌟', '🎊', '🍬'],
  nature: ['🌸', '🌻', '🌼', '🍀', '🌷', '🌺', '🍄', '🌿'],
}

// Bộ icon theo chủ đề yêu thích của bé (robot / siêu nhân / quái vật).
// Dùng biểu tượng nguyên bản, KHÔNG dùng nhân vật có bản quyền.
// Emoji ảnh Twemoji cho từng chủ đề (đẹp, đồng nhất mọi thiết bị).
export const INTEREST_ICONS: Record<Exclude<InterestTheme, 'classic'>, string[]> = {
  robot: ['🤖', '🦾', '🚀', '🛸', '🛰️', '🔋'],
  hero: ['🦸', '🦹', '🦸‍♂️', '🦸‍♀️', '🦇', '⚡'],
  monster: ['👾', '🐲', '🐉', '🦖', '🦕', '👹'],
  car: ['🚗', '🚙', '🚕', '🏎️', '🚌', '🚓'],
}

// Avatar gợi ý theo chủ đề (đứng đầu danh sách khi bé chọn chủ đề đó).
export const THEME_AVATARS: Record<InterestTheme, string[]> = {
  classic: ['🦊', '🐰', '🐨', '🐯', '🦁', '🐼', '🐸', '🐵', '🦄', '🐧', '🐷', '🐥'],
  robot: ['🤖', '👾', '🦾', '🛸', '🚀', '🛰️', '⚙️', '🔋', '📡', '💡', '🎮', '🦿'],
  hero: ['🦸', '🦸‍♂️', '🦸‍♀️', '🦹', '🦇', '⚡', '🛡️', '🔥', '💥', '⭐', '🏆', '🌟'],
  monster: ['👾', '🐲', '🐉', '🦖', '🦕', '👹', '👻', '🦄', '🦎', '🐙', '🐊', '🦂'],
  car: ['🚗', '🚙', '🚕', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚌', '🛻', '🚜'],
}

export function themeIcons(name?: string): string[] {
  return THEMES[name ?? 'fruit'] ?? THEMES.fruit
}

// Trả về bộ icon phù hợp: gộp icon của TẤT CẢ chủ đề bé chọn (trừ 'classic').
// Nếu không chọn chủ đề nào (hoặc chỉ 'classic') thì dùng bộ icon của bài học.
export function resolveIcons(themes: InterestTheme[] | undefined, lessonTheme?: string): string[] {
  const active = (themes ?? []).filter(
    (t): t is Exclude<InterestTheme, 'classic'> => t !== 'classic',
  )
  if (active.length === 0) return themeIcons(lessonTheme)
  return active.flatMap((t) => INTEREST_ICONS[t])
}

export function pickFrom(icons: string[]): string {
  return icons[Math.floor(Math.random() * icons.length)]
}

export function pickIcon(name?: string): string {
  return pickFrom(themeIcons(name))
}
