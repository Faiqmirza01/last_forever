'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowLeft, ArrowUpRight, Heart, Pause, Play, SkipBack, SkipForward, X, ZoomIn } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import styles from './memory-journal.module.css'

const dimensions = [[1240, 1748], [1587, 2245], [1080, 1920], [1080, 1080], [1080, 1920], [2000, 1600], [1080, 1920]]

const memories = [
  { image: '/images/memory-01.png', title: 'A little wish, just for you.', subtitle: 'The beginning', note: 'May all the beautiful things you wish for find their way to you.', alt: 'Happy Birthday Arhu — a personal birthday wish with a portrait and flowers' },
  { image: '/images/memory-02.png', title: 'Meri pasandida aurat.', subtitle: 'A little poetry', note: 'Kuch log bas dil ke bohat qareeb hote hain.', alt: 'To my Pasandida aurat — a floral poem and portrait', audio: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/audio-3a1aRYr0pDhInux9WcmhUtQE6YwYmd.mp3' },
  { image: '/images/memory-03.png', title: 'The little things.', subtitle: 'A feeling, a song', note: 'Some moments say more than words ever could.', alt: 'A black and white playful photo collage', audio: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tum-Aankhon-Se-Batana-Hum-Samajh-Jaayenge-Dikshant-Hindi-Song-m2tyh0prJQiP679MT1Vpsvlq9FU3Jx.mp3' },
  { image: '/images/memory-04.png', title: 'My favourite kind of memory.', subtitle: 'Close to my heart', note: 'Not just a photograph. A feeling I want to keep.', alt: 'A romantic pink and ivory photo collage', audio: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/final_boss-nV9Zzbj0g0hsZnUpUKOGOtknFJiNTA.mp3' },
  { image: '/images/memory-05.png', title: 'Another year of you.', subtitle: 'Something to celebrate', note: 'And a thousand more reasons to smile.', alt: 'A warm brown and white birthday greeting', audio: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/audio2_final-DeLBzOyKRzlzPV6Qep7l2nxIBzQLJs.mp3' },
  { image: '/images/memory-06.png', title: 'If memories had a melody.', subtitle: 'On repeat', note: 'This is what the good moments sound like.', alt: 'A dark aesthetic photo collage', audio: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/audio3-3ZyGt1dtMvniG5vj9iJPrrzsSOJTSv.mp3' },
  { image: '/images/memory-07.jpeg', title: 'A few words. All my heart.', subtitle: 'One last little thing', note: 'For the things that are easier to write than to say.', alt: 'A personal letter on a vintage scrapbook page' },
]

function time(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00'
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
}

function MemorySong({ src, title }: { src: string; title: string }) {
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [position, setPosition] = useState(0)
  const [error, setError] = useState('')
  const seek = (value: number) => {
    if (!audio.current || !duration) return
    audio.current.currentTime = Math.max(0, Math.min(duration, value))
    setPosition(audio.current.currentTime)
  }
  async function toggle() {
    if (!audio.current) return
    if (!audio.current.paused) return audio.current.pause()
    setError('')
    try { await audio.current.play() } catch { setError('Could not play. Tap to try again.') }
  }
  return <div className={styles.song}>
    <audio ref={audio} src={src} preload="none" onLoadedMetadata={e => setDuration(e.currentTarget.duration)} onTimeUpdate={e => setPosition(e.currentTarget.currentTime)} onPause={() => setPlaying(false)} onPlay={e => {
      document.querySelectorAll<HTMLAudioElement>('[data-memory-journal] audio').forEach(other => { if (other !== e.currentTarget) other.pause() })
      setPlaying(true)
    }} onEnded={() => setPlaying(false)} onError={() => setError('Song unavailable. Please try again.')} />
    <div className={styles.songControls}>
      <button type="button" onClick={() => seek(position - 10)} aria-label={`Rewind ${title} 10 seconds`}><SkipBack size={16} /></button>
      <button type="button" className={styles.play} onClick={toggle} aria-label={`${playing ? 'Pause' : 'Play'} ${title}`}>{playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}</button>
      <button type="button" onClick={() => seek(position + 10)} aria-label={`Skip ${title} forward 10 seconds`}><SkipForward size={16} /></button>
      <input type="range" min={0} max={duration || 1} step={0.1} value={Math.min(position, duration || 1)} disabled={!duration} onChange={e => seek(Number(e.target.value))} aria-label={`Seek ${title}`} />
      <span className={styles.time}>{time(position)} / {time(duration)}</span>
    </div>
    {error && <p role="status" className={styles.error}>{error}</p>}
  </div>
}

export function MemoryJournal() {
  const reducedMotion = useReducedMotion()
  const dialog = useRef<HTMLDialogElement>(null)
  const [selected, setSelected] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const openImage = (index: number) => { setSelected(index); setZoomed(false); dialog.current?.showModal() }
  const photo = (index: number) => <button type="button" className={styles.artwork} onClick={() => openImage(index)} aria-label={`View ${memories[index].title} full size`}>
    <img src={memories[index].image} alt={memories[index].alt} width={dimensions[index][0]} height={dimensions[index][1]} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
    <span className={styles.enlarge}><ZoomIn size={14} /> A closer look</span>
  </button>

  return <section className={styles.journal} data-memory-journal id="journal-top">
    <nav className={styles.nav} aria-label="Album navigation"><Link href="/"><ArrowLeft size={15} /><span>Back to the celebration</span></Link><span className={styles.navNote}>A LITTLE KEEPSAKE, JUST FOR YOU <Heart size={12} /></span></nav>
    <header className={styles.hero}>
      <div className={styles.heroCopy}>
        <h1>For you,<br /><em>with love.</em></h1>
        <p className={styles.intro}>Some moments deserve more than a place in our camera roll. They deserve a little corner of forever.</p>
        <div className={styles.dedication}><Heart size={17} strokeWidth={1} /><span>For Arhu, on your special day.</span></div>
        <a href="#our-memories" className={styles.explore}>UNFOLD THE MEMORIES <ArrowDown size={16} /></a>
      </div>
      <div className={styles.heroArt}><span className={styles.tape} aria-hidden="true" />{photo(0)}<p className={styles.handwritten}>a little wish, a whole lot of love</p></div>
    </header>
    <div className={styles.memories} id="our-memories">
      {memories.slice(1).map((memory, offset) => {
        const index = offset + 1
        return <motion.article className={`${styles.memory} ${styles[`memory${index}`]}`} key={memory.image} initial={reducedMotion ? false : { opacity: 0, y: 32, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
          {(index === 3 || index === 6) && <div className={styles.memoryHeading}><span className={styles.eyebrow}>{memory.subtitle}</span><Heart size={13} strokeWidth={1} /></div>}
          <div className={styles.photoWrap}>{photo(index)}</div>
          <div className={styles.caption}>{index !== 1 && <h2>{memory.title}</h2>}<p>{index === 3 ? 'Not just a photograph.' : memory.note}</p></div>
          {memory.audio && <MemorySong src={memory.audio} title={memory.title} />}
        </motion.article>
      })}
    </div>
    <footer className={styles.footer}><Heart size={26} strokeWidth={1} /><p>Not just today.<br /><em>Always.</em></p><a href="#journal-top">Back to the beginning <ArrowUpRight size={15} /></a></footer>
    <dialog ref={dialog} className={styles.viewer} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close() }} aria-label={memories[selected].title}>
      <div className={styles.viewerToolbar}><span>{selected === 1 ? '' : memories[selected].title}</span><button type="button" onClick={() => setZoomed(!zoomed)} aria-label={zoomed ? 'Fit image to screen' : 'Zoom into image'}><ZoomIn size={20} /></button><button type="button" onClick={() => dialog.current?.close()} aria-label="Close image"><X size={22} /></button></div>
      <div className={styles.viewerScroll} data-zoomed={zoomed}><img src={memories[selected].image} alt={memories[selected].alt} /></div>
    </dialog>
  </section>
}
