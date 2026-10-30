'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowDown, ArrowUpRight, CakeSlice, Check, Heart, Images, Mail, RotateCcw, Sparkles, Wind, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CakeScene } from './cake-scene'
import { MusicToggle } from './music-toggle'

export function BirthdayExperience() {
  const [wished, setWished] = useState(false)
  const router = useRouter()
  const [cut, setCut] = useState(false)
  const [noteRead, setNoteRead] = useState(false)
  const [noteType, setNoteType] = useState<'surprise' | 'personal'>('surprise')
  const [albumOpened, setAlbumOpened] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [celebration, setCelebration] = useState(0)
  const letter = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    setAlbumOpened(sessionStorage.getItem('birthday-album-opened') === 'true')
  }, [])

  function celebrate() {
    setCelebration((value) => value + 1)
    setConfetti(true)
  }

  function makeWish() {
    setWished(true)
    celebrate()
  }

  function cutCake() {
    if (!wished || cut) return
    setCut(true)
    celebrate()
  }

  function nextMoment() {
    if (!wished) makeWish()
    else if (!cut) cutCake()
    else if (!noteRead) {
      setNoteType('surprise')
      letter.current?.showModal()
    } else {
      celebrate()
      sessionStorage.setItem('birthday-album-opened', 'true')
      setAlbumOpened(true)
      router.push('/album')
    }
  }

  function closeLetter() {
    if (noteType === 'surprise') setNoteRead(true)
    letter.current?.close()
  }

  return (
    <div className="birthday-page">
      <header className="site-header">
        <a href="#" className="wordmark" aria-label="Just for you, home"><span className="brand-mark"><Sparkles size={21} strokeWidth={1.4} /></span>just for you<span className="wordmark-dot">.</span></a>
        <span className="header-note">A LITTLE CELEBRATION. A LOT OF LOVE.</span>
        <MusicToggle />
      </header>

      <main id="main-content">
        <section className="birthday-hero" aria-labelledby="birthday-title">
          <div className="hero-copy">
            <div className="eyebrow"><span />TODAY IS A LITTLE MORE SPECIAL</div>
            <h1 id="birthday-title">Happy Birthday,<br /><em className="birthday-name">Ariha.</em><Sparkles className="heading-sparkle" aria-hidden="true" strokeWidth={1} /></h1>
            <p className="hero-description">Here&apos;s to you. To your beautiful heart, your big dreams,<br className="desktop-break" /> and all the little things that make you, <em>you.</em></p>
            <p className="birthday-dedication">Ariha, the world is a little brighter with you in it.</p>
            <div className="wish-actions">
              <Button size="lg" onClick={nextMoment} className="h-13 rounded-full px-7">
                {noteRead ? <Images data-icon="inline-start" /> : cut ? <Mail data-icon="inline-start" /> : wished ? <CakeSlice data-icon="inline-start" /> : <Wind data-icon="inline-start" />}
                {noteRead ? 'Moments We Keep forever' : cut ? 'Your next surprise' : wished ? 'Cut your birthday cake' : 'Make a wish & blow the candle'}
                <ArrowUpRight data-icon="inline-end" />
              </Button>
              {wished && !cut && <span className="action-hint" aria-live="polite">Wish made. Now tap the cake or the button for your first slice.</span>}
            </div>
            <div className="personal-note"><span className="little-heart"><Heart size={16} strokeWidth={1.5} /></span><span>No ordinary day. No ordinary you.</span></div>
          </div>
          <CakeScene wished={wished} cut={cut} onCut={cutCake} />
        </section>

        <section className="birthday-ritual" aria-label="Your birthday ritual">
          <div className="ritual-intro"><span className="eyebrow">YOUR BIRTHDAY RITUAL</span><p>A moment, just for you.</p></div>
          <div className="ritual-step"><span className="step-number">01</span><div><h2>Pause a little</h2><p>Take a breath. This is your day.</p></div></div>
          <div className="ritual-step"><span className="step-number">{wished ? <Check size={17} /> : '02'}</span><div><h2>Make a wish</h2><p>{wished ? 'Your wish is out in the universe.' : 'The kind you keep close to your heart.'}</p></div></div>
          <div className="ritual-step"><span className="step-number">{cut ? <Check size={17} /> : '03'}</span><div><h2>A slice of happiness</h2><p>{cut ? 'Made sweeter because it is yours.' : 'Blow the candle, then cut your cake.'}</p></div></div>
          <div className="ritual-step"><span className="step-number">{albumOpened ? <Check size={17} /> : '04'}</span><div><h2>Moments We Keep</h2><p>{albumOpened ? 'A few memories, held close.' : 'A little collection of beautiful moments.'}</p></div></div>
        </section>

        <section className="wish-strip" aria-label="A birthday wish">
          <Sparkles size={20} strokeWidth={1.2} aria-hidden="true" />
          <p>A new chapter. More laughter. <em>Endless possibilities.</em></p>
          <button className="letter-link" onClick={() => { setNoteType('personal'); letter.current?.showModal() }}>A little note for you <ArrowUpRight size={15} /></button>
        </section>
      </main>

      <footer className="site-footer"><span>MADE WITH LOVE, JUST FOR YOU</span><Heart size={13} strokeWidth={1.3} aria-hidden="true" />{wished ? <button onClick={() => { setWished(false); setCut(false); setConfetti(false) }}><RotateCcw size={12} /> Make another wish</button> : <span>A DAY WORTH CELEBRATING</span>}</footer>

      {confetti && <div key={celebration} className="confetti-layer" aria-hidden="true" onAnimationEnd={(event) => { if (event.target === event.currentTarget) setConfetti(false) }}>{Array.from({ length: 52 }, (_, index) => <span key={index} style={{ '--x': `${(index * 37) % 100}%`, '--delay': `${(index % 8) * 0.13}s`, '--rotation': `${index * 31}deg`, '--drift': `${(index % 2 ? 1 : -1) * (30 + index % 90)}px`, '--confetti-color': ['#907a9e', '#a45369', '#d4b780', '#cbbbd6'][index % 4] } as CSSProperties} />)}</div>}

      <dialog ref={letter} aria-label="A birthday note just for you" className="birthday-letter" onClose={() => { if (noteType === 'surprise') setNoteRead(true) }} onClick={(event) => { if (event.target === event.currentTarget) closeLetter() }}>
        <div className="letter-content"><Button variant="ghost" size="icon" className="letter-close" aria-label="Close birthday note" onClick={closeLetter}><X /></Button><span className="letter-icon"><Heart size={27} strokeWidth={1.2} /></span><span className="eyebrow">A LITTLE NOTE, FROM THE HEART</span>{noteType === 'surprise' ? <><h2>Dear Ariha,<br /><em>you are a gift.</em></h2><p>May this next chapter bring you the kind of happiness that stays. The quiet wins, the loud laughter, the people who feel like home.</p><p>Keep being wonderfully, unapologetically you. The world is better for it.</p><span className="letter-signature">With all the love, always.</span></> : <><h2>You are my universe.</h2><p>I don&apos;t know how to tell you that I love you, perhaps because three words could never justify exactly how I feel for you. So, maybe four words can describe how I feel a little more accurately: you are my universe.</p><p>The dictionary says that the universe is all of space, and time and their contents. So in other words, the universe is everything. You are my everything.</p><p>When you look up at the stars, can you imagine their end? I imagine constellations after constellation, galaxies after galaxies—I cannot picture the sky ever coming to a point where the stars cease to exist and there is a sudden wall of infinite blackness. I imagine the stars going on forever. My love for you is the same. It continues on, and on, and on.</p><p>When I tell you that you are my universe, I am not saying that everything will always be perfect. Even the brightest stars fall from the sky. Some explode, some burn out. But amidst all of our explosions, and shortcomings, and falling outs, I will still love you. Because out of all the things that fail in this life, love never does.</p><p>You are my universe. But even those four words do not unravel my love for you; I&apos;m not sure if anything ever will.</p></>}<Button className="mt-7 h-11 rounded-full px-6" onClick={closeLetter}>Back to the celebration <ArrowDown data-icon="inline-end" /></Button></div>
      </dialog>
    </div>
  )
}
