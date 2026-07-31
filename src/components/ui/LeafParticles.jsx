import React, { useEffect, useRef } from 'react'

const LeafParticles = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId

    // Handle resizing
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth
      canvas.height = canvas.parentElement.clientHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Particle Class
    class Leaf {
      constructor(x, y, isBurst = false) {
        this.x = x ?? Math.random() * canvas.width
        this.y = y ?? (isBurst ? y : -20)
        this.size = Math.random() * 8 + 5
        this.speedX = Math.random() * 1.5 - 0.75
        this.speedY = Math.random() * 1.2 + 0.8
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = Math.random() * 0.03 - 0.015
        this.opacity = Math.random() * 0.4 + 0.3
        
        // Green shades matching the organic tea palette
        const shades = ['#1B9C85', '#4E9F3D', '#05C7A6', '#1E5128']
        this.color = shades[Math.floor(Math.random() * shades.length)]
      }

      update(mouseX, mouseY) {
        this.y += this.speedY
        this.x += this.speedX + Math.sin(this.y / 30) * 0.5 // Wind sway
        this.rotation += this.rotationSpeed

        // Mouse interaction (Repulsion physics)
        if (mouseX !== null && mouseY !== null) {
          const dx = this.x - mouseX
          const dy = this.y - mouseY
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 120) {
            const force = (120 - distance) / 120
            this.x += (dx / distance) * force * 5
            this.y += (dy / distance) * force * 5
          }
        }
      }

      draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = this.color

        // Draw organic leaf shape using Bezier curves
        ctx.beginPath()
        ctx.moveTo(0, -this.size)
        ctx.quadraticCurveTo(this.size, -this.size / 2, 0, this.size)
        ctx.quadraticCurveTo(-this.size, -this.size / 2, 0, -this.size)
        ctx.fill()
        
        ctx.restore()
      }
    }

    let leaves = Array.from({ length: 25 }, () => new Leaf())
    let mouse = { x: null, y: null }

    // Spawn regular leaves at intervals
    const spawnInterval = setInterval(() => {
      if (leaves.length < 45) {
        leaves.push(new Leaf())
      }
    }, 400)

    // Mouse Move listeners
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    const handleMouseLeave = () => {
      mouse.x = null
      mouse.y = null
    }

    // Click to burst leaves
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const clickY = e.clientY - rect.top
      for (let i = 0; i < 10; i++) {
        leaves.push(new Leaf(clickX, clickY, true))
      }
    }

    canvas.parentElement.addEventListener('mousemove', handleMouseMove)
    canvas.parentElement.addEventListener('mouseleave', handleMouseLeave)
    canvas.parentElement.addEventListener('click', handleClick)

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      leaves = leaves.filter(leaf => {
        leaf.update(mouse.x, mouse.y)
        leaf.draw()
        // Keep particles that are inside bounds
        return leaf.y < canvas.height + 20 && leaf.x > -20 && leaf.x < canvas.width + 20
      })

      animationFrameId = requestAnimationFrame(draw)
    }
    draw()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      clearInterval(spawnInterval)
      window.removeEventListener('resize', resizeCanvas)
      if (canvas && canvas.parentElement) {
        canvas.parentElement.removeEventListener('mousemove', handleMouseMove)
        canvas.parentElement.removeEventListener('mouseleave', handleMouseLeave)
        canvas.parentElement.removeEventListener('click', handleClick)
      }
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  )
}

export default LeafParticles
