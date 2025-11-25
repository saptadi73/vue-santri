<template>
  <div class="lembar-dokumen-container">
    <!-- Header -->
    <div class="header-section">
      <button @click="goBack" class="btn-back">
        ← Kembali
      </button>
      <div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          Lembar Dokumen - {{ santriData.namaSantri }}
        </h2>
        <p class="text-gray-600">
          No. Pengajuan: {{ santriData.noPengajuan }}
        </p>
      </div>
    </div>

    <!-- Document Sections in 3 Column Grid -->
    <div class="document-grid-layout">
      
      <!-- Column 1: Dokumen Pendaftaran -->
      <div class="document-column">
        <div class="document-card">
          <h3 class="card-title">📄 Dokumen Pendaftaran</h3>
          <div class="card-content">
            <div class="document-list">
              <div
                v-for="(doc, index) in santriData.dokumenPendaftaran"
                :key="index"
                @click="viewDocument(doc)"
                class="document-item-card"
              >
                <div class="doc-icon-large">📄</div>
                <div class="doc-info">
                  <div class="doc-name">{{ doc.name }}</div>
                  <div class="doc-meta">{{ doc.size }} • {{ doc.date }}</div>
                </div>
                <div class="doc-action">👁️</div>
              </div>
            </div>
          </div>
        </div>

        <div class="document-card">
          <h3 class="card-title">🎥 Video Pendaftaran</h3>
          <div class="card-content">
            <div class="video-list">
              <div
                v-for="(video, index) in santriData.videoPendaftaran"
                :key="index"
                @click="viewVideo(video)"
                class="video-item-card"
              >
                <div class="video-thumbnail">
                  <img :src="`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`" :alt="video.title" />
                  <div class="play-button">▶️</div>
                </div>
                <div class="video-info">
                  <div class="video-title">{{ video.title }}</div>
                  <div class="video-meta">{{ video.category }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Column 2: Dokumen Pengajuan -->
      <div class="document-column">
        <div class="document-card">
          <h3 class="card-title">📋 Dokumen Pengajuan</h3>
          <div class="card-content">
            <div class="document-list">
              <div
                v-for="(doc, index) in santriData.dokumenPengajuan"
                :key="index"
                @click="viewDocument(doc)"
                class="document-item-card"
              >
                <div class="doc-icon-large">📄</div>
                <div class="doc-info">
                  <div class="doc-name">{{ doc.name }}</div>
                  <div class="doc-meta">{{ doc.size }} • {{ doc.date }}</div>
                </div>
                <div class="doc-action">👁️</div>
              </div>
            </div>
          </div>
        </div>

        <div class="document-card">
          <h3 class="card-title">📷 Foto Verifikasi</h3>
          <div class="card-content">
            <div class="photo-grid-compact">
              <div
                v-for="(photo, index) in santriData.photos"
                :key="index"
                @click="viewPhoto(photo)"
                class="photo-item-card"
              >
                <img :src="photo.url" :alt="photo.name" class="photo-thumbnail" />
                <div class="photo-overlay">
                  <span class="photo-name">{{ photo.name }}</span>
                  <span class="photo-icon">🔍</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Column 3: Video Verifikasi -->
      <div class="document-column">
        <div class="document-card">
          <h3 class="card-title">🎬 Video Verifikasi</h3>
          <div class="card-content">
            <div class="video-list">
              <div
                v-for="(video, index) in santriData.videoVerifikasi"
                :key="index"
                @click="viewVideo(video)"
                class="video-item-card"
              >
                <div class="video-thumbnail">
                  <img :src="`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`" :alt="video.title" />
                  <div class="play-button">▶️</div>
                </div>
                <div class="video-info">
                  <div class="video-title">{{ video.title }}</div>
                  <div class="video-meta">{{ video.category }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal for PDF Document -->
    <div v-if="showPdfModal" class="modal-overlay" @click="closePdfModal">
      <div class="modal-content modal-large" @click.stop>
        <div class="modal-header">
          <h3 class="text-xl font-bold">{{ selectedDocument?.name }}</h3>
          <button @click="closePdfModal" class="btn-close">✕</button>
        </div>
        <div class="modal-body-pdf">
          <div class="pdf-viewer">
            <p class="pdf-placeholder">
              📄 PDF Viewer<br/>
              <span class="pdf-info">{{ selectedDocument?.name }}</span><br/>
              <span class="pdf-hint">Dalam implementasi nyata, gunakan library seperti PDF.js atau vue-pdf</span>
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <a :href="selectedDocument?.url" download class="btn btn-success">
            📥 Download
          </a>
          <button @click="closePdfModal" class="btn btn-secondary">Tutup</button>
        </div>
      </div>
    </div>

    <!-- Modal for Photo -->
    <div v-if="showPhotoModal" class="modal-overlay" @click="closePhotoModal">
      <div class="modal-content modal-photo" @click.stop>
        <div class="modal-header">
          <h3 class="text-xl font-bold">{{ selectedPhoto?.name }}</h3>
          <button @click="closePhotoModal" class="btn-close">✕</button>
        </div>
        <div class="modal-body-photo">
          <img :src="selectedPhoto?.url" :alt="selectedPhoto?.name" class="photo-full" />
        </div>
        <div class="modal-footer">
          <button @click="closePhotoModal" class="btn btn-secondary">Tutup</button>
        </div>
      </div>
    </div>

    <!-- Modal for Video -->
    <div v-if="showVideoModal" class="modal-overlay" @click="closeVideoModal">
      <div class="modal-content modal-video" @click.stop>
        <div class="modal-header">
          <h3 class="text-xl font-bold">{{ selectedVideo?.title }}</h3>
          <button @click="closeVideoModal" class="btn-close">✕</button>
        </div>
        <div class="modal-body-video">
          <iframe
            v-if="selectedVideo"
            :src="`https://www.youtube.com/embed/${selectedVideo.videoId}`"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="youtube-player"
          ></iframe>
        </div>
        <div class="modal-footer">
          <a :href="selectedVideo?.url" target="_blank" class="btn btn-primary">
            🔗 Buka di YouTube
          </a>
          <button @click="closeVideoModal" class="btn btn-secondary">Tutup</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// State
const showPdfModal = ref(false)
const showPhotoModal = ref(false)
const showVideoModal = ref(false)
const selectedDocument = ref(null)
const selectedPhoto = ref(null)
const selectedVideo = ref(null)

// Static Data
const santriData = ref({
  noPengajuan: '',
  namaSantri: '',
  dokumenPendaftaran: [
    {
      name: 'KTP Santri.pdf',
      url: '#',
      size: '245 KB',
      date: '15 Jan 2024'
    },
    {
      name: 'Kartu Keluarga.pdf',
      url: '#',
      size: '312 KB',
      date: '15 Jan 2024'
    },
    {
      name: 'Akta Kelahiran.pdf',
      url: '#',
      size: '198 KB',
      date: '15 Jan 2024'
    },
    {
      name: 'Foto Santri 3x4.pdf',
      url: '#',
      size: '156 KB',
      date: '15 Jan 2024'
    }
  ],
  dokumenPengajuan: [
    {
      name: 'Surat Keterangan Tidak Mampu.pdf',
      url: '#',
      size: '189 KB',
      date: '16 Jan 2024'
    },
    {
      name: 'Surat Rekomendasi Pesantren.pdf',
      url: '#',
      size: '421 KB',
      date: '16 Jan 2024'
    },
    {
      name: 'Laporan Verifikasi Lapangan.pdf',
      url: '#',
      size: '1.2 MB',
      date: '20 Jan 2024'
    },
    {
      name: 'Berita Acara Verifikasi.pdf',
      url: '#',
      size: '567 KB',
      date: '20 Jan 2024'
    },
    {
      name: 'Surat Pernyataan Orang Tua.pdf',
      url: '#',
      size: '234 KB',
      date: '16 Jan 2024'
    }
  ],
  photos: [
    {
      name: 'Foto Santri',
      url: '/cowok1.jpg'
    },
    {
      name: 'Foto Rumah Depan',
      url: '/cowok1.jpg'
    },
    {
      name: 'Foto Rumah Samping',
      url: '/cowok1.jpg'
    },
    {
      name: 'Foto Kondisi Rumah',
      url: '/cowok1.jpg'
    },
    {
      name: 'Foto Keluarga',
      url: '/cowok1.jpg'
    },
    {
      name: 'Foto Kamar',
      url: '/cowok1.jpg'
    }
  ],
  videoPendaftaran: [
    {
      title: 'Wawancara dengan Santri',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoId: 'dQw4w9WgXcQ',
      category: 'Wawancara Santri'
    },
    {
      title: 'Wawancara dengan Orang Tua',
      url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
      videoId: '9bZkp7q19f0',
      category: 'Wawancara Orang Tua'
    },
    {
      title: 'Profil Santri',
      url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
      videoId: 'kJQP7kiw5Fk',
      category: 'Profil'
    }
  ],
  videoVerifikasi: [
    {
      title: 'Kondisi Rumah dan Lingkungan',
      url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      videoId: 'jNQXAC9IVRw',
      category: 'Verifikasi Lapangan'
    },
    {
      title: 'Aktivitas Santri di Pesantren',
      url: 'https://www.youtube.com/watch?v=ZZ5LpwO-An4',
      videoId: 'ZZ5LpwO-An4',
      category: 'Dokumentasi Pesantren'
    },
    {
      title: 'Testimoni Pengasuh Pesantren',
      url: 'https://www.youtube.com/watch?v=L_jWHffIx5E',
      videoId: 'L_jWHffIx5E',
      category: 'Testimoni'
    },
    {
      title: 'Survey Kondisi Ekonomi Keluarga',
      url: 'https://www.youtube.com/watch?v=YQHsXMglC9A',
      videoId: 'YQHsXMglC9A',
      category: 'Survey Ekonomi'
    }
  ]
})

// Methods
const goBack = () => {
  router.push({ name: 'daftar_alokasi_santri' })
}

const viewDocument = (doc) => {
  selectedDocument.value = doc
  showPdfModal.value = true
}

const closePdfModal = () => {
  showPdfModal.value = false
  selectedDocument.value = null
}

const viewPhoto = (photo) => {
  selectedPhoto.value = photo
  showPhotoModal.value = true
}

const closePhotoModal = () => {
  showPhotoModal.value = false
  selectedPhoto.value = null
}

const viewVideo = (video) => {
  selectedVideo.value = video
  showVideoModal.value = true
}

const closeVideoModal = () => {
  showVideoModal.value = false
  selectedVideo.value = null
}

const loadDataFromRoute = () => {
  if (route.params.data) {
    const data = JSON.parse(decodeURIComponent(route.params.data))
    santriData.value.noPengajuan = data.noPengajuan || ''
    santriData.value.namaSantri = data.namaSantri || ''
  }
}

onMounted(() => {
  loadDataFromRoute()
})
</script>

<style scoped>
.lembar-dokumen-container {
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

.document-grid-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: start;
}

.document-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.document-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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

.document-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.document-item-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.document-item-card:hover {
  border-color: #3b82f6;
  background-color: #eff6ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.2);
}

.doc-icon-large {
  font-size: 48px;
}

.doc-info {
  flex: 1;
}

.doc-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
  margin-bottom: 4px;
}

.doc-meta {
  font-size: 12px;
  color: #6b7280;
}

.doc-action {
  font-size: 24px;
  opacity: 0.5;
  transition: opacity 0.3s;
}

.document-item-card:hover .doc-action {
  opacity: 1;
}

.photo-grid-compact {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.photo-item-card {
  position: relative;
  aspect-ratio: 4/3;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid #e5e7eb;
}

.photo-item-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  border-color: #3b82f6;
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
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
}

.photo-item-card:hover .photo-overlay {
  opacity: 1;
}

.photo-name {
  font-weight: 600;
  font-size: 13px;
}

.photo-icon {
  font-size: 20px;
}

.video-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.video-item-card {
  background-color: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.video-item-card:hover {
  border-color: #ef4444;
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(239, 68, 68, 0.2);
}

.video-thumbnail {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  opacity: 0.9;
  transition: all 0.3s;
}

.video-item-card:hover .play-button {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1.2);
}

.video-info {
  padding: 16px;
}

.video-title {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
  margin-bottom: 4px;
}

.video-meta {
  font-size: 12px;
  color: #6b7280;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
}

.modal-large {
  max-width: 1200px;
}

.modal-photo {
  max-width: 1000px;
}

.modal-video {
  max-width: 1100px;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9fafb;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.3s;
}

.btn-close:hover {
  background-color: #e5e7eb;
}

.modal-body-pdf {
  padding: 24px;
  min-height: 600px;
}

.pdf-viewer {
  width: 100%;
  height: 600px;
  background-color: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pdf-placeholder {
  text-align: center;
  color: #6b7280;
  font-size: 16px;
  line-height: 2;
}

.pdf-info {
  font-weight: 600;
  color: #1f2937;
  font-size: 18px;
}

.pdf-hint {
  font-size: 12px;
  color: #9ca3af;
}

.modal-body-photo {
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
}

.photo-full {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

.modal-body-video {
  padding: 24px;
  background-color: #000;
}

.youtube-player {
  width: 100%;
  height: 600px;
  border-radius: 8px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: #f9fafb;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-success {
  background-color: #10b981;
  color: white;
}

.btn-success:hover {
  background-color: #059669;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

@media (max-width: 1400px) {
  .document-grid-layout {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .document-grid-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .lembar-dokumen-container {
    padding: 16px;
  }

  .document-column {
    gap: 16px;
  }

  .photo-grid-compact {
    grid-template-columns: repeat(2, 1fr);
  }

  .card-content {
    padding: 16px;
  }

  .card-title {
    font-size: 16px;
    padding: 12px 16px;
  }

  .youtube-player {
    height: 300px;
  }
}
</style>
