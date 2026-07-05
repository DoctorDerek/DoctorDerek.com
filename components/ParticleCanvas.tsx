"use client"

import { useEffect, useRef } from "react"

const INFLUENCE_RADIUS = 150
const REPULSION_STRENGTH = 8
const DAMPING = 0.92
const SPRING_BACK = 0.02
const GLOW_RADIUS_MULTIPLIER = 1.5

const MAPACHITO_VIVID_COLORS = [
  "rgba(0, 139, 139, 0.6)",
  "rgba(156, 0, 82, 0.6)",
  "rgba(0, 142, 193, 0.6)",
  "rgba(255, 69, 0, 0.6)",
  "rgba(121, 15, 197, 0.6)",
  "rgba(0, 143, 57, 0.6)",
]

class Particle {
  x: number
  y: number
  homeX: number
  homeY: number
  vx: number
  vy: number
  radius: number
  baseRadius: number
  speedY: number
  speedX: number
  opacity: number
  wobble: number
  color: string

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth
    this.y = Math.random() * canvasHeight
    this.homeX = this.x
    this.homeY = this.y
    this.vx = 0
    this.vy = 0
    this.baseRadius = Math.random() * 4 + 1
    this.radius = this.baseRadius
    this.speedY = Math.random() * -1 - 0.5
    this.speedX = Math.random() * 1 - 0.5
    this.opacity = Math.random() * 0.5 + 0.1
    this.wobble = Math.random() * Math.PI * 2

    this.color =
      Math.random() < 0.2
        ? MAPACHITO_VIVID_COLORS[
            Math.floor(Math.random() * MAPACHITO_VIVID_COLORS.length)
          ]
        : `rgba(255, 255, 255, ${this.opacity})`
  }

  update(
    canvasWidth: number,
    canvasHeight: number,
    mouseX: number | null,
    mouseY: number | null,
  ) {
    this.wobble += 0.02
    this.homeY += this.speedY
    this.homeX += Math.sin(this.wobble) * this.speedX

    if (this.homeY + this.baseRadius < 0) {
      this.homeY = canvasHeight + this.baseRadius
      this.homeX = Math.random() * canvasWidth
    }

    if (mouseX !== null && mouseY !== null) {
      const dx = this.x - mouseX
      const dy = this.y - mouseY
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < INFLUENCE_RADIUS && distance > 0) {
        const normalizedDistance = 1 - distance / INFLUENCE_RADIUS
        const force =
          normalizedDistance * normalizedDistance * REPULSION_STRENGTH
        const angle = Math.atan2(dy, dx)
        this.vx += Math.cos(angle) * force
        this.vy += Math.sin(angle) * force
        this.radius =
          this.baseRadius +
          this.baseRadius * (GLOW_RADIUS_MULTIPLIER - 1) * normalizedDistance
      } else {
        this.radius += (this.baseRadius - this.radius) * 0.1
      }
    } else {
      this.radius += (this.baseRadius - this.radius) * 0.1
    }

    this.vx += (this.homeX - this.x) * SPRING_BACK
    this.vy += (this.homeY - this.y) * SPRING_BACK

    this.vx *= DAMPING
    this.vy *= DAMPING

    this.x += this.vx
    this.y += this.vy
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.closePath()
  }
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  })

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

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    const handleMouseLeave = () => {
      mouseRef.current.x = null
      mouseRef.current.y = null
    }

    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.addEventListener("mouseleave", handleMouseLeave)

    resize()

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const { x: mouseX, y: mouseY } = mouseRef.current
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(canvas.width, canvas.height, mouseX, mouseY)
        particles[i].draw(ctx)
      }
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
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
