<template>
  <div class="dashboard-bantuan-santri">
    <!-- Header -->
    <div class="dashboard-header">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">
        Dashboard Bantuan Sosial Santri
      </h1>
      <p class="text-gray-600 mb-6">
        Monitoring dan Pelaporan Program Bantuan Pemerintah untuk Santri
      </p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="summary-card bg-gradient-to-br from-blue-500 to-blue-600">
        <div class="card-icon">👥</div>
        <div class="card-content">
          <p class="card-label">Total Santri Terbantu</p>
          <p class="card-value">{{ formatNumber(totalSantri) }}</p>
          <p class="card-subtitle">Santri</p>
        </div>
      </div>

      <div class="summary-card bg-gradient-to-br from-green-500 to-green-600">
        <div class="card-icon">💰</div>
        <div class="card-content">
          <p class="card-label">Total Bantuan</p>
          <p class="card-value">{{ formatRupiah(totalBantuan) }}</p>
          <p class="card-subtitle">Rupiah</p>
        </div>
      </div>

      <div class="summary-card bg-gradient-to-br from-yellow-500 to-yellow-600">
        <div class="card-icon">📋</div>
        <div class="card-content">
          <p class="card-label">Dalam Verifikasi</p>
          <p class="card-value">{{ formatNumber(dalamVerifikasi) }}</p>
          <p class="card-subtitle">Santri</p>
        </div>
      </div>

      <div class="summary-card bg-gradient-to-br from-purple-500 to-purple-600">
        <div class="card-icon">✅</div>
        <div class="card-content">
          <p class="card-label">Disetujui</p>
          <p class="card-value">{{ formatNumber(disetujui) }}</p>
          <p class="card-subtitle">Santri</p>
        </div>
      </div>
    </div>

    <!-- Row 1: Pie Chart & Doughnut Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Chart 1: Pie Chart - Kategori Bantuan -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <span class="chart-icon">🎯</span>
            Distribusi Bantuan per Kategori Santri
          </h3>
        </div>
        <div class="chart-body">
          <BaseChart
            type="pie"
            :data="kategoriBantuanData"
            :options="kategoriBantuanOptions"
            height="320px"
          />
        </div>
      </div>

      <!-- Chart 4: Doughnut Chart - Kontribusi Bantuan -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <span class="chart-icon">🤝</span>
            Kontribusi Sumber Bantuan
          </h3>
        </div>
        <div class="chart-body">
          <BaseChart
            type="doughnut"
            :data="kontribusiBantuanData"
            :options="kontribusiBantuanOptions"
            height="320px"
          />
        </div>
      </div>
    </div>

    <!-- Row 2: Bar Chart & Line Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Chart 2: Bar Chart - Kenaikan Bantuan Sosial -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <span class="chart-icon">📊</span>
            Kenaikan Bantuan Sosial (Ratusan Juta)
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

      <!-- Chart 3: Line Chart - Jumlah Santri Terbantu -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <span class="chart-icon">📈</span>
            Jumlah Santri Terbantu (Ribuan)
          </h3>
        </div>
        <div class="chart-body">
          <BaseChart
            type="line"
            :data="santriTerbantuData"
            :options="santriTerbantuOptions"
            height="320px"
          />
        </div>
      </div>
    </div>

    <!-- Row 3: Status Progress & Table -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Chart 5: Status Verifikasi dengan Progress -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <span class="chart-icon">⏳</span>
            Status Verifikasi Bantuan
          </h3>
        </div>
        <div class="chart-body">
          <!-- Progress Bars -->
          <div class="space-y-4 mb-6">
            <div v-for="status in statusVerifikasi" :key="status.label" class="progress-item">
              <div class="flex justify-between mb-2">
                <span class="text-sm font-semibold text-gray-700">{{ status.label }}</span>
                <span class="text-sm font-bold" :style="{ color: status.color }">
                  {{ formatNumber(status.jumlah) }} santri ({{ status.persentase }}%)
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
                  <th>Jumlah Santri</th>
                  <th>Persentase</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="status in statusVerifikasi" :key="status.label">
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
                  <td class="text-right font-bold">{{ formatNumber(totalStatusSantri) }}</td>
                  <td class="text-right font-bold">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <!-- Chart 5 Alternative: Radar Chart Status -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <span class="chart-icon">🎯</span>
            Visualisasi Status Verifikasi
          </h3>
        </div>
        <div class="chart-body">
          <BaseChart
            type="doughnut"
            :data="statusVerifikasiChartData"
            :options="statusVerifikasiChartOptions"
            height="320px"
          />
        </div>
      </div>
    </div>

    <!-- Row 4: Table Penerima Bantuan per Provinsi -->
    <div class="chart-card mb-6">
      <div class="chart-header">
        <h3 class="chart-title">
          <span class="chart-icon">🗺️</span>
          Data Penerima Bantuan per Provinsi
        </h3>
        <div class="flex gap-2">
          <button @click="sortTable('provinsi')" class="btn-sort">
            Provinsi {{ sortBy === 'provinsi' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
          </button>
          <button @click="sortTable('jumlah')" class="btn-sort">
            Jumlah {{ sortBy === 'jumlah' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
          </button>
          <button @click="sortTable('total')" class="btn-sort">
            Total {{ sortBy === 'total' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
          </button>
        </div>
      </div>
      <div class="chart-body">
        <div class="overflow-x-auto">
          <table class="data-table">
            <thead>
              <tr>
                <th class="text-left">No</th>
                <th class="text-left">Provinsi</th>
                <th class="text-right">Jumlah Santri</th>
                <th class="text-right">Total Bantuan (Rp)</th>
                <th class="text-center">Rata-rata per Santri</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in sortedProvinsiData" :key="item.provinsi">
                <td class="text-center">{{ index + 1 }}</td>
                <td class="font-semibold">{{ item.provinsi }}</td>
                <td class="text-right">{{ formatNumber(item.jumlahSantri) }}</td>
                <td class="text-right font-semibold text-green-600">
                  {{ formatRupiahShort(item.totalBantuan) }}
                </td>
                <td class="text-center text-sm text-gray-600">
                  {{ formatRupiahShort(item.totalBantuan / item.jumlahSantri) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="font-bold bg-gray-100">
                <td colspan="2" class="text-left">TOTAL NASIONAL</td>
                <td class="text-right">{{ formatNumber(totalSantriProvinsi) }}</td>
                <td class="text-right text-green-600">{{ formatRupiahShort(totalBantuanProvinsi) }}</td>
                <td class="text-center">{{ formatRupiahShort(totalBantuanProvinsi / totalSantriProvinsi) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- Footer Info -->
    <div class="footer-info">
      <p class="text-sm text-gray-600">
        <span class="font-semibold">Catatan:</span> Data ini merupakan data statistik untuk monitoring program bantuan sosial santri. 
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
const totalSantri = 45750
const totalBantuan = 687500000000 // 687.5 Miliar
const dalamVerifikasi = 3250
const disetujui = 42500

// Chart 1: Pie Chart - Kategori Bantuan Santri
const kategoriBantuanData = reactive({
  labels: [
    'Prestasi Akademik',
    'Keluarga Tidak Mampu',
    'Disabilitas',
    'Prestasi Olahraga',
    'Korban Bencana/HAM',
    'Jasa & Penghargaan Lain'
  ],
  datasets: [{
    label: 'Jumlah Santri',
    data: [8500, 18200, 4300, 3800, 6450, 4500],
    backgroundColor: [
      'rgba(59, 130, 246, 0.8)',   // Blue
      'rgba(16, 185, 129, 0.8)',   // Green
      'rgba(245, 158, 11, 0.8)',   // Yellow
      'rgba(239, 68, 68, 0.8)',    // Red
      'rgba(139, 92, 246, 0.8)',   // Purple
      'rgba(236, 72, 153, 0.8)'    // Pink
    ],
    borderColor: [
      'rgba(59, 130, 246, 1)',
      'rgba(16, 185, 129, 1)',
      'rgba(245, 158, 11, 1)',
      'rgba(239, 68, 68, 1)',
      'rgba(139, 92, 246, 1)',
      'rgba(236, 72, 153, 1)'
    ],
    borderWidth: 2
  }]
})

const kategoriBantuanOptions = {
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
          return `${label}: ${value.toLocaleString()} santri (${percentage}%)`
        }
      }
    }
  }
}

// Chart 2: Bar Chart - Kenaikan Bantuan Sosial (Ratusan Juta)
const kenaikanBantuanData = reactive({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  datasets: [{
    label: 'Bantuan Sosial (Ratus Juta Rp)',
    data: [320, 380, 450, 520, 580, 640, 720, 780, 850, 920, 980, 1050],
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
          return `Rp ${context.parsed.y * 100} Juta`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return value + ' (x100 Jt)'
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

// Chart 3: Line Chart - Jumlah Santri Terbantu (Ribuan)
const santriTerbantuData = reactive({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  datasets: [{
    label: 'Santri Terbantu (Ribuan)',
    data: [12.5, 15.8, 19.2, 23.5, 27.8, 31.2, 34.5, 37.8, 40.2, 42.5, 44.1, 45.75],
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

const santriTerbantuOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.parsed.y} ribu santri (${(context.parsed.y * 1000).toLocaleString()} santri)`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return value + ' ribu'
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

// Chart 4: Doughnut Chart - Kontribusi Bantuan
const kontribusiBantuanData = reactive({
  labels: [
    'Pemerintah Pusat',
    'CSR Swasta',
    'Kementerian Keuangan',
    'Kementerian Agama',
    'BAZIS',
    'Lain-lain'
  ],
  datasets: [{
    label: 'Kontribusi',
    data: [35, 25, 15, 12, 8, 5],
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

const kontribusiBantuanOptions = {
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

// Chart 5: Status Verifikasi
const statusVerifikasi = reactive([
  {
    label: 'Dalam Verifikasi',
    jumlah: 3250,
    persentase: 7.1,
    color: '#F59E0B'
  },
  {
    label: 'Disetujui',
    jumlah: 42500,
    persentase: 92.9,
    color: '#10B981'
  },
  {
    label: 'Tahap Penyaluran',
    jumlah: 38750,
    persentase: 84.7,
    color: '#3B82F6'
  }
])

const totalStatusSantri = computed(() => {
  return 45750 // Total unique santri
})

// Status Verifikasi Chart Data
const statusVerifikasiChartData = reactive({
  labels: ['Dalam Verifikasi', 'Disetujui', 'Tahap Penyaluran'],
  datasets: [{
    data: [3250, 42500, 38750],
    backgroundColor: [
      'rgba(245, 158, 11, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(59, 130, 246, 0.8)'
    ],
    borderWidth: 2
  }]
})

const statusVerifikasiChartOptions = {
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
          return `${context.label}: ${value.toLocaleString()} santri (${percentage}%)`
        }
      }
    }
  }
}

// Table 6: Data Provinsi
const provinsiData = reactive([
  { provinsi: 'Jawa Barat', jumlahSantri: 8500, totalBantuan: 127500000000 },
  { provinsi: 'Jawa Timur', jumlahSantri: 7800, totalBantuan: 117000000000 },
  { provinsi: 'Jawa Tengah', jumlahSantri: 6200, totalBantuan: 93000000000 },
  { provinsi: 'Banten', jumlahSantri: 4500, totalBantuan: 67500000000 },
  { provinsi: 'DKI Jakarta', jumlahSantri: 3200, totalBantuan: 48000000000 },
  { provinsi: 'Sumatera Utara', jumlahSantri: 2800, totalBantuan: 42000000000 },
  { provinsi: 'Sulawesi Selatan', jumlahSantri: 2500, totalBantuan: 37500000000 },
  { provinsi: 'Lampung', jumlahSantri: 2100, totalBantuan: 31500000000 },
  { provinsi: 'Aceh', jumlahSantri: 1900, totalBantuan: 28500000000 },
  { provinsi: 'Kalimantan Selatan', jumlahSantri: 1750, totalBantuan: 26250000000 },
  { provinsi: 'Sumatera Barat', jumlahSantri: 1600, totalBantuan: 24000000000 },
  { provinsi: 'Nusa Tenggara Barat', jumlahSantri: 1400, totalBantuan: 21000000000 },
  { provinsi: 'Riau', jumlahSantri: 1200, totalBantuan: 18000000000 },
  { provinsi: 'Lainnya', jumlahSantri: 200, totalBantuan: 5750000000 }
])

const sortBy = ref('jumlah')
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
      aVal = a.jumlahSantri
      bVal = b.jumlahSantri
    } else {
      aVal = a.totalBantuan
      bVal = b.totalBantuan
    }
    
    return sortOrder.value === 'asc' ? aVal - bVal : bVal - aVal
  })
})

const totalSantriProvinsi = computed(() => {
  return provinsiData.reduce((sum, item) => sum + item.jumlahSantri, 0)
})

const totalBantuanProvinsi = computed(() => {
  return provinsiData.reduce((sum, item) => sum + item.totalBantuan, 0)
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
.dashboard-bantuan-santri {
  max-width: 100%;
  margin: 0 auto;
  padding: 24px;
  background-color: #f9fafb;
}

.dashboard-header {
  margin-bottom: 24px;
}

/* Summary Cards */
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

/* Chart Cards */
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
  padding: 24px;
}

/* Progress Bars */
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
  border-radius: 6px;
  transition: width 0.3s ease;
}

/* Tables */
.status-table,
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.status-table th,
.data-table th {
  background-color: #f3f4f6;
  padding: 12px;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.status-table td,
.data-table td {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.status-table tbody tr:hover,
.data-table tbody tr:hover {
  background-color: #f9fafb;
}

.status-table tfoot tr,
.data-table tfoot tr {
  background-color: #f3f4f6;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  color: white;
  font-size: 12px;
  font-weight: 600;
}

/* Buttons */
.btn-sort {
  padding: 6px 12px;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-sort:hover {
  background-color: #e5e7eb;
}

/* Footer */
.footer-info {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 1024px) {
  .summary-card {
    padding: 20px;
    min-height: 120px;
  }

  .card-icon {
    font-size: 48px;
  }

  .card-value {
    font-size: 22px;
  }
}

@media (max-width: 768px) {
  .dashboard-bantuan-santri {
    padding: 16px;
  }

  .summary-card {
    padding: 18px;
    min-height: 110px;
    gap: 16px;
  }

  .card-icon {
    font-size: 40px;
  }

  .card-label {
    font-size: 12px;
  }

  .card-value {
    font-size: 20px;
  }

  .card-subtitle {
    font-size: 11px;
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .chart-title {
    font-size: 16px;
  }

  .status-table,
  .data-table {
    font-size: 12px;
  }

  .status-table th,
  .status-table td,
  .data-table th,
  .data-table td {
    padding: 8px;
  }
}
</style>
