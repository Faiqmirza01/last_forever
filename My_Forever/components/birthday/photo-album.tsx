'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpLeft, Heart, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { MemoryJournal } from './memory-journal'

function EnvelopeCover({ onOpen }: { onOpen: () => void }) {
  return <motion.section className="album-cover" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.65 }}>
    <Link href="/" className="scrapbook-floating-back"><ArrowUpLeft size={15} /> Back to the celebration</Link>
    <div className="cover-sparkle cover-sparkle-one"><Sparkles /></div><div className="cover-sparkle cover-sparkle-two"><Heart /></div>
    <div className="cover-decor cover-camera" aria-hidden="true"><span /></div><div className="cover-decor cover-rose"><i /><i /><i /></div>
    <button className="birthday-envelope" type="button" onClick={onOpen} aria-label="Open birthday envelope"><span className="birthday-card">Happy<br />Birthday</span><span className="envelope-flap" /><span className="envelope-heart">♡</span></button>
    <p className="click-hint">click me</p>
  </motion.section>
}

export function PhotoAlbum() { const [open, setOpen] = useState(false); return <main className="scrapbook-page"><AnimatePresence mode="wait">{!open ? <EnvelopeCover key="cover" onOpen={() => setOpen(true)} /> : <MemoryJournal key="blank" />}</AnimatePresence></main> }
