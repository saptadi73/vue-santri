<template>
  <div class="form-pengajuan-container">
    <div class="header-section">
      <button @click="goBack" class="btn-back">← Kembali</button>
      <div>
        <h1 class="page-title">{{ isEditMode ? 'Edit' : 'Form' }} Pengajuan Pesantren</h1>
        <p class="page-sub">Lengkapi data pesantren, upload dokumen & foto, dan tambahkan catatan.</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="form-content">
      <div class="top-grid">
        <div class="photo-card">
          <div v-if="formData.fotoUrl" class="photo-display">
            <img :src="formData.fotoUrl" alt="Foto Pesantren" />
          </div>
          <div v-else class="photo-placeholder">
            <span class="placeholder-icon">🏛️</span>
            <p class="placeholder-text">Foto Pesantren</p>
          </div>
          <label class="upload-label" for="foto-upload">📷 Upload Foto</label>
          <input id="foto-upload" type="file" accept="image/*" @change="handlePhotoUpload" class="file-input" />
        </div>

        <div class="basic-card">
          <div class="form-row">
            <label>Nama Pesantren</label>
            <input v-model="formData.pesantren" required />
          </div>
          <div class="form-row">
            <label>Nama Pengasuh</label>
            <input v-model="formData.namaPengasuh" />
          </div>
          <div class="form-row">
            <label>No. HP Pengasuh</label>
            <input v-model="formData.hpPengasuh" />
          </div>
          <div class="form-row">
            <label>Alamat Pesantren</label>
            <textarea v-model="formData.alamatPesantren" rows="2"></textarea>
          </div>
          <div class="form-grid-mini compact">
            <div class="input-inline">
              <label>Jumlah Santri</label>
              <div class="input-with-unit">
                <input type="number" min="0" v-model.number="formData.jumlahSantri" class="small-input" />
                <span class="unit">org</span>
              </div>
            </div>
            <div class="input-inline">
              <label>Luas Area</label>
              <div class="input-with-unit">
                <input type="number" step="0.01" min="0" v-model.number="formData.luasArea" class="small-input" />
                <span class="unit">ha</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">Legalitas & Status</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Status IMB</label>
            <select v-model="formData.statusIMB">
              <option value="">-- pilih --</option>
              <option>Ada</option>
              <option>Dalam Pengajuan</option>
              <option>Tidak Ada</option>
            </select>
          </div>
          <div class="form-group">
            <label>Status Yayasan</label>
            <select v-model="formData.statusYayasan">
              <option value="">-- pilih --</option>
              <option>Ada</option>
              <option>Dalam Pengajuan</option>
              <option>Tidak Ada</option>
            </select>
          </div>
          <div class="form-group">
            <label>Status SLF</label>
            <select v-model="formData.statusSLF">
              <option value="">-- pilih --</option>
              <option>Ada</option>
              <option>Kadaluwarsa</option>
              <option>Tidak Ada</option>
              <option>Proses Pengajuan</option>
            </select>
          </div>
          <div class="form-group">
            <label>Status Pengajuan</label>
            <select v-model="formData.statusPengajuan">
              <option value="">-- pilih --</option>
              <option>Pendaftaran</option>
              <option>Verifikasi</option>
              <option>Proses Persetujuan</option>
              <option>Pencairan</option>
              <option>Ditolak</option>
            </select>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">Lokasi & Tanggal</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Latitude Pesantren</label>
            <input v-model="formData.gpsPesantrenLat" />
          </div>
            <div class="form-group">
            <label>Longitude Pesantren</label>
            <input v-model="formData.gpsPesantrenLng" />
          </div>
          <div class="form-group">
            <label>Tanggal Pengajuan</label>
            <input type="date" v-model="formData.tanggalPengajuan" />
          </div>
          <div class="form-group">
            <label>Ambil Lokasi</label>
            <button type="button" class="btn-gps" @click="getCurrentLocation('pesantren')">📍 Ambil Lokasi</button>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">Alasan & Catatan</h3>
        <div class="form-grid">
          <div class="form-group full-width">
            <label>Alasan Pengajuan</label>
            <textarea v-model="formData.alasan" rows="3"></textarea>
          </div>
          <div class="form-group full-width">
            <label>Catatan Petugas</label>
            <textarea v-model="formData.catatanPetugas" rows="2"></textarea>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">Dokumen Pendukung</h3>
        <div class="dokumen-wrapper">
          <div class="file-upload-block">
            <label class="file-upload-label" for="document-upload">
              <input id="document-upload" type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                     @change="handleDocumentUpload" class="file-input" />
              <span class="upload-area">📎 Klik untuk upload dokumen (PDF/DOC/JPG) — Max 5MB/file</span>
            </label>
          </div>
          <div v-if="formData.documents.length" class="document-list">
            <div v-for="(doc, idx) in formData.documents" :key="idx" class="document-item">
              <span class="doc-icon">📄</span>
              <span class="doc-name" :title="doc.name">{{ doc.name }}</span>
              <span class="doc-size">{{ formatFileSize(doc.size) }}</span>
              <button type="button" class="btn-remove-doc" @click="removeDocument(idx)">✕</button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">Video Dokumentasi (opsional)</h3>
        <div class="form-group full-width">
          <label>URL YouTube</label>
          <input v-model="formData.videoUrl" placeholder="https://www.youtube.com/watch?v=..." />
        </div>
        <div v-if="videoId" class="video-preview">
          <iframe :src="`https://www.youtube.com/embed/${videoId}`" frameborder="0" allowfullscreen></iframe>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="goBack">Batal</button>
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          <span v-if="isSubmitting">⏳ Menyimpan...</span>
          <span v-else>💾 {{ isEditMode ? 'Update Data' : 'Simpan Data' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const isEditMode = ref(false)
const isSubmitting = ref(false)

const formData = ref({
  pesantren: '',
  namaPengasuh: '',
  hpPengasuh: '',
  alamatPesantren: '',
  gpsPesantrenLat: '',
  gpsPesantrenLng: '',
  statusIMB: '',
  statusYayasan: '',
  statusSLF: '',
  jumlahSantri: null,
  luasArea: null,
  statusPengajuan: '',
  tanggalPengajuan: '',
  alasan: '',
  catatanPetugas: '',
  fotoUrl: '',
  documents: [],
  videoUrl: ''
})

const videoId = computed(() => {
  if (!formData.value.videoUrl) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = formData.value.videoUrl.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
})

const goBack = () => router.push({ name: 'daftar_pesantren' })

const handlePhotoUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) { alert('Ukuran foto maksimal 2MB'); return }
  const reader = new FileReader()
  reader.onload = ev => formData.value.fotoUrl = ev.target.result
  reader.readAsDataURL(file)
  e.target.value = ''
}

const handleDocumentUpload = (e) => {
  const files = Array.from(e.target.files || [])
  files.forEach(file => {
    if (file.size > 5 * 1024 * 1024) { alert(`${file.name} terlalu besar (max 5MB)`); return }
    formData.value.documents.push({ name: file.name, size: file.size, file })
  })
  e.target.value = ''
}
const removeDocument = (i) => formData.value.documents.splice(i, 1)
const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes','KB','MB','GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (Math.round(bytes / Math.pow(k,i) * 100) / 100) + ' ' + sizes[i]
}

const getCurrentLocation = (type) => {
  if (!navigator.geolocation) { alert('Geolocation tidak didukung'); return }
  navigator.geolocation.getCurrentPosition(pos => {
    if (type === 'pesantren') {
      formData.value.gpsPesantrenLat = pos.coords.latitude.toFixed(6)
      formData.value.gpsPesantrenLng = pos.coords.longitude.toFixed(6)
    }
    alert('Lokasi berhasil diambil')
  }, err => alert('Gagal mengambil lokasi: ' + err.message))
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    await new Promise(r => setTimeout(r, 900))
    console.log('Submitted', formData.value)
    alert(isEditMode.value ? 'Data berhasil diupdate' : 'Data berhasil disimpan')
    router.push({ name: 'daftar_pesantren' })
  } catch {
    alert('Gagal menyimpan data')
  } finally {
    isSubmitting.value = false
  }
}

const loadDataFromRoute = () => {
  const raw = route.params.data || route.query.data
  if (!raw) {
    formData.value.tanggalPengajuan = new Date().toISOString().split('T')[0]
    return
  }
  isEditMode.value = true
  let parsed = null
  const tries = [raw, decodeURIComponent(raw), decodeURIComponent(decodeURIComponent(raw))]
  for (const t of tries) { try { parsed = JSON.parse(t); break } catch {} }
  if (!parsed) return
  const map = {
    nama: 'pesantren',
    pengasuh: 'namaPengasuh',
    hpPengasuh: 'hpPengasuh',
    alamat: 'alamatPesantren',
    gpsLat: 'gpsPesantrenLat',
    gpsLng: 'gpsPesantrenLng'
  }
  Object.keys(parsed).forEach(k => {
    const target = map[k] || k
    if (target in formData.value) formData.value[target] = parsed[k]
  })
  if (!formData.value.tanggalPengajuan)
    formData.value.tanggalPengajuan = new Date().toISOString().split('T')[0]
}

onMounted(loadDataFromRoute)
</script>

<style scoped>
.form-pengajuan-container {
  width:80vw;
  max-width:1400px;
  min-width:900px;
  margin:28px auto;
  padding:20px;
  box-sizing:border-box;
}
.header-section { display:flex; gap:16px; align-items:center; margin-bottom:18px; }
.btn-back { background:#6b7280; color:#fff; border:none; padding:8px 14px; border-radius:8px; cursor:pointer; }
.page-title { margin:0; font-size:20px; font-weight:700; }
.page-sub { margin:2px 0 0; color:#6b7280; }

.form-content {
  width:100%; margin:0 auto; background:#fff; padding:24px;
  border-radius:12px; box-shadow:0 6px 18px rgba(2,6,23,0.06);
}

.top-grid { display:grid; grid-template-columns:300px 1fr; gap:28px; margin-bottom:18px; }

.photo-card {
  display:flex;
  flex-direction:column;
  gap:14px;
  padding:16px;
  background:#f8fafc;
  border:1px solid #e2e8f0;
  border-radius:14px;
}
.photo-display, .photo-placeholder {
  margin:0;
}
.upload-label {
  margin-top:6px;
}

.dokumen-wrapper {
  display:flex;
  flex-direction:column;
  gap:16px;
  padding:16px 18px;
  background:#f8fafc;
  border:1px solid #e2e8f0;
  border-radius:14px;
}
.file-upload-block {
  display:flex;
  flex-direction:column;
  gap:10px;
}
.upload-area {
  padding:18px;
  border:2px dashed #cbd5e1;
  background:#fff;
  border-radius:12px;
  transition:border-color .15s, background .15s;
}
.upload-area:hover {
  border-color:#2563eb;
  background:#f0f7ff;
}

.document-list {
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
  gap:12px 14px;
  margin-top:4px;
}
.document-item {
  display:grid;
  grid-template-columns: 28px 1fr auto 34px;
  align-items:center;
  gap:8px;
  background:#fff;
  padding:10px 12px;
  border:1px solid #e2e8f0;
  border-radius:12px;
  font-size:13px;
  min-height:54px;
  box-shadow:0 2px 4px rgba(0,0,0,0.04);
}
.doc-icon {
  font-size:20px;
  opacity:.75;
}
.doc-name {
  font-weight:600;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.doc-size {
  font-size:11px;
  font-weight:600;
  color:#64748b;
  padding:4px 8px;
  background:#f1f5f9;
  border-radius:8px;
}
.btn-remove-doc {
  background:#fee2e2;
  color:#b91c1c;
  border:none;
  width:30px;
  height:30px;
  border-radius:8px;
  cursor:pointer;
  font-weight:700;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:14px;
  transition:.15s;
}
.btn-remove-doc:hover {
  background:#fca5a5;
}

@media (max-width:980px) {
  .document-list { grid-template-columns:1fr; }
  .photo-card { padding:14px; }
  .dokumen-wrapper { padding:14px 16px; }
}
@media (max-width:900px) {
  .form-grid { grid-template-columns:1fr; }
  .video-preview iframe { height:240px; }
  .photo-display, .photo-placeholder { aspect-ratio:16/9; }
}
@media (min-width:1200px) {
  .top-grid { grid-template-columns:300px 1fr 300px; }
  .photo-display, .photo-placeholder { height:auto; }
}
</style>