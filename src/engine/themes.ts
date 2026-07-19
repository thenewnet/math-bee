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
export const INTEREST_ICONS: Record<Exclude<InterestTheme, 'classic'>, string[]> = {
  robot: ['🤖', '🦾', '🦿', '🛸', '🚀', '🛰️', '📡', '🔋', '⚙️', '💡', '🔧', '🎛️'],
  hero: ['🦸', '🦸‍♂️', '🦸‍♀️', '🦹', '🛡️', '⚡', '💥', '🔥', '⭐', '🌟', '🏆', '🦇'],
  monster: ['👾', '🐲', '🐉', '🦖', '🦕', '👹', '👻', '🦎', '🐙', '🦄', '🐊', '🦂'],
}

// Avatar gợi ý theo chủ đề (đứng đầu danh sách khi bé chọn chủ đề đó).
export const THEME_AVATARS: Record<InterestTheme, string[]> = {
  classic: ['🦊', '🐰', '🐨', '🐯', '🦁', '🐼', '🐸', '🐵', '🦄', '🐧', '🐷', '🐥'],
  robot: ['🤖', '👾', '🦾', '🛸', '🚀', '🛰️', '⚙️', '🔋', '📡', '💡', '🎮', '🦿'],
  hero: ['🦸', '🦸‍♂️', '🦸‍♀️', '🦹', '🦇', '⚡', '🛡️', '🔥', '💥', '⭐', '🏆', '🌟'],
  monster: ['👾', '🐲', '🐉', '🦖', '🦕', '👹', '👻', '🦄', '🦎', '🐙', '🐊', '🦂'],
}

export function themeIcons(name?: string): string[] {
  return THEMES[name ?? 'fruit'] ?? THEMES.fruit
}

// Trả về bộ icon phù hợp: ưu tiên chủ đề yêu thích của bé, nếu là 'classic' thì
// dùng bộ icon mặc định của bài học.
export function resolveIcons(interest: InterestTheme | undefined, lessonTheme?: string): string[] {
  if (interest && interest !== 'classic') return INTEREST_ICONS[interest]
  return themeIcons(lessonTheme)
}

export function pickFrom(icons: string[]): string {
  return icons[Math.floor(Math.random() * icons.length)]
}

export function pickIcon(name?: string): string {
  return pickFrom(themeIcons(name))
}
