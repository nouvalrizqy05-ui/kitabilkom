import { Loader2 } from 'lucide-react'

export default function Spinner({ size = 24, text = 'Memuat...', className = '' }) {
  return (
    <div className={`spinner-container ${className}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
      <Loader2 size={size} className="animate-spin" style={{ animation: 'spin 1s linear infinite', marginBottom: text ? '0.5rem' : '0' }} />
      {text && <p style={{ fontSize: '0.9rem' }}>{text}</p>}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
