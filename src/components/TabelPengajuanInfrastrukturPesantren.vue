<template>
  <div class="tabel-pengajuan-pesantren-container">
    <!-- Header -->
    <div class="header-section">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          Daftar Pengajuan Bantuan Infrastruktur Pesantren
        </h2>
        <p class="text-gray-600">
          Data pesantren yang mengajukan bantuan infrastruktur pemerintah
        </p>
      </div>
      <div class="header-actions">
        <button @click="exportToExcel" class="btn btn-success">
          📥 Export Excel
        </button>
        <button @click="printTable" class="btn btn-primary">
          🖨️ Print
        </button>
      </div>
    </div>

    <!-- Filter & Search -->
    <div class="filter-section">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama pesantren, pengasuh, atau alamat..."
          class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>

      <div class="filter-group">
        <select v-model="filterStatus" class="filter-select">
          <option value="">Semua Status Pengajuan</option>
          <option value="Pendaftaran">Pendaftaran</option>
          <option value="Verifikasi">Verifikasi</option>
          <option value="Ditolak">Ditolak</option>
          <option value="Proses Persetujuan">Proses Persetujuan</option>
          <option value="Pencairan">Pencairan</option>
        </select>

        <select v-model="filterIMB" class="filter-select">
          <option value="">Semua Status IMB</option>
          <option value="Ada">Ada</option>
          <option value="Tidak Ada">Tidak Ada</option>
          <option value="Dalam Pengajuan">Dalam Pengajuan</option>
        </select>

        <select v-model="filterYayasan" class="filter-select">
          <option value="">Semua Status Yayasan</option>
          <option value="Ada">Ada</option>
          <option value="Tidak Ada">Tidak Ada</option>
          <option value="Dalam Pengajuan">Dalam Pengajuan</option>
        </select>

        <button @click="resetFilters" class="btn btn-secondary">
          🔄 Reset Filter
        </button>
      </div>
    </div>

    <!-- Summary Info -->
    <div class="summary-info">
      <div class="info-item">
        <span class="info-label">Total Data:</span>
        <span class="info-value">{{ filteredData.length }} pesantren</span>
      </div>
      <div class="info-item">
        <span class="info-label">Halaman:</span>
        <span class="info-value">{{ currentPage }} dari {{ totalPages }}</span>
      </div>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th class="sticky-col">No</th>
            <th class="sticky-col-2">Pesantren</th>
            <th>Pengasuh / HP</th>
            <th>GPS Lokasi</th>
            <th>Status IMB</th>
            <th>Status Yayasan</th>
            <th>Status SLF</th> <!-- baru -->
            <th>Santri / Luas</th>
            <th>Status Pengajuan</th>
            <th class="action-col">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(pesantren, index) in paginatedData" :key="pesantren.id">
            <td class="sticky-col text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>

            <!-- Pesantren + Alamat -->
            <td class="sticky-col-2">
              <a
                class="data-name clickable-name"
                role="button"
                tabindex="0"
                @click.prevent="editData(pesantren)"
                @keydown.enter.prevent="editData(pesantren)"
                title="Buka form pengajuan"
              >
                {{ pesantren.nama }}
              </a>
              <div class="muted small text-ellipsis">{{ pesantren.alamat }}</div>
            </td>

            <!-- Pengasuh + HP -->
            <td>
              <div class="pengasuh-cell">
                <div class="data-name">{{ pesantren.pengasuh }}</div>
                <div class="muted small">{{ pesantren.hpPengasuh }}</div>
              </div>
            </td>

            <!-- GPS Lokasi -->
            <td>
              <div class="gps-display">
                <div class="gps-item">Lat: {{ pesantren.gpsLat }}</div>
                <div class="gps-item">Lng: {{ pesantren.gpsLng }}</div>
                <a 
                  :href="`https://www.google.com/maps?q=${pesantren.gpsLat},${pesantren.gpsLng}`" 
                  target="_blank"
                  class="gps-link"
                >
                  📍 Maps
                </a>
              </div>
            </td>

            <!-- Status IMB -->
            <td>
              <span 
                class="badge badge-imb" 
                :class="getIMBClass(pesantren.statusIMB)"
              >
                {{ pesantren.statusIMB }}
              </span>
            </td>

            <!-- Status Yayasan -->
            <td>
              <span 
                class="badge badge-yayasan" 
                :class="getYayasanClass(pesantren.statusYayasan)"
              >
                {{ pesantren.statusYayasan }}
              </span>
            </td>

            <!-- Status SLF (baru) -->
            <td>
              <span 
                class="badge badge-slf" 
                :class="getSLFClass(pesantren.statusSLF)"
              >
                {{ pesantren.statusSLF }}
              </span>
            </td>

            <!-- Jumlah Santri + Luas Area -->
            <td class="text-center">
              <div class="santri-luas">
                <span class="badge badge-santri">{{ pesantren.jumlahSantri }} santri</span>
                <span class="badge badge-luas ml-8">{{ pesantren.luasArea }} ha</span>
              </div>
            </td>

            <!-- Status Pengajuan -->
            <td>
              <span 
                class="badge badge-status" 
                :class="getStatusClass(pesantren.statusPengajuan)"
              >
                {{ pesantren.statusPengajuan }}
              </span>
            </td>

            <!-- Aksi -->
            <td class="action-col">
              <div class="action-buttons">
                <button 
                  @click="viewDetail(pesantren)" 
                  class="btn-action btn-view"
                  title="Lihat Detail"
                >
                  👁️
                </button>
                <button 
                  @click="editData(pesantren)" 
                  class="btn-action btn-edit"
                  title="Edit"
                >
                  ✏️
                </button>
                <button 
                  @click="deleteData(pesantren)" 
                  class="btn-action btn-delete"
                  title="Hapus"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination-container">
      <div class="pagination-info">
        Menampilkan {{ startIndex + 1 }} - {{ endIndex }} dari {{ filteredData.length }} data
      </div>
      <div class="pagination-controls">
        <button 
          @click="previousPage" 
          :disabled="currentPage === 1"
          class="btn-pagination"
        >
          ← Sebelumnya
        </button>
        
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="['btn-page', { active: currentPage === page }]"
        >
          {{ page }}
        </button>

        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="btn-pagination"
        >
          Selanjutnya →
        </button>
      </div>
      <div class="items-per-page">
        <label>Tampilkan:</label>
        <select v-model="itemsPerPage" class="select-items">
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
        <span>per halaman</span>
      </div>
    </div>

    <!-- Modal Detail -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="text-xl font-bold">Detail Pesantren</h3>
          <button @click="closeModal" class="btn-close">✕</button>
        </div>
        <div class="modal-body" v-if="selectedPesantren">
          <div class="detail-grid">
            <div class="detail-section">
              <h4 class="section-title">Data Pesantren</h4>
              <div class="detail-item">
                <span class="detail-label">Nama:</span>
                <span class="detail-value">{{ selectedPesantren.nama }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Alamat:</span>
                <span class="detail-value">{{ selectedPesantren.alamat }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Jumlah Santri:</span>
                <span class="detail-value">{{ selectedPesantren.jumlahSantri }} santri</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Luas Area:</span>
                <span class="detail-value">{{ selectedPesantren.luasArea }} ha</span>
              </div>
            </div>

            <div class="detail-section">
              <h4 class="section-title">Data Pengasuh</h4>
              <div class="detail-item">
                <span class="detail-label">Nama:</span>
                <span class="detail-value">{{ selectedPesantren.pengasuh }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">HP:</span>
                <span class="detail-value">{{ selectedPesantren.hpPengasuh }}</span>
              </div>
            </div>

            <div class="detail-section">
              <h4 class="section-title">Status Legalitas</h4>
              <div class="detail-item">
                <span class="detail-label">Status IMB:</span>
                <span 
                  class="badge badge-imb" 
                  :class="getIMBClass(selectedPesantren.statusIMB)"
                >
                  {{ selectedPesantren.statusIMB }}
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Status Yayasan:</span>
                <span 
                  class="badge badge-yayasan" 
                  :class="getYayasanClass(selectedPesantren.statusYayasan)"
                >
                  {{ selectedPesantren.statusYayasan }}
                </span>
              </div>
            </div>

            <div class="detail-section">
              <h4 class="section-title">Lokasi GPS</h4>
              <div class="detail-item">
                <span class="detail-label">Latitude:</span>
                <span class="detail-value">{{ selectedPesantren.gpsLat }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Longitude:</span>
                <span class="detail-value">{{ selectedPesantren.gpsLng }}</span>
              </div>
              <div class="detail-item">
                <a 
                  :href="`https://www.google.com/maps?q=${selectedPesantren.gpsLat},${selectedPesantren.gpsLng}`" 
                  target="_blank"
                  class="btn btn-primary"
                >
                  📍 Buka di Google Maps
                </a>
              </div>
            </div>

            <div class="detail-section">
              <h4 class="section-title">Status Pengajuan</h4>
              <div class="detail-item">
                <span class="detail-label">Status:</span>
                <span 
                  class="badge badge-status" 
                  :class="getStatusClass(selectedPesantren.statusPengajuan)"
                >
                  {{ selectedPesantren.statusPengajuan }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="btn btn-secondary">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Data Static Pesantren
const pesantrenData = reactive([
  {
    id: 1,
    nama: 'Pondok Pesantren Al-Hikmah',
    alamat: 'Jl. Pesantren No. 45, Bandung, Jawa Barat',
    pengasuh: 'KH. Abdullah Syafi\'i',
    hpPengasuh: '081234567801',
    gpsLat: '-6.914744',
    gpsLng: '107.609810',
    statusIMB: 'Ada',
    statusYayasan: 'Ada',
    statusSLF: 'Ada', // baru
    jumlahSantri: 850,
    luasArea: 3.5,
    statusPengajuan: 'Verifikasi'
  },
  {
    id: 2,
    nama: 'Pondok Pesantren Daarut Tauhid',
    alamat: 'Jl. Geger Kalong No. 67, Bandung, Jawa Barat',
    pengasuh: 'KH. Ahmad Dahlan',
    hpPengasuh: '081234567802',
    gpsLat: '-6.850000',
    gpsLng: '107.600000',
    statusIMB: 'Dalam Pengajuan',
    statusYayasan: 'Ada',
    statusSLF: 'Ada', // baru
    jumlahSantri: 450,
    luasArea: 2.3,
    statusPengajuan: 'Pendaftaran'
  },
  {
    id: 3,
    nama: 'Pondok Pesantren Nurul Iman',
    alamat: 'Jl. Cibiru No. 89, Bandung, Jawa Barat',
    pengasuh: 'KH. Muhammad Yusuf',
    hpPengasuh: '081234567803',
    gpsLat: '-6.920000',
    gpsLng: '107.700000',
    statusIMB: 'Ada',
    statusYayasan: 'Dalam Pengajuan',
    statusSLF: 'Dalam Pengajuan', // baru
    jumlahSantri: 620,
    luasArea: 4.2,
    statusPengajuan: 'Proses Persetujuan'
  },
  {
    id: 4,
    nama: 'Pondok Pesantren Al-Falah',
    alamat: 'Jl. Raya Lembang No. 12, Bandung, Jawa Barat',
    pengasuh: 'Nyai Hj. Siti Khadijah',
    hpPengasuh: '081234567804',
    gpsLat: '-6.810000',
    gpsLng: '107.620000',
    statusIMB: 'Tidak Ada',
    statusYayasan: 'Ada',
    statusSLF: 'Ada', // baru
    jumlahSantri: 280,
    luasArea: 1.8,
    statusPengajuan: 'Ditolak'
  },
  {
    id: 5,
    nama: 'Pondok Pesantren Darul Ulum',
    alamat: 'Jl. Cimahi No. 34, Bandung, Jawa Barat',
    pengasuh: 'KH. Zainuddin MZ',
    hpPengasuh: '081234567805',
    gpsLat: '-6.880000',
    gpsLng: '107.540000',
    statusIMB: 'Ada',
    statusYayasan: 'Ada',
    statusSLF: 'Ada', // baru
    jumlahSantri: 1200,
    luasArea: 5.5,
    statusPengajuan: 'Pencairan'
  },
  {
    id: 6,
    nama: 'Pondok Pesantren Al-Munawwir',
    alamat: 'Jl. Soreang No. 56, Bandung, Jawa Barat',
    pengasuh: 'KH. Hasyim Asy\'ari',
    hpPengasuh: '081234567806',
    gpsLat: '-7.020000',
    gpsLng: '107.520000',
    statusIMB: 'Dalam Pengajuan',
    statusYayasan: 'Tidak Ada',
    statusSLF: 'Tidak Ada', // baru
    jumlahSantri: 350,
    luasArea: 2.1,
    statusPengajuan: 'Pendaftaran'
  },
  {
    id: 7,
    nama: 'Pondok Pesantren Sidogiri',
    alamat: 'Jl. Buahbatu No. 78, Bandung, Jawa Barat',
    pengasuh: 'KH. Mustofa Bisri',
    hpPengasuh: '081234567807',
    gpsLat: '-6.950000',
    gpsLng: '107.650000',
    statusIMB: 'Ada',
    statusYayasan: 'Ada',
    statusSLF: 'Ada', // baru
    jumlahSantri: 780,
    luasArea: 3.8,
    statusPengajuan: 'Verifikasi'
  },
  {
    id: 8,
    nama: 'Pondok Pesantren Lirboyo',
    alamat: 'Jl. Ciwastra No. 90, Bandung, Jawa Barat',
    pengasuh: 'KH. Sahal Mahfudz',
    hpPengasuh: '081234567808',
    gpsLat: '-6.930000',
    gpsLng: '107.680000',
    statusIMB: 'Ada',
    statusYayasan: 'Ada',
    statusSLF: 'Dalam Pengajuan', // baru
    jumlahSantri: 950,
    luasArea: 4.5,
    statusPengajuan: 'Proses Persetujuan'
  },
  {
    id: 9,
    nama: 'Pondok Pesantren Tebuireng',
    alamat: 'Jl. Kopo No. 123, Bandung, Jawa Barat',
    pengasuh: 'KH. Abdurrahman Wahid',
    hpPengasuh: '081234567809',
    gpsLat: '-6.960000',
    gpsLng: '107.590000',
    statusIMB: 'Tidak Ada',
    statusYayasan: 'Dalam Pengajuan',
    statusSLF: 'Ada', // baru
    jumlahSantri: 420,
    luasArea: 2.7,
    statusPengajuan: 'Pendaftaran'
  },
  {
    id: 10,
    nama: 'Pondok Pesantren Gontor',
    alamat: 'Jl. Bojongsoang No. 45, Bandung, Jawa Barat',
    pengasuh: 'KH. Imam Zarkasyi',
    hpPengasuh: '081234567810',
    gpsLat: '-6.990000',
    gpsLng: '107.630000',
    statusIMB: 'Ada',
    statusYayasan: 'Ada',
    statusSLF: 'Ada', // baru
    jumlahSantri: 1500,
    luasArea: 6.2,
    statusPengajuan: 'Pencairan'
  }
])

// State
const searchQuery = ref('')
const filterStatus = ref('')
const filterIMB = ref('')
const filterYayasan = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showModal = ref(false)
const selectedPesantren = ref(null)

// Computed
const filteredData = computed(() => {
  let data = pesantrenData

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    data = data.filter(pesantren => 
      pesantren.nama.toLowerCase().includes(query) ||
      pesantren.pengasuh.toLowerCase().includes(query) ||
      pesantren.alamat.toLowerCase().includes(query)
    )
  }

  // Filter by status pengajuan
  if (filterStatus.value) {
    data = data.filter(pesantren => pesantren.statusPengajuan === filterStatus.value)
  }

  // Filter by status IMB
  if (filterIMB.value) {
    data = data.filter(pesantren => pesantren.statusIMB === filterIMB.value)
  }

  // Filter by status yayasan
  if (filterYayasan.value) {
    data = data.filter(pesantren => pesantren.statusYayasan === filterYayasan.value)
  }

  return data
})

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage.value)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value
})

const endIndex = computed(() => {
  const end = startIndex.value + itemsPerPage.value
  return end > filteredData.value.length ? filteredData.value.length : end
})

const paginatedData = computed(() => {
  return filteredData.value.slice(startIndex.value, endIndex.value)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
const getStatusClass = (status) => {
  const classes = {
    'Pendaftaran': 'status-pendaftaran',
    'Verifikasi': 'status-verifikasi',
    'Ditolak': 'status-ditolak',
    'Proses Persetujuan': 'status-persetujuan',
    'Pencairan': 'status-pencairan'
  }
  return classes[status] || ''
}

const getIMBClass = (status) => {
  const classes = {
    'Ada': 'imb-ada',
    'Tidak Ada': 'imb-tidak',
    'Dalam Pengajuan': 'imb-proses'
  }
  return classes[status] || ''
}

const getYayasanClass = (status) => {
  const classes = {
    'Ada': 'yayasan-ada',
    'Tidak Ada': 'yayasan-tidak',
    'Dalam Pengajuan': 'yayasan-proses'
  }
  return classes[status] || ''
}

const getSLFClass = (status) => {
  const classes = {
    'Ada': 'slf-ada',
    'Tidak Ada': 'slf-tidak',
    'Dalam Pengajuan': 'slf-proses'
  }
  return classes[status] || ''
}

const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  filterIMB.value = ''
  filterYayasan.value = ''
  currentPage.value = 1
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page) => {
  currentPage.value = page
}

const viewDetail = (pesantren) => {
  selectedPesantren.value = pesantren
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedPesantren.value = null
}

const editData = (pesantren) => {
  // encode data agar aman untuk dikirim sebagai param path
  const encodedData = encodeURIComponent(JSON.stringify(pesantren))
  // navigasi ke route: /pesantren/form/:data?
  router.push({
    name: 'form_pesantren',
    params: { data: encodedData }
  })
}


const deleteData = (pesantren) => {
  if (confirm(`Hapus data ${pesantren.nama}?`)) {
    const index = pesantrenData.findIndex(p => p.id === pesantren.id)
    if (index > -1) {
      pesantrenData.splice(index, 1)
    }
  }
}

const exportToExcel = () => {
  alert('Export to Excel - Feature coming soon!')
}

const printTable = () => {
  window.print()
}
</script>

<style scoped>
.tabel-pengajuan-pesantren-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 24px;
  background-color: #f9fafb;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 10px 20px;
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

.filter-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-box {
  position: relative;
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
}

.filter-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 10px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.summary-info {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  padding: 12px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.info-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.info-label {
  font-weight: 600;
  color: #6b7280;
  font-size: 14px;
}

.info-value {
  font-weight: 700;
  color: #1f2937;
  font-size: 14px;
}

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  margin-bottom: 20px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 2200px;
}

.data-table thead {
  background-color: #f3f4f6;
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table th {
  padding: 14px 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  white-space: nowrap;
}

.data-table td {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
}

.data-table tbody tr:hover {
  background-color: #f9fafb;
}

.sticky-col {
  position: sticky;
  left: 0;
  background-color: #f3f4f6;
  z-index: 11;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
}

.pagination-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 12px 0;
}

.pagination-info {
  color: #6b7280;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

/* tombol pagination umum */
.btn-pagination,
.btn-page {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: white;
  cursor: pointer;
  font-weight: 600;
  color: #374151;
  transition: background-color 0.15s, border-color 0.15s, transform 0.05s;
  min-width: 44px;
  text-align: center;
  box-shadow: none;
}

/* prev/next disabled */
.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* hover states */
.btn-pagination:hover:not(:disabled),
.btn-page:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

/* active page */
.btn-page.active {
  background: #3b82f6;
  color: #ffffff;
  border-color: #3b82f6;
  box-shadow: 0 2px 6px rgba(59,130,246,0.15);
}

/* ringan untuk visual ketika banyak halaman */
.btn-page {
  padding: 6px 10px;
  min-width: 36px;
  border-radius: 6px;
}

/* items per page */
.items-per-page {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #374151;
  font-size: 14px;
}

.select-items {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: white;
  font-size: 14px;
  cursor: pointer;
}

/* responsive: pindah ke kolom pada layar kecil */
@media (max-width: 768px) {
  .pagination-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .pagination-controls {
    order: 2;
    width: 100%;
    overflow-x: auto;
    padding-bottom: 6px;
  }
  .pagination-controls .btn-page,
  .pagination-controls .btn-pagination {
    flex: 0 0 auto;
  }
  .items-per-page {
    order: 3;
  }
  .pagination-info {
    order: 1;
  }
}

/* badge umum untuk status */
.badge {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 13px;
  box-shadow: 0 2px 6px rgba(2,6,23,0.06);
  border: 1px solid rgba(0,0,0,0.03);
}

/* badge khusus status pengajuan (lebih estetis, kontras, mudah dibaca) */
.badge-status {
  color: #0b1320;
  background: linear-gradient(90deg, #eef2ff 0%, #dbeafe 100%);
  border-color: rgba(59,130,246,0.15);
}

/* Warna per status */
.status-pendaftaran { /* kuning/oranye - perhatian awal */
  background: linear-gradient(90deg, #fff7ed 0%, #ffedd5 50%, #ffd29b 100%);
  color: #92400e;
  border-color: rgba(245,158,11,0.12);
}

.status-verifikasi { /* biru - proses verifikasi */
  background: linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%);
  color: #08306b;
  border-color: rgba(59,130,246,0.14);
}

.status-persetujuan { /* amber/ungu - menunggu persetujuan (menonjol) */
  background: linear-gradient(90deg, #fff7ed 0%, #fde68a 50%, #fb923c 100%);
  color: #5a3415;
  border-color: rgba(251,146,60,0.12);
}

.status-pencairan { /* hijau - sukses / cair */
  background: linear-gradient(90deg, #ecfdf5 0%, #bbf7d0 60%, #34d399 100%);
  color: #064e3b;
  border-color: rgba(16,185,129,0.12);
}

.status-ditolak { /* merah - ditolak */
  background: linear-gradient(90deg, #fff1f2 0%, #fecdd3 60%, #fb7185 100%);
  color: #6b0216;
  border-color: rgba(239,68,68,0.12);
}

/* kecilkan dan rapikan di tabel */
.data-table td .badge {
  padding: 6px 8px;
  font-size: 12px;
  border-radius: 8px;
}

/* clickable name */
.clickable-name {
  cursor: pointer;
  color: #1d4ed8;
  text-decoration: underline;
  font-weight: 700;
  outline: none;
  display: inline-block;
}
.clickable-name:focus {
  box-shadow: 0 0 0 4px rgba(59,130,246,0.12);
  border-radius: 6px;
  padding: 2px 4px;
}
/* hover for mouse users */
.clickable-name:hover {
  color: #0b63d6;
  text-decoration: none;
}
</style>