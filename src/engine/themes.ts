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

export function themeIcons(name?: string): string[] {
  return THEMES[name ?? 'fruit'] ?? THEMES.fruit
}

export function pickIcon(name?: string): string {
  const icons = themeIcons(name)
  return icons[Math.floor(Math.random() * icons.length)]
}
