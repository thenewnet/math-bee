import { Glyph } from './Creatures'

// Hiển thị một nhóm N đồ vật (emoji hoặc nhân vật SVG) dạng lưới đẹp mắt.
export function ObjectGroup({
  icon,
  count,
  size = 'md',
  faded = 0,
  crossed = 0,
}: {
  icon: string
  count: number
  size?: 'sm' | 'md' | 'lg'
  faded?: number // số phần tử cuối bị mờ (dùng cho tách/trừ phần "lấy đi")
  crossed?: number // số phần tử cuối bị gạch (dùng cho phép trừ)
}) {
  // Ở khung câu hỏi (lg): ít đồ vật thì vẽ TO để nổi bật, nhiều thì nhỏ lại vừa khung.
  const lgPx = count <= 2 ? 116 : count <= 4 ? 96 : count <= 6 ? 78 : count <= 10 ? 64 : 54
  const px = size === 'lg' ? lgPx : size === 'sm' ? 44 : 56
  const cols = count <= 3 ? count : count <= 6 ? 3 : count <= 8 ? 4 : 5
  const items = Array.from({ length: count })
  return (
    <div
      className="grid justify-center gap-2 sm:gap-3"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {items.map((_, i) => {
        const isFaded = i >= count - faded
        const isCrossed = i >= count - crossed
        return (
          <span
            key={i}
            className={`anim-pop relative inline-flex items-center justify-center leading-none ${isFaded ? 'opacity-30' : ''}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <Glyph token={icon} size={px} />
            {isCrossed && (
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="block h-1 w-[120%] rotate-[-18deg] rounded-full bg-coral/80" />
              </span>
            )}
          </span>
        )
      })}
    </div>
  )
}
