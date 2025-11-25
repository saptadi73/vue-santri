<template>
  <div class="form-shell">
    <header class="form-head">
      <h2>{{ isEdit ? 'Edit' : 'Input' }} Verifikasi Pesantren</h2>
      <div class="head-actions">
        <button @click="goBack">← Kembali</button>
        <button class="primary" :disabled="!isValid" @click="submit">Simpan</button>
      </div>
    </header>

    <form @submit.prevent="submit" class="form-grid">
      <!-- Data Pengajuan -->
      <fieldset class="block">
        <legend>Data Pengajuan</legend>
        <div class="grid-2">
          <label>
            <span>No. Pengajuan</span>
            <input v-model="form.noPengajuan" :readonly="isEdit" required />
          </label>
          <label>
            <span>Nama Pesantren</span>
            <input v-model="form.namaPesantren" required />
          </label>
          <label>
            <span>Pengasuh Pesantren</span>
            <input v-model="form.pengasuhPesantren" required />
          </label>
          <label>
            <span>HP Pengasuh</span>
            <input v-model="form.hpPengasuh" required />
          </label>
          <label class="full">
            <span>Catatan Pengajuan dari Pengasuh</span>
            <textarea v-model="form.catatanPengasuh" rows="3" />
          </label>
        </div>
      </fieldset>

      <!-- Petugas & Status -->
      <fieldset class="block">
        <legend>Petugas & Status</legend>
        <div class="grid-2">
          <label>
            <span>Nama Petugas Verifikasi</span>
            <input v-model="form.namaPetugas" required />
          </label>
          <label>
            <span>HP Petugas Verifikasi</span>
            <input v-model="form.hpPetugas" required />
          </label>
          <label>
            <span>Kedinasan</span>
            <select v-model="form.kedinasan" required>
              <option value="">-- Pilih --</option>
              <option>Dinsos</option>
              <option>KUA</option>
              <option>Dinas Pekerjaan Umum</option>
              <option>Dinas Perkimtan</option>
              <option>Bazis</option>
              <option>Swasta</option>
            </select>
          </label>
          <label>
            <span>Status Verifikasi</span>
            <select v-model="form.statusVerifikasi" required>
              <option value="">-- Pilih --</option>
              <option>Selesai</option>
              <option>Proses Pelengkapan Dokumen</option>
              <option>Proses Pelaporan</option>
            </select>
          </label>
          <label class="full">
            <span>Catatan Petugas Verifikasi</span>
            <textarea v-model="form.catatanPetugas" rows="3" />
          </label>
        </div>
      </fieldset>

      <!-- Dokumen & Foto -->
      <fieldset class="block">
        <legend>Dokumen & Foto Verifikasi</legend>
        <div class="grid-2">
          <div class="upload-box full">
            <span>Upload Multi Dokumen (PDF/Doc)</span>
            <input type="file" multiple @change="handleDocs" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" />
            <ul class="file-list" v-if="form.dokumen.length">
              <li v-for="(f,i) in form.dokumen" :key="i">
                {{ f.name }}
                <button type="button" @click="removeDoc(i)">✕</button>
              </li>
            </ul>
          </div>
          <div class="upload-box full">
            <span>Upload Multi Foto</span>
            <input type="file" multiple @change="handleFotos" accept="image/*" />
            <div class="foto-grid" v-if="form.foto.length">
              <div v-for="(f,i) in form.foto" :key="i" class="foto-item">
                <img :src="previewMap.get(f)" />
                <button type="button" @click="removeFoto(i)">✕</button>
              </div>
            </div>
          </div>
        </div>
      </fieldset>

      <!-- Media & Lokasi -->
      <fieldset class="block">
        <legend>Media & Lokasi Verifikasi</legend>
        <div class="grid-2">
          <label class="full">
            <span>URL Video YouTube</span>
            <input v-model="form.videoUrl" placeholder="https://www.youtube.com/watch?v=..." />
          </label>
          <div class="video-preview full" v-if="youtubeId">
            <iframe
              :src="`https://www.youtube.com/embed/${youtubeId}`"
              allowfullscreen
            ></iframe>
          </div>
          <div class="loc-row full">
            <div class="loc-fields">
              <label>
                <span>Latitude</span>
                <input v-model="form.gpsLat" readonly />
              </label>
              <label>
                <span>Longitude</span>
                <input v-model="form.gpsLng" readonly />
              </label>
            </div>
            <button type="button" class="primary" @click="getLocation">Ambil Lokasi GPS</button>
          </div>
          <div v-if="locationError" class="loc-error full">{{ locationError }}</div>
        </div>
      </fieldset>

      <!-- Actions bottom -->
      <div class="form-actions">
        <button type="button" @click="goBack">Batal</button>
        <button type="submit" class="primary" :disabled="!isValid">Simpan</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isEdit = ref(false)
const locationError = ref('')
const previewMap = new Map()

const form = reactive({
  noPengajuan: '',
  namaPesantren: '',
  pengasuhPesantren: '',
  hpPengasuh: '',
  namaPetugas: '',
  hpPetugas: '',
  kedinasan: '',
  statusVerifikasi: '',
  catatanPetugas: '',
  catatanPengasuh: '',
  dokumen: [],
  foto: [],
  videoUrl: '',
  gpsLat: '',
  gpsLng: ''
})

onMounted(() => {
  const raw = route.params.data
  if (raw) {
    try {
      const parsed = JSON.parse(decodeURIComponent(raw))
      Object.assign(form, parsed)
      isEdit.value = true
    } catch {}
  }
})

const youtubeId = computed(() => {
  if (!form.videoUrl) return ''
  const m = form.videoUrl.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/)
  return m ? m[1] : ''
})

const isValid = computed(() =>
  form.noPengajuan &&
  form.namaPesantren &&
  form.pengasuhPesantren &&
  form.hpPengasuh &&
  form.namaPetugas &&
  form.hpPetugas &&
  form.kedinasan &&
  form.statusVerifikasi
)

function handleDocs(e) {
  form.dokumen = Array.from(e.target.files)
}
function removeDoc(i) {
  form.dokumen.splice(i,1)
}

function handleFotos(e) {
  form.foto = Array.from(e.target.files)
  previewMap.clear()
  form.foto.forEach(f => {
    const url = URL.createObjectURL(f)
    previewMap.set(f,url)
  })
}
function removeFoto(i) {
  const f = form.foto[i]
  const url = previewMap.get(f)
  if (url) URL.revokeObjectURL(url)
  previewMap.delete(f)
  form.foto.splice(i,1)
}

function getLocation() {
  locationError.value = ''
  if (!navigator.geolocation) {
    locationError.value = 'Geolocation tidak didukung.'
    return
  }
  navigator.geolocation.getCurrentPosition(
    pos => {
      form.gpsLat = pos.coords.latitude.toFixed(6)
      form.gpsLng = pos.coords.longitude.toFixed(6)
    },
    err => {
      locationError.value = 'Gagal ambil lokasi: ' + err.message
    },
    { enableHighAccuracy: true, timeout: 10000 }
  )
}

function submit() {
  if (!isValid.value) return
  // Simpan (mock)
  console.log('DATA VERIFIKASI:', { ...form })
  alert('Data tersimpan.')
  goBack()
}

function goBack() {
  router.push({ name: 'daftar_verifikasi_pesantren' })
}
</script>

<style scoped>
.form-shell {
  width:95vw;
  max-width:1200px;
  margin:26px auto;
  background:#fff;
  padding:22px 26px 34px;
  border-radius:18px;
  box-shadow:0 10px 30px rgba(0,0,0,0.07);
  box-sizing:border-box;
  font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;
}
.form-head {
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:18px;
  flex-wrap:wrap;
  gap:14px;
}
.form-head h2 {
  margin:0;
  font-size:30px;
  font-weight:800;
  background:linear-gradient(90deg,#1e3a8a,#2563eb,#1d4ed8);
  background-clip:text;              /* tambahan agar linter tidak error */
  -webkit-background-clip:text;
  color:transparent;
  letter-spacing:.7px;
}
.head-actions {
  display:flex;
  gap:10px;
}
.head-actions button {
  background:#e2e8f0;
  border:none;
  padding:10px 16px;
  border-radius:10px;
  font-weight:600;
  cursor:pointer;
}
.head-actions button.primary {
  background:#2563eb;
  color:#fff;
}
.head-actions button:hover { background:#cbd5e1; }
.head-actions button.primary:hover { background:#1d4ed8; }

.form-grid {
  display:flex;
  flex-direction:column;
  gap:28px;
}
.block {
  border:1px solid #e2e8f0;
  border-radius:16px;
  padding:18px 20px 16px;
  background:#f8fafc;
}
.block legend {
  font-weight:700;
  font-size:14px;
  letter-spacing:.6px;
  color:#334155;
  padding:0 6px;
}
.grid-2 {
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
  gap:16px 20px;
  margin-top:14px;
}
label {
  display:flex;
  flex-direction:column;
  gap:6px;
  font-size:13px;
  font-weight:600;
  letter-spacing:.4px;
  color:#475569;
}
label.full { grid-column:1/-1; }
input, select, textarea {
  border:1px solid #cbd5e1;
  background:#fff;
  border-radius:10px;
  padding:10px 12px;
  font-size:14px;
  font-family:inherit;
  resize:vertical;
}
input:focus, select:focus, textarea:focus {
  outline:2px solid #2563eb33;
}
.upload-box span {
  display:block;
  font-size:12px;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.7px;
  color:#64748b;
  margin-bottom:6px;
}
.file-list {
  list-style:none;
  margin:10px 0 0;
  padding:0;
  display:flex;
  flex-direction:column;
  gap:6px;
}
.file-list li {
  background:#fff;
  border:1px solid #e2e8f0;
  padding:8px 10px;
  border-radius:10px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  font-size:13px;
}
.file-list li button {
  background:#ef4444;
  color:#fff;
  border:none;
  width:28px;
  height:28px;
  border-radius:8px;
  cursor:pointer;
  font-weight:700;
}
.file-list li button:hover { background:#dc2626; }

.foto-grid {
  margin-top:10px;
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(110px,1fr));
  gap:10px;
}
.foto-item {
  position:relative;
  border:1px solid #e2e8f0;
  border-radius:12px;
  overflow:hidden;
  background:#fff;
  aspect-ratio:1/1;
  display:flex;
  align-items:center;
  justify-content:center;
}
.foto-item img {
  width:100%;
  height:100%;
  object-fit:cover;
}
.foto-item button {
  position:absolute;
  top:6px;
  right:6px;
  background:rgba(0,0,0,0.55);
  color:#fff;
  border:none;
  width:28px;
  height:28px;
  border-radius:8px;
  cursor:pointer;
  font-size:13px;
}
.foto-item button:hover { background:rgba(0,0,0,0.75); }

.video-preview iframe {
  width:100%;
  height:340px;
  border:none;
  border-radius:14px;
  background:#000;
}

.loc-row {
  display:flex;
  flex-direction:column;
  gap:14px;
}
.loc-fields {
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(180px,1fr));
  gap:14px;
}
.loc-error {
  color:#dc2626;
  font-size:12.5px;
  font-weight:600;
}

.form-actions {
  display:flex;
  justify-content:flex-end;
  gap:14px;
  margin-top:6px;
}
.form-actions button {
  background:#e2e8f0;
  border:none;
  padding:12px 20px;
  border-radius:12px;
  font-weight:600;
  cursor:pointer;
  font-size:14px;
}
.form-actions button.primary {
  background:#2563eb;
  color:#fff;
}
.form-actions button:hover { background:#cbd5e1; }
.form-actions button.primary:hover { background:#1d4ed8; }

@media (max-width: 900px) {
  .form-shell { padding:18px 16px 28px; width:100vw; border-radius:0; }
  .form-head h2 { font-size:24px; }
  .video-preview iframe { height:240px; }
}
</style>