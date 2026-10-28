import { useRef } from 'react'
import { Briefcase, Fingerprint, Mail } from 'lucide-react'

// 3D tilt using pure CSS + vanilla JS mouse events — no framer-motion
export default function DosenCard({ dosen }) {
  const ref = useRef(null)

  const handleMouseMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20
    el.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`
  }

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = 'rotateX(0deg) rotateY(0deg)'
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d', transition: 'transform 0.15s ease-out' }}
      className="dosen-card-wrapper"
    >
      <div className="dosen-unnes-logo-wrap">
        <img src="/assets/unnes-logo.webp" alt="unnes" />
      </div>

      <div className="dosen-watermark">UNNES</div>

      <img
        src={dosen.foto_url || '/assets/dosen-placeholder.png'}
        alt={dosen.nama}
        loading="lazy"
        className="dosen-photo-main"
      />

      <div
        style={{ transformStyle: 'preserve-3d', transform: 'translateZ(75px)' }}
        className="dosen-glass-panel"
      >
        <div
          style={{ transform: 'translateZ(85px)', transformStyle: 'preserve-3d' }}
          className="dosen-prodi-float"
        >
          {dosen.prodi}
        </div>

        <div className="dosen-info-content">
          <div className="dosen-name-bold">{dosen.nama}</div>

          <div className="dosen-info-row">
            <Mail size={18} />
            <p>{dosen.email || 'N/A'}</p>
          </div>

          <div className="dosen-info-row">
            <Briefcase size={18} />
            <p>{dosen.jabatan}</p>
          </div>

          <div className="dosen-info-row">
            <Fingerprint size={18} />
            <p>{dosen.nip}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
