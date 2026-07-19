import { useEffect, useRef } from 'react'

interface Piece {
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  vr: number
  size: number
  color: string
  shape: number
}

const COLORS = ['#ffb300', '#ff7043', '#42a5f5', '#66bb6a', '#ab47bc', '#ec407a', '#ffd54f']

// Bắn confetti mỗi khi `trigger` thay đổi (giá trị > 0).
export function Confetti({ trigger }: { trigger: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const piecesRef = useRef<Piece[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!trigger) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    ctx.scale(dpr, dpr)
    const W = window.innerWidth
    const H = window.innerHeight

    const n = 130
    const pieces: Piece[] = []
    for (let i = 0; i < n; i++) {
      pieces.push({
        x: W / 2 + (Math.random() - 0.5) * 120,
        y: H * 0.32,
        vx: (Math.random() - 0.5) * 11,
        vy: Math.random() * -12 - 4,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 9 + 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: Math.floor(Math.random() * 3),
      })
    }
    piecesRef.current = pieces

    let frames = 0
    const gravity = 0.32
    const tick = () => {
      ctx.clearRect(0, 0, W, H)
      let alive = false
      for (const p of piecesRef.current) {
        p.vy += gravity
        p.vx *= 0.99
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vr
        if (p.y < H + 40) alive = true
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        if (p.shape === 0) ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        else if (p.shape === 1) {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.moveTo(0, -p.size / 2)
          ctx.lineTo(p.size / 2, p.size / 2)
          ctx.lineTo(-p.size / 2, p.size / 2)
          ctx.closePath()
          ctx.fill()
        }
        ctx.restore()
      }
      frames++
      if (alive && frames < 240) rafRef.current = requestAnimationFrame(tick)
      else ctx.clearRect(0, 0, W, H)
    }
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [trigger])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      style={{ width: '100vw', height: '100vh' }}
    />
  )
}
