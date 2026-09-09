import { useRef } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from 'framer-motion'
import { Briefcase, Fingerprint, Mail } from 'lucide-react'

const ROTATION_RANGE = 32.5
const HALF_ROTATION_RANGE = 32.5 / 2

export default function DosenCard({ dosen }) {
  const ref = useRef(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const xSpring = useSpring(x)
  const ySpring = useSpring(y)

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE
    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1
    const rY = mouseX / width - HALF_ROTATION_RANGE
    x.set(rX)
    y.set(rY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        transform,
      }}
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

      <motion.div
        style={{
          transformStyle: 'preserve-3d',
          transform: 'translateZ(75px)',
        }}
        className="dosen-glass-panel"
      >
        <div
          style={{
            transform: 'translateZ(85px)',
            transformStyle: 'preserve-3d',
          }}
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
      </motion.div>
    </motion.div>
  )
}
