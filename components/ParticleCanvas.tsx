"use client"

import { useEffect, useRef } from "react"

const INFLUENCE_RADIUS = 150
const REPULSION_STRENGTH = 8
const DAMPING = 0.92
const SPRING_BACK = 0.02
const GLOW_RADIUS_MULTIPLIER = 1.5
const INITIAL_SPAWN_BAND_HEIGHT_RATIO = 0.25

const MAPACHITO_VIVID_COLORS = [
  "rgba(0, 139, 139, 0.6)",
  "rgba(156, 0, 82, 0.6)",
  "rgba(0, 142, 193, 0.6)",
  "rgba(255, 69, 0, 0.6)",
  "rgba(121, 15, 197, 0.6)",
  "rgba(0, 143, 57, 0.6)",
]

class Particle {
  baseX: number
  baseY: number
  interactionOffsetX: number
  interactionOffsetY: number
  interactionVelocityX: number
  interactionVelocityY: number
  radius: number
  baseRadius: number
  speedY: number
  speedX: number
  opacity: number
  wobble: number
  color: string

  constructor(canvasWidth: number, canvasHeight: number) {
    this.baseX = Math.random() * canvasWidth
    this.baseY =
      canvasHeight +
      Math.random() * canvasHeight * INITIAL_SPAWN_BAND_HEIGHT_RATIO
    this.interactionOffsetX = 0
    this.interactionOffsetY = 0
    this.interactionVelocityX = 0
    this.interactionVelocityY = 0
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
    this.baseY += this.speedY
    this.baseX += Math.sin(this.wobble) * this.speedX

    if (this.baseY + this.baseRadius < 0) {
      this.baseY = canvasHeight + this.baseRadius
      this.baseX = Math.random() * canvasWidth
      this.interactionOffsetX = 0
      this.interactionOffsetY = 0
      this.interactionVelocityX = 0
      this.interactionVelocityY = 0
    }

    if (mouseX !== null && mouseY !== null) {
      const particleX = this.baseX + this.interactionOffsetX
      const particleY = this.baseY + this.interactionOffsetY
      const dx = particleX - mouseX
      const dy = particleY - mouseY
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < INFLUENCE_RADIUS && distance > 0) {
        const normalizedDistance = 1 - distance / INFLUENCE_RADIUS
        const force =
          normalizedDistance * normalizedDistance * REPULSION_STRENGTH
        const angle = Math.atan2(dy, dx)
        this.interactionVelocityX += Math.cos(angle) * force
        this.interactionVelocityY += Math.sin(angle) * force
        this.radius =
          this.baseRadius +
          this.baseRadius * (GLOW_RADIUS_MULTIPLIER - 1) * normalizedDistance
      } else {
        this.radius += (this.baseRadius - this.radius) * 0.1
      }
    } else {
      this.radius += (this.baseRadius - this.radius) * 0.1
    }

    this.interactionVelocityX -= this.interactionOffsetX * SPRING_BACK
    this.interactionVelocityY -= this.interactionOffsetY * SPRING_BACK

    this.interactionVelocityX *= DAMPING
    this.interactionVelocityY *= DAMPING

    this.interactionOffsetX += this.interactionVelocityX
    this.interactionOffsetY += this.interactionVelocityY
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.arc(
      this.baseX + this.interactionOffsetX,
      this.baseY + this.interactionOffsetY,
      this.radius,
      0,
      Math.PI * 2,
    )
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.closePath()
  }
}

export default function ParticleCanvas({ onReady }: { onReady?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  })

  useEffect(() => {
    const canvas = canvasRef.current!
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
    onReady?.()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [onReady])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  )
}
