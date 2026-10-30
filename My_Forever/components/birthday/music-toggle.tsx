'use client'

import { useEffect, useRef, useState } from 'react'
import { Music2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MusicToggle() {
  const [playing, setPlaying] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const audio = useRef<AudioContext | null>(null)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current)
    void audio.current?.close()
  }, [])

  async function toggle() {
    if (playing) {
      if (timer.current) clearInterval(timer.current)
      await audio.current?.close()
      audio.current = null
      setPlaying(false)
      return
    }
    try {
      const context = audio.current ?? new AudioContext()
      audio.current = context
      await context.resume()
      const notes = [261.63, 261.63, 293.66, 261.63, 349.23, 329.63, 261.63, 261.63, 293.66, 261.63, 392, 349.23, 261.63, 261.63, 523.25, 440, 349.23, 329.63, 293.66, 466.16, 466.16, 440, 349.23, 392, 349.23]
      const beats = [0.75, 0.25, 1, 1, 1, 2, 0.75, 0.25, 1, 1, 1, 2, 0.75, 0.25, 1, 1, 1, 1, 2, 0.75, 0.25, 1, 1, 1, 2]
      const playMelody = () => {
        let start = context.currentTime + 0.1
        notes.forEach((frequency, index) => {
          const oscillator = context.createOscillator()
          const gain = context.createGain()
          oscillator.type = 'sine'
          oscillator.frequency.value = frequency * 2
          gain.gain.setValueAtTime(0, start)
          gain.gain.linearRampToValueAtTime(0.075, start + 0.015)
          gain.gain.exponentialRampToValueAtTime(0.001, start + beats[index] * 0.46)
          oscillator.connect(gain)
          gain.connect(context.destination)
          oscillator.start(start)
          oscillator.stop(start + beats[index] * 0.5)
          oscillator.onended = () => { oscillator.disconnect(); gain.disconnect() }
          start += beats[index] * 0.5
        })
      }
      playMelody()
      timer.current = setInterval(playMelody, 20500)
      setPlaying(true)
    } catch {
      setUnavailable(true)
    }
  }

  return <Button variant="outline" className="h-10 rounded-full px-4" aria-pressed={playing} onClick={toggle} disabled={unavailable}>
    {playing ? <Music2 data-icon="inline-start" /> : <VolumeX data-icon="inline-start" />}
    {unavailable ? 'Sound unavailable' : playing ? 'Sound on' : 'Sound off'}
  </Button>
}
