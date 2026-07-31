import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, RefreshCw, ArrowLeft, Gamepad2, Heart, Award } from 'lucide-react'
import AnimatedPage from '../components/layout/AnimatedPage'
import useDocumentTitle from '../hooks/useDocumentTitle'
import useCartStore from '../store/cartStore'
import toast from 'react-hot-toast'

const MomoGame = () => {
  useDocumentTitle('Momo Catch Game')
  const navigate = useNavigate()
  const applyPromoCode = useCartStore(state => state.applyPromoCode)
  const canvasRef = useRef(null)

  // Game States
  const [gameState, setGameState] = useState('idle') // 'idle', 'playing', 'won', 'lost'
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [unlockedCode, setUnlockedCode] = useState(false)

  // Game Loop Refs
  const requestRef = useRef(null)
  const scoreRef = useRef(0)
  const livesRef = useRef(3)
  const cupXRef = useRef(165) // Centered initially on 400px wide canvas

  const handleMouseMove = (e) => {
    if (gameState !== 'playing' || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    // Align cup center with mouse
    const relativeX = e.clientX - rect.left
    cupXRef.current = Math.max(0, Math.min(330, relativeX - 35))
  }

  const handleTouchMove = (e) => {
    if (gameState !== 'playing' || !canvasRef.current || e.touches.length === 0) return
    const rect = canvasRef.current.getBoundingClientRect()
    const relativeX = e.touches[0].clientX - rect.left
    cupXRef.current = Math.max(0, Math.min(330, relativeX - 35))
  }

  const startGame = () => {
    setScore(0)
    setLives(3)
    scoreRef.current = 0
    livesRef.current = 3
    setGameState('playing')
  }

  useEffect(() => {
    if (gameState !== 'playing') {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Game variables
    let momos = []
    let lastSpawnTime = 0
    const spawnRate = 1200 // Spawn every 1.2s

    // Momo structure
    class FallingMomo {
      constructor() {
        this.x = Math.random() * 360 + 20
        this.y = -20
        this.speed = Math.random() * 2.5 + 2
        this.size = 14
        this.angle = Math.random() * Math.PI
        this.rotSpeed = Math.random() * 0.05 - 0.025
      }

      update() {
        this.y += this.speed
        this.angle += this.rotSpeed
      }

      draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        
        // Draw Momo (dumpling shape)
        ctx.fillStyle = '#FFE5D9'
        ctx.strokeStyle = '#2B2118'
        ctx.lineWidth = 2
        
        ctx.beginPath()
        ctx.arc(0, 0, this.size, 0, Math.PI, true)
        ctx.quadraticCurveTo(0, -this.size / 2, 0, -this.size)
        ctx.quadraticCurveTo(0, -this.size / 2, -this.size, 0)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        // Momo crimps/wrinkles details
        ctx.beginPath()
        ctx.moveTo(-this.size/2, -this.size/4)
        ctx.quadraticCurveTo(0, -this.size/2, this.size/2, -this.size/4)
        ctx.stroke()

        ctx.restore()
      }
    }

    const gameLoop = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 1. Draw Teacup (Player basket)
      ctx.fillStyle = '#FF5A1F' // Chiya Orange
      ctx.strokeStyle = '#2B2118'
      ctx.lineWidth = 3

      // Cup body
      ctx.beginPath()
      ctx.moveTo(cupXRef.current, 450)
      ctx.lineTo(cupXRef.current + 70, 450)
      ctx.quadraticCurveTo(cupXRef.current + 65, 480, cupXRef.current + 55, 490)
      ctx.lineTo(cupXRef.current + 15, 490)
      ctx.quadraticCurveTo(cupXRef.current + 5, 480, cupXRef.current, 450)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Cup handle
      ctx.beginPath()
      ctx.arc(cupXRef.current + 70, 470, 10, -Math.PI / 2, Math.PI / 2)
      ctx.stroke()

      // 2. Handle momos
      if (timestamp - lastSpawnTime > spawnRate) {
        momos.push(new FallingMomo())
        lastSpawnTime = timestamp
      }

      momos.forEach((momo, idx) => {
        momo.update()
        momo.draw()

        // Check Collision with Cup (bucket y is 450 to 470)
        if (
          momo.y >= 445 &&
          momo.y <= 460 &&
          momo.x >= cupXRef.current - 5 &&
          momo.x <= cupXRef.current + 75
        ) {
          // Caught!
          scoreRef.current += 1
          setScore(scoreRef.current)
          momos.splice(idx, 1)

          // Win check
          if (scoreRef.current >= 10) {
            setGameState('won')
            setUnlockedCode(true)
            toast.success('Congratulations! You caught 10 Momos! 🥟', { icon: '🏆' })
          }
        }

        // Out of bounds (Dropped)
        if (momo.y > 510) {
          momos.splice(idx, 1)
          livesRef.current -= 1
          setLives(livesRef.current)

          if (livesRef.current <= 0) {
            setGameState('lost')
            toast.error('Oh no, you dropped too many momos!')
          }
        }
      })

      if (gameState === 'playing') {
        requestRef.current = requestAnimationFrame(gameLoop)
      }
    }

    requestRef.current = requestAnimationFrame(gameLoop)

    return () => {
      cancelAnimationFrame(requestRef.current)
    }
  }, [gameState])

  const handleClaimCode = () => {
    applyPromoCode('MOMO_CHAMP')
    toast.success('Secret code "MOMO_CHAMP" applied! 25% OFF discount registered!', { icon: '🎟️' })
    navigate('/cart')
  }

  return (
    <AnimatedPage className="min-h-screen bg-chiya-cream py-12">
      <div className="max-w-md mx-auto px-4 text-center">
        
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate('/rewards')}
            className="p-2 border-2 border-chiya-ink bg-white rounded-full hover:bg-chiya-cream transition shadow-[2px_2px_0px_0px_var(--color-ink)]"
          >
            <ArrowLeft size={16} />
          </button>
          <span className="font-display font-black text-sm uppercase tracking-wider text-chiya-ink flex items-center gap-1.5">
            <Gamepad2 size={16} /> Momo Catch Mini
          </span>
          <div className="w-8 h-8" /> {/* Balance spacer */}
        </div>

        {/* Game Area */}
        <div className="bg-white border-4 border-chiya-ink rounded-[2.5rem] p-6 shadow-[8px_8px_0px_0px_var(--color-ink)] flex flex-col items-center relative overflow-hidden">
          
          {/* Stats Bar */}
          <div className="w-full flex justify-between items-center mb-4">
            <div className="bg-chiya-orange/10 border-2 border-chiya-ink rounded-full px-4 py-1.5 font-display font-black text-sm text-chiya-orange">
              🥟 Caught: {score} / 10
            </div>
            
            <div className="flex gap-1 text-chiya-pink">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart 
                  key={i} 
                  size={16} 
                  fill={i < lives ? 'currentColor' : 'none'} 
                  className="transition-colors"
                />
              ))}
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="relative border-4 border-chiya-ink rounded-3xl overflow-hidden bg-chiya-cream w-[350px] h-[500px]">
            <canvas
              ref={canvasRef}
              width={350}
              height={500}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="block cursor-none"
            />

            {/* Screens Overlay */}
            <AnimatePresence>
              {gameState === 'idle' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10"
                >
                  <Gamepad2 size={48} className="text-chiya-orange mb-4 animate-pulse" />
                  <h3 className="text-2xl font-display font-black text-chiya-ink mb-2">Momo Catch Challenge</h3>
                  <p className="text-xs font-sans font-medium text-chiya-ink/75 mb-6 max-w-[260px] leading-relaxed">
                    Move your mouse or slide your finger to catch falling momos in the chiya cup. Catch 10 without dropping 3 to win!
                  </p>
                  <button
                    onClick={startGame}
                    className="btn-primary py-3 px-8 text-sm shadow-[3px_3px_0px_0px_var(--color-ink)] hover:scale-105"
                  >
                    Start Game 🕹️
                  </button>
                </motion.div>
              )}

              {gameState === 'won' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/95 backdrop-blur flex flex-col items-center justify-center p-6 text-center z-10 space-y-4"
                >
                  <Trophy size={48} className="text-chiya-yellow animate-bounce" />
                  <h3 className="text-2xl font-display font-black text-chiya-ink">Victory!</h3>
                  <p className="text-xs font-sans font-medium text-chiya-ink/75 max-w-[240px]">
                    Incredible catching skills! You unlocked the secret 25% off coupon.
                  </p>
                  
                  <div className="bg-chiya-yellow/10 border-2 border-dashed border-chiya-orange p-3 rounded-2xl">
                    <span className="text-[10px] font-display font-black uppercase text-chiya-orange/50 tracking-wider">Coupon Code</span>
                    <h4 className="text-2xl font-display font-black text-chiya-orange">MOMO_CHAMP</h4>
                  </div>

                  <button
                    onClick={handleClaimCode}
                    className="w-full btn-primary py-3 flex items-center justify-center gap-1.5 text-xs shadow-[3px_3px_0px_0px_var(--color-ink)]"
                  >
                    <Award size={14} /> Apply 25% Coupon
                  </button>
                </motion.div>
              )}

              {gameState === 'lost' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/95 backdrop-blur flex flex-col items-center justify-center p-6 text-center z-10 space-y-4"
                >
                  <h3 className="text-2xl font-display font-black text-chiya-ink">Game Over 🥺</h3>
                  <p className="text-xs font-sans font-medium text-chiya-ink/75 max-w-[220px]">
                    You dropped 3 delicious steaming momos. Don't let them go to waste!
                  </p>
                  
                  <button
                    onClick={startGame}
                    className="w-full btn-primary py-3 flex items-center justify-center gap-1.5 text-xs shadow-[3px_3px_0px_0px_var(--color-ink)]"
                  >
                    <RefreshCw size={14} /> Play Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </AnimatedPage>
  )
}

export default MomoGame
