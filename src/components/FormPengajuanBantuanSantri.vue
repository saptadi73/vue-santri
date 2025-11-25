<template>
  <div class="form-pengajuan-container">
    <!-- Header -->
    <div class="header-section">
      <button @click="goBack" class="btn-back">
        ← Kembali
      </button>
      <div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          {{ isEditMode ? 'Edit Data' : 'Input Data' }} Pengajuan Bantuan Santri
        </h2>
        <p class="text-gray-600">
          Lengkapi semua data pengajuan bantuan untuk santri
        </p>
      </div>
    </div>

    <!-- Form Container -->
    <form @submit.prevent="handleSubmit" class="form-content">
      <!-- Foto Santri Section -->
      <div class="photo-section">
        <div class="photo-container">
          <div v-if="formData.fotoUrl" class="photo-display">
            <img :src="formData.fotoUrl" alt="Foto Santri" class="santri-photo" />
          </div>
          <div v-else class="photo-placeholder">
            <span class="placeholder-icon">👤</span>
            <p class="placeholder-text">Foto Santri</p>
          </div>
          <div class="photo-upload">
            <label for="foto-upload" class="upload-label">
              📷 Upload Foto Santri
            </label>
            <input
              id="foto-upload"
              type="file"
              accept="image/*"
              @change="handlePhotoUpload"
              class="file-input"
            />
          </div>
        </div>
      </div>

      <!-- Data Santri Section -->
      <div class="form-section">
        <h3 class="section-title">Data Santri</h3>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Nama Lengkap <span class="required">*</span></label>
            <input
              v-model="formData.nama"
              type="text"
              class="form-input"
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">NIK <span class="required">*</span></label>
            <input
              v-model="formData.nik"
              type="text"
              class="form-input"
              placeholder="Masukkan NIK"
              maxlength="16"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">No. HP <span class="required">*</span></label>
            <input
              v-model="formData.hp"
              type="tel"
              class="form-input"
              placeholder="Masukkan nomor HP"
              required
            />
          </div>

          <div class="form-group full-width">
            <label class="form-label">Alamat Lengkap <span class="required">*</span></label>
            <textarea
              v-model="formData.alamat"
              class="form-textarea"
              placeholder="Masukkan alamat lengkap"
              rows="3"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Lokasi GPS Rumah</label>
            <div class="gps-input-group">
              <input
                v-model="formData.gpsRumahLat"
                type="text"
                class="form-input"
                placeholder="Latitude"
              />
              <input
                v-model="formData.gpsRumahLng"
                type="text"
                class="form-input"
                placeholder="Longitude"
              />
              <button type="button" @click="getCurrentLocation('rumah')" class="btn-gps">
                📍 Ambil Lokasi
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Orang Tua Section -->
      <div class="form-section">
        <h3 class="section-title">Data Orang Tua / Wali</h3>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Nama Orang Tua / Wali <span class="required">*</span></label>
            <input
              v-model="formData.namaOrtu"
              type="text"
              class="form-input"
              placeholder="Masukkan nama orang tua/wali"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">NIK Orang Tua / Wali <span class="required">*</span></label>
            <input
              v-model="formData.nikOrtu"
              type="text"
              class="form-input"
              placeholder="Masukkan NIK orang tua/wali"
              maxlength="16"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">No. HP Orang Tua / Wali <span class="required">*</span></label>
            <input
              v-model="formData.hpOrtu"
              type="tel"
              class="form-input"
              placeholder="Masukkan nomor HP"
              required
            />
          </div>
        </div>
      </div>

      <!-- Data Pesantren Section -->
      <div class="form-section">
        <h3 class="section-title">Data Pondok Pesantren</h3>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Nama Pondok Pesantren <span class="required">*</span></label>
            <input
              v-model="formData.pesantren"
              type="text"
              class="form-input"
              placeholder="Masukkan nama pesantren"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Tingkat Pendidikan <span class="required">*</span></label>
            <select v-model="formData.tingkat" class="form-select" required>
              <option value="">Pilih Tingkat</option>
              <option value="MI">MI</option>
              <option value="SD">SD</option>
              <option value="MTs">MTs</option>
              <option value="SMP">SMP</option>
              <option value="MA">MA</option>
              <option value="SMA">SMA</option>
              <option value="Mahasiswa">Mahasiswa</option>
            </select>
          </div>

          <div class="form-group full-width">
            <label class="form-label">Alamat Pesantren <span class="required">*</span></label>
            <textarea
              v-model="formData.alamatPesantren"
              class="form-textarea"
              placeholder="Masukkan alamat pesantren"
              rows="3"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Lokasi GPS Pesantren</label>
            <div class="gps-input-group">
              <input
                v-model="formData.gpsPesantrenLat"
                type="text"
                class="form-input"
                placeholder="Latitude"
              />
              <input
                v-model="formData.gpsPesantrenLng"
                type="text"
                class="form-input"
                placeholder="Longitude"
              />
              <button type="button" @click="getCurrentLocation('pesantren')" class="btn-gps">
                📍 Ambil Lokasi
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Nama Pengasuh <span class="required">*</span></label>
            <input
              v-model="formData.namaPengasuh"
              type="text"
              class="form-input"
              placeholder="Masukkan nama pengasuh"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">No. HP Pengasuh <span class="required">*</span></label>
            <input
              v-model="formData.hpPengasuh"
              type="tel"
              class="form-input"
              placeholder="Masukkan nomor HP pengasuh"
              required
            />
          </div>
        </div>
      </div>

      <!-- Data Verifikasi Section -->
      <div class="form-section">
        <h3 class="section-title">Data Verifikasi</h3>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Petugas Verifikasi <span class="required">*</span></label>
            <input
              v-model="formData.petugasVerifikasi"
              type="text"
              class="form-input"
              placeholder="Masukkan nama petugas"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">No. HP Petugas <span class="required">*</span></label>
            <input
              v-model="formData.hpPetugas"
              type="tel"
              class="form-input"
              placeholder="Masukkan nomor HP petugas"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Status <span class="required">*</span></label>
            <select v-model="formData.status" class="form-select" required>
              <option value="">Pilih Status</option>
              <option value="Pendaftaran">Pendaftaran</option>
              <option value="Verifikasi">Verifikasi</option>
              <option value="Wawancara">Wawancara</option>
              <option value="Proses Persetujuan">Proses Persetujuan</option>
              <option value="Pencairan">Pencairan</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Tanggal Pengajuan <span class="required">*</span></label>
            <input
              v-model="formData.tanggalPengajuan"
              type="date"
              class="form-input"
              required
            />
          </div>
        </div>
      </div>

      <!-- Alasan & Catatan Section -->
      <div class="form-section">
        <h3 class="section-title">Alasan & Catatan</h3>
        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label">Alasan Pengajuan <span class="required">*</span></label>
            <textarea
              v-model="formData.alasan"
              class="form-textarea"
              placeholder="Jelaskan alasan pengajuan bantuan..."
              rows="4"
              required
            ></textarea>
          </div>

          <div class="form-group full-width">
            <label class="form-label">Catatan Petugas</label>
            <textarea
              v-model="formData.catatanPetugas"
              class="form-textarea"
              placeholder="Catatan dari petugas verifikasi..."
              rows="4"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Dokumen Pendukung Section -->
      <div class="form-section">
        <h3 class="section-title">Dokumen Pendukung</h3>
        <div class="form-group full-width">
          <label class="form-label">Upload Dokumen (Multiple Files)</label>
          <div class="file-upload-area">
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              @change="handleDocumentUpload"
              class="file-input"
              id="document-upload"
            />
            <label for="document-upload" class="file-upload-label">
              <span class="upload-icon">📎</span>
              <span class="upload-text">Klik untuk upload dokumen</span>
              <span class="upload-hint">PDF, DOC, DOCX, JPG, PNG (Max 5MB per file)</span>
            </label>
          </div>
          
          <!-- Document List -->
          <div v-if="formData.documents.length > 0" class="document-list">
            <div
              v-for="(doc, index) in formData.documents"
              :key="index"
              class="document-item"
            >
              <span class="doc-icon">📄</span>
              <span class="doc-name">{{ doc.name }}</span>
              <span class="doc-size">{{ formatFileSize(doc.size) }}</span>
              <button
                type="button"
                @click="removeDocument(index)"
                class="btn-remove-doc"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Video Section -->
      <div class="form-section">
        <h3 class="section-title">Video Wawancara / Dokumentasi</h3>
        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label">URL Video YouTube</label>
            <input
              v-model="formData.videoUrl"
              type="url"
              class="form-input"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p class="input-hint">Masukkan link video YouTube untuk wawancara atau dokumentasi</p>
          </div>

          <!-- Video Preview -->
          <div v-if="videoId" class="video-preview">
            <iframe
              :src="`https://www.youtube.com/embed/${videoId}`"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="youtube-iframe"
            ></iframe>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="form-actions">
        <button type="button" @click="goBack" class="btn btn-secondary">
          Batal
        </button>
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

// State
const isEditMode = ref(false)
const isSubmitting = ref(false)

const formData = ref({
  // Data Santri
  nama: '',
  nik: '',
  hp: '',
  alamat: '',
  fotoUrl: '',
  gpsRumahLat: '',
  gpsRumahLng: '',
  
  // Data Orang Tua
  namaOrtu: '',
  nikOrtu: '',
  hpOrtu: '',
  
  // Data Pesantren
  pesantren: '',
  tingkat: '',
  alamatPesantren: '',
  gpsPesantrenLat: '',
  gpsPesantrenLng: '',
  namaPengasuh: '',
  hpPengasuh: '',
  
  // Data Verifikasi
  petugasVerifikasi: '',
  hpPetugas: '',
  status: '',
  tanggalPengajuan: '',
  
  // Alasan & Catatan
  alasan: '',
  catatanPetugas: '',
  
  // Dokumen & Video
  documents: [],
  videoUrl: ''
})

// Computed
const videoId = computed(() => {
  if (!formData.value.videoUrl) return null
  
  // Extract YouTube video ID from various URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = formData.value.videoUrl.match(regExp)
  
  return (match && match[2].length === 11) ? match[2] : null
})

// Methods
const goBack = () => {
  router.push({ name: 'daftar_santri' })
}

const handlePhotoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file terlalu besar. Maksimal 2MB')
      return
    }
    
    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.value.fotoUrl = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleDocumentUpload = (event) => {
  const files = Array.from(event.target.files)
  
  files.forEach(file => {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(`File ${file.name} terlalu besar. Maksimal 5MB`)
      return
    }
    
    formData.value.documents.push({
      name: file.name,
      size: file.size,
      file: file
    })
  })
  
  // Reset input
  event.target.value = ''
}

const removeDocument = (index) => {
  formData.value.documents.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const getCurrentLocation = (type) => {
  if (!navigator.geolocation) {
    alert('Geolocation tidak didukung oleh browser Anda')
    return
  }
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      if (type === 'rumah') {
        formData.value.gpsRumahLat = position.coords.latitude.toFixed(6)
        formData.value.gpsRumahLng = position.coords.longitude.toFixed(6)
      } else if (type === 'pesantren') {
        formData.value.gpsPesantrenLat = position.coords.latitude.toFixed(6)
        formData.value.gpsPesantrenLng = position.coords.longitude.toFixed(6)
      }
      alert('Lokasi berhasil diambil!')
    },
    (error) => {
      alert('Gagal mengambil lokasi: ' + error.message)
    }
  )
}

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Form Data:', formData.value)
    
    alert(isEditMode.value ? 'Data berhasil diupdate!' : 'Data berhasil disimpan!')
    router.push({ name: 'daftar_santri' })
  } catch (error) {
    console.error('Error:', error)
    alert('Terjadi kesalahan saat menyimpan data')
  } finally {
    isSubmitting.value = false
  }
}

const loadDataFromRoute = () => {
  // Check if data is passed from route
  if (route.params.data) {
    isEditMode.value = true
    const data = JSON.parse(decodeURIComponent(route.params.data))
    
    // Populate form with existing data
    Object.keys(data).forEach(key => {
      if (formData.value.hasOwnProperty(key)) {
        formData.value[key] = data[key]
      }
    })
    
    // Set default date if not exists
    if (!formData.value.tanggalPengajuan) {
      formData.value.tanggalPengajuan = new Date().toISOString().split('T')[0]
    }
  } else {
    // Set default date for new entry
    formData.value.tanggalPengajuan = new Date().toISOString().split('T')[0]
  }
}

// Lifecycle
onMounted(() => {
  loadDataFromRoute()
})
</script>

<style scoped>
.form-pengajuan-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background-color: #f9fafb;
  min-height: 100vh;
}

/* Header */
.header-section {
  margin-bottom: 24px;
}

.btn-back {
  padding: 8px 16px;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 16px;
  transition: all 0.3s;
}

.btn-back:hover {
  background-color: #4b5563;
}

/* Form Content */
.form-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 32px;
}

/* Photo Section */
.photo-section {
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
}

.photo-container {
  text-align: center;
}

.photo-display {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 16px;
  border: 4px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.santri-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: #f3f4f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  border: 4px solid #e5e7eb;
}

.placeholder-icon {
  font-size: 64px;
  color: #9ca3af;
}

.placeholder-text {
  color: #6b7280;
  font-size: 14px;
  margin-top: 8px;
}

.photo-upload {
  margin-top: 16px;
}

.upload-label {
  display: inline-block;
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.upload-label:hover {
  background-color: #2563eb;
}

.file-input {
  display: none;
}

/* Form Section */
.form-section {
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 2px solid #e5e7eb;
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #3b82f6;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: 14px;
}

.required {
  color: #ef4444;
}

.form-input,
.form-select,
.form-textarea {
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.input-hint {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

/* GPS Input Group */
.gps-input-group {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 8px;
}

.btn-gps {
  padding: 12px 16px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  transition: all 0.3s;
}

.btn-gps:hover {
  background-color: #059669;
}

/* File Upload Area */
.file-upload-area {
  position: relative;
  margin-bottom: 16px;
}

.file-upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #f9fafb;
}

.file-upload-label:hover {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.upload-text {
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.upload-hint {
  font-size: 12px;
  color: #6b7280;
}

/* Document List */
.document-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #f3f4f6;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.doc-icon {
  font-size: 24px;
}

.doc-name {
  flex: 1;
  font-weight: 500;
  color: #1f2937;
  font-size: 14px;
}

.doc-size {
  font-size: 12px;
  color: #6b7280;
}

.btn-remove-doc {
  padding: 4px 8px;
  background-color: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-remove-doc:hover {
  background-color: #fecaca;
}

/* Video Preview */
.video-preview {
  grid-column: 1 / -1;
  margin-top: 16px;
}

.youtube-iframe {
  width: 100%;
  height: 400px;
  border-radius: 8px;
}

/* Action Buttons */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid #e5e7eb;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-primary:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

/* Responsive */
@media (max-width: 768px) {
  .form-pengajuan-container {
    padding: 16px;
  }

  .form-content {
    padding: 20px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .gps-input-group {
    grid-template-columns: 1fr;
  }

  .photo-display,
  .photo-placeholder {
    width: 150px;
    height: 150px;
  }

  .placeholder-icon {
    font-size: 48px;
  }

  .youtube-iframe {
    height: 250px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
