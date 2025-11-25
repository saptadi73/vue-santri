<template>
  <div class="ocr-container">
    <!-- Header -->
    <div class="header-section">
      <h1 class="page-title">🔍 AI Test - Upload Dokumen</h1>
      <p class="page-sub">Upload gambar untuk mengekstrak teks menggunakan AI</p>
    </div>

    <div class="content-grid">
      <!-- Upload Section -->
      <div class="upload-section">
        <div class="card">
          <h3 class="card-title">📤 Upload Gambar</h3>
          
          <!-- File Upload Area -->
          <label class="upload-area" for="image-upload">
            <input 
              id="image-upload" 
              type="file" 
              accept="image/*" 
              @change="handleImageUpload" 
              class="file-input"
            />
            <div class="upload-content">
              <span class="upload-icon">📷</span>
              <span class="upload-text">Klik untuk upload gambar</span>
              <span class="upload-hint">支持 JPG, PNG, BMP, TIFF</span>
            </div>
          </label>

          <!-- Image Preview -->
          <div v-if="imagePreview" class="preview-section">
            <h4 class="preview-title">Preview Gambar:</h4>
            <img :src="imagePreview" alt="Preview" class="image-preview" />
            <button @click="clearImage" class="btn-clear">✕ Hapus Gambar</button>
          </div>

          <!-- Language Selection -->
          <div class="language-section">
            <label class="label">Pilih Bahasa untuk AI:</label>
            <select v-model="selectedLanguage" class="select-language">
              <option value="eng">English</option>
              <option value="ind">Indonesian</option>
              <option value="ara">Arabic</option>
              <option value="chi_sim">Chinese Simplified</option>
              <option value="jpn">Japanese</option>
              <option value="kor">Korean</option>
            </select>
          </div>

          <!-- Process Button -->
          <button 
            @click="processOCR" 
            :disabled="!imageFile || isProcessing"
            class="btn-process"
          >
            <span v-if="isProcessing">⏳ Memproses...</span>
            <span v-else>🚀 Ekstrak Teks</span>
          </button>
        </div>
      </div>

      <!-- Result Section -->
      <div class="result-section">
        <div class="card">
          <h3 class="card-title">📝 Hasil AI</h3>

          <!-- Progress Bar -->
          <div v-if="isProcessing" class="progress-section">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
            <p class="progress-text">{{ progress }}% - {{ status }}</p>
          </div>

          <!-- OCR Result -->
          <div v-if="ocrText && !isProcessing" class="result-content">
            <div class="result-header">
              <span class="result-label">Teks Hasil Ekstraksi:</span>
              <div class="result-actions">
                <button @click="copyToClipboard" class="btn-icon" title="Copy">
                  📋
                </button>
                <button @click="downloadText" class="btn-icon" title="Download">
                  💾
                </button>
              </div>
            </div>
            <textarea 
              v-model="ocrText" 
              class="result-textarea"
              rows="15"
              readonly
            ></textarea>
            <div class="result-stats">
              <span class="stat-item">📊 Karakter: {{ ocrText.length }}</span>
              <span class="stat-item">📄 Kata: {{ wordCount }}</span>
              <span class="stat-item">⏱️ Waktu: {{ processingTime }}s</span>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="!ocrText && !isProcessing" class="empty-state">
            <span class="empty-icon">📭</span>
            <p class="empty-text">Belum ada hasil AI</p>
            <p class="empty-hint">Upload gambar dan klik "Ekstrak Teks" untuk memulai</p>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="error-message">
            <span class="error-icon">⚠️</span>
            <p>{{ errorMessage }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Example Images -->
    <div class="examples-section">
      <h3 class="section-title">💡 Contoh Gambar untuk Dicoba</h3>
      <div class="examples-grid">
        <div 
          v-for="(example, idx) in exampleImages" 
          :key="idx"
          @click="loadExampleImage(example)"
          class="example-item"
        >
          <img :src="example.url" :alt="example.name" class="example-image" />
          <p class="example-name">{{ example.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { createWorker } from 'tesseract.js'

// State
const imageFile = ref(null)
const imagePreview = ref(null)
const selectedLanguage = ref('eng')
const isProcessing = ref(false)
const progress = ref(0)
const status = ref('')
const ocrText = ref('')
const errorMessage = ref('')
const startTime = ref(0)
const processingTime = ref(0)

// Computed
const wordCount = computed(() => {
  if (!ocrText.value) return 0
  return ocrText.value.trim().split(/\s+/).length
})

// Example Images
const exampleImages = ref([
  {
    name: 'KTP',
    url: '/cowok1.jpg'
  },
  {
    name: 'Dokumen',
    url: '/cowok1.jpg'
  },
  {
    name: 'Receipt',
    url: '/cowok1.jpg'
  },
  {
    name: 'Text Image',
    url: '/cowok1.jpg'
  }
])

// Methods
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'File harus berupa gambar!'
    return
  }

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    errorMessage.value = 'Ukuran file maksimal 10MB!'
    return
  }

  imageFile.value = file
  errorMessage.value = ''
  ocrText.value = ''

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const clearImage = () => {
  imageFile.value = null
  imagePreview.value = null
  ocrText.value = ''
  errorMessage.value = ''
  progress.value = 0
  status.value = ''
}

const processOCR = async () => {
  if (!imageFile.value) return

  isProcessing.value = true
  progress.value = 0
  status.value = 'Initializing...'
  errorMessage.value = ''
  ocrText.value = ''
  startTime.value = Date.now()

  try {
    // Create Tesseract worker
    const worker = await createWorker(selectedLanguage.value, 1, {
      logger: (m) => {
        if (m.status) {
          status.value = m.status
        }
        if (m.progress) {
          progress.value = Math.round(m.progress * 100)
        }
      }
    })

    // Perform OCR
    const { data: { text } } = await worker.recognize(imageFile.value)
    
    ocrText.value = text
    processingTime.value = ((Date.now() - startTime.value) / 1000).toFixed(2)

    // Terminate worker
    await worker.terminate()

  } catch (error) {
    console.error('OCR Error:', error)
    errorMessage.value = 'Gagal memproses gambar: ' + error.message
  } finally {
    isProcessing.value = false
  }
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(ocrText.value)
    .then(() => {
      alert('✅ Teks berhasil dicopy!')
    })
    .catch(() => {
      alert('❌ Gagal copy teks')
    })
}

const downloadText = () => {
  const blob = new Blob([ocrText.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ocr-result-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

const loadExampleImage = async (example) => {
  try {
    const response = await fetch(example.url)
    const blob = await response.blob()
    const file = new File([blob], example.name + '.jpg', { type: 'image/jpeg' })
    
    imageFile.value = file
    imagePreview.value = example.url
    ocrText.value = ''
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = 'Gagal memuat contoh gambar'
  }
}
</script>

<style scoped>
.ocr-container {
  width: 95vw;
  max-width: 1600px;
  margin: 20px auto;
  padding: 20px;
}

.header-section {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px;
  color: #111827;
}

.page-sub {
  color: #6b7280;
  margin: 0;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 20px;
  color: #111827;
}

.upload-area {
  display: block;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #f8fafc;
}

.upload-area:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.file-input {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.upload-icon {
  font-size: 48px;
}

.upload-text {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.upload-hint {
  font-size: 13px;
  color: #9ca3af;
}

.preview-section {
  margin-top: 20px;
}

.preview-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #374151;
}

.image-preview {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.btn-clear {
  width: 100%;
  margin-top: 10px;
  padding: 8px;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-clear:hover {
  background: #fca5a5;
}

.language-section {
  margin-top: 20px;
}

.label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
}

.select-language {
  width: 100%;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
}

.btn-process {
  width: 100%;
  margin-top: 20px;
  padding: 14px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-process:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
}

.btn-process:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.progress-section {
  margin: 20px 0;
}

.progress-bar {
  width: 100%;
  height: 24px;
  background: #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #10b981);
  transition: width 0.3s;
}

.progress-text {
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.result-content {
  margin-top: 20px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.result-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.result-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #e5e7eb;
  transform: scale(1.05);
}

.result-textarea {
  width: 100%;
  padding: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  resize: vertical;
  background: #f9fafb;
}

.result-stats {
  display: flex;
  gap: 20px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #e5e7eb;
}

.stat-item {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.empty-icon {
  font-size: 64px;
  display: block;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px;
}

.empty-hint {
  font-size: 13px;
  margin: 0;
}

.error-message {
  background: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #dc2626;
}

.error-icon {
  font-size: 20px;
}

.examples-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 20px;
  color: #111827;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.example-item {
  cursor: pointer;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px;
  transition: all 0.2s;
}

.example-item:hover {
  border-color: #3b82f6;
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.example-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 8px;
}

.example-name {
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .examples-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .ocr-container {
    width: calc(100vw - 32px);
    padding: 16px;
  }

  .examples-grid {
    grid-template-columns: 1fr;
  }
}
</style>