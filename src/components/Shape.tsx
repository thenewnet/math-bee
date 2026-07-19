const COLORS: Record<string, string> = {
  circle: '#ff7043',
  square: '#42a5f5',
  triangle: '#66bb6a',
  rectangle: '#ab47bc',
}

export function Shape({ kind, size = 96 }: { kind: string; size?: number }) {
  const c = COLORS[kind] ?? '#ffb300'
  const common = { fill: c, stroke: 'rgba(0,0,0,0.12)', strokeWidth: 3 }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      {kind === 'circle' && <circle cx="50" cy="50" r="42" {...common} />}
      {kind === 'square' && <rect x="12" y="12" width="76" height="76" rx="8" {...common} />}
      {kind === 'triangle' && <polygon points="50,10 90,86 10,86" {...common} />}
      {kind === 'rectangle' && <rect x="6" y="26" width="88" height="48" rx="8" {...common} />}
    </svg>
  )
}
