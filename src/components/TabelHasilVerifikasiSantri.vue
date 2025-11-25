<template>
  <div class="tabel-verifikasi-container">
    <!-- Header -->
    <div class="header-section">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          Hasil Verifikasi Santri Calon Penerima Bantuan
        </h2>
        <p class="text-gray-600">
          Data hasil verifikasi santri yang telah diproses oleh petugas
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
          placeholder="Cari nomor pengajuan, nama santri, atau petugas..."
          class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>

      <div class="filter-group">
        <select v-model="filterStatus" class="filter-select">
          <option value="">Semua Status</option>
          <option value="Antrian">Antrian</option>
          <option value="Proses Pelengkapan Dokumen">Proses Pelengkapan Dokumen</option>
          <option value="Proses Laporan">Proses Laporan</option>
          <option value="Selesai">Selesai</option>
        </select>

        <select v-model="filterKedinasan" class="filter-select">
          <option value="">Semua Kedinasan</option>
          <option value="Dinsos">Dinsos</option>
          <option value="KUA">KUA</option>
          <option value="Dinas Pendidikan">Dinas Pendidikan</option>
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
        <span class="info-value">{{ filteredData.length }} verifikasi</span>
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
            <th class="sticky-col-2">No. Pengajuan</th>
            <th>Nama Santri</th>
            <th>Nama Petugas Verifikasi</th>
            <th>HP Petugas</th>
            <th>Kedinasan</th>
            <th>Status Verifikasi</th>
            <th class="action-col">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(verifikasi, index) in paginatedData" :key="verifikasi.noPengajuan">
            <td class="sticky-col text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            
            <!-- No. Pengajuan -->
            <td class="sticky-col-2">
              <div class="data-name clickable-name" @click="editData(verifikasi)">
                {{ verifikasi.noPengajuan }}
              </div>
            </td>
            
            <!-- Nama Santri -->
            <td>
              <div class="data-name">{{ verifikasi.namaSantri }}</div>
            </td>
            
            <!-- Nama Petugas Verifikasi -->
            <td>
              <div class="data-name">{{ verifikasi.namaPetugas }}</div>
            </td>
            
            <!-- HP Petugas -->
            <td>{{ verifikasi.hpPetugas }}</td>
            
            <!-- Kedinasan -->
            <td>
              <span class="badge badge-kedinasan" :class="getKedinasanClass(verifikasi.kedinasan)">
                {{ verifikasi.kedinasan }}
              </span>
            </td>
            
            <!-- Status Verifikasi -->
            <td>
              <span 
                class="badge badge-status" 
                :class="getStatusClass(verifikasi.statusVerifikasi)"
              >
                {{ verifikasi.statusVerifikasi }}
              </span>
            </td>
            
            <!-- Aksi -->
            <td class="action-col">
              <div class="action-buttons">
                <button 
                  @click="viewDetail(verifikasi)" 
                  class="btn-action btn-view"
                  title="Lihat Detail"
                >
                  👁️
                </button>
                <button 
                  @click="editData(verifikasi)" 
                  class="btn-action btn-edit"
                  title="Edit"
                >
                  ✏️
                </button>
                <button 
                  @click="deleteData(verifikasi)" 
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
          <h3 class="text-xl font-bold">Detail Verifikasi</h3>
          <button @click="closeModal" class="btn-close">✕</button>
        </div>
        <div class="modal-body" v-if="selectedVerifikasi">
          <div class="detail-grid">
            <div class="detail-section">
              <h4 class="section-title">Data Pengajuan</h4>
              <div class="detail-item">
                <span class="detail-label">No. Pengajuan:</span>
                <span class="detail-value">{{ selectedVerifikasi.noPengajuan }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Nama Santri:</span>
                <span class="detail-value">{{ selectedVerifikasi.namaSantri }}</span>
              </div>
            </div>

            <div class="detail-section">
              <h4 class="section-title">Data Petugas</h4>
              <div class="detail-item">
                <span class="detail-label">Nama Petugas:</span>
                <span class="detail-value">{{ selectedVerifikasi.namaPetugas }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">HP Petugas:</span>
                <span class="detail-value">{{ selectedVerifikasi.hpPetugas }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Kedinasan:</span>
                <span class="detail-value">{{ selectedVerifikasi.kedinasan }}</span>
              </div>
            </div>

            <div class="detail-section">
              <h4 class="section-title">Status Verifikasi</h4>
              <div class="detail-item">
                <span class="detail-label">Status:</span>
                <span 
                  class="badge badge-status" 
                  :class="getStatusClass(selectedVerifikasi.statusVerifikasi)"
                >
                  {{ selectedVerifikasi.statusVerifikasi }}
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

// Data Static Verifikasi
const verifikasiData = reactive([
  {
    noPengajuan: 'PB-2024-001',
    namaSantri: 'Ahmad Fauzi',
    namaPetugas: 'Siti Nurhaliza',
    hpPetugas: '081234567804',
    kedinasan: 'Dinsos',
    statusVerifikasi: 'Selesai'
  },
  {
    noPengajuan: 'PB-2024-002',
    namaSantri: 'Fatimah Azzahra',
    namaPetugas: 'Budi Hartono',
    hpPetugas: '081234567808',
    kedinasan: 'KUA',
    statusVerifikasi: 'Proses Laporan'
  },
  {
    noPengajuan: 'PB-2024-003',
    namaSantri: 'Muhammad Rizki',
    namaPetugas: 'Dewi Sartika',
    hpPetugas: '081234567812',
    kedinasan: 'Dinas Pendidikan',
    statusVerifikasi: 'Proses Pelengkapan Dokumen'
  },
  {
    noPengajuan: 'PB-2024-004',
    namaSantri: 'Siti Aisyah',
    namaPetugas: 'Ahmad Yani',
    hpPetugas: '081234567816',
    kedinasan: 'Dinsos',
    statusVerifikasi: 'Antrian'
  },
  {
    noPengajuan: 'PB-2024-005',
    namaSantri: 'Abdullah Rahman',
    namaPetugas: 'Rina Susanti',
    hpPetugas: '081234567820',
    kedinasan: 'KUA',
    statusVerifikasi: 'Selesai'
  },
  {
    noPengajuan: 'PB-2024-006',
    namaSantri: 'Khadijah Maryam',
    namaPetugas: 'Bambang Sutrisno',
    hpPetugas: '081234567824',
    kedinasan: 'Dinas Pendidikan',
    statusVerifikasi: 'Proses Laporan'
  },
  {
    noPengajuan: 'PB-2024-007',
    namaSantri: 'Umar Faruq',
    namaPetugas: 'Lina Marlina',
    hpPetugas: '081234567828',
    kedinasan: 'Dinsos',
    statusVerifikasi: 'Antrian'
  },
  {
    noPengajuan: 'PB-2024-008',
    namaSantri: 'Zainab Kubra',
    namaPetugas: 'Eko Prasetyo',
    hpPetugas: '081234567832',
    kedinasan: 'KUA',
    statusVerifikasi: 'Proses Pelengkapan Dokumen'
  },
  {
    noPengajuan: 'PB-2024-009',
    namaSantri: 'Ali Imran',
    namaPetugas: 'Sri Wahyuni',
    hpPetugas: '081234567836',
    kedinasan: 'Dinas Pendidikan',
    statusVerifikasi: 'Selesai'
  },
  {
    noPengajuan: 'PB-2024-010',
    namaSantri: 'Hafsah Ummu',
    namaPetugas: 'Agus Salim',
    hpPetugas: '081234567840',
    kedinasan: 'Dinsos',
    statusVerifikasi: 'Proses Laporan'
  }
])

// State
const searchQuery = ref('')
const filterStatus = ref('')
const filterKedinasan = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showModal = ref(false)
const selectedVerifikasi = ref(null)

// Computed
const filteredData = computed(() => {
  let data = verifikasiData

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    data = data.filter(verifikasi => 
      verifikasi.noPengajuan.toLowerCase().includes(query) ||
      verifikasi.namaSantri.toLowerCase().includes(query) ||
      verifikasi.namaPetugas.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (filterStatus.value) {
    data = data.filter(verifikasi => verifikasi.statusVerifikasi === filterStatus.value)
  }

  // Filter by kedinasan
  if (filterKedinasan.value) {
    data = data.filter(verifikasi => verifikasi.kedinasan === filterKedinasan.value)
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
    'Antrian': 'status-antrian',
    'Proses Pelengkapan Dokumen': 'status-dokumen',
    'Proses Laporan': 'status-laporan',
    'Selesai': 'status-selesai'
  }
  return classes[status] || ''
}

const getKedinasanClass = (kedinasan) => {
  const classes = {
    'Dinsos': 'kedinasan-dinsos',
    'KUA': 'kedinasan-kua',
    'Dinas Pendidikan': 'kedinasan-pendidikan'
  }
  return classes[kedinasan] || ''
}

const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  filterKedinasan.value = ''
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

const viewDetail = (verifikasi) => {
  selectedVerifikasi.value = verifikasi
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedVerifikasi.value = null
}

const editData = (verifikasi) => {
  // Encode verifikasi data to pass via route
  const encodedData = encodeURIComponent(JSON.stringify(verifikasi))
  router.push({ 
    name: 'form_verifikasi_santri', 
    params: { data: encodedData } 
  })
}

const deleteData = (verifikasi) => {
  if (confirm(`Hapus data verifikasi ${verifikasi.noPengajuan}?`)) {
    const index = verifikasiData.findIndex(v => v.noPengajuan === verifikasi.noPengajuan)
    if (index > -1) {
      verifikasiData.splice(index, 1)
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
.tabel-verifikasi-container {
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
  min-width: 1200px;
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

.sticky-col-2 {
  position: sticky;
  left: 50px;
  background-color: #f3f4f6;
  z-index: 11;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
}

.data-table tbody .sticky-col,
.data-table tbody .sticky-col-2 {
  background-color: white;
}

.data-table tbody tr:hover .sticky-col,
.data-table tbody tr:hover .sticky-col-2 {
  background-color: #f9fafb;
}

.data-name {
  font-weight: 600;
  font-size: 13px;
  color: #1f2937;
}

.clickable-name {
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: underline;
}

.clickable-name:hover {
  color: #2563eb;
  text-decoration: none;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  color: white;
}

.kedinasan-dinsos {
  background-color: #3b82f6;
}

.kedinasan-kua {
  background-color: #10b981;
}

.kedinasan-pendidikan {
  background-color: #8b5cf6;
}

.status-antrian {
  background-color: #6b7280;
}

.status-dokumen {
  background-color: #f59e0b;
}

.status-laporan {
  background-color: #3b82f6;
}

.status-selesai {
  background-color: #10b981;
}

.action-col {
  position: sticky;
  right: 0;
  background-color: #f3f4f6;
  z-index: 11;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.05);
}

.data-table tbody .action-col {
  background-color: white;
}

.data-table tbody tr:hover .action-col {
  background-color: #f9fafb;
}

.action-buttons {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.btn-action {
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.btn-view {
  background-color: #dbeafe;
}

.btn-view:hover {
  background-color: #bfdbfe;
}

.btn-edit {
  background-color: #fef3c7;
}

.btn-edit:hover {
  background-color: #fde68a;
}

.btn-delete {
  background-color: #fee2e2;
}

.btn-delete:hover {
  background-color: #fecaca;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  gap: 16px;
}

.pagination-info {
  font-size: 14px;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-pagination {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-pagination:hover:not(:disabled) {
  background-color: #f3f4f6;
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-page {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  min-width: 40px;
}

.btn-page:hover {
  background-color: #f3f4f6;
}

.btn-page.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.items-per-page {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  color: #6b7280;
}

.select-items {
  padding: 6px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
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
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  background-color: #f3f4f6;
}

.modal-body {
  padding: 24px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.detail-section {
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #6b7280;
  font-size: 13px;
}

.detail-value {
  font-weight: 500;
  color: #1f2937;
  font-size: 13px;
  text-align: right;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 768px) {
  .tabel-verifikasi-container {
    padding: 16px;
  }

  .header-section {
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .btn {
    flex: 1;
  }

  .filter-group {
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }

  .pagination-container {
    flex-direction: column;
    align-items: stretch;
  }

  .pagination-controls {
    justify-content: center;
    flex-wrap: wrap;
  }

  .items-per-page {
    justify-content: center;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media print {
  .header-actions,
  .filter-section,
  .pagination-container,
  .action-col,
  .btn-action {
    display: none !important;
  }

  .table-container {
    box-shadow: none;
  }

  .data-table {
    font-size: 10px;
  }

  .data-table th,
  .data-table td {
    padding: 6px;
  }
}
</style>
