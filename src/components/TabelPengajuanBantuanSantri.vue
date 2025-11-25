<template>
  <div class="tabel-pengajuan-container">
    <!-- Header -->
    <div class="header-section">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          Daftar Santri dalam Pengajuan Bantuan
        </h2>
        <p class="text-gray-600">
          Data santri yang sedang dalam proses pengajuan bantuan sosial
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
          placeholder="Cari nama santri, NIK, atau pesantren..."
          class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>

      <div class="filter-group">
        <select v-model="filterStatus" class="filter-select">
          <option value="">Semua Status</option>
          <option value="Pendaftaran">Pendaftaran</option>
          <option value="Verifikasi">Verifikasi</option>
          <option value="Wawancara">Wawancara</option>
          <option value="Proses Persetujuan">Proses Persetujuan</option>
          <option value="Pencairan">Pencairan</option>
        </select>

        <select v-model="filterTingkat" class="filter-select">
          <option value="">Semua Tingkat</option>
          <option value="MI">MI</option>
          <option value="SD">SD</option>
          <option value="MTs">MTs</option>
          <option value="SMP">SMP</option>
          <option value="MA">MA</option>
          <option value="SMA">SMA</option>
          <option value="Mahasiswa">Mahasiswa</option>
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
        <span class="info-value">{{ filteredData.length }} santri</span>
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
            <th class="sticky-col-2">Data Santri</th>
            <th>Alamat Santri</th>
            <th>Data Orang Tua</th>
            <th>Pondok Pesantren</th>
            <th>Tingkat</th>
            <th>Alamat Pesantren</th>
            <th>Petugas Verifikasi</th>
            <th>Status</th>
            <th class="action-col">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(santri, index) in paginatedData" :key="santri.nik">
            <td class="sticky-col text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            
            <!-- Data Santri (Nama, NIK, HP) -->
            <td class="sticky-col-2">
              <div class="data-group">
                <div class="data-name clickable-name" @click="editData(santri)">
                  {{ santri.nama }}
                </div>
                <div class="data-detail">NIK: {{ santri.nik }}</div>
                <div class="data-detail">HP: {{ santri.hp }}</div>
              </div>
            </td>
            
            <!-- Alamat Santri -->
            <td class="max-w-xs">{{ santri.alamat }}</td>
            
            <!-- Data Orang Tua (Nama, NIK, HP) -->
            <td>
              <div class="data-group">
                <div class="data-name">{{ santri.namaOrtu }}</div>
                <div class="data-detail">NIK: {{ santri.nikOrtu }}</div>
                <div class="data-detail">HP: {{ santri.hpOrtu }}</div>
              </div>
            </td>
            
            <!-- Pondok Pesantren (Nama, Pengasuh, HP) -->
            <td>
              <div class="data-group">
                <div class="data-name">{{ santri.pesantren }}</div>
                <div class="data-detail">Pengasuh: {{ santri.namaPengasuh }}</div>
                <div class="data-detail">HP: {{ santri.hpPengasuh }}</div>
              </div>
            </td>
            
            <!-- Tingkat -->
            <td class="text-center">
              <span class="badge badge-tingkat">{{ santri.tingkat }}</span>
            </td>
            
            <!-- Alamat Pesantren -->
            <td class="max-w-xs">{{ santri.alamatPesantren }}</td>
            
            <!-- Petugas Verifikasi (Nama, HP) -->
            <td>
              <div class="data-group">
                <div class="data-name">{{ santri.petugasVerifikasi }}</div>
                <div class="data-detail">HP: {{ santri.hpPetugas }}</div>
              </div>
            </td>
            
            <!-- Status -->
            <td>
              <span 
                class="badge badge-status" 
                :class="getStatusClass(santri.status)"
              >
                {{ santri.status }}
              </span>
            </td>
            
            <!-- Aksi -->
            <td class="action-col">
              <div class="action-buttons">
                <button 
                  @click="viewDetail(santri)" 
                  class="btn-action btn-view"
                  title="Lihat Detail"
                >
                  👁️
                </button>
                <button 
                  @click="editData(santri)" 
                  class="btn-action btn-edit"
                  title="Edit"
                >
                  ✏️
                </button>
                <button 
                  @click="deleteData(santri)" 
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

    <!-- Modal Detail (Optional) -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="text-xl font-bold">Detail Santri</h3>
          <button @click="closeModal" class="btn-close">✕</button>
        </div>
        <div class="modal-body" v-if="selectedSantri">
          <div class="detail-grid">
            <div class="detail-section">
              <h4 class="section-title">Data Santri</h4>
              <div class="detail-item">
                <span class="detail-label">Nama:</span>
                <span class="detail-value">{{ selectedSantri.nama }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">NIK:</span>
                <span class="detail-value">{{ selectedSantri.nik }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">HP:</span>
                <span class="detail-value">{{ selectedSantri.hp }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Alamat:</span>
                <span class="detail-value">{{ selectedSantri.alamat }}</span>
              </div>
            </div>

            <div class="detail-section">
              <h4 class="section-title">Data Orang Tua</h4>
              <div class="detail-item">
                <span class="detail-label">Nama:</span>
                <span class="detail-value">{{ selectedSantri.namaOrtu }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">NIK:</span>
                <span class="detail-value">{{ selectedSantri.nikOrtu }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">HP:</span>
                <span class="detail-value">{{ selectedSantri.hpOrtu }}</span>
              </div>
            </div>

            <div class="detail-section">
              <h4 class="section-title">Data Pesantren</h4>
              <div class="detail-item">
                <span class="detail-label">Pesantren:</span>
                <span class="detail-value">{{ selectedSantri.pesantren }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Tingkat:</span>
                <span class="detail-value">{{ selectedSantri.tingkat }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Alamat:</span>
                <span class="detail-value">{{ selectedSantri.alamatPesantren }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Pengasuh:</span>
                <span class="detail-value">{{ selectedSantri.namaPengasuh }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">HP Pengasuh:</span>
                <span class="detail-value">{{ selectedSantri.hpPengasuh }}</span>
              </div>
            </div>

            <div class="detail-section">
              <h4 class="section-title">Data Verifikasi</h4>
              <div class="detail-item">
                <span class="detail-label">Petugas:</span>
                <span class="detail-value">{{ selectedSantri.petugasVerifikasi }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">HP Petugas:</span>
                <span class="detail-value">{{ selectedSantri.hpPetugas }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Status:</span>
                <span 
                  class="badge badge-status" 
                  :class="getStatusClass(selectedSantri.status)"
                >
                  {{ selectedSantri.status }}
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

// Data Static Santri
const santriData = reactive([
  {
    nama: 'Ahmad Fauzi',
    nik: '3201012001010001',
    hp: '081234567801',
    alamat: 'Jl. Merdeka No. 123, Bandung',
    namaOrtu: 'Budi Santoso',
    nikOrtu: '3201011975010001',
    hpOrtu: '081234567802',
    pesantren: 'Pondok Pesantren Al-Hikmah',
    tingkat: 'MA',
    alamatPesantren: 'Jl. Pesantren No. 45, Bandung',
    namaPengasuh: 'KH. Abdullah Syafi\'i',
    hpPengasuh: '081234567803',
    petugasVerifikasi: 'Siti Nurhaliza',
    hpPetugas: '081234567804',
    status: 'Verifikasi'
  },
  {
    nama: 'Fatimah Azzahra',
    nik: '3201012002020002',
    hp: '081234567805',
    alamat: 'Jl. Sudirman No. 456, Jakarta',
    namaOrtu: 'Hasan Basri',
    nikOrtu: '3201011976020002',
    hpOrtu: '081234567806',
    pesantren: 'Pondok Pesantren Daarut Tauhid',
    tingkat: 'MTs',
    alamatPesantren: 'Jl. Geger Kalong No. 67, Bandung',
    namaPengasuh: 'KH. Ahmad Dahlan',
    hpPengasuh: '081234567807',
    petugasVerifikasi: 'Budi Hartono',
    hpPetugas: '081234567808',
    status: 'Pendaftaran'
  },
  {
    nama: 'Muhammad Rizki',
    nik: '3201012003030003',
    hp: '081234567809',
    alamat: 'Jl. Asia Afrika No. 789, Bandung',
    namaOrtu: 'Suryadi',
    nikOrtu: '3201011977030003',
    hpOrtu: '081234567810',
    pesantren: 'Pondok Pesantren Nurul Iman',
    tingkat: 'SMA',
    alamatPesantren: 'Jl. Cibiru No. 89, Bandung',
    namaPengasuh: 'KH. Muhammad Yusuf',
    hpPengasuh: '081234567811',
    petugasVerifikasi: 'Dewi Sartika',
    hpPetugas: '081234567812',
    status: 'Wawancara'
  },
  {
    nama: 'Siti Aisyah',
    nik: '3201012004040004',
    hp: '081234567813',
    alamat: 'Jl. Gatot Subroto No. 321, Surabaya',
    namaOrtu: 'Mahmud Ali',
    nikOrtu: '3201011978040004',
    hpOrtu: '081234567814',
    pesantren: 'Pondok Pesantren Al-Falah',
    tingkat: 'MI',
    alamatPesantren: 'Jl. Raya Lembang No. 12, Bandung',
    namaPengasuh: 'Nyai Hj. Siti Khadijah',
    hpPengasuh: '081234567815',
    petugasVerifikasi: 'Ahmad Yani',
    hpPetugas: '081234567816',
    status: 'Proses Persetujuan'
  },
  {
    nama: 'Abdullah Rahman',
    nik: '3201012005050005',
    hp: '081234567817',
    alamat: 'Jl. Diponegoro No. 654, Semarang',
    namaOrtu: 'Usman Harun',
    nikOrtu: '3201011979050005',
    hpOrtu: '081234567818',
    pesantren: 'Pondok Pesantren Darul Ulum',
    tingkat: 'Mahasiswa',
    alamatPesantren: 'Jl. Cimahi No. 34, Bandung',
    namaPengasuh: 'KH. Zainuddin MZ',
    hpPengasuh: '081234567819',
    petugasVerifikasi: 'Rina Susanti',
    hpPetugas: '081234567820',
    status: 'Pencairan'
  },
  {
    nama: 'Khadijah Maryam',
    nik: '3201012006060006',
    hp: '081234567821',
    alamat: 'Jl. Ahmad Yani No. 987, Yogyakarta',
    namaOrtu: 'Ibrahim Khalil',
    nikOrtu: '3201011980060006',
    hpOrtu: '081234567822',
    pesantren: 'Pondok Pesantren Al-Munawwir',
    tingkat: 'SD',
    alamatPesantren: 'Jl. Soreang No. 56, Bandung',
    namaPengasuh: 'KH. Hasyim Asy\'ari',
    hpPengasuh: '081234567823',
    petugasVerifikasi: 'Bambang Sutrisno',
    hpPetugas: '081234567824',
    status: 'Verifikasi'
  },
  {
    nama: 'Umar Faruq',
    nik: '3201012007070007',
    hp: '081234567825',
    alamat: 'Jl. Veteran No. 147, Malang',
    namaOrtu: 'Yusuf Mansur',
    nikOrtu: '3201011981070007',
    hpOrtu: '081234567826',
    pesantren: 'Pondok Pesantren Sidogiri',
    tingkat: 'SMP',
    alamatPesantren: 'Jl. Buahbatu No. 78, Bandung',
    namaPengasuh: 'KH. Mustofa Bisri',
    hpPengasuh: '081234567827',
    petugasVerifikasi: 'Lina Marlina',
    hpPetugas: '081234567828',
    status: 'Pendaftaran'
  },
  {
    nama: 'Zainab Kubra',
    nik: '3201012008080008',
    hp: '081234567829',
    alamat: 'Jl. Pahlawan No. 258, Solo',
    namaOrtu: 'Hamzah Fansuri',
    nikOrtu: '3201011982080008',
    hpOrtu: '081234567830',
    pesantren: 'Pondok Pesantren Lirboyo',
    tingkat: 'MA',
    alamatPesantren: 'Jl. Ciwastra No. 90, Bandung',
    namaPengasuh: 'KH. Sahal Mahfudz',
    hpPengasuh: '081234567831',
    petugasVerifikasi: 'Eko Prasetyo',
    hpPetugas: '081234567832',
    status: 'Wawancara'
  },
  {
    nama: 'Ali Imran',
    nik: '3201012009090009',
    hp: '081234567833',
    alamat: 'Jl. Pemuda No. 369, Medan',
    namaOrtu: 'Zakariya Ansari',
    nikOrtu: '3201011983090009',
    hpOrtu: '081234567834',
    pesantren: 'Pondok Pesantren Tebuireng',
    tingkat: 'MTs',
    alamatPesantren: 'Jl. Kopo No. 123, Bandung',
    namaPengasuh: 'KH. Abdurrahman Wahid',
    hpPengasuh: '081234567835',
    petugasVerifikasi: 'Sri Wahyuni',
    hpPetugas: '081234567836',
    status: 'Proses Persetujuan'
  },
  {
    nama: 'Hafsah Ummu',
    nik: '3201012010100010',
    hp: '081234567837',
    alamat: 'Jl. Kartini No. 741, Palembang',
    namaOrtu: 'Bilal Habsyi',
    nikOrtu: '3201011984100010',
    hpOrtu: '081234567838',
    pesantren: 'Pondok Pesantren Gontor',
    tingkat: 'Mahasiswa',
    alamatPesantren: 'Jl. Bojongsoang No. 45, Bandung',
    namaPengasuh: 'KH. Imam Zarkasyi',
    hpPengasuh: '081234567839',
    petugasVerifikasi: 'Agus Salim',
    hpPetugas: '081234567840',
    status: 'Pencairan'
  },
  {
    nama: 'Hamzah Yusuf',
    nik: '3201012011110011',
    hp: '081234567841',
    alamat: 'Jl. Proklamasi No. 852, Makassar',
    namaOrtu: 'Umar Khattab',
    nikOrtu: '3201011985110011',
    hpOrtu: '081234567842',
    pesantren: 'Pondok Pesantren Al-Azhar',
    tingkat: 'MI',
    alamatPesantren: 'Jl. Dayeuhkolot No. 67, Bandung',
    namaPengasuh: 'KH. Ali Mustafa Yaqub',
    hpPengasuh: '081234567843',
    petugasVerifikasi: 'Nurul Hidayah',
    hpPetugas: '081234567844',
    status: 'Verifikasi'
  },
  {
    nama: 'Ruqayyah Zahra',
    nik: '3201012012120012',
    hp: '081234567845',
    alamat: 'Jl. Kemerdekaan No. 963, Balikpapan',
    namaOrtu: 'Salman Farisi',
    nikOrtu: '3201011986120012',
    hpOrtu: '081234567846',
    pesantren: 'Pondok Pesantren Raudlatul Ulum',
    tingkat: 'SMA',
    alamatPesantren: 'Jl. Banjaran No. 89, Bandung',
    namaPengasuh: 'KH. Maimun Zubair',
    hpPengasuh: '081234567847',
    petugasVerifikasi: 'Dedi Mulyadi',
    hpPetugas: '081234567848',
    status: 'Pendaftaran'
  }
])

// State
const searchQuery = ref('')
const filterStatus = ref('')
const filterTingkat = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showModal = ref(false)
const selectedSantri = ref(null)

// Computed
const filteredData = computed(() => {
  let data = santriData

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    data = data.filter(santri => 
      santri.nama.toLowerCase().includes(query) ||
      santri.nik.includes(query) ||
      santri.pesantren.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (filterStatus.value) {
    data = data.filter(santri => santri.status === filterStatus.value)
  }

  // Filter by tingkat
  if (filterTingkat.value) {
    data = data.filter(santri => santri.tingkat === filterTingkat.value)
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
    'Wawancara': 'status-wawancara',
    'Proses Persetujuan': 'status-persetujuan',
    'Pencairan': 'status-pencairan'
  }
  return classes[status] || ''
}

const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  filterTingkat.value = ''
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

const viewDetail = (santri) => {
  selectedSantri.value = santri
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedSantri.value = null
}

const editData = (santri) => {
  // Encode santri data to pass via route
  const encodedData = encodeURIComponent(JSON.stringify(santri))
  router.push({ 
    name: 'form_santri', 
    params: { data: encodedData } 
  })
}

const deleteData = (santri) => {
  if (confirm(`Hapus data ${santri.nama}?`)) {
    const index = santriData.findIndex(s => s.nik === santri.nik)
    if (index > -1) {
      santriData.splice(index, 1)
    }
  }
}

const exportToExcel = () => {
  alert('Export to Excel - Feature coming soon!')
  // Implement export logic
}

const printTable = () => {
  window.print()
}
</script>

<style scoped>
.tabel-pengajuan-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 24px;
  background-color: #f9fafb;
}

/* Header */
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

/* Buttons */
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

/* Filter Section */
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

/* Summary Info */
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

/* Table Container */
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
  min-width: 2000px;
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

/* Sticky Columns */
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

/* Data Group Styling */
.data-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
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

.data-detail {
  font-size: 11px;
  color: #6b7280;
}

/* Text Utilities */
.text-nowrap {
  white-space: nowrap;
}

.max-w-xs {
  max-width: 200px;
  white-space: normal;
  word-wrap: break-word;
}

/* Badges */
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
}

.badge-tingkat {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-status {
  color: white;
}

.status-pendaftaran {
  background-color: #6b7280;
}

.status-verifikasi {
  background-color: #f59e0b;
}

.status-wawancara {
  background-color: #3b82f6;
}

.status-persetujuan {
  background-color: #8b5cf6;
}

.status-pencairan {
  background-color: #10b981;
}

/* Action Buttons */
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

/* Pagination */
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

/* Modal */
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

/* Responsive */
@media (max-width: 768px) {
  .tabel-pengajuan-container {
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

/* Print Styles */
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
