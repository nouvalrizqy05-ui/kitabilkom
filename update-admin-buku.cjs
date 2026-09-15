const fs = require('fs');

let adminJsx = fs.readFileSync('src/pages/admin/AdminBuku.jsx', 'utf8');

if (!adminJsx.includes('matakuliahData')) {
  adminJsx = adminJsx.replace(
    /import \{ supabase \} from '\.\.\/\.\.\/lib\/supabaseClient'/,
    "import { supabase } from '../../lib/supabaseClient'\nimport { MATAKULIAH_DATA } from '../../lib/matakuliahData'"
  );
}

const inputStr = `<input required value={form.mata_kuliah} onChange={(e) => setForm({ ...form, mata_kuliah: e.target.value })} />`;
const replacementStr = `<input 
                required 
                list="matkul-list"
                value={form.mata_kuliah} 
                onChange={(e) => setForm({ ...form, mata_kuliah: e.target.value })} 
                placeholder="Pilih atau ketik..."
              />
              <datalist id="matkul-list">
                {(MATAKULIAH_DATA[form.prodi]?.[form.semester] || []).map(mk => (
                  <option key={mk} value={mk} />
                ))}
              </datalist>`;

adminJsx = adminJsx.replace(inputStr, replacementStr);

fs.writeFileSync('src/pages/admin/AdminBuku.jsx', adminJsx, 'utf8');
console.log('AdminBuku.jsx updated with datalist for mata_kuliah.');
