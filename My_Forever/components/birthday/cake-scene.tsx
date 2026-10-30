import Image from 'next/image'
import { CornerRightDown, Heart, Sparkle } from 'lucide-react'

export function CakeScene({ wished, cut, onCut }: { wished: boolean; cut: boolean; onCut: () => void }) {
  return (
    <div className="cake-composition">
      <div className="cake-note"><span>A little sweetness,</span><span>just for you.</span><CornerRightDown className="note-arrow" size={35} strokeWidth={1} aria-hidden="true" /></div>
      <div className="cake-photo" data-cut={cut}>
        <Image src="/images/birthday-cake.png" alt="Ariha’s lavender birthday cake with cherries and a striped candle" width={1024} height={1024} priority sizes="(max-width: 767px) 90vw, 46vw" />
        <svg className="cake-inscription" viewBox="0 0 300 82" aria-hidden="true">
          <defs>
            <path id="cake-inscription-arc" d="M 20 12 Q 150 82 280 12" />
          </defs>
          <text>
            <textPath href="#cake-inscription-arc" startOffset="50%" textAnchor="middle">HBD Ariha</textPath>
          </text>
        </svg>
        <span className="cake-cut-interior" aria-hidden="true" />
        <div className="cake-slice-piece" aria-hidden="true"><Image src="/images/birthday-cake.png" alt="" width={1024} height={1024} sizes="(max-width: 767px) 90vw, 46vw" /></div>
        {!wished && <span className="candle-flame" aria-hidden="true" />}
        {wished && <span className="candle-smoke" aria-hidden="true" />}
        {wished && !cut && <button type="button" className="cake-cut-target" onClick={onCut} aria-label="Tap to cut Ariha’s cake"><span className="sr-only">Cut your first slice</span></button>}
      </div>
      <Sparkle className="cake-sparkle sparkle-one" strokeWidth={1} aria-hidden="true" />
      <Sparkle className="cake-sparkle sparkle-two" strokeWidth={1} aria-hidden="true" />
      <div className="love-seal"><Heart size={16} strokeWidth={1.3} aria-hidden="true" /><span>Too sweet for the real world, so I made it here</span></div>
      <div className="cake-caption" aria-live="polite"><span className={wished ? 'status-dot wished' : 'status-dot'} />{cut ? 'A little slice of happiness, just for you.' : wished ? 'Your wish is made. Tap the cake to cut a slice.' : 'One candle. One special you. Endless possibilities.'}</div>
    </div>
  )
}
