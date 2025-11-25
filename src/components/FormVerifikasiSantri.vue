<template>
  <div class="form-verifikasi-container">
    <!-- Header -->
    <div class="header-section">
      <button @click="goBack" class="btn-back">
        ← Kembali
      </button>
      <div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          {{ isEditMode ? 'Edit Data' : 'Input Data' }} Verifikasi Santri
        </h2>
        <p class="text-gray-600">
          Lengkapi semua data verifikasi untuk santri calon penerima bantuan
        </p>
      </div>
    </div>

    <!-- Form Container with 3 Column Layout -->
    <form @submit.prevent="handleSubmit" class="form-content-wrapper">
      
      <!-- Column 1: Data Pengajuan & Petugas -->
      <div class="form-column">
        <!-- Data Pengajuan Card -->
        <div class="form-card">
          <h3 class="card-title">📋 Data Pengajuan</h3>
          <div class="card-content">
            <div class="form-group">
              <label class="form-label">No. Pengajuan <span class="required">*</span></label>
              <input
                v-model="formData.noPengajuan"
                type="text"
                class="form-input"
                placeholder="Masukkan nomor pengajuan"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Nama Santri <span class="required">*</span></label>
              <input
                v-model="formData.namaSantri"
                type="text"
                class="form-input"
                placeholder="Masukkan nama santri"
                required
              />
            </div>
          </div>
        </div>

        <!-- Data Petugas Verifikasi Card -->
        <div class="form-card">
          <h3 class="card-title">👤 Data Petugas Verifikasi</h3>
          <div class="card-content">
            <div class="form-group">
              <label class="form-label">Nama Petugas <span class="required">*</span></label>
              <input
                v-model="formData.namaPetugas"
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
              <label class="form-label">Kedinasan <span class="required">*</span></label>
              <select v-model="formData.kedinasan" class="form-select" required>
                <option value="">Pilih Kedinasan</option>
                <option value="Dinsos">Dinsos</option>
                <option value="KUA">KUA</option>
                <option value="Dinas Pendidikan">Dinas Pendidikan</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Status Verifikasi <span class="required">*</span></label>
              <select v-model="formData.statusVerifikasi" class="form-select" required>
                <option value="">Pilih Status</option>
                <option value="Antrian">Antrian</option>
                <option value="Proses Pelengkapan Dokumen">Proses Pelengkapan Dokumen</option>
                <option value="Proses Laporan">Proses Laporan</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Column 2: Lokasi & Catatan -->
      <div class="form-column">
        <!-- Lokasi Verifikasi Card -->
        <div class="form-card">
          <h3 class="card-title">📍 Lokasi Verifikasi</h3>
          <div class="card-content">
            <div class="form-group">
              <label class="form-label">GPS Location Tempat Verifikasi</label>
              <div class="gps-input-group">
                <input
                  v-model="formData.gpsVerifikasiLat"
                  type="text"
                  class="form-input"
                  placeholder="Latitude"
                />
                <input
                  v-model="formData.gpsVerifikasiLng"
                  type="text"
                  class="form-input"
                  placeholder="Longitude"
                />
              </div>
              <button type="button" @click="getCurrentLocation" class="btn-gps-full">
                📍 Ambil Lokasi Saat Ini
              </button>
            </div>
          </div>
        </div>

        <!-- Catatan Petugas Card -->
        <div class="form-card">
          <h3 class="card-title">📝 Catatan Petugas Verifikasi</h3>
          <div class="card-content">
            <div class="form-group">
              <label class="form-label">Catatan Petugas</label>
              <textarea
                v-model="formData.catatanPetugas"
                class="form-textarea"
                placeholder="Masukkan catatan hasil verifikasi..."
                rows="8"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Dokumen Pendukung Card -->
        <div class="form-card">
          <h3 class="card-title">📎 Dokumen Pendukung</h3>
          <div class="card-content">
            <div class="form-group">
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
        </div>
      </div>

      <!-- Column 3: Foto & Video -->
      <div class="form-column">
        <!-- Foto Verifikasi Card -->
        <div class="form-card">
          <h3 class="card-title">📷 Foto Verifikasi</h3>
          <div class="card-content">
            <div class="form-group">
              <label class="form-label">Upload Foto</label>
              <div class="file-upload-area">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  @change="handlePhotoUpload"
                  class="file-input"
                  id="photo-upload"
                />
                <label for="photo-upload" class="file-upload-label">
                  <span class="upload-icon">📷</span>
                  <span class="upload-text">Klik untuk upload foto</span>
                  <span class="upload-hint">JPG, PNG (Max 5MB per file)</span>
                </label>
              </div>
              
              <!-- Photo Preview Grid -->
              <div v-if="formData.photos.length > 0" class="photo-grid">
                <div
                  v-for="(photo, index) in formData.photos"
                  :key="index"
                  class="photo-item"
                >
                  <img :src="photo.preview" alt="Foto Verifikasi" class="photo-preview" />
                  <button
                    type="button"
                    @click="removePhoto(index)"
                    class="btn-remove-photo"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Video Verifikasi Card -->
        <div class="form-card">
          <h3 class="card-title">🎥 Video Verifikasi</h3>
          <div class="card-content">
            <div class="form-group">
              <label class="form-label">URL Video YouTube</label>
              <input
                v-model="formData.videoUrl"
                type="url"
                class="form-input"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p class="input-hint">Masukkan link video YouTube untuk dokumentasi verifikasi</p>
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
  noPengajuan: '',
  namaSantri: '',
  namaPetugas: '',
  hpPetugas: '',
  kedinasan: '',
  statusVerifikasi: '',
  gpsVerifikasiLat: '',
  gpsVerifikasiLng: '',
  catatanPetugas: '',
  photos: [],
  documents: [],
  videoUrl: ''
})

// Computed
const videoId = computed(() => {
  if (!formData.value.videoUrl) return null
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = formData.value.videoUrl.match(regExp)
  
  return (match && match[2].length === 11) ? match[2] : null
})

// Methods
const goBack = () => {
  router.push({ name: 'daftar_verifikasi_santri' })
}

const handlePhotoUpload = (event) => {
  const files = Array.from(event.target.files)
  
  files.forEach(file => {
    if (file.size > 5 * 1024 * 1024) {
      alert(`File ${file.name} terlalu besar. Maksimal 5MB`)
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.value.photos.push({
        name: file.name,
        preview: e.target.result,
        file: file
      })
    }
    reader.readAsDataURL(file)
  })
  
  event.target.value = ''
}

const removePhoto = (index) => {
  formData.value.photos.splice(index, 1)
}

const handleDocumentUpload = (event) => {
  const files = Array.from(event.target.files)
  
  files.forEach(file => {
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

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert('Geolocation tidak didukung oleh browser Anda')
    return
  }
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      formData.value.gpsVerifikasiLat = position.coords.latitude.toFixed(6)
      formData.value.gpsVerifikasiLng = position.coords.longitude.toFixed(6)
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
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Form Data:', formData.value)
    
    alert(isEditMode.value ? 'Data berhasil diupdate!' : 'Data berhasil disimpan!')
    router.push({ name: 'daftar_verifikasi_santri' })
  } catch (error) {
    console.error('Error:', error)
    alert('Terjadi kesalahan saat menyimpan data')
  } finally {
    isSubmitting.value = false
  }
}

const loadDataFromRoute = () => {
  if (route.params.data) {
    isEditMode.value = true
    const data = JSON.parse(decodeURIComponent(route.params.data))
    
    Object.keys(data).forEach(key => {
      if (formData.value.hasOwnProperty(key)) {
        formData.value[key] = data[key]
      }
    })
  }
}

onMounted(() => {
  loadDataFromRoute()
})
</script>

<style scoped>
.form-verifikasi-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 24px;
  background-color: #f9fafb;
  min-height: 100vh;
}

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

.form-content-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: start;
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s;
}

.form-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px 24px;
  margin: 0;
}

.card-content {
  padding: 24px;
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

.gps-input-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.btn-gps-full {
  width: 100%;
  padding: 12px 16px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-gps-full:hover {
  background-color: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
}

.file-input {
  display: none;
}

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

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.photo-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
}

.photo-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove-photo {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  background-color: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-remove-photo:hover {
  background-color: #fecaca;
}

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

.video-preview {
  grid-column: 1 / -1;
  margin-top: 16px;
}

.youtube-iframe {
  width: 100%;
  height: 300px;
  border-radius: 8px;
  margin-top: 16px;
}

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

@media (max-width: 1400px) {
  .form-content-wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .form-content-wrapper {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .form-verifikasi-container {
    padding: 16px;
  }

  .form-column {
    gap: 16px;
  }

  .card-content {
    padding: 16px;
  }

  .card-title {
    font-size: 16px;
    padding: 12px 16px;
  }

  .gps-input-group {
    grid-template-columns: 1fr;
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

  .photo-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>
