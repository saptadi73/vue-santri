<template>
  <div class="verifikasi-shell">
    <header class="page-head">
      <h2>Hasil Verifikasi Pesantren</h2>
      <div class="head-actions">
        <button @click="resetFilters">Reset</button>
      </div>
    </header>

    <section class="filters">
      <input v-model="searchQuery" placeholder="Cari no / pesantren / petugas…" />
      <select v-model="filterStatus">
        <option value="">Status</option>
        <option>Selesai</option>
        <option>Proses Pelengkapan Dokumen</option>
        <option>Proses Pelaporan</option>
      </select>
      <select v-model="filterKedinasan">
        <option value="">Kedinasan</option>
        <option>Dinsos</option>
        <option>KUA</option>
        <option>Dinas Pekerjaan Umum</option>
        <option>Dinas Perkimtan</option>
        <option>Bazis</option>
        <option>Swasta</option>
      </select>
    </section>

    <div class="table-wrap">
      <table class="verifikasi-table">
        <thead>
          <tr>
            <th>No</th>
            <th>No. Pengajuan</th>
            <th>Pesantren</th>
            <th>Pengasuh</th>
            <th>HP Pengasuh</th>
            <th>Petugas</th>
            <th>HP Petugas</th>
            <th>Kedinasan</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in paginatedData" :key="row.noPengajuan">
            <td>{{ startIndex + i + 1 }}</td>
            <td class="cell-link" @click="goForm(row)">{{ row.noPengajuan }}</td>
            <td class="cell-ellipsis" :title="row.namaPesantren">{{ row.namaPesantren }}</td>
            <td class="cell-ellipsis" :title="row.pengasuhPesantren">{{ row.pengasuhPesantren }}</td>
            <td>{{ row.hpPengasuh }}</td>
            <td class="cell-ellipsis" :title="row.namaPetugas">{{ row.namaPetugas }}</td>
            <td>{{ row.hpPetugas }}</td>
            <td><span class="badge kedinasan" :class="kedinasanClass(row.kedinasan)">{{ row.kedinasan }}</span></td>
            <td><span class="badge status" :class="statusClass(row.statusVerifikasi)">{{ row.statusVerifikasi }}</span></td>
            <td class="aksi">
              <button @click="showDetail(row)">👁️</button>
              <button @click="goForm(row)">✏️</button>
              <button @click="delRow(row)">🗑️</button>
            </td>
          </tr>
          <tr v-if="!paginatedData.length">
            <td colspan="10" class="empty">Tidak ada data</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pager">
      <span>Menampilkan {{ startIndex + 1 }} - {{ endIndex }} dari {{ filteredData.length }}</span>
      <div class="page-buttons">
        <button :disabled="currentPage===1" @click="currentPage--">←</button>
        <button v-for="p in totalPages" :key="p" @click="currentPage=p" :class="{active: currentPage===p}">{{ p }}</button>
        <button :disabled="currentPage===totalPages" @click="currentPage++">→</button>
      </div>
      <select v-model="itemsPerPage">
        <option :value="10">10</option>
        <option :value="25">25</option>
        <option :value="50">50</option>
      </select>
    </div>

    <div v-if="showModal" class="modal-backdrop" @click="closeModal">
      <div class="modal-card" @click.stop>
        <div class="modal-head">
          <h3>Detail Verifikasi</h3>
          <button @click="closeModal">✕</button>
        </div>
        <div class="modal-body" v-if="selectedVerifikasi">
          <div class="detail-group">
            <h4>Pengajuan</h4>
            <ul>
              <li><span>No. Pengajuan</span><strong>{{ selectedVerifikasi.noPengajuan }}</strong></li>
              <li><span>Nama Pesantren</span><strong>{{ selectedVerifikasi.namaPesantren }}</strong></li>
              <li><span>Pengasuh</span><strong>{{ selectedVerifikasi.pengasuhPesantren }}</strong></li>
              <li><span>HP Pengasuh</span><strong>{{ selectedVerifikasi.hpPengasuh }}</strong></li>
            </ul>
          </div>
          <div class="detail-group">
            <h4>Petugas</h4>
            <ul>
              <li><span>Nama Petugas</span><strong>{{ selectedVerifikasi.namaPetugas }}</strong></li>
              <li><span>HP Petugas</span><strong>{{ selectedVerifikasi.hpPetugas }}</strong></li>
              <li><span>Kedinasan</span>
                <strong><span class="badge kedinasan" :class="kedinasanClass(selectedVerifikasi.kedinasan)">{{ selectedVerifikasi.kedinasan }}</span></strong>
              </li>
              <li><span>Status</span>
                <strong><span class="badge status" :class="statusClass(selectedVerifikasi.statusVerifikasi)">{{ selectedVerifikasi.statusVerifikasi }}</span></strong>
              </li>
            </ul>
          </div>
        </div>
        <div class="modal-foot">
          <button class="primary" @click="goForm(selectedVerifikasi)">Edit</button>
          <button @click="closeModal">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const verifikasiData = reactive([
  { noPengajuan:'PB-2024-001', namaPesantren:'Pesantren Al-Falah', pengasuhPesantren:'KH. Ahmad Fauzi', hpPengasuh:'081222111001', namaPetugas:'Siti Nurhaliza', hpPetugas:'081234567804', kedinasan:'Dinsos', statusVerifikasi:'Selesai' },
  { noPengajuan:'PB-2024-002', namaPesantren:'Pesantren Al-Muhajirin', pengasuhPesantren:'Ust. Zainul Abidin', hpPengasuh:'081222111002', namaPetugas:'Budi Hartono', hpPetugas:'081234567808', kedinasan:'KUA', statusVerifikasi:'Proses Pelaporan' },
  { noPengajuan:'PB-2024-003', namaPesantren:'Pesantren Al-Ikhlas', pengasuhPesantren:'KH. M. Siroj', hpPengasuh:'081222111003', namaPetugas:'Aisyah Rahma', hpPetugas:'081234567809', kedinasan:'Bazis', statusVerifikasi:'Selesai' },
  { noPengajuan:'PB-2024-004', namaPesantren:'Pesantren Darul Ulum', pengasuhPesantren:'KH. Masrur', hpPengasuh:'081222111004', namaPetugas:'Joko Santoso', hpPetugas:'081234567810', kedinasan:'Dinas Perkimtan', statusVerifikasi:'Proses Pelengkapan Dokumen' },
  { noPengajuan:'PB-2024-005', namaPesantren:'Pesantren Al-Hidayah', pengasuhPesantren:'Ust. Rahmat', hpPengasuh:'081222111005', namaPetugas:'Dewi Lestari', hpPetugas:'081234567811', kedinasan:'Dinsos', statusVerifikasi:'Selesai' },
  ...Array.from({length:15}, (_,i)=>({
    noPengajuan:`PB-2024-${(i+6).toString().padStart(3,'0')}`,
    namaPesantren:`Pesantren Contoh ${i+6}`,
    pengasuhPesantren:`Pengasuh ${i+6}`,
    hpPengasuh:`081222119${(i+6).toString().padStart(2,'0')}`,
    namaPetugas:`Petugas ${i+6}`,
    hpPetugas:`08129999${(i+6).toString().padStart(2,'0')}`,
    kedinasan:['Dinsos','KUA','Bazis','Swasta','Dinas Perkimtan'][i%5],
    statusVerifikasi:['Selesai','Proses Pelengkapan Dokumen','Proses Pelaporan'][i%3]
  }))
])

const searchQuery = ref('')
const filterStatus = ref('')
const filterKedinasan = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showModal = ref(false)
const selectedVerifikasi = ref(null)

const filteredData = computed(() => {
  let d = verifikasiData
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    d = d.filter(r =>
      r.noPengajuan.toLowerCase().includes(q) ||
      r.namaPesantren.toLowerCase().includes(q) ||
      r.namaPetugas.toLowerCase().includes(q)
    )
  }
  if (filterStatus.value) d = d.filter(r => r.statusVerifikasi === filterStatus.value)
  if (filterKedinasan.value) d = d.filter(r => r.kedinasan === filterKedinasan.value)
  return d
})
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredData.value.length))
const paginatedData = computed(() => filteredData.value.slice(startIndex.value, endIndex.value))

function resetFilters() {
  searchQuery.value = ''
  filterStatus.value = ''
  filterKedinasan.value = ''
  currentPage.value = 1
}
function kedinasanClass(v) { return 'ked-' + v?.toLowerCase().replace(/\s+/g,'-') }
function statusClass(v) { return 'sts-' + v?.toLowerCase().replace(/\s+/g,'-') }

function goForm(row) {
  const encoded = encodeURIComponent(JSON.stringify(row))
  router.push({ name:'form_verifikasi_pesantren', params:{ data: encoded } })
}
function showDetail(row) {
  selectedVerifikasi.value = row
  showModal.value = true
  document.body.style.overflow='hidden'
}
function closeModal() {
  showModal.value = false
  selectedVerifikasi.value = null
  document.body.style.overflow=''
}
function delRow(row) {
  const idx = verifikasiData.findIndex(r => r.noPengajuan === row.noPengajuan)
  if (idx >= 0) verifikasiData.splice(idx,1)
}
</script>

<style scoped>
/* Container */
.verifikasi-shell {
  width:95vw;
  max-width:1600px;
  margin:28px auto;
  padding:20px 24px 26px;
  background:#ffffff;
  border-radius:18px;
  box-shadow:0 10px 32px rgba(0,0,0,0.07);
  box-sizing:border-box;
  font-family:system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial;
}

/* Header */
.page-head {
  display:flex;
  justify-content:center;
  align-items:center;
  position:relative;
  margin-bottom:14px;
}
.page-head h2 {
  font-size:36px;
  font-weight:800;
  margin:0;
  background:linear-gradient(90deg,#1e3a8a,#2563eb,#1d4ed8);
  background-clip:text;              /* standard property (fix linter) */
  -webkit-background-clip:text;      /* vendor prefix */
  color:transparent;
  letter-spacing:.8px;
  display:inline-block;              /* improves clipping reliability */
}
.head-actions {
  position:absolute;
  right:0;
  display:flex;
  gap:10px;
}
.head-actions button {
  background:#2563eb;
  color:#fff;
  border:none;
  padding:8px 16px;
  border-radius:10px;
  font-weight:600;
  cursor:pointer;
}
.head-actions button:hover { background:#1d4ed8; }

/* Filters */
.filters {
  display:flex;
  flex-wrap:wrap;
  gap:12px;
  margin-bottom:12px;
}
.filters input,
.filters select {
  padding:10px 12px;
  border:1px solid #cbd5e1;
  border-radius:10px;
  font-size:14px;
  min-width:190px;
  background:#fff;
}
.filters input:focus,
.filters select:focus {
  outline:2px solid #2563eb33;
}

/* Table wrapper */
.table-wrap {
  overflow-x:auto;
  border:1px solid #e2e8f0;
  border-radius:14px;
  background:#fff;
}

/* Table */
.verifikasi-table {
  width:100%;
  min-width:1200px;
  border-collapse:separate;
  border-spacing:0;
  font-size:14px;
}
.verifikasi-table thead th {
  background:linear-gradient(#f8fafc,#f1f5f9);
  font-weight:600;
  text-align:left;
  padding:12px 14px;
  border-bottom:1px solid #e2e8f0;
  position:sticky;
  top:0;
  z-index:5;
}
.verifikasi-table tbody td {
  padding:10px 14px;
  border-bottom:1px solid #f1f5f9;
  background:#fff;
  line-height:1.3;
}
.verifikasi-table tbody tr:last-child td {
  border-bottom:none;
}
.verifikasi-table tbody tr {
  transition:background .16s;
}
.verifikasi-table tbody tr:hover {
  background:#f0f5fa;
}
.cell-link {
  color:#2563eb;
  font-weight:600;
  cursor:pointer;
}
.cell-link:hover { text-decoration:underline; }
.cell-ellipsis {
  max-width:200px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}

/* Badges */
.badge {
  display:inline-block;
  padding:5px 12px;
  border-radius:24px;
  font-size:12px;
  font-weight:600;
  letter-spacing:.3px;
  line-height:1;
}
.badge.status {
  box-shadow:0 2px 4px rgba(0,0,0,0.08);
}

/* Status colors */
.sts-selesai { background:#10b981; color:#fff; }
.sts-proses-pelengkapan-dokumen { background:#f59e0b; color:#fff; }
.sts-proses-pelaporan { background:#2563eb; color:#fff; }

/* Kedinasan colors */
.ked-dinsos { background:#fce7f3; color:#9d174d; }
.ked-kua { background:#e0f2fe; color:#075985; }
.ked-bazis { background:#ede9fe; color:#5b21b6; }
.ked-swasta { background:#f1f5f9; color:#334155; }
.ked-dinas-perkimtan { background:#ecfdf5; color:#047857; }
.ked-dinas-pekerjaan-umum { background:#f0fdfa; color:#0f766e; }

/* Aksi buttons */
.aksi button {
  background:#f1f5f9;
  border:none;
  padding:6px 8px;
  border-radius:8px;
  cursor:pointer;
  margin-right:4px;
  font-size:14px;
}
.aksi button:last-child { margin-right:0; }
.aksi button:hover { background:#e2e8f0; }

/* Empty */
.empty {
  text-align:center;
  padding:28px;
  color:#64748b;
  font-style:italic;
}

/* Pager */
.pager {
  display:flex;
  flex-wrap:wrap;
  gap:16px;
  align-items:center;
  justify-content:space-between;
  margin-top:18px;
  font-size:13px;
}
.page-buttons {
  display:flex;
  gap:6px;
}
.page-buttons button {
  min-width:38px;
  padding:6px 10px;
  border:1px solid #94a3b8;
  background:#fff;
  border-radius:8px;
  cursor:pointer;
  font-weight:500;
}
.page-buttons button.active {
  background:#2563eb;
  color:#fff;
  border-color:#2563eb;
}
.page-buttons button:disabled {
  opacity:.4;
  cursor:not-allowed;
}

/* Modal */
.modal-backdrop {
  position:fixed;
  inset:0;
  background:rgba(17,25,40,0.55);
  backdrop-filter:blur(4px);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:200;
}
.modal-card {
  width:640px;
  max-width:92vw;
  background:#ffffff;
  border-radius:20px;
  border:1px solid #1e3a8a22;
  box-shadow:0 18px 42px -8px rgba(15,23,42,0.35);
  display:flex;
  flex-direction:column;
  overflow:hidden;
  animation:modalPop .28s ease;
}
@keyframes modalPop {
  0% { transform:scale(.92) translateY(12px); opacity:0; }
  100% { transform:scale(1) translateY(0); opacity:1; }
}
.modal-head {
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:16px 24px;
  background:linear-gradient(90deg,#1e3a8a,#2563eb,#1d4ed8);
  color:#fff;
}
.modal-head h3 {
  margin:0;
  font-size:18px;
  font-weight:700;
  letter-spacing:.4px;
  background:linear-gradient(90deg,#ffffff,#e2e8f0);
  background-clip:text;
  -webkit-background-clip:text;
  color:transparent;
  display:inline-block;
}
.modal-head button {
  background:rgba(255,255,255,0.18);
  border:none;
  width:38px;
  height:38px;
  border-radius:10px;
  cursor:pointer;
  font-size:16px;
  color:#fff;
}
.modal-head button:hover { background:rgba(255,255,255,0.32); }
.modal-body {
  padding:20px 26px 8px;
  max-height:55vh;
  overflow-y:auto;
}
.detail-group { margin-bottom:22px; }
.detail-group h4 {
  margin:0 0 10px;
  font-size:14px;
  font-weight:700;
  letter-spacing:.5px;
  color:#334155;
}
.detail-group ul {
  list-style:none;
  margin:0;
  padding:0;
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
  gap:12px 16px;
}
.detail-group li {
  background:#f8fafc;
  border:1px solid #e2e8f0;
  border-radius:12px;
  padding:10px 12px 8px;
  display:flex;
  flex-direction:column;
  gap:6px;
  min-height:84px;
}
.detail-group li span {
  font-size:11px;
  text-transform:uppercase;
  letter-spacing:.8px;
  color:#64748b;
  font-weight:600;
}
.detail-group li strong {
  font-size:14px;
  font-weight:600;
  color:#0f172a;
  word-break:break-word;
}
.modal-foot {
  display:flex;
  justify-content:flex-end;
  gap:12px;
  padding:14px 22px 18px;
  background:#f1f5f9;
  border-top:1px solid #e2e8f0;
}
.modal-foot button {
  background:#e2e8f0;
  border:none;
  padding:10px 18px;
  font-weight:600;
  border-radius:10px;
  cursor:pointer;
  color:#334155;
}
.modal-foot button:hover { background:#cbd5e1; }
.modal-foot .primary {
  background:#2563eb;
  color:#fff;
}
.modal-foot .primary:hover { background:#1d4ed8; }

/* Responsive */
@media (max-width: 900px) {
  .verifikasi-shell { padding:16px 14px 22px; width:100vw; border-radius:0; }
  .page-head h2 { font-size:28px; }
  .verifikasi-table { font-size:13px; }
  .filters input, .filters select { min-width:160px; }
}
</style>
