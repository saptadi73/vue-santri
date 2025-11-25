<template>
  <div class="form-pertanggungjawaban-container">
    <!-- Header -->
    <div class="header-section">
      <button @click="goBack" class="btn-back">← Kembali</button>
      <div>
        <h1 class="page-title">Form Pertanggungjawaban Penggunaan Bantuan</h1>
        <p class="page-sub">Lengkapi data pertanggungjawaban penggunaan bantuan pesantren</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="form-content">
      <!-- Data Contract & Identitas -->
      <div class="form-section">
        <h3 class="section-title">📋 Data Kontrak & Identitas</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>No. Kontrak <span class="required">*</span></label>
            <input v-model="formData.noKontrak" required placeholder="Masukkan nomor kontrak" />
          </div>
          <div class="form-group">
            <label>Nama Pesantren <span class="required">*</span></label>
            <input v-model="formData.namaPesantren" required placeholder="Masukkan nama pesantren" />
          </div>
          <div class="form-group">
            <label>NIK Pengasuh <span class="required">*</span></label>
            <input v-model="formData.nik" required placeholder="Masukkan NIK pengasuh" maxlength="16" />
          </div>
          <div class="form-group">
            <label>Nama Pengasuh <span class="required">*</span></label>
            <input v-model="formData.namaPengasuh" required placeholder="Masukkan nama pengasuh" />
          </div>
        </div>
      </div>

      <!-- Data Keuangan -->
      <div class="form-section">
        <h3 class="section-title">💰 Data Keuangan</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Jumlah Pencairan (Rp) <span class="required">*</span></label>
            <input 
              v-model.number="formData.jumlahPencairan" 
              type="number" 
              required 
              placeholder="0"
              @input="calculatePengembalian"
            />
            <span class="input-hint">{{ formatCurrency(formData.jumlahPencairan) }}</span>
          </div>
          <div class="form-group">
            <label>Jumlah Pertanggungjawaban (Rp) <span class="required">*</span></label>
            <input 
              v-model.number="formData.jumlahPertanggungjawaban" 
              type="number" 
              required 
              placeholder="0"
              @input="calculatePengembalian"
            />
            <span class="input-hint">{{ formatCurrency(formData.jumlahPertanggungjawaban) }}</span>
          </div>
          <div class="form-group">
            <label>Jumlah Pengembalian (Rp)</label>
            <input 
              v-model.number="formData.jumlahPengembalian" 
              type="number" 
              readonly
              class="readonly-input"
            />
            <span class="input-hint" :class="{ 'text-red': formData.jumlahPengembalian > 0 }">
              {{ formatCurrency(formData.jumlahPengembalian) }}
            </span>
          </div>
          <div class="form-group">
            <label>Tanggal Pertanggungjawaban <span class="required">*</span></label>
            <input v-model="formData.tanggalPertanggungjawaban" type="date" required />
          </div>
        </div>
      </div>

      <!-- Upload Laporan Pertanggungjawaban -->
      <div class="form-section">
        <h3 class="section-title">📄 Laporan Pertanggungjawaban</h3>
        <div class="form-group full-width">
          <label class="file-upload-label" for="laporan-upload">
            <input 
              id="laporan-upload" 
              type="file" 
              accept=".pdf,.doc,.docx" 
              @change="handleLaporanUpload" 
              class="file-input" 
            />
            <span class="upload-area">
              📎 Klik untuk upload Laporan Pertanggungjawaban (PDF/DOC) — Max 10MB
            </span>
          </label>
          <div v-if="formData.laporanFile" class="file-preview">
            <div class="file-item">
              <span class="file-icon">📄</span>
              <span class="file-name">{{ formData.laporanFile.name }}</span>
              <span class="file-size">{{ formatFileSize(formData.laporanFile.size) }}</span>
              <button type="button" class="btn-remove" @click="removeLaporan">✕</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Upload Kwitansi (Multi File) -->
      <div class="form-section">
        <h3 class="section-title">🧾 Kwitansi Pengeluaran</h3>
        <div class="form-group full-width">
          <label class="file-upload-label" for="kwitansi-upload">
            <input 
              id="kwitansi-upload" 
              type="file" 
              multiple 
              accept=".pdf,.jpg,.jpeg,.png" 
              @change="handleKwitansiUpload" 
              class="file-input" 
            />
            <span class="upload-area">
              📎 Klik untuk upload Kwitansi (PDF/JPG/PNG) — Multi file, Max 5MB/file
            </span>
          </label>
          <div v-if="formData.kwitansiFiles.length" class="file-list">
            <div v-for="(file, idx) in formData.kwitansiFiles" :key="idx" class="file-item">
              <span class="file-icon">🧾</span>
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ formatFileSize(file.size) }}</span>
              <button type="button" class="btn-remove" @click="removeKwitansi(idx)">✕</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Upload Foto Kegiatan (Multi File) -->
      <div class="form-section">
        <h3 class="section-title">📷 Foto Kegiatan</h3>
        <div class="form-group full-width">
          <label class="file-upload-label" for="foto-upload">
            <input 
              id="foto-upload" 
              type="file" 
              multiple 
              accept="image/*" 
              @change="handleFotoUpload" 
              class="file-input" 
            />
            <span class="upload-area">
              📷 Klik untuk upload Foto Kegiatan (JPG/PNG) — Multi file, Max 3MB/file
            </span>
          </label>
          <div v-if="formData.fotoFiles.length" class="photo-grid">
            <div v-for="(foto, idx) in formData.fotoFiles" :key="idx" class="photo-item">
              <img :src="foto.preview" :alt="foto.name" class="photo-thumbnail" />
              <div class="photo-overlay">
                <span class="photo-name">{{ foto.name }}</span>
                <button type="button" class="btn-remove-photo" @click="removeFoto(idx)">✕</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Video Dokumentasi -->
      <div class="form-section">
        <h3 class="section-title">🎥 Video Dokumentasi Kegiatan</h3>
        <div class="form-group full-width">
          <label>URL YouTube Video</label>
          <input 
            v-model="formData.videoUrl" 
            placeholder="https://www.youtube.com/watch?v=..." 
          />
        </div>
        <div v-if="videoId" class="video-preview">
          <iframe 
            :src="`https://www.youtube.com/embed/${videoId}`" 
            frameborder="0" 
            allowfullscreen
          ></iframe>
        </div>
      </div>

      <!-- Catatan Tambahan -->
      <div class="form-section">
        <h3 class="section-title">📝 Catatan Tambahan</h3>
        <div class="form-group full-width">
          <label>Catatan/Keterangan</label>
          <textarea 
            v-model="formData.catatan" 
            rows="4" 
            placeholder="Masukkan catatan atau keterangan tambahan..."
          ></textarea>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="goBack">Batal</button>
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          <span v-if="isSubmitting">⏳ Menyimpan...</span>
          <span v-else>💾 Simpan Pertanggungjawaban</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isSubmitting = ref(false)

const formData = ref({
  noKontrak: '',
  namaPesantren: '',
  nik: '',
  namaPengasuh: '',
  jumlahPencairan: 0,
  jumlahPertanggungjawaban: 0,
  jumlahPengembalian: 0,
  tanggalPertanggungjawaban: '',
  laporanFile: null,
  kwitansiFiles: [],
  fotoFiles: [],
  videoUrl: '',
  catatan: ''
})

const videoId = computed(() => {
  if (!formData.value.videoUrl) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = formData.value.videoUrl.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
})

const goBack = () => router.push({ name: 'daftar_alokasi_santri' })

const calculatePengembalian = () => {
  const pencairan = formData.value.jumlahPencairan || 0
  const pertanggungjawaban = formData.value.jumlahPertanggungjawaban || 0
  formData.value.jumlahPengembalian = Math.max(0, pencairan - pertanggungjawaban)
}

const formatCurrency = (value) => {
  if (!value) return 'Rp 0'
  return 'Rp ' + value.toLocaleString('id-ID')
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const handleLaporanUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 10 * 1024 * 1024) {
    alert('Ukuran file maksimal 10MB')
    e.target.value = ''
    return
  }
  formData.value.laporanFile = file
  e.target.value = ''
}

const removeLaporan = () => {
  formData.value.laporanFile = null
}

const handleKwitansiUpload = (e) => {
  const files = Array.from(e.target.files || [])
  files.forEach(file => {
    if (file.size > 5 * 1024 * 1024) {
      alert(`${file.name} terlalu besar (max 5MB)`)
      return
    }
    formData.value.kwitansiFiles.push(file)
  })
  e.target.value = ''
}

const removeKwitansi = (idx) => {
  formData.value.kwitansiFiles.splice(idx, 1)
}

const handleFotoUpload = (e) => {
  const files = Array.from(e.target.files || [])
  files.forEach(file => {
    if (file.size > 3 * 1024 * 1024) {
      alert(`${file.name} terlalu besar (max 3MB)`)
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      formData.value.fotoFiles.push({
        name: file.name,
        size: file.size,
        file: file,
        preview: ev.target.result
      })
    }
    reader.readAsDataURL(file)
  })
  e.target.value = ''
}

const removeFoto = (idx) => {
  formData.value.fotoFiles.splice(idx, 1)
}

const handleSubmit = async () => {
  // Validasi
  if (!formData.value.laporanFile) {
    alert('Laporan Pertanggungjawaban harus diupload!')
    return
  }
  if (formData.value.kwitansiFiles.length === 0) {
    alert('Minimal upload 1 kwitansi!')
    return
  }

  isSubmitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Form Data:', formData.value)
    alert('Data pertanggungjawaban berhasil disimpan!')
    router.push({ name: 'daftar_alokasi_santri' })
  } catch (error) {
    alert('Gagal menyimpan data')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.form-pertanggungjawaban-container {
  width: 90vw;
  max-width: 1400px;
  margin: 28px auto;
  padding: 20px;
  box-sizing: border-box;
}

.header-section {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 18px;
}

.btn-back {
  background: #6b7280;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn-back:hover {
  background: #4b5563;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.page-sub {
  margin: 2px 0 0;
  color: #6b7280;
}

.form-content {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.06);
}

.form-section {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px dashed #e5e7eb;
}

.form-section:first-child {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  font-size: 13px;
  color: #374151;
}

.required {
  color: #ef4444;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.readonly-input {
  background: #f3f4f6;
  cursor: not-allowed;
}

.input-hint {
  font-size: 12px;
  color: #10b981;
  font-weight: 600;
}

.text-red {
  color: #ef4444;
}

.file-upload-label {
  display: block;
  cursor: pointer;
}

.upload-area {
  display: block;
  padding: 18px;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  text-align: center;
  background: #fafafa;
  color: #374151;
  font-weight: 600;
  transition: 0.15s;
}

.upload-area:hover {
  border-color: #3b82f6;
  background: #f0f7ff;
}

.file-input {
  display: none;
}

.file-preview,
.file-list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.file-icon {
  font-size: 24px;
}

.file-name {
  flex: 1;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
  padding: 4px 8px;
  background: #e5e7eb;
  border-radius: 6px;
}

.btn-remove,
.btn-remove-photo {
  background: #fee2e2;
  color: #b91c1c;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover,
.btn-remove-photo:hover {
  background: #fca5a5;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 14px;
  margin-top: 12px;
}

.photo-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.photo-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.photo-name {
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.video-preview {
  margin-top: 12px;
}

.video-preview iframe {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.btn {
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background: #3b82f6;
  color: #fff;
}

.btn-secondary {
  background: #6b7280;
  color: #fff;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .form-pertanggungjawaban-container {
    width: calc(100vw - 32px);
    padding: 16px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .video-preview iframe {
    height: 240px;
  }

  .photo-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}
</style>