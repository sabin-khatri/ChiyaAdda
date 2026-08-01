import React, { useEffect, useRef, useState } from 'react'

const LiquidCupCanvas = ({ teaColor, milkLevel }) => {
  const canvasRef = useRef(null)
  const [rippleHeight, setRippleHeight] = useState(0)
  const mouseRef = useRef({ x: null, y: null })

  // Trigger a splash ripple on click
  const handleClick = (e) => {
    setRippleHeight(12) // Peak ripple amplitude
  }

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    mouseRef.current.x = e.clientX - rect.left
    mouseRef.current.y = e.clientY - rect.top
    
    // Add small disturbance on hover move
    setRippleHeight(prev => Math.min(6, prev + 0.3))
  }

  const handleMouseLeave = () => {
    mouseRef.current.x = null
    mouseRef.current.y = null
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let time = 0
    let currentRipple = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Decelerate ripple height over time (decay function)
      currentRipple += (rippleHeight - currentRipple) * 0.1
      if (rippleHeight > 0.1) {
        setRippleHeight(prev => prev * 0.94) // Slow bleed decay
      }

      ctx.save()

      // 1. Clip path matching the cup rounded-bottom shape
      ctx.beginPath()
      ctx.moveTo(4, 0)
      ctx.lineTo(188, 0)
      ctx.lineTo(188, 70)
      ctx.quadraticCurveTo(188, 140, 144, 140)
      ctx.lineTo(48, 140)
      ctx.quadraticCurveTo(4, 140, 4, 70)
      ctx.closePath()
      ctx.clip()

      // 2. Draw Liquid
      const liquidTopY = 38 // 75% filled line height
      ctx.fillStyle = teaColor

      ctx.beginPath()
      ctx.moveTo(0, canvas.height)
      ctx.lineTo(0, liquidTopY)

      // Draw mathematical sine wave representing liquid ripples
      for (let x = 0; x <= canvas.width; x += 2) {
        const wave = Math.sin(x * 0.08 + time) * currentRipple
        const secondaryWave = Math.cos(x * 0.04 - time * 0.7) * (currentRipple * 0.3)
        ctx.lineTo(x, liquidTopY + wave + secondaryWave)
      }
      ctx.lineTo(canvas.width, canvas.height)
      ctx.closePath()
      ctx.fill()

      // 3. Draw Steaming/Milk foam top highlight (Froth)
      if (milkLevel > 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
        ctx.beginPath()
        ctx.moveTo(0, liquidTopY - 4)
        for (let x = 0; x <= canvas.width; x += 4) {
          const wave = Math.sin(x * 0.08 + time) * currentRipple
          ctx.lineTo(x, liquidTopY + wave - 3)
        }
        for (let x = canvas.width; x >= 0; x -= 4) {
          const wave = Math.sin(x * 0.08 + time) * currentRipple
          ctx.lineTo(x, liquidTopY + wave + 2)
        }
        ctx.closePath()
        ctx.fill()

        // Draw tiny rising bubbles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
        for (let i = 0; i < 5; i++) {
          const bubbleX = (canvas.width / 6) * (i + 1) + Math.sin(time + i) * 6
          const bubbleY = liquidTopY + Math.sin(bubbleX * 0.08 + time) * currentRipple - 4
          ctx.beginPath()
          ctx.arc(bubbleX, bubbleY, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.restore()

      time += 0.09
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [teaColor, milkLevel, rippleHeight])

  return (
    <canvas
      ref={canvasRef}
      width={192}
      height={144}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="absolute bottom-1 left-1 rounded-b-[38px] z-10 cursor-pointer block"
      title="Click to ripple the tea!"
    />
  )
}

export default LiquidCupCanvas
