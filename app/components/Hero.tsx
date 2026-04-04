'use client'

import { useEffect, useRef } from 'react'

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.width = canvas.offsetWidth
    const H = canvas.height = 460
    const COLS = 40, ROWS = 30

    // flow field angles — each cell has a direction
    const field: number[] = []
    for(let i = 0; i < COLS * ROWS; i++) {
      const x = (i % COLS) / COLS
      const y = Math.floor(i / COLS) / ROWS
      field.push(
        Math.sin(x * Math.PI * 2) * Math.cos(y * Math.PI * 2) * Math.PI +
        Math.sin(y * Math.PI * 3 + 1.2) * 0.8
      )
    }

    function getAngle(x: number, y: number, t: number) {
      const cx = x / W * COLS | 0
      const cy = y / H * ROWS | 0
      const idx = Math.min(cy, ROWS-1) * COLS + Math.min(cx, COLS-1)
      return field[idx] + t * 0.0008
    }

    // particles
    const COUNT = 500
    const px = new Float32Array(COUNT)
    const py = new Float32Array(COUNT)
    const pa = new Float32Array(COUNT) // alpha
    const plife = new Float32Array(COUNT)
    const pmaxlife = new Float32Array(COUNT)

    function initParticle(i: number) {
      px[i] = Math.random() * W
      py[i] = Math.random() * H
      plife[i] = 0
      pmaxlife[i] = 80 + Math.random() * 120
      pa[i] = 0
    }

    for(let i = 0; i < COUNT; i++) {
      initParticle(i)
      plife[i] = Math.random() * 200 // stagger starts
    }

    let frame = 0
    let raf: number

    function loop() {
      frame++
      ctx.fillStyle = 'rgba(10,10,10,0.18)'
      ctx.fillRect(0, 0, W, H)

      for(let i = 0; i < COUNT; i++) {
        plife[i]++
        if(plife[i] > pmaxlife[i]) { initParticle(i); continue }

        const lifeRatio = plife[i] / pmaxlife[i]
        pa[i] = lifeRatio < 0.1
          ? lifeRatio * 10
          : lifeRatio > 0.8
          ? (1 - lifeRatio) * 5
          : 1

        const angle = getAngle(px[i], py[i], frame)
        const speed = 1.2
        px[i] += Math.cos(angle) * speed
        py[i] += Math.sin(angle) * speed

        if(px[i] < 0 || px[i] > W || py[i] < 0 || py[i] > H) {
          initParticle(i)
          continue
        }

        ctx.beginPath()
        ctx.arc(px[i], py[i], 1.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(29,158,117,${pa[i] * 0.6})`
        ctx.fill()
      }

      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section style={{ position: 'relative', width: '100%', height: '460px' }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#0a0a0a' }}
      />
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '2.5rem',
        background: 'linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 60%)',
      }}>
        <span style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '0.75rem' }}>
          cs @ northeastern
        </span>
        <h1 style={{ fontSize: '42px', fontWeight: 500, lineHeight: 1.2, margin: 0, color: '#fff' }}>
          build, break, repeat :)
        </h1>
      </div>
    </section>
  )
}
