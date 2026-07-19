export function Stars({ value, max = 3, size = 'md' }: { value: number; max?: number; size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'lg' ? 'text-4xl' : size === 'sm' ? 'text-base' : 'text-2xl'
  return (
    <div className={`flex items-center gap-0.5 ${cls}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < value ? '' : 'opacity-25 grayscale'}>
          ⭐
        </span>
      ))}
    </div>
  )
}
