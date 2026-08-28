import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function BackButton({ light = false }) {
  const navigate = useNavigate()

  return (
    <button
      className={light ? "back-btn-page-light" : "back-btn-page"}
      onClick={() => navigate(-1)}
      aria-label="Kembali"
    >
      <ArrowLeft size={18} />
      <span className="back-btn-text">Kembali</span>
    </button>
  )
}
