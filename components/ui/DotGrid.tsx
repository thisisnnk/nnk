'use client'
import { useRef, useEffect } from 'react'

const SPACING      = 24
const DOT_R        = 0.85
const ACCENT       = '0,170,255'
const ACCENT_RATIO = 0.12

const WAVE_SPEED    = 180
const WAVE_WIDTH    = 160
const WAVE_SCALE    = 2.0   // dots grow to 2x at peak — small, noticeable
const WAVE_INTERVAL = 3800

interface Dot  { x: number; y: number; accent: boolean }
interface Wave { radius: number; maxRadius: number }

export default function DotGrid() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let w = 0, h = 0
    let dots:  Dot[]  = []
    let waves: Wave[] = []
    let nextWaveAt = 0
    let lastTime   = 0
    let raf = 0

    const buildDots = (): Dot[] => {
      const cols = Math.ceil(w / SPACING) + 1
      const rows = Math.ceil(h / SPACING) + 1
      return Array.from({ length: rows * cols }, (_, k) => ({
        x: (k % cols) * SPACING,
        y: Math.floor(k / cols) * SPACING,
        accent: Math.random() < ACCENT_RATIO,
      }))
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      w = canvas.offsetWidth; h = canvas.offsetHeight
      canvas.width  = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.resetTransform(); ctx.scale(dpr, dpr)
      dots = buildDots()
      waves = []; nextWaveAt = 0; lastTime = 0
    }

    const frame = (ts: number) => {
      const now = ts
      const dt  = Math.min((now - (lastTime || now)) / 1000, 0.05)
      lastTime  = now

      ctx.clearRect(0, 0, w, h)

      const cx = w / 2, cy = h / 2

      if (now >= nextWaveAt) {
        const maxR = Math.sqrt(cx * cx + cy * cy) + WAVE_WIDTH
        waves.push({ radius: 0, maxRadius: maxR })
        nextWaveAt = now + WAVE_INTERVAL
      }

      for (const wv of waves) wv.radius += WAVE_SPEED * dt
      waves = waves.filter(wv => wv.radius <= wv.maxRadius)

      for (const d of dots) {
        const dist  = Math.sqrt((d.x - cx) ** 2 + (d.y - cy) ** 2)
        let   scale = 1

        for (const wv of waves) {
          const delta = Math.abs(dist - wv.radius)
          if (delta < WAVE_WIDTH) {
            const t = 1 - delta / WAVE_WIDTH
            scale = Math.max(scale, 1 + t * (WAVE_SCALE - 1))
          }
        }

        ctx.beginPath()
        ctx.arc(d.x, d.y, DOT_R * scale, 0, Math.PI * 2)
        ctx.fillStyle = d.accent ? `rgba(${ACCENT},0.8)` : 'rgba(255,255,255,0.30)'
        ctx.fill()
      }

      raf = requestAnimationFrame(frame)
    }

    resize()
    raf = requestAnimationFrame(frame)

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  )
}
