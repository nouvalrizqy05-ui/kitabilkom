import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function BackButton({ light = false, to }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (to) {
      navigate(to)
    } else {
      // safe fallback if no history
      if (window.history?.length <= 1) {
        navigate('/')
      } else {
        navigate(-1)
      }
    }
  }

  return (
    <button
      className={light ? "back-btn-page-light" : "back-btn-page"}
      onClick={handleClick}
      aria-label="Kembali"
    >
      <ArrowLeft size={18} />
      <span className="back-btn-text">Kembali</span>
    </button>
  )
}
