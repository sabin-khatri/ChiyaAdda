import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Music, Flame, CloudRain, Play, Pause } from 'lucide-react'

const AmbientSoundboard = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedSound, setSelectedSound] = useState('lofi') // 'lofi', 'rain', 'breeze'
  const [volume, setVolume] = useState(0.5)
  
  const audioCtxRef = useRef(null)
  const sourceNodeRef = useRef(null)
  const gainNodeRef = useRef(null)

  // Initialize Web Audio Context
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      gainNodeRef.current = audioCtxRef.current.createGain()
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime)
      gainNodeRef.current.connect(audioCtxRef.current.destination)
    }
  }

  // Synthesize Sound Loops
  const playSynthesizedSound = (type) => {
    initAudio()
    stopSound()

    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    if (type === 'rain') {
      // Synthesize rain using White Noise
      const bufferSize = ctx.sampleRate * 2
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }

      const whiteNoise = ctx.createBufferSource()
      whiteNoise.buffer = noiseBuffer
      whiteNoise.loop = true

      // Filter to create a low, rumbling rain sound
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(1000, ctx.currentTime)

      whiteNoise.connect(filter)
      filter.connect(gainNodeRef.current)
      whiteNoise.start()
      sourceNodeRef.current = whiteNoise

    } else if (type === 'lofi') {
      // Synthesize Lo-Fi Synth Chords using multi-oscillators and LFO
      const nodes = []
      const freqs = [196.00, 293.66, 392.00, 493.88] // G3, D4, G4, B4 (Major 7th voicing)
      
      freqs.forEach((freq) => {
        const osc = ctx.createOscillator()
        const filter = ctx.createBiquadFilter()
        
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, ctx.currentTime)

        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(400, ctx.currentTime)

        // Detune slightly for chorusing effect
        osc.detune.setValueAtTime(Math.random() * 8 - 4, ctx.currentTime)

        osc.connect(filter)
        filter.connect(gainNodeRef.current)
        osc.start()
        nodes.push(osc)
      })

      // Add a slow volume LFO to mimic lo-fi cassette flutter
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      lfo.frequency.value = 0.5 // 0.5Hz modulation
      lfoGain.gain.value = 0.15 // Moderate flutter

      lfo.connect(lfoGain)
      lfoGain.connect(gainNodeRef.current.gain)
      lfo.start()

      sourceNodeRef.current = {
        stop: () => {
          nodes.forEach(n => n.stop())
          lfo.stop()
        }
      }

    } else if (type === 'breeze') {
      // Synthesize wind/breeze using Pink Noise
      const bufferSize = ctx.sampleRate * 2
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }

      const whiteNoise = ctx.createBufferSource()
      whiteNoise.buffer = noiseBuffer
      whiteNoise.loop = true

      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 600
      filter.Q.value = 2.0

      // Dynamic wind sweep LFO
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      lfo.frequency.value = 0.2 // Slow sweeping
      lfoGain.gain.value = 200

      lfo.connect(lfoGain)
      lfoGain.connect(filter.frequency)
      lfo.start()

      whiteNoise.connect(filter)
      filter.connect(gainNodeRef.current)
      whiteNoise.start()
      sourceNodeRef.current = {
        stop: () => {
          whiteNoise.stop()
          lfo.stop()
        }
      }
    }
  }

  const stopSound = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop()
      } catch (e) {
        // Already stopped
      }
      sourceNodeRef.current = null
    }
  }

  // Handle Play/Pause
  const togglePlay = () => {
    if (isPlaying) {
      stopSound()
      setIsPlaying(false)
    } else {
      playSynthesizedSound(selectedSound)
      setIsPlaying(true)
    }
  }

  // Handle Volume
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value)
    setVolume(val)
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(val, audioCtxRef.current.currentTime)
    }
  }

  // Change Track
  const changeSound = (soundType) => {
    setSelectedSound(soundType)
    if (isPlaying) {
      playSynthesizedSound(soundType)
    }
  }

  // Clean up nodes on unmount
  useEffect(() => {
    return () => {
      stopSound()
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
      }
    }
  }, [])

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="bg-white/80 backdrop-blur-md border-2 border-chiya-ink rounded-card-sm p-4 w-60 shadow-pop mb-3 text-left"
          >
            <h4 className="text-sm font-display font-black text-chiya-ink mb-3 flex items-center gap-1.5 uppercase tracking-wider">
              ☕ Ambient Soundboard
            </h4>
            
            {/* Tracks */}
            <div className="space-y-2 mb-4">
              {[
                { id: 'lofi', name: 'Lo-Fi Lounge', icon: <Music size={14} /> },
                { id: 'rain', name: 'Thamel Rain', icon: <CloudRain size={14} /> },
                { id: 'breeze', name: 'Himalayan Breeze', icon: <Flame size={14} /> }
              ].map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => changeSound(sound.id)}
                  className={`w-full text-left py-2 px-3 rounded-xl border-2 border-chiya-ink flex items-center gap-2 text-xs font-display font-bold transition-all cursor-pointer ${selectedSound === sound.id ? 'bg-chiya-orange text-white shadow-[2px_2px_0px_0px_var(--color-ink)]' : 'bg-white text-chiya-ink hover:bg-chiya-cream'}`}
                >
                  {sound.icon}
                  {sound.name}
                </button>
              ))}
            </div>

            {/* Volume & Play Controls */}
            <div className="flex items-center gap-3 border-t border-chiya-ink/10 pt-3">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-chiya-pink text-white border-2 border-chiya-ink flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_0px_var(--color-ink)] active:translate-y-0.5"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
              </button>

              <div className="flex-1 flex items-center gap-2">
                {volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1.5 bg-chiya-ink/10 rounded-lg appearance-none cursor-pointer accent-chiya-pink"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-chiya-yellow border-2 border-chiya-ink flex items-center justify-center shadow-pop hover:scale-105 active:scale-95 cursor-pointer text-chiya-ink transition-transform"
      >
        <Music size={20} className={isPlaying ? 'animate-spin' : ''} style={{ animationDuration: '6s' }} />
      </button>
    </div>
  )
}

export default AmbientSoundboard
