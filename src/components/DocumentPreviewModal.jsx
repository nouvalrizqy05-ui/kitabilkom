import { X, Download, FileText } from 'lucide-react'

export default function DocumentPreviewModal({ data, onClose, onDownload }) {
  if (!data) return null

  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div className="preview-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="preview-modal-header">
          <div className="preview-modal-title">
            <FileText size={20} />
            <h3>{data.title}</h3>
          </div>
          <div className="preview-modal-actions">
            <button className="preview-btn" onClick={() => onDownload(data.item)} title="Unduh File">
              <Download size={18} />
              <span className="preview-btn-text">Unduh</span>
            </button>
            <button className="preview-btn close" onClick={onClose} title="Tutup">
              <X size={24} />
            </button>
          </div>
        </div>
        
        {/* Viewer */}
        <div className="preview-modal-body">
          <iframe 
            src={data.url} 
            title={data.title}
            className="preview-iframe"
          />
        </div>
      </div>
    </div>
  )
}
