<template>
  <div class="dashboard-infrastruktur">
    <!-- Header -->
    <div class="dashboard-header">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">
        Dashboard Bantuan Infrastruktur Pesantren
      </h1>
      <p class="text-gray-600 mb-6">
        Monitoring dan Pelaporan Program Bantuan Infrastruktur untuk Pondok Pesantren
      </p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="summary-card bg-gradient-to-br from-blue-500 to-blue-600">
        <div class="card-icon">🏫</div>
        <div class="card-content">
          <p class="card-label">Total Pesantren Terbantu</p>
          <p class="card-value">{{ formatNumber(totalPesantren) }}</p>
          <p class="card-subtitle">Pesantren</p>
        </div>
      </div>

      <div class="summary-card bg-gradient-to-br from-green-500 to-green-600">
        <div class="card-icon">💰</div>
        <div class="card-content">
          <p class="card-label">Total Bantuan Infrastruktur</p>
          <p class="card-value">{{ formatRupiahShort(totalBantuan) }}</p>
          <p class="card-subtitle">Miliar Rupiah</p>
        </div>
      </div>

      <div class="summary-card bg-gradient-to-br from-yellow-500 to-yellow-600">
        <div class="card-icon">📋</div>
        <div class="card-content">
          <p class="card-label">Dalam Verifikasi</p>
          <p class="card-value">{{ formatNumber(dalamVerifikasi) }}</p>
          <p class="card-subtitle">Pesantren</p>
        </div>
      </div>

      <div class="summary-card bg-gradient-to-br from-purple-500 to-purple-600">
        <div class="card-icon">✅</div>
        <div class="card-content">
          <p class="card-label">Disetujui</p>
          <p class="card-value">{{ formatNumber(disetujui) }}</p>
          <p class="card-subtitle">Pesantren</p>
        </div>
      </div>
    </div>

    <!-- Row 1: Pie Chart & Doughnut Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Chart 1: Pie Chart - Kategori Pesantren -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <span class="chart-icon">🎯</span>
            Distribusi Bantuan ke Kategori Pesantren
          </h3>
        </div>
        <div class="chart-body">
          <BaseChart
            type="pie"
            :data="kategoriPesantrenData"
            :options="kategoriPesantrenOptions"
            height="320px"
          />
        </div>
      </div>

      <!-- Chart 2: Doughnut Chart - Sumber Bantuan -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <span class="chart-icon">🤝</span>
            Sumber Bantuan Infrastruktur Pesantren
          </h3>
        </div>
        <div class="chart-body">
          <BaseChart
            type="doughnut"
            :data="sumberBantuanData"
            :options="sumberBantuanOptions"
            height="320px"
          />
        </div>
      </div>
    </div>

    <!-- Row 2: Bar Chart & Line Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Chart 3: Bar Chart - Kenaikan Bantuan Infrastruktur -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <span class="chart-icon">📊</span>
            Kenaikan Bantuan Infrastruktur (Miliar Rupiah)
          </h3>
        </div>
        <div class="chart-body">
          <BaseChart
            type="bar"
            :data="kenaikanBantuanData"
            :options="kenaikanBantuanOptions"
            height="320px"
          />
        </div>
      </div>

      <!-- Chart 4: Line Chart - Jumlah Pesantren Terbantu -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <span class="chart-icon">📈</span>
            Jumlah Pesantren Terbantu (Puluhan)
          </h3>
        </div>
        <div class="chart-body">
          <BaseChart
            type="line"
            :data="pesantrenTerbantuData"
            :options="pesantrenTerbantuOptions"
            height="320px"
          />
        </div>
      </div>
    </div>

    <!-- Row 3: Status Progress & Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Chart 5: Status Pengajuan dengan Progress -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <span class="chart-icon">⏳</span>
            Status Pengajuan Bantuan
          </h3>
        </div>
        <div class="chart-body">
          <!-- Progress Bars -->
          <div class="space-y-4 mb-6">
            <div v-for="status in statusPengajuan" :key="status.label" class="progress-item">
              <div class="flex justify-between mb-2">
                <span class="text-sm font-semibold text-gray-700">{{ status.label }}</span>
                <span class="text-sm font-bold" :style="{ color: status.color }">
                  {{ formatNumber(status.jumlah) }} pesantren ({{ status.persentase }}%)
                </span>
              </div>
              <div class="progress-bar-container">
                <div 
                  class="progress-bar" 
                  :style="{ width: status.persentase + '%', backgroundColor: status.color }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Table Status -->
          <div class="overflow-x-auto">
            <table class="status-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Jumlah Pesantren</th>
                  <th>Persentase</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="status in statusPengajuan" :key="status.label">
                  <td>
                    <span class="status-badge" :style="{ backgroundColor: status.color }">
                      {{ status.label }}
                    </span>
                  </td>
                  <td class="text-right font-semibold">{{ formatNumber(status.jumlah) }}</td>
                  <td class="text-right">{{ status.persentase }}%</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td class="font-bold">Total</td>
                  <td class="text-right font-bold">{{ formatNumber(totalStatusPesantren) }}</td>
                  <td class="text-right font-bold">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <!-- Chart 6: Doughnut Chart Status -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <span class="chart-icon">🎯</span>
            Visualisasi Status Pengajuan
          </h3>
        </div>
        <div class="chart-body">
          <BaseChart
            type="doughnut"
            :data="statusPengajuanChartData"
            :options="statusPengajuanChartOptions"
            height="320px"
          />
        </div>
      </div>
    </div>

    <!-- Row 4: Table Distribusi per Provinsi -->
    <div class="chart-card mb-6">
      <div class="chart-header">
        <h3 class="chart-title">
          <span class="chart-icon">🗺️</span>
          Distribusi Penyaluran Dana Bantuan per Provinsi
        </h3>
        <div class="flex gap-2">
          <button @click="sortTable('provinsi')" class="btn-sort">
            📍 Provinsi {{ sortBy === 'provinsi' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
          </button>
          <button @click="sortTable('jumlah')" class="btn-sort">
            🏫 Jumlah {{ sortBy === 'jumlah' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
          </button>
          <button @click="sortTable('total')" class="btn-sort">
            💰 Total {{ sortBy === 'total' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
          </button>
        </div>
      </div>
      <div class="chart-body">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th class="th-no">No</th>
                <th class="th-provinsi">Provinsi</th>
                <th class="th-bantuan">Total Bantuan</th>
                <th class="th-pesantren">Jumlah Pesantren</th>
                <th class="th-rata">Rata-rata per Pesantren</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in sortedProvinsiData" :key="item.provinsi" class="table-row">
                <td class="td-no">
                  <span class="badge-number">{{ index + 1 }}</span>
                </td>
                <td class="td-provinsi">
                  <div class="provinsi-cell">
                    <span class="provinsi-icon">📍</span>
                    <span class="provinsi-name">{{ item.provinsi }}</span>
                  </div>
                </td>
                <td class="td-bantuan">
                  <div class="amount-cell">
                    <span class="amount-value">{{ formatRupiah(item.jumlahBantuan) }}</span>
                    <span class="amount-short">{{ formatRupiahShort(item.jumlahBantuan) }}</span>
                  </div>
                </td>
                <td class="td-pesantren">
                  <span class="badge-pesantren">
                    <span class="badge-icon">🏫</span>
                    <span class="badge-value">{{ formatNumber(item.jumlahPesantren) }}</span>
                    <span class="badge-label">pesantren</span>
                  </span>
                </td>
                <td class="td-rata">
                  <span class="rata-value">{{ formatRupiahShort(item.jumlahBantuan / item.jumlahPesantren) }}</span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="table-footer">
                <td colspan="2" class="footer-label">
                  <div class="total-cell">
                    <span class="total-icon">🇮🇩</span>
                    <span class="total-text">TOTAL NASIONAL</span>
                  </div>
                </td>
                <td class="footer-bantuan">
                  <div class="amount-cell">
                    <span class="amount-value">{{ formatRupiah(totalBantuanProvinsi) }}</span>
                    <span class="amount-short">{{ formatRupiahShort(totalBantuanProvinsi) }}</span>
                  </div>
                </td>
                <td class="footer-pesantren">
                  <span class="badge-pesantren">
                    <span class="badge-icon">🏫</span>
                    <span class="badge-value">{{ formatNumber(totalPesantrenProvinsi) }}</span>
                    <span class="badge-label">pesantren</span>
                  </span>
                </td>
                <td class="footer-rata">
                  <span class="rata-value">{{ formatRupiahShort(totalBantuanProvinsi / totalPesantrenProvinsi) }}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- Footer Info -->
    <div class="footer-info">
      <p class="text-sm text-gray-600">
        <span class="font-semibold">Catatan:</span> Data ini merupakan data statistik untuk monitoring program bantuan infrastruktur pesantren. 
        Diperbarui secara berkala setiap bulan.
      </p>
      <p class="text-xs text-gray-500 mt-2">
        Sumber: Kementerian Agama RI, Kementerian Keuangan, dan Lembaga Terkait | 
        Periode: Januari - Desember {{ currentYear }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import BaseChart from './BaseChart.vue'

// Current Year
const currentYear = new Date().getFullYear()

// Summary Data
const totalPesantren = 1250
const totalBantuan = 125000000000 // 125 Miliar
const dalamVerifikasi = 85
const disetujui = 1165

// Chart 1: Pie Chart - Kategori Pesantren
const kategoriPesantrenData = reactive({
  labels: [
    'Pesantren Kecil (<100 santri atau <1 ha)',
    'Pesantren Menengah (100-500 santri atau 1-3 ha)',
    'Pesantren Besar (>500 santri atau >3 ha)'
  ],
  datasets: [{
    label: 'Jumlah Pesantren',
    data: [450, 550, 250],
    backgroundColor: [
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(139, 92, 246, 0.8)'
    ],
    borderColor: [
      'rgba(59, 130, 246, 1)',
      'rgba(16, 185, 129, 1)',
      'rgba(139, 92, 246, 1)'
    ],
    borderWidth: 2
  }]
})

const kategoriPesantrenOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 15,
        font: {
          size: 12
        },
        generateLabels: function(chart) {
          const data = chart.data
          if (data.labels.length && data.datasets.length) {
            return data.labels.map((label, i) => {
              const value = data.datasets[0].data[i]
              const total = data.datasets[0].data.reduce((a, b) => a + b, 0)
              const percentage = ((value / total) * 100).toFixed(1)
              return {
                text: `${label}: ${value.toLocaleString()} (${percentage}%)`,
                fillStyle: data.datasets[0].backgroundColor[i],
                hidden: false,
                index: i
              }
            })
          }
          return []
        }
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.label || ''
          const value = context.parsed
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return `${label}: ${value.toLocaleString()} pesantren (${percentage}%)`
        }
      }
    }
  }
}

// Chart 2: Doughnut Chart - Sumber Bantuan
const sumberBantuanData = reactive({
  labels: [
    'APBN',
    'APBD',
    'CSR/Swasta',
    'LSM/NGO',
    'Luar Negeri',
    'Lain-lain'
  ],
  datasets: [{
    label: 'Kontribusi',
    data: [45, 20, 18, 10, 5, 2],
    backgroundColor: [
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(139, 92, 246, 0.8)',
      'rgba(236, 72, 153, 0.8)',
      'rgba(156, 163, 175, 0.8)'
    ],
    borderColor: [
      'rgba(59, 130, 246, 1)',
      'rgba(16, 185, 129, 1)',
      'rgba(245, 158, 11, 1)',
      'rgba(139, 92, 246, 1)',
      'rgba(236, 72, 153, 1)',
      'rgba(156, 163, 175, 1)'
    ],
    borderWidth: 2
  }]
})

const sumberBantuanOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        padding: 15,
        font: {
          size: 11
        },
        generateLabels: function(chart) {
          const data = chart.data
          if (data.labels.length && data.datasets.length) {
            return data.labels.map((label, i) => {
              const value = data.datasets[0].data[i]
              return {
                text: `${label}: ${value}%`,
                fillStyle: data.datasets[0].backgroundColor[i],
                hidden: false,
                index: i
              }
            })
          }
          return []
        }
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.label}: ${context.parsed}%`
        }
      }
    }
  }
}

// Chart 3: Bar Chart - Kenaikan Bantuan Infrastruktur (Miliar)
const kenaikanBantuanData = reactive({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  datasets: [{
    label: 'Bantuan Infrastruktur (Miliar Rp)',
    data: [5.2, 6.8, 8.5, 10.2, 12.5, 15.8, 18.5, 21.2, 24.8, 28.5, 32.1, 35.5],
    backgroundColor: 'rgba(16, 185, 129, 0.7)',
    borderColor: 'rgba(16, 185, 129, 1)',
    borderWidth: 2,
    borderRadius: 6
  }]
})

const kenaikanBantuanOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `Rp ${context.parsed.y} Miliar`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return 'Rp ' + value + ' M'
        }
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
}

// Chart 4: Line Chart - Jumlah Pesantren Terbantu (Puluhan)
const pesantrenTerbantuData = reactive({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  datasets: [{
    label: 'Pesantren Terbantu (Puluhan)',
    data: [25, 35, 48, 62, 78, 92, 105, 118, 132, 145, 158, 172],
    borderColor: 'rgb(59, 130, 246)',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    tension: 0.4,
    fill: true,
    pointRadius: 4,
    pointHoverRadius: 6,
    pointBackgroundColor: 'rgb(59, 130, 246)',
    pointBorderColor: '#fff',
    pointBorderWidth: 2
  }]
})

const pesantrenTerbantuOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.parsed.y} puluh pesantren (${context.parsed.y * 10} pesantren)`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return value + ' x10'
        }
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
}

// Chart 5: Status Pengajuan
const statusPengajuan = reactive([
  {
    label: 'Verifikasi',
    jumlah: 85,
    persentase: 6.8,
    color: '#F59E0B'
  },
  {
    label: 'Ditolak',
    jumlah: 45,
    persentase: 3.6,
    color: '#EF4444'
  },
  {
    label: 'Disetujui',
    jumlah: 1165,
    persentase: 93.2,
    color: '#10B981'
  },
  {
    label: 'Tahap Penyaluran',
    jumlah: 1050,
    persentase: 84.0,
    color: '#3B82F6'
  }
])

const totalStatusPesantren = computed(() => {
  return 1250
})

// Status Pengajuan Chart Data
const statusPengajuanChartData = reactive({
  labels: ['Verifikasi', 'Ditolak', 'Disetujui', 'Tahap Penyaluran'],
  datasets: [{
    data: [85, 45, 1165, 1050],
    backgroundColor: [
      'rgba(245, 158, 11, 0.8)',
      'rgba(239, 68, 68, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(59, 130, 246, 0.8)'
    ],
    borderWidth: 2
  }]
})

const statusPengajuanChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 15
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const value = context.parsed
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return `${context.label}: ${value.toLocaleString()} pesantren (${percentage}%)`
        }
      }
    }
  }
}

// Table: Data Provinsi
const provinsiData = reactive([
  { provinsi: 'Jawa Barat', jumlahBantuan: 28500000000, jumlahPesantren: 285 },
  { provinsi: 'Jawa Timur', jumlahBantuan: 24800000000, jumlahPesantren: 248 },
  { provinsi: 'Jawa Tengah', jumlahBantuan: 18600000000, jumlahPesantren: 186 },
  { provinsi: 'Banten', jumlahBantuan: 12500000000, jumlahPesantren: 125 },
  { provinsi: 'DKI Jakarta', jumlahBantuan: 8200000000, jumlahPesantren: 82 },
  { provinsi: 'Sumatera Utara', jumlahBantuan: 6800000000, jumlahPesantren: 68 },
  { provinsi: 'Sulawesi Selatan', jumlahBantuan: 5500000000, jumlahPesantren: 55 },
  { provinsi: 'Lampung', jumlahBantuan: 4200000000, jumlahPesantren: 42 },
  { provinsi: 'Aceh', jumlahBantuan: 3800000000, jumlahPesantren: 38 },
  { provinsi: 'Kalimantan Selatan', jumlahBantuan: 3200000000, jumlahPesantren: 32 },
  { provinsi: 'Sumatera Barat', jumlahBantuan: 2900000000, jumlahPesantren: 29 },
  { provinsi: 'Nusa Tenggara Barat', jumlahBantuan: 2500000000, jumlahPesantren: 25 },
  { provinsi: 'Riau', jumlahBantuan: 2100000000, jumlahPesantren: 21 },
  { provinsi: 'Lainnya', jumlahBantuan: 1400000000, jumlahPesantren: 14 }
])

const sortBy = ref('total')
const sortOrder = ref('desc')

const sortTable = (column) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortOrder.value = 'desc'
  }
}

const sortedProvinsiData = computed(() => {
  const data = [...provinsiData]
  return data.sort((a, b) => {
    let aVal, bVal
    
    if (sortBy.value === 'provinsi') {
      aVal = a.provinsi
      bVal = b.provinsi
      return sortOrder.value === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    } else if (sortBy.value === 'jumlah') {
      aVal = a.jumlahPesantren
      bVal = b.jumlahPesantren
    } else {
      aVal = a.jumlahBantuan
      bVal = b.jumlahBantuan
    }
    
    return sortOrder.value === 'asc' ? aVal - bVal : bVal - aVal
  })
})

const totalPesantrenProvinsi = computed(() => {
  return provinsiData.reduce((sum, item) => sum + item.jumlahPesantren, 0)
})

const totalBantuanProvinsi = computed(() => {
  return provinsiData.reduce((sum, item) => sum + item.jumlahBantuan, 0)
})

// Helper Functions
const formatNumber = (num) => {
  return num.toLocaleString('id-ID')
}

const formatRupiah = (num) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(num)
}

const formatRupiahShort = (num) => {
  if (num >= 1000000000) {
    return `Rp ${(num / 1000000000).toFixed(2)} M`
  } else if (num >= 1000000) {
    return `Rp ${(num / 1000000).toFixed(2)} Jt`
  }
  return formatRupiah(num)
}
</script>

<style scoped>
.dashboard-infrastruktur {
  width: 80vw;
  max-width: 100%;
  margin: 0 auto;
  padding: 24px;
  background-color: #f9fafb;
}

.dashboard-header {
  margin-bottom: 24px;
}

.summary-card {
  border-radius: 12px;
  padding: 28px;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s;
  min-height: 140px;
}

.summary-card:hover {
  transform: translateY(-4px);
}

.card-icon {
  font-size: 56px;
  opacity: 0.9;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-label {
  font-size: 13px;
  opacity: 0.9;
  margin-bottom: 6px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-value {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 4px;
  line-height: 1.2;
  word-break: break-word;
}

.card-subtitle {
  font-size: 12px;
  opacity: 0.8;
}

.chart-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chart-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-icon {
  font-size: 24px;
}

.chart-body {
  padding: 0;
}

.btn-sort {
  padding: 8px 16px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-sort:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}

.btn-sort:active {
  transform: scale(0.98);
}

/* Table Styles */
.table-wrapper {
  overflow-x: auto;
  border-radius: 0 0 12px 12px;
}

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
}

.data-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.data-table thead th {
  padding: 18px 20px;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 3px solid #5a67d8;
}

.th-no {
  text-align: center;
  width: 70px;
}

.th-provinsi {
  text-align: left;
  width: 25%;
}

.th-bantuan {
  text-align: right;
  width: 25%;
}

.th-pesantren {
  text-align: center;
  width: 20%;
}

.th-rata {
  text-align: center;
  width: 20%;
}

.data-table tbody tr {
  background: white;
  transition: all 0.2s;
}

.data-table tbody tr:nth-child(even) {
  background: #f9fafb;
}

.data-table tbody tr:hover {
  background: #eff6ff;
  transform: scale(1.01);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.data-table tbody td {
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
}

.td-no {
  text-align: center;
}

.badge-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 13px;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
}

.provinsi-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.provinsi-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.provinsi-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
}

.td-bantuan {
  text-align: right;
}

.amount-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.amount-value {
  font-weight: 700;
  color: #10b981;
  font-size: 15px;
}

.amount-short {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  background: #d1fae5;
  padding: 2px 8px;
  border-radius: 4px;
}

.td-pesantren {
  text-align: center;
}

.badge-pesantren {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
}

.badge-icon {
  font-size: 16px;
}

.badge-value {
  font-weight: 700;
}

.badge-label {
  font-size: 11px;
  opacity: 0.9;
}

.td-rata {
  text-align: center;
}

.rata-value {
  display: inline-block;
  padding: 8px 14px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  border: 1px solid #fde68a;
}

/* Footer Styles */
.data-table tfoot {
  background: linear-gradient(135deg, #1f2937, #111827);
  color: white;
}

.table-footer td {
  padding: 20px;
  border-top: 3px solid #10b981;
  font-weight: 700;
  font-size: 15px;
}

.total-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.total-icon {
  font-size: 28px;
}

.total-text {
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.5px;
}

.footer-bantuan .amount-value {
  color: #10b981;
  font-size: 16px;
}

.footer-bantuan .amount-short {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.footer-pesantren .badge-pesantren {
  background: linear-gradient(135deg, #10b981, #059669);
}

.footer-rata .rata-value {
  background: #fbbf24;
  color: #78350f;
  border-color: #f59e0b;
  font-size: 14px;
}

.progress-item {
  margin-bottom: 16px;
}

.progress-bar-container {
  width: 100%;
  height: 12px;
  background-color: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
}

.status-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.status-table th {
  background: #f3f4f6;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #e5e7eb;
}

.status-table td {
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  color: white;
  font-size: 12px;
  font-weight: 600;
}

.footer-info {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 1600px) {
  .dashboard-infrastruktur {
    width: 90vw;
  }
}

@media (max-width: 1200px) {
  .dashboard-infrastruktur {
    width: 95vw;
  }
  
  .data-table {
    font-size: 13px;
  }

  .badge-number {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }

  .provinsi-name {
    font-size: 13px;
  }

  .amount-value {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .dashboard-infrastruktur {
    width: calc(100vw - 32px);
    padding: 16px;
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .table-wrapper {
    overflow-x: scroll;
  }

  .data-table {
    min-width: 800px;
  }

  .summary-card {
    padding: 20px;
    min-height: 120px;
  }

  .card-icon {
    font-size: 40px;
  }

  .card-value {
    font-size: 22px;
  }
}
</style>