<template>
  <div class="form-pertanggungjawaban-container">
    <!-- Header -->
    <div class="header-section">
      <button @click="goBack" class="btn-back">← Kembali</button>
      <div>
        <h1 class="page-title">Form Pertanggungjawaban Bantuan Santri</h1>
        <p class="page-sub">Lengkapi data pertanggungjawaban bantuan yang diterima santri</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="form-content">
      <!-- Data Identitas Santri -->
      <div class="form-section">
        <h3 class="section-title">👤 Data Identitas Santri</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Nama Lengkap Santri <span class="required">*</span></label>
            <input v-model="formData.namaSantri" required placeholder="Masukkan nama lengkap santri" />
          </div>
          <div class="form-group">
            <label>NIK Santri <span class="required">*</span></label>
            <input 
              v-model="formData.nikSantri" 
              required 
              placeholder="Masukkan NIK santri" 
              maxlength="16"
              pattern="[0-9]{16}"
              title="NIK harus 16 digit angka"
            />
          </div>
          <div class="form-group">
            <label>Tempat Lahir <span class="required">*</span></label>
            <input v-model="formData.tempatLahir" required placeholder="Masukkan tempat lahir" />
          </div>
          <div class="form-group">
            <label>Tanggal Lahir <span class="required">*</span></label>
            <input v-model="formData.tanggalLahir" type="date" required />
          </div>
          <div class="form-group">
            <label>Jenis Kelamin <span class="required">*</span></label>
            <select v-model="formData.jenisKelamin" required>
              <option value="">Pilih Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <div class="form-group">
            <label>Nama Pesantren <span class="required">*</span></label>
            <input v-model="formData.namaPesantren" required placeholder="Masukkan nama pesantren" />
          </div>
          <div class="form-group full-width">
            <label>Alamat Lengkap <span class="required">*</span></label>
            <textarea 
              v-model="formData.alamat" 
              required 
              rows="2" 
              placeholder="Masukkan alamat lengkap santri..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Data Bantuan -->
      <div class="form-section">
        <h3 class="section-title">💰 Data Bantuan</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>No. Kontrak Bantuan <span class="required">*</span></label>
            <input v-model="formData.noKontrak" required placeholder="Masukkan nomor kontrak" />
          </div>
          <div class="form-group">
            <label>Jenis Bantuan <span class="required">*</span></label>
            <select v-model="formData.jenisBantuan" required>
              <option value="">Pilih Jenis Bantuan</option>
              <option value="Beasiswa Pendidikan">Beasiswa Pendidikan</option>
              <option value="Bantuan Biaya Hidup">Bantuan Biaya Hidup</option>
              <option value="Bantuan Peralatan">Bantuan Peralatan</option>
              <option value="Bantuan Prestasi">Bantuan Prestasi</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div class="form-group">
            <label>Jumlah Bantuan (Rp) <span class="required">*</span></label>
            <input 
              v-model.number="formData.jumlahBantuan" 
              type="number" 
              required 
              placeholder="0"
            />
            <span class="input-hint">{{ formatCurrency(formData.jumlahBantuan) }}</span>
          </div>
          <div class="form-group">
            <label>Periode Bantuan <span class="required">*</span></label>
            <input v-model="formData.periodeBantuan" required placeholder="Contoh: Semester 1 2024" />
          </div>
        </div>
      </div>

      <!-- Upload Dokumen Ijazah -->
      <div class="form-section">
        <h3 class="section-title">🎓 Dokumen Ijazah</h3>
        <div class="form-group full-width">
          <label class="file-upload-label" for="ijazah-upload">
            <input 
              id="ijazah-upload" 
              type="file" 
              multiple 
              accept=".pdf,.jpg,.jpeg,.png" 
              @change="handleIjazahUpload" 
              class="file-input" 
            />
            <span class="upload-area">
              📎 Klik untuk upload Ijazah (PDF/JPG/PNG) — Multi file, Max 5MB/file
            </span>
          </label>
          <div v-if="formData.ijazahFiles.length" class="file-list">
            <div v-for="(file, idx) in formData.ijazahFiles" :key="idx" class="file-item">
              <span class="file-icon">🎓</span>
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ formatFileSize(file.size) }}</span>
              <button type="button" class="btn-remove" @click="removeIjazah(idx)">✕</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Upload Dokumen Raport -->
      <div class="form-section">
        <h3 class="section-title">📚 Dokumen Raport</h3>
        <div class="form-group full-width">
          <label class="file-upload-label" for="raport-upload">
            <input 
              id="raport-upload" 
              type="file" 
              multiple 
              accept=".pdf,.jpg,.jpeg,.png" 
              @change="handleRaportUpload" 
              class="file-input" 
            />
            <span class="upload-area">
              📎 Klik untuk upload Raport (PDF/JPG/PNG) — Multi file, Max 5MB/file
            </span>
          </label>
          <div v-if="formData.raportFiles.length" class="file-list">
            <div v-for="(file, idx) in formData.raportFiles" :key="idx" class="file-item">
              <span class="file-icon">📚</span>
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ formatFileSize(file.size) }}</span>
              <button type="button" class="btn-remove" @click="removeRaport(idx)">✕</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Upload Piagam Prestasi -->
      <div class="form-section">
        <h3 class="section-title">🏆 Piagam Prestasi</h3>
        <div class="form-group full-width">
          <label class="file-upload-label" for="piagam-upload">
            <input 
              id="piagam-upload" 
              type="file" 
              multiple 
              accept=".pdf,.jpg,.jpeg,.png" 
              @change="handlePiagamUpload" 
              class="file-input" 
            />
            <span class="upload-area">
              📎 Klik untuk upload Piagam Prestasi (PDF/JPG/PNG) — Multi file, Max 5MB/file
            </span>
          </label>
          <div v-if="formData.piagamFiles.length" class="file-list">
            <div v-for="(file, idx) in formData.piagamFiles" :key="idx" class="file-item">
              <span class="file-icon">🏆</span>
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ formatFileSize(file.size) }}</span>
              <button type="button" class="btn-remove" @click="removePiagam(idx)">✕</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Catatan Prestasi -->
      <div class="form-section">
        <h3 class="section-title">⭐ Catatan Prestasi & Pencapaian</h3>
        <div class="form-group full-width">
          <label>Deskripsi Prestasi</label>
          <textarea 
            v-model="formData.catatanPrestasi" 
            rows="6" 
            placeholder="Tulis prestasi akademik, non-akademik, dan pencapaian lainnya yang diraih santri..."
          ></textarea>
          <span class="input-hint">Contoh: Juara 1 Lomba Hafalan Al-Quran, Peringkat 1 Kelas, dll</span>
        </div>
      </div>

      <!-- Upload Foto Kegiatan -->
      <div class="form-section">
        <h3 class="section-title">📷 Foto Kegiatan & Dokumentasi</h3>
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

      <!-- Catatan Tambahan -->
      <div class="form-section">
        <h3 class="section-title">📝 Catatan Tambahan</h3>
        <div class="form-group full-width">
          <label>Keterangan Lain</label>
          <textarea 
            v-model="formData.catatanTambahan" 
            rows="4" 
            placeholder="Masukkan catatan atau keterangan tambahan terkait pertanggungjawaban bantuan..."
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isSubmitting = ref(false)

const formData = ref({
  namaSantri: '',
  nikSantri: '',
  tempatLahir: '',
  tanggalLahir: '',
  jenisKelamin: '',
  namaPesantren: '',
  alamat: '',
  noKontrak: '',
  jenisBantuan: '',
  jumlahBantuan: 0,
  periodeBantuan: '',
  ijazahFiles: [],
  raportFiles: [],
  piagamFiles: [],
  catatanPrestasi: '',
  fotoFiles: [],
  catatanTambahan: ''
})

const goBack = () => router.push({ name: 'daftar_alokasi_santri' })

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

const handleIjazahUpload = (e) => {
  const files = Array.from(e.target.files || [])
  files.forEach(file => {
    if (file.size > 5 * 1024 * 1024) {
      alert(`${file.name} terlalu besar (max 5MB)`)
      return
    }
    formData.value.ijazahFiles.push(file)
  })
  e.target.value = ''
}

const removeIjazah = (idx) => {
  formData.value.ijazahFiles.splice(idx, 1)
}

const handleRaportUpload = (e) => {
  const files = Array.from(e.target.files || [])
  files.forEach(file => {
    if (file.size > 5 * 1024 * 1024) {
      alert(`${file.name} terlalu besar (max 5MB)`)
      return
    }
    formData.value.raportFiles.push(file)
  })
  e.target.value = ''
}

const removeRaport = (idx) => {
  formData.value.raportFiles.splice(idx, 1)
}

const handlePiagamUpload = (e) => {
  const files = Array.from(e.target.files || [])
  files.forEach(file => {
    if (file.size > 5 * 1024 * 1024) {
      alert(`${file.name} terlalu besar (max 5MB)`)
      return
    }
    formData.value.piagamFiles.push(file)
  })
  e.target.value = ''
}

const removePiagam = (idx) => {
  formData.value.piagamFiles.splice(idx, 1)
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
  if (formData.value.ijazahFiles.length === 0) {
    alert('Minimal upload 1 dokumen ijazah!')
    return
  }
  if (formData.value.raportFiles.length === 0) {
    alert('Minimal upload 1 dokumen raport!')
    return
  }
  if (formData.value.fotoFiles.length === 0) {
    alert('Minimal upload 1 foto kegiatan!')
    return
  }

  isSubmitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Form Data:', formData.value)
    alert('Data pertanggungjawaban santri berhasil disimpan!')
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
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.input-hint {
  font-size: 12px;
  color: #10b981;
  font-weight: 600;
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

  .photo-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}
</style>