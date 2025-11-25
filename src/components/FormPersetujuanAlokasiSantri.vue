<template>
  <div class="form-persetujuan-container">
    <!-- Header -->
    <div class="header-section">
      <button @click="goBack" class="btn-back">
        ← Kembali
      </button>
      <div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          Lembar Persetujuan Pengalokasian Bantuan
        </h2>
        <p class="text-gray-600">
          Proses persetujuan pengalokasian anggaran bantuan santri
        </p>
      </div>
    </div>

    <!-- Form Container with 3 Column Layout -->
    <form @submit.prevent="handleSubmit" class="form-content-wrapper">
      
      <!-- Column 1: Data Pengajuan & Anggaran -->
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

        <!-- Data Anggaran Card -->
        <div class="form-card">
          <h3 class="card-title">💰 Data Anggaran</h3>
          <div class="card-content">
            <div class="form-group">
              <label class="form-label">Alokasi Anggaran <span class="required">*</span></label>
              <select v-model="formData.alokasiAnggaran" class="form-select" required>
                <option value="">Pilih Alokasi</option>
                <option value="Kemenag">Kemenag</option>
                <option value="Kemendiknas">Kemendiknas</option>
                <option value="Kemensos">Kemensos</option>
                <option value="Bazis">Bazis</option>
                <option value="CSR Perusahaan">CSR Perusahaan</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Nama Lembaga/Perusahaan</label>
              <input
                v-model="formData.lembaga"
                type="text"
                class="form-input"
                placeholder="Masukkan nama lembaga (jika ada)"
              />
            </div>

            <div class="form-group">
              <label class="form-label">No. Mata Anggaran <span class="required">*</span></label>
              <input
                v-model="formData.noMataAnggaran"
                type="text"
                class="form-input"
                placeholder="Masukkan no. mata anggaran"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Jumlah Pengajuan <span class="required">*</span></label>
              <input
                v-model.number="formData.jumlahPengajuan"
                type="number"
                class="form-input"
                placeholder="Masukkan jumlah pengajuan"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Jumlah Disetujui</label>
              <input
                v-model.number="formData.jumlahDisetujui"
                type="number"
                class="form-input"
                placeholder="Masukkan jumlah yang disetujui"
              />
            </div>
          </div>
        </div>

        <!-- Pemeriksa 1 Card -->
        <div class="form-card">
          <h3 class="card-title">✅ Persetujuan Pemeriksa 1</h3>
          <div class="card-content">
            <div class="form-group">
              <label class="form-label">Nama Petugas Pemeriksa 1 <span class="required">*</span></label>
              <input
                v-model="formData.pemeriksa1"
                type="text"
                class="form-input"
                placeholder="Masukkan nama pemeriksa 1"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Email Pemeriksa 1 <span class="required">*</span></label>
              <input
                v-model="formData.emailPemeriksa1"
                type="email"
                class="form-input"
                placeholder="Masukkan email pemeriksa 1"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Catatan Pemeriksa 1</label>
              <textarea
                v-model="formData.catatanPemeriksa1"
                class="form-textarea"
                placeholder="Masukkan catatan pemeriksa 1..."
                rows="4"
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Keputusan Pemeriksa 1 <span class="required">*</span></label>
              <div class="decision-buttons">
                <button
                  type="button"
                  @click="formData.keputusanPemeriksa1 = 'Disetujui'"
                  :class="['btn-decision', { active: formData.keputusanPemeriksa1 === 'Disetujui' }]"
                  class="btn-approve"
                >
                  ✓ Setuju
                </button>
                <button
                  type="button"
                  @click="formData.keputusanPemeriksa1 = 'Ditolak'"
                  :class="['btn-decision', { active: formData.keputusanPemeriksa1 === 'Ditolak' }]"
                  class="btn-reject"
                >
                  ✗ Tolak
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Column 2: Pemeriksa 2 -->
      <div class="form-column">
        <!-- Pemeriksa 2 Card -->
        <div class="form-card">
          <h3 class="card-title">✅ Persetujuan Pemeriksa 2</h3>
          <div class="card-content">
            <div class="form-group">
              <label class="form-label">Nama Petugas Pemeriksa 2 <span class="required">*</span></label>
              <input
                v-model="formData.pemeriksa2"
                type="text"
                class="form-input"
                placeholder="Masukkan nama pemeriksa 2"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Email Pemeriksa 2 <span class="required">*</span></label>
              <input
                v-model="formData.emailPemeriksa2"
                type="email"
                class="form-input"
                placeholder="Masukkan email pemeriksa 2"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Catatan Pemeriksa 2</label>
              <textarea
                v-model="formData.catatanPemeriksa2"
                class="form-textarea"
                placeholder="Masukkan catatan pemeriksa 2..."
                rows="4"
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Keputusan Pemeriksa 2 <span class="required">*</span></label>
              <div class="decision-buttons">
                <button
                  type="button"
                  @click="formData.keputusanPemeriksa2 = 'Disetujui'"
                  :class="['btn-decision', { active: formData.keputusanPemeriksa2 === 'Disetujui' }]"
                  class="btn-approve"
                >
                  ✓ Setuju
                </button>
                <button
                  type="button"
                  @click="formData.keputusanPemeriksa2 = 'Ditolak'"
                  :class="['btn-decision', { active: formData.keputusanPemeriksa2 === 'Ditolak' }]"
                  class="btn-reject"
                >
                  ✗ Tolak
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Status Summary Card -->
        <div class="form-card">
          <h3 class="card-title">📊 Ringkasan Status</h3>
          <div class="card-content">
            <div class="status-summary">
              <div class="status-item">
                <span class="status-label">Pemeriksa 1:</span>
                <span :class="['status-badge', formData.keputusanPemeriksa1 === 'Disetujui' ? 'badge-success' : formData.keputusanPemeriksa1 === 'Ditolak' ? 'badge-danger' : 'badge-pending']">
                  {{ formData.keputusanPemeriksa1 || 'Belum Diputuskan' }}
                </span>
              </div>
              <div class="status-item">
                <span class="status-label">Pemeriksa 2:</span>
                <span :class="['status-badge', formData.keputusanPemeriksa2 === 'Disetujui' ? 'badge-success' : formData.keputusanPemeriksa2 === 'Ditolak' ? 'badge-danger' : 'badge-pending']">
                  {{ formData.keputusanPemeriksa2 || 'Belum Diputuskan' }}
                </span>
              </div>
              <div class="status-item">
                <span class="status-label">Pejabat Berwenang:</span>
                <span :class="['status-badge', formData.keputusanPejabat === 'Disetujui' ? 'badge-success' : formData.keputusanPejabat === 'Ditolak' ? 'badge-danger' : 'badge-pending']">
                  {{ formData.keputusanPejabat || 'Belum Diputuskan' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Column 3: Pejabat Berwenang -->
      <div class="form-column">
        <!-- Pejabat Berwenang Card -->
        <div class="form-card">
          <h3 class="card-title">👔 Persetujuan Pejabat Berwenang</h3>
          <div class="card-content">
            <div class="form-group">
              <label class="form-label">Nama Pejabat Berwenang <span class="required">*</span></label>
              <input
                v-model="formData.pejabat"
                type="text"
                class="form-input"
                placeholder="Masukkan nama pejabat"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Kedudukan <span class="required">*</span></label>
              <input
                v-model="formData.kedudukan"
                type="text"
                class="form-input"
                placeholder="Masukkan kedudukan"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Email Pejabat <span class="required">*</span></label>
              <input
                v-model="formData.emailPejabat"
                type="email"
                class="form-input"
                placeholder="Masukkan email pejabat"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Catatan Pejabat Berwenang</label>
              <textarea
                v-model="formData.catatanPejabat"
                class="form-textarea"
                placeholder="Masukkan catatan pejabat berwenang..."
                rows="4"
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Keputusan Pejabat Berwenang <span class="required">*</span></label>
              <div class="decision-buttons">
                <button
                  type="button"
                  @click="formData.keputusanPejabat = 'Disetujui'"
                  :class="['btn-decision', { active: formData.keputusanPejabat === 'Disetujui' }]"
                  class="btn-approve"
                >
                  ✓ Setuju
                </button>
                <button
                  type="button"
                  @click="formData.keputusanPejabat = 'Ditolak'"
                  :class="['btn-decision', { active: formData.keputusanPejabat === 'Ditolak' }]"
                  class="btn-reject"
                >
                  ✗ Tolak
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Info Card -->
        <div class="info-card">
          <div class="info-icon">ℹ️</div>
          <div class="info-content">
            <h4 class="info-title">Informasi Proses Persetujuan</h4>
            <ul class="info-list">
              <li>Pemeriksa 1 harus memberikan persetujuan terlebih dahulu</li>
              <li>Jika Pemeriksa 1 menyetujui, dilanjutkan ke Pemeriksa 2</li>
              <li>Jika Pemeriksa 2 menyetujui, dilanjutkan ke Pejabat Berwenang</li>
              <li>Keputusan final ada pada Pejabat Berwenang</li>
              <li>Jika salah satu menolak, proses dihentikan</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Action Buttons (Full Width) -->
      <div class="form-actions-full">
        <button type="button" @click="goBack" class="btn btn-secondary">
          Batal
        </button>
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          <span v-if="isSubmitting">⏳ Menyimpan...</span>
          <span v-else>💾 {{ isEditMode ? 'Update Persetujuan' : 'Simpan Persetujuan' }}</span>
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
  pemeriksa1: '',
  emailPemeriksa1: '',
  pemeriksa2: '',
  emailPemeriksa2: '',
  pejabat: '',
  kedudukan: '',
  emailPejabat: '',
  alokasiAnggaran: '',
  lembaga: '',
  noMataAnggaran: '',
  jumlahPengajuan: 0,
  jumlahDisetujui: 0,
  catatanPemeriksa1: '',
  keputusanPemeriksa1: '',
  catatanPemeriksa2: '',
  keputusanPemeriksa2: '',
  catatanPejabat: '',
  keputusanPejabat: '',
  status: ''
})

// Computed
const finalStatus = computed(() => {
  if (formData.value.keputusanPemeriksa1 === 'Ditolak') {
    return 'Pemeriksa 1 Ditolak'
  } else if (formData.value.keputusanPemeriksa1 === 'Disetujui' && formData.value.keputusanPemeriksa2 === 'Ditolak') {
    return 'Pemeriksa 2 Ditolak'
  } else if (formData.value.keputusanPemeriksa1 === 'Disetujui' && formData.value.keputusanPemeriksa2 === 'Disetujui' && formData.value.keputusanPejabat === 'Ditolak') {
    return 'Ditolak Pejabat Berwenang'
  } else if (formData.value.keputusanPemeriksa1 === 'Disetujui' && formData.value.keputusanPemeriksa2 === 'Disetujui' && formData.value.keputusanPejabat === 'Disetujui') {
    return 'Disetujui Pejabat Berwenang'
  } else if (formData.value.keputusanPemeriksa1 === 'Disetujui' && formData.value.keputusanPemeriksa2 === 'Disetujui') {
    return 'Pemeriksa 2 Disetujui'
  } else if (formData.value.keputusanPemeriksa1 === 'Disetujui') {
    return 'Pemeriksa 1 Disetujui'
  }
  return 'Menunggu Persetujuan'
})

// Methods
const goBack = () => {
  router.push({ name: 'daftar_alokasi_santri' })
}

const handleSubmit = async () => {
  // Validate decisions
  if (!formData.value.keputusanPemeriksa1) {
    alert('Keputusan Pemeriksa 1 harus diisi!')
    return
  }

  if (formData.value.keputusanPemeriksa1 === 'Disetujui' && !formData.value.keputusanPemeriksa2) {
    alert('Keputusan Pemeriksa 2 harus diisi!')
    return
  }

  if (formData.value.keputusanPemeriksa1 === 'Disetujui' && formData.value.keputusanPemeriksa2 === 'Disetujui' && !formData.value.keputusanPejabat) {
    alert('Keputusan Pejabat Berwenang harus diisi!')
    return
  }

  isSubmitting.value = true
  
  try {
    // Update status based on decisions
    formData.value.status = finalStatus.value
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Form Data:', formData.value)
    
    alert(isEditMode.value ? 'Persetujuan berhasil diupdate!' : 'Persetujuan berhasil disimpan!')
    router.push({ name: 'daftar_alokasi_santri' })
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
.form-persetujuan-container {
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
  margin-bottom: 16px;
}

.form-group:last-child {
  margin-bottom: 0;
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

.decision-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.btn-decision {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s;
  background: white;
}

.btn-approve {
  color: #059669;
}

.btn-approve:hover {
  background-color: #d1fae5;
  border-color: #10b981;
}

.btn-approve.active {
  background-color: #10b981;
  color: white;
  border-color: #10b981;
}

.btn-reject {
  color: #dc2626;
}

.btn-reject:hover {
  background-color: #fee2e2;
  border-color: #ef4444;
}

.btn-reject.active {
  background-color: #ef4444;
  color: white;
  border-color: #ef4444;
}

.info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.info-icon {
  font-size: 48px;
  text-align: center;
  margin-bottom: 16px;
}

.info-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  text-align: center;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list li {
  padding: 8px 0;
  padding-left: 24px;
  position: relative;
  font-size: 13px;
  line-height: 1.6;
}

.info-list li:before {
  content: '→';
  position: absolute;
  left: 0;
  font-weight: bold;
}

.status-summary {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 8px;
}

.status-label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.badge-success {
  background-color: #10b981;
  color: white;
}

.badge-danger {
  background-color: #ef4444;
  color: white;
}

.badge-pending {
  background-color: #6b7280;
  color: white;
}

.form-actions-full {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  .form-persetujuan-container {
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

  .decision-buttons {
    grid-template-columns: 1fr;
  }

  .form-actions-full {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
