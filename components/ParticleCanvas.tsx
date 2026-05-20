"use client"
import { useEffect, useRef } from "react"

class Particle {
  x: number
  y: number
  radius: number
  speedY: number
  speedX: number
  opacity: number
  wobble: number

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth
    this.y = Math.random() * canvasHeight
    this.radius = Math.random() * 4 + 1
    this.speedY = Math.random() * -1 - 0.5
    this.speedX = Math.random() * 1 - 0.5
    this.opacity = Math.random() * 0.5 + 0.1
    this.wobble = Math.random() * Math.PI * 2
  }

  update(canvasWidth: number, canvasHeight: number) {
    this.y += this.speedY
    this.wobble += 0.02
    this.x += Math.sin(this.wobble) * this.speedX

    if (this.y + this.radius < 0) {
      this.y = canvasHeight + this.radius
      this.x = Math.random() * canvasWidth
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
    ctx.fill()
    ctx.closePath()
  }
}
export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []

    const initParticles = () => {
      particles = []
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000)
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height))
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    window.addEventListener("resize", resize)
    resize()

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(canvas.width, canvas.height)
        particles[i].draw(ctx)
      }
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  )
}
