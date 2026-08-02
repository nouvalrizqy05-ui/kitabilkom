import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function RichTextEditor({ value, onChange, placeholder }) {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  }

  return (
    <div className="rich-text-editor-container" style={{ marginBottom: '1rem', background: 'white' }}>
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange} 
        modules={modules}
        placeholder={placeholder || 'Tulis isi konten di sini...'}
        style={{ minHeight: '250px' }}
      />
    </div>
  )
}
