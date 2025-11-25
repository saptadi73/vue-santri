<template>
  <div class="tabel-alokasi-container">
    <!-- Header -->
    <div class="header-section">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          Pengalokasian Bantuan Pesantren
        </h2>
        <p class="text-gray-600">
          Data pengalokasian anggaran bantuan untuk pesantren yang telah diverifikasi
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
          placeholder="Cari nomor pengajuan, nama pesantren, atau petugas..."
          class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>

      <div class="filter-group">
        <select v-model="filterStatus" class="filter-select">
          <option value="">Semua Status</option>
          <option value="Pemeriksa 1 Disetujui">Pemeriksa 1 Disetujui</option>
          <option value="Pemeriksa 1 Ditolak">Pemeriksa 1 Ditolak</option>
          <option value="Pemeriksa 2 Disetujui">Pemeriksa 2 Disetujui</option>
          <option value="Pemeriksa 2 Ditolak">Pemeriksa 2 Ditolak</option>
          <option value="Disetujui Pejabat Berwenang">Disetujui Pejabat Berwenang</option>
          <option value="Ditolak Pejabat Berwenang">Ditolak Pejabat Berwenang</option>
        </select>

        <select v-model="filterAlokasi" class="filter-select">
          <option value="">Semua Alokasi</option>
          <option value="Kemenag">Kemenag</option>
          <option value="Kemendiknas">Kemendiknas</option>
          <option value="Kemensos">Kemensos</option>
          <option value="Bazis">Bazis</option>
          <option value="CSR Perusahaan">CSR Perusahaan</option>
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
        <span class="info-value">{{ filteredData.length }} pengajuan</span>
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
            <th class="sticky-col-2">Data Pengajuan</th>
            <th>Pemeriksa 1</th>
            <th>Pemeriksa 2</th>
            <th>Pejabat Berwenang</th>
            <th>Alokasi Anggaran</th>
            <th>Lembaga/Perusahaan</th>
            <th>Data Anggaran</th>
            <th>Status</th>
            <th class="action-col">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(alokasi, index) in paginatedData" :key="alokasi.noPengajuan">
            <td class="sticky-col text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            
            <!-- Data Pengajuan (No. Pengajuan + Nama Pesantren) -->
            <td class="sticky-col-2">
              <div class="data-group">
                <div class="data-name clickable-name" @click="editData(alokasi)">
                  {{ alokasi.noPengajuan }}
                </div>
                <div class="data-detail">{{ alokasi.namaPesantren }}</div>
              </div>
            </td>
            
            <!-- Pemeriksa 1 (Nama + Email) -->
            <td>
              <div class="data-group">
                <div class="data-name">{{ alokasi.pemeriksa1 }}</div>
                <div class="data-detail">📧 {{ alokasi.emailPemeriksa1 }}</div>
              </div>
            </td>
            
            <!-- Pemeriksa 2 (Nama + Email) -->
            <td>
              <div class="data-group">
                <div class="data-name">{{ alokasi.pemeriksa2 }}</div>
                <div class="data-detail">📧 {{ alokasi.emailPemeriksa2 }}</div>
              </div>
            </td>
            
            <!-- Pejabat Berwenang (Nama + Kedudukan + Email) -->
            <td>
              <div class="data-group">
                <div class="data-name">{{ alokasi.pejabat }}</div>
                <div class="data-detail">{{ alokasi.kedudukan }}</div>
                <div class="data-detail">📧 {{ alokasi.emailPejabat }}</div>
              </div>
            </td>
            
            <!-- Alokasi Anggaran -->
            <td>
              <span class="badge badge-alokasi" :class="getAlokasiClass(alokasi.alokasiAnggaran)">
                {{ alokasi.alokasiAnggaran }}
              </span>
            </td>
            
            <!-- Lembaga/Perusahaan -->
            <td>{{ alokasi.lembaga || '-' }}</td>
            
            <!-- Data Anggaran (No. MAK + Jumlah Pengajuan + Jumlah Disetujui) -->
            <td>
              <div class="data-group">
                <div class="data-detail">MAK: {{ alokasi.noMataAnggaran }}</div>
                <div class="data-name">Pengajuan: {{ formatCurrency(alokasi.jumlahPengajuan) }}</div>
                <div class="data-name text-success">Disetujui: {{ formatCurrency(alokasi.jumlahDisetujui) }}</div>
              </div>
            </td>
            
            <!-- Status -->
            <td>
              <span 
                class="badge badge-status" 
                :class="getStatusClass(alokasi.status)"
              >
                {{ alokasi.status }}
              </span>
            </td>
            
            <!-- Aksi -->
            <td class="action-col">
              <div class="action-buttons">
                <button 
                  @click="viewDokumen(alokasi)" 
                  class="btn-action btn-dokumen"
                  title="View Dokumen"
                >
                  📁
                </button>
                <button 
                  @click="viewDetail(alokasi)" 
                  class="btn-action btn-view"
                  title="Lihat Detail"
                >
                  👁️
                </button>
                <button 
                  @click="editData(alokasi)" 
                  class="btn-action btn-edit"
                  title="Edit"
                >
                  ✏️
                </button>
                <button 
                  @click="deleteData(alokasi)" 
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
          <h3 class="text-xl font-bold">Detail Pengalokasian</h3>
          <button @click="closeModal" class="btn-close">✕</button>
        </div>
        <div class="modal-body" v-if="selectedAlokasi">
          <div class="detail-grid">
            <div class="detail-section">
              <h4 class="section-title">Data Pengajuan</h4>
              <div class="detail-item">
                <span class="detail-label">No. Pengajuan:</span>
                <span class="detail-value">{{ selectedAlokasi.noPengajuan }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Nama Pesantren:</span>
                <span class="detail-value">{{ selectedAlokasi.namaPesantren }}</span>
              </div>
            </div>

            <div class="detail-section">
              <h4 class="section-title">Anggaran</h4>
              <div class="detail-item">
                <span class="detail-label">Alokasi:</span>
                <span class="detail-value">{{ selectedAlokasi.alokasiAnggaran }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Jumlah Pengajuan:</span>
                <span class="detail-value">{{ formatCurrency(selectedAlokasi.jumlahPengajuan) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Jumlah Disetujui:</span>
                <span class="detail-value">{{ formatCurrency(selectedAlokasi.jumlahDisetujui) }}</span>
              </div>
            </div>

            <div class="detail-section">
              <h4 class="section-title">Status</h4>
              <div class="detail-item">
                <span class="detail-label">Status:</span>
                <span 
                  class="badge badge-status" 
                  :class="getStatusClass(selectedAlokasi.status)"
                >
                  {{ selectedAlokasi.status }}
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

// Data Static Alokasi
const alokasiData = reactive([
  {
    noPengajuan: 'PB-2024-001',
    namaPesantren: 'Pesantren Al-Falah',
    pemeriksa1: 'Dr. Siti Aminah, M.Pd',
    emailPemeriksa1: 'siti.aminah@kemenag.go.id',
    pemeriksa2: 'Drs. Budi Santoso, M.Si',
    emailPemeriksa2: 'budi.santoso@kemenag.go.id',
    pejabat: 'Prof. Dr. H. Ahmad Syafii, M.A',
    kedudukan: 'Kepala Kanwil Kemenag DKI Jakarta',
    emailPejabat: 'ahmad.syafii@kemenag.go.id',
    alokasiAnggaran: 'Kemenag',
    lembaga: 'Kementerian Agama RI',
    noMataAnggaran: 'MAK-2024-001-KMG',
    jumlahPengajuan: 150000000,
    jumlahDisetujui: 150000000,
    status: 'Disetujui Pejabat Berwenang'
  },
  {
    noPengajuan: 'PB-2024-002',
    namaPesantren: 'Pesantren Darul Ulum',
    pemeriksa1: 'Dra. Nurul Hidayah, M.Pd',
    emailPemeriksa1: 'nurul.hidayah@kemdikbud.go.id',
    pemeriksa2: 'Dr. Eko Prasetyo, S.Pd, M.Ed',
    emailPemeriksa2: 'eko.prasetyo@kemdikbud.go.id',
    pejabat: 'Dr. Ir. Bambang Sutrisno, M.Pd',
    kedudukan: 'Kepala Dinas Pendidikan Provinsi',
    emailPejabat: 'bambang.sutrisno@kemdikbud.go.id',
    alokasiAnggaran: 'Kemendiknas',
    lembaga: 'Kemendikbudristek RI',
    noMataAnggaran: 'MAK-2024-002-KDK',
    jumlahPengajuan: 85000000,
    jumlahDisetujui: 75000000,
    status: 'Pemeriksa 2 Disetujui'
  },
  {
    noPengajuan: 'PB-2024-003',
    namaPesantren: 'Pesantren Al-Ikhlas',
    pemeriksa1: 'Drs. Agus Salim, M.Sos',
    emailPemeriksa1: 'agus.salim@kemensos.go.id',
    pemeriksa2: 'Dra. Sri Wahyuni, S.Sos, M.Si',
    emailPemeriksa2: 'sri.wahyuni@kemensos.go.id',
    pejabat: 'Dr. H. Mahmud Ali, S.Sos, M.Si',
    kedudukan: 'Kepala Dinas Sosial Provinsi',
    emailPejabat: 'mahmud.ali@kemensos.go.id',
    alokasiAnggaran: 'Kemensos',
    lembaga: 'Kementerian Sosial RI',
    noMataAnggaran: 'MAK-2024-003-KMS',
    jumlahPengajuan: 120000000,
    jumlahDisetujui: 0,
    status: 'Pemeriksa 1 Ditolak'
  },
  {
    noPengajuan: 'PB-2024-004',
    namaPesantren: 'Pesantren Nurul Huda',
    pemeriksa1: 'H. Abdullah Rahman, Lc, M.A',
    emailPemeriksa1: 'abdullah.rahman@bazis.or.id',
    pemeriksa2: 'Hj. Khadijah Maryam, S.Ag, M.Si',
    emailPemeriksa2: 'khadijah.maryam@bazis.or.id',
    pejabat: 'KH. Dr. Umar Faruq, M.A',
    kedudukan: 'Ketua Bazis DKI Jakarta',
    emailPejabat: 'umar.faruq@bazis.or.id',
    alokasiAnggaran: 'Bazis',
    lembaga: 'Bazis DKI Jakarta',
    noMataAnggaran: 'MAK-2024-004-BZS',
    jumlahPengajuan: 65000000,
    jumlahDisetujui: 65000000,
    status: 'Pemeriksa 1 Disetujui'
  },
  {
    noPengajuan: 'PB-2024-005',
    namaPesantren: 'Pesantren Al-Hidayah',
    pemeriksa1: 'Ir. Dewi Sartika, M.M, MBA',
    emailPemeriksa1: 'dewi.sartika@pertamina.com',
    pemeriksa2: 'Drs. Rina Susanti, M.M',
    emailPemeriksa2: 'rina.susanti@pertamina.com',
    pejabat: 'Ir. H. Bambang Hartono, M.B.A',
    kedudukan: 'VP Corporate Social Responsibility',
    emailPejabat: 'bambang.hartono@pertamina.com',
    alokasiAnggaran: 'CSR Perusahaan',
    lembaga: 'PT Pertamina (Persero)',
    noMataAnggaran: 'CSR-2024-001-PTM',
    jumlahPengajuan: 250000000,
    jumlahDisetujui: 250000000,
    status: 'Disetujui Pejabat Berwenang'
  },
  {
    noPengajuan: 'PB-2024-006',
    namaPesantren: 'Pesantren Al-Muhajirin',
    pemeriksa1: 'Dr. Lina Marlina, S.Pd, M.Pd',
    emailPemeriksa1: 'lina.marlina@kemenag.go.id',
    pemeriksa2: 'Drs. Ahmad Yani, M.Ag',
    emailPemeriksa2: 'ahmad.yani@kemenag.go.id',
    pejabat: 'Prof. Dr. H. Ahmad Syafii, M.A',
    kedudukan: 'Kepala Kanwil Kemenag DKI Jakarta',
    emailPejabat: 'ahmad.syafii@kemenag.go.id',
    alokasiAnggaran: 'Kemenag',
    lembaga: 'Kementerian Agama RI',
    noMataAnggaran: 'MAK-2024-005-KMG',
    jumlahPengajuan: 95000000,
    jumlahDisetujui: 90000000,
    status: 'Pemeriksa 2 Disetujui'
  },
  {
    noPengajuan: 'PB-2024-007',
    namaPesantren: 'Pesantren Darul Hikam',
    pemeriksa1: 'Dra. Ratna Sari, M.Pd',
    emailPemeriksa1: 'ratna.sari@kemdikbud.go.id',
    pemeriksa2: 'Dr. Hendra Gunawan, S.Pd, M.Si',
    emailPemeriksa2: 'hendra.gunawan@kemdikbud.go.id',
    pejabat: 'Dr. Ir. Bambang Sutrisno, M.Pd',
    kedudukan: 'Kepala Dinas Pendidikan Provinsi',
    emailPejabat: 'bambang.sutrisno@kemdikbud.go.id',
    alokasiAnggaran: 'Kemendiknas',
    lembaga: 'Kemendikbudristek RI',
    noMataAnggaran: 'MAK-2024-006-KDK',
    jumlahPengajuan: 180000000,
    jumlahDisetujui: 180000000,
    status: 'Disetujui Pejabat Berwenang'
  },
  {
    noPengajuan: 'PB-2024-008',
    namaPesantren: 'Pesantren Al-Barkah',
    pemeriksa1: 'Drs. Hendro Sucipto, M.Sos',
    emailPemeriksa1: 'hendro.sucipto@kemensos.go.id',
    pemeriksa2: 'Dra. Ani Rahmawati, M.Si',
    emailPemeriksa2: 'ani.rahmawati@kemensos.go.id',
    pejabat: 'Dr. H. Mahmud Ali, S.Sos, M.Si',
    kedudukan: 'Kepala Dinas Sosial Provinsi',
    emailPejabat: 'mahmud.ali@kemensos.go.id',
    alokasiAnggaran: 'Kemensos',
    lembaga: 'Kementerian Sosial RI',
    noMataAnggaran: 'MAK-2024-007-KMS',
    jumlahPengajuan: 110000000,
    jumlahDisetujui: 110000000,
    status: 'Pemeriksa 1 Disetujui'
  },
  {
    noPengajuan: 'PB-2024-009',
    namaPesantren: 'Pesantren Raudhatul Jannah',
    pemeriksa1: 'H. Zainuddin Abbas, Lc, M.H.I',
    emailPemeriksa1: 'zainuddin.abbas@bazis.or.id',
    pemeriksa2: 'Hj. Maimunah, S.Ag, M.Pd.I',
    emailPemeriksa2: 'maimunah@bazis.or.id',
    pejabat: 'KH. Dr. Umar Faruq, M.A',
    kedudukan: 'Ketua Bazis DKI Jakarta',
    emailPejabat: 'umar.faruq@bazis.or.id',
    alokasiAnggaran: 'Bazis',
    lembaga: 'Bazis DKI Jakarta',
    noMataAnggaran: 'MAK-2024-008-BZS',
    jumlahPengajuan: 78000000,
    jumlahDisetujui: 0,
    status: 'Pemeriksa 2 Ditolak'
  },
  {
    noPengajuan: 'PB-2024-010',
    namaPesantren: 'Pesantren Al-Falah Ciledug',
    pemeriksa1: 'Ir. Putri Handayani, M.M',
    emailPemeriksa1: 'putri.handayani@telkom.co.id',
    pemeriksa2: 'Drs. Adi Nugroho, MBA',
    emailPemeriksa2: 'adi.nugroho@telkom.co.id',
    pejabat: 'Dr. Ir. Erick Thohir, M.Sc',
    kedudukan: 'Direktur Utama',
    emailPejabat: 'erick.thohir@telkom.co.id',
    alokasiAnggaran: 'CSR Perusahaan',
    lembaga: 'PT Telkom Indonesia (Persero) Tbk',
    noMataAnggaran: 'CSR-2024-002-TLK',
    jumlahPengajuan: 350000000,
    jumlahDisetujui: 350000000,
    status: 'Disetujui Pejabat Berwenang'
  },
  {
    noPengajuan: 'PB-2024-011',
    namaPesantren: 'Pesantren Nurul Iman',
    pemeriksa1: 'Dr. Wahyu Prasetyo, M.Pd',
    emailPemeriksa1: 'wahyu.prasetyo@kemenag.go.id',
    pemeriksa2: 'Dra. Erna Wati, M.Ag',
    emailPemeriksa2: 'erna.wati@kemenag.go.id',
    pejabat: 'Prof. Dr. H. Ahmad Syafii, M.A',
    kedudukan: 'Kepala Kanwil Kemenag DKI Jakarta',
    emailPejabat: 'ahmad.syafii@kemenag.go.id',
    alokasiAnggaran: 'Kemenag',
    lembaga: 'Kementerian Agama RI',
    noMataAnggaran: 'MAK-2024-009-KMG',
    jumlahPengajuan: 125000000,
    jumlahDisetujui: 120000000,
    status: 'Pemeriksa 2 Disetujui'
  },
  {
    noPengajuan: 'PB-2024-012',
    namaPesantren: 'Pesantren Daarul Quran',
    pemeriksa1: 'Dra. Maya Sari, M.Pd',
    emailPemeriksa1: 'maya.sari@kemdikbud.go.id',
    pemeriksa2: 'Dr. Rudi Hartono, S.Pd, M.Ed',
    emailPemeriksa2: 'rudi.hartono@kemdikbud.go.id',
    pejabat: 'Dr. Ir. Bambang Sutrisno, M.Pd',
    kedudukan: 'Kepala Dinas Pendidikan Provinsi',
    emailPejabat: 'bambang.sutrisno@kemdikbud.go.id',
    alokasiAnggaran: 'Kemendiknas',
    lembaga: 'Kemendikbudristek RI',
    noMataAnggaran: 'MAK-2024-010-KDK',
    jumlahPengajuan: 200000000,
    jumlahDisetujui: 0,
    status: 'Ditolak Pejabat Berwenang'
  },
  {
    noPengajuan: 'PB-2024-013',
    namaPesantren: 'Pesantren Al-Kautsar',
    pemeriksa1: 'Drs. Joko Widodo, M.Sos',
    emailPemeriksa1: 'joko.widodo@kemensos.go.id',
    pemeriksa2: 'Dra. Siti Nurjanah, M.Si',
    emailPemeriksa2: 'siti.nurjanah@kemensos.go.id',
    pejabat: 'Dr. H. Mahmud Ali, S.Sos, M.Si',
    kedudukan: 'Kepala Dinas Sosial Provinsi',
    emailPejabat: 'mahmud.ali@kemensos.go.id',
    alokasiAnggaran: 'Kemensos',
    lembaga: 'Kementerian Sosial RI',
    noMataAnggaran: 'MAK-2024-011-KMS',
    jumlahPengajuan: 140000000,
    jumlahDisetujui: 140000000,
    status: 'Disetujui Pejabat Berwenang'
  },
  {
    noPengajuan: 'PB-2024-014',
    namaPesantren: 'Pesantren Miftahul Huda',
    pemeriksa1: 'H. Fahmi Idris, Lc, M.Pd.I',
    emailPemeriksa1: 'fahmi.idris@bazis.or.id',
    pemeriksa2: 'Hj. Umi Salamah, S.Ag, M.Si',
    emailPemeriksa2: 'umi.salamah@bazis.or.id',
    pejabat: 'KH. Dr. Umar Faruq, M.A',
    kedudukan: 'Ketua Bazis DKI Jakarta',
    emailPejabat: 'umar.faruq@bazis.or.id',
    alokasiAnggaran: 'Bazis',
    lembaga: 'Bazis DKI Jakarta',
    noMataAnggaran: 'MAK-2024-012-BZS',
    jumlahPengajuan: 88000000,
    jumlahDisetujui: 88000000,
    status: 'Pemeriksa 1 Disetujui'
  },
  {
    noPengajuan: 'PB-2024-015',
    namaPesantren: 'Pesantren Al-Madinah',
    pemeriksa1: 'Ir. Diana Puspitasari, M.M',
    emailPemeriksa1: 'diana.puspitasari@pln.co.id',
    pemeriksa2: 'Drs. Bambang Suryadi, MBA',
    emailPemeriksa2: 'bambang.suryadi@pln.co.id',
    pejabat: 'Ir. Darmawan Prasodjo, M.Sc',
    kedudukan: 'Direktur Utama PLN',
    emailPejabat: 'darmawan.prasodjo@pln.co.id',
    alokasiAnggaran: 'CSR Perusahaan',
    lembaga: 'PT PLN (Persero)',
    noMataAnggaran: 'CSR-2024-003-PLN',
    jumlahPengajuan: 450000000,
    jumlahDisetujui: 450000000,
    status: 'Disetujui Pejabat Berwenang'
  }
])

// State
const searchQuery = ref('')
const filterStatus = ref('')
const filterAlokasi = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showModal = ref(false)
const selectedAlokasi = ref(null)

// Computed
const filteredData = computed(() => {
  let data = alokasiData

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    data = data.filter(alokasi => 
      alokasi.noPengajuan.toLowerCase().includes(query) ||
      alokasi.namaPesantren.toLowerCase().includes(query) ||
      alokasi.pemeriksa1.toLowerCase().includes(query) ||
      alokasi.pemeriksa2.toLowerCase().includes(query)
    )
  }

  if (filterStatus.value) {
    data = data.filter(alokasi => alokasi.status === filterStatus.value)
  }

  if (filterAlokasi.value) {
    data = data.filter(alokasi => alokasi.alokasiAnggaran === filterAlokasi.value)
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
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

const getStatusClass = (status) => {
  const classes = {
    'Pemeriksa 1 Disetujui': 'status-p1-setuju',
    'Pemeriksa 1 Ditolak': 'status-p1-tolak',
    'Pemeriksa 2 Disetujui': 'status-p2-setuju',
    'Pemeriksa 2 Ditolak': 'status-p2-tolak',
    'Disetujui Pejabat Berwenang': 'status-pejabat-setuju',
    'Ditolak Pejabat Berwenang': 'status-pejabat-tolak'
  }
  return classes[status] || ''
}

const getAlokasiClass = (alokasi) => {
  const classes = {
    'Kemenag': 'alokasi-kemenag',
    'Kemendiknas': 'alokasi-kemendiknas',
    'Kemensos': 'alokasi-kemensos',
    'Bazis': 'alokasi-bazis',
    'CSR Perusahaan': 'alokasi-csr'
  }
  return classes[alokasi] || ''
}

const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  filterAlokasi.value = ''
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

const viewDetail = (alokasi) => {
  selectedAlokasi.value = alokasi
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedAlokasi.value = null
}

const viewDokumen = (alokasi) => {
  const encodedData = encodeURIComponent(JSON.stringify(alokasi))
  router.push({ 
    name: 'dokumen_pesantren', 
    params: { data: encodedData } 
  })
}

const editData = (alokasi) => {
  const encodedData = encodeURIComponent(JSON.stringify(alokasi))
  router.push({ 
    name: 'form_alokasi_pesantren', 
    params: { data: encodedData } 
  })
}

const deleteData = (alokasi) => {
  if (confirm(`Hapus data pengalokasian ${alokasi.noPengajuan}?`)) {
    const index = alokasiData.findIndex(a => a.noPengajuan === alokasi.noPengajuan)
    if (index > -1) {
      alokasiData.splice(index, 1)
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
.tabel-alokasi-container {
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
  min-width: 1800px;
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

.text-success {
  color: #10b981;
  font-weight: 700;
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

.alokasi-kemenag {
  background-color: #10b981;
}

.alokasi-kemendiknas {
  background-color: #3b82f6;
}

.alokasi-kemensos {
  background-color: #f59e0b;
}

.alokasi-bazis {
  background-color: #8b5cf6;
}

.alokasi-csr {
  background-color: #ec4899;
}

.status-p1-setuju {
  background-color: #10b981;
}

.status-p1-tolak {
  background-color: #ef4444;
}

.status-p2-setuju {
  background-color: #3b82f6;
}

.status-p2-tolak {
  background-color: #f59e0b;
}

.status-pejabat-setuju {
  background-color: #059669;
}

.status-pejabat-tolak {
  background-color: #dc2626;
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

.btn-dokumen {
  background-color: #ddd6fe;
}

.btn-dokumen:hover {
  background-color: #c4b5fd;
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
  .tabel-alokasi-container {
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
