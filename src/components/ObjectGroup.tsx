// Hiển thị một nhóm N đồ vật (emoji) dạng lưới đẹp mắt, có hiệu ứng bung ra.
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
  const fontSize = size === 'lg' ? 'text-5xl' : size === 'sm' ? 'text-3xl' : 'text-4xl'
  const cols = count <= 3 ? count : count <= 6 ? 3 : count <= 8 ? 4 : 5
  const items = Array.from({ length: count })
  return (
    <div
      className="grid justify-center gap-1.5 sm:gap-2"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {items.map((_, i) => {
        const isFaded = i >= count - faded
        const isCrossed = i >= count - crossed
        return (
          <span
            key={i}
            className={`${fontSize} anim-pop relative leading-none ${isFaded ? 'opacity-30' : ''}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {icon}
            {isCrossed && (
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-coral">
                <span className="block h-1 w-[120%] rotate-[-18deg] rounded-full bg-coral/80" />
              </span>
            )}
          </span>
        )
      })}
    </div>
  )
}
