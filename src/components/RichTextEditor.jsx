export default function RichTextEditor({ value, onChange, placeholder }) {
  return (
    <div className="rich-text-editor-container" style={{ marginBottom: '1rem' }}>
      <textarea
        className="rte-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Tulis isi konten di sini...'}
        style={{ width: '100%', minHeight: '250px', padding: '1rem', borderRadius: '4px', fontFamily: 'inherit' }}
      />
    </div>
  )
}
