import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

/**
 * Dropdown filter dengan checkbox.
 * Props:
 *   label        - Label tombol (misal "Kategori", "Bidang")
 *   options      - Array string opsi (tanpa "Semua")
 *   selected     - Array string opsi yang terpilih
 *   onChange     - callback(newSelected: string[])
 *   allLabel     - Label untuk "semua" (default: "Semua")
 */
export default function FilterDropdown({ label, options, selected, onChange, allLabel = 'Semua' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const allSelected = selected.length === 0 // kosong = semua

  const toggleOption = (opt) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(s => s !== opt))
    } else {
      onChange([...selected, opt])
    }
  }

  const selectAll = () => onChange([])

  const displayText = allSelected
    ? allLabel
    : selected.length === 1
      ? selected[0]
      : `${selected.length} dipilih`

  return (
    <div className="filter-dropdown" ref={ref}>
      <button
        type="button"
        className={`filter-dropdown-trigger${open ? ' open' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span className="filter-dropdown-label">{label}:</span>
        <span className="filter-dropdown-value">{displayText}</span>
        <ChevronDown size={16} className={`filter-dropdown-chevron${open ? ' rotated' : ''}`} />
      </button>

      {open && (
        <div className="filter-dropdown-menu">
          {/* Semua */}
          <label className="filter-dropdown-item" onClick={selectAll}>
            <span className={`filter-checkbox${allSelected ? ' checked' : ''}`}>
              {allSelected && <Check size={12} />}
            </span>
            <span>{allLabel}</span>
          </label>

          <div className="filter-dropdown-divider" />

          {options.map(opt => {
            const isChecked = selected.includes(opt)
            return (
              <label key={opt} className="filter-dropdown-item" onClick={() => toggleOption(opt)}>
                <span className={`filter-checkbox${isChecked ? ' checked' : ''}`}>
                  {isChecked && <Check size={12} />}
                </span>
                <span>{opt}</span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}
