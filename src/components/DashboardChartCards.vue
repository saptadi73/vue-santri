<template>
  <div class="dashboard-charts">
    <!-- Row 1: Two Cards Side by Side -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Card 1: Iuran Bulanan Bar Chart -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800">Iuran Bulanan</h3>
          <button 
            @click="refreshIuranData" 
            class="text-blue-600 hover:text-blue-800 transition"
            :disabled="loadingIuran"
          >
            <span v-if="loadingIuran">⟳</span>
            <span v-else>🔄</span>
          </button>
        </div>
        <div v-if="loadingIuran" class="flex justify-center items-center h-64">
          <div class="text-gray-500">Loading...</div>
        </div>
        <BaseChart
          v-else
          type="bar"
          :data="iuranChartData"
          :options="iuranChartOptions"
          height="280px"
        />
      </div>

      <!-- Card 2: Distribusi Keuangan Doughnut Chart -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800">Distribusi Keuangan</h3>
          <button 
            @click="refreshDistribusiData" 
            class="text-blue-600 hover:text-blue-800 transition"
            :disabled="loadingDistribusi"
          >
            <span v-if="loadingDistribusi">⟳</span>
            <span v-else>🔄</span>
          </button>
        </div>
        <div v-if="loadingDistribusi" class="flex justify-center items-center h-64">
          <div class="text-gray-500">Loading...</div>
        </div>
        <BaseChart
          v-else
          type="doughnut"
          :data="distribusiChartData"
          :options="distribusiChartOptions"
          height="280px"
        />
      </div>
    </div>

    <!-- Row 2: Full Width Card - Trend Keuangan -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-800">Trend Keuangan (Pemasukan vs Pengeluaran)</h3>
        <button 
          @click="refreshTrendData" 
          class="text-blue-600 hover:text-blue-800 transition"
          :disabled="loadingTrend"
        >
          <span v-if="loadingTrend">⟳</span>
          <span v-else>🔄</span>
        </button>
      </div>
      <div v-if="loadingTrend" class="flex justify-center items-center h-80">
        <div class="text-gray-500">Loading...</div>
      </div>
      <BaseChart
        v-else
        type="line"
        :data="trendChartData"
        :options="trendChartOptions"
        height="320px"
      />
    </div>

    <!-- Row 3: Three Small Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Card 3: Pemasukan Pie Chart -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h3 class="text-lg font-bold text-gray-800 mb-4">Sumber Pemasukan</h3>
        <BaseChart
          type="pie"
          :data="pemasukanChartData"
          :options="pemasukanChartOptions"
          height="220px"
        />
      </div>

      <!-- Card 4: Pengeluaran Pie Chart -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h3 class="text-lg font-bold text-gray-800 mb-4">Kategori Pengeluaran</h3>
        <BaseChart
          type="pie"
          :data="pengeluaranChartData"
          :options="pengeluaranChartOptions"
          height="220px"
        />
      </div>

      <!-- Card 5: Status Pembayaran Radar Chart -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h3 class="text-lg font-bold text-gray-800 mb-4">Status Pembayaran</h3>
        <BaseChart
          type="radar"
          :data="statusChartData"
          :options="statusChartOptions"
          height="220px"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import BaseChart from './BaseChart.vue'
import axios from 'axios'
import { BASE_URL } from '../base.url.utils'

// Loading states
const loadingIuran = ref(false)
const loadingDistribusi = ref(false)
const loadingTrend = ref(false)

// Chart 1: Iuran Bulanan (Bar Chart)
const iuranChartData = reactive({
  labels: [],
  datasets: [{
    label: 'Iuran',
    data: [],
    backgroundColor: 'rgba(54, 162, 235, 0.7)',
    borderColor: 'rgba(54, 162, 235, 1)',
    borderWidth: 2,
    borderRadius: 5
  }]
})

const iuranChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
          }).format(context.parsed.y)
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return new Intl.NumberFormat('id-ID', {
            notation: 'compact',
            compactDisplay: 'short'
          }).format(value)
        }
      }
    }
  }
}

// Chart 2: Distribusi Keuangan (Doughnut Chart)
const distribusiChartData = reactive({
  labels: ['Iuran', 'Pemasukan Lain', 'Pengeluaran'],
  datasets: [{
    label: 'Keuangan',
    data: [0, 0, 0],
    backgroundColor: [
      'rgba(54, 162, 235, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(255, 99, 132, 0.8)'
    ],
    borderColor: [
      'rgba(54, 162, 235, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(255, 99, 132, 1)'
    ],
    borderWidth: 2
  }]
})

const distribusiChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 15,
        font: {
          size: 11
        }
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.label || ''
          if (label) {
            label += ': '
          }
          label += new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
          }).format(context.parsed)
          
          // Add percentage
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = ((context.parsed / total) * 100).toFixed(1)
          label += ` (${percentage}%)`
          
          return label
        }
      }
    }
  }
}

// Chart 3: Trend Keuangan (Line Chart)
const trendChartData = reactive({
  labels: [],
  datasets: [
    {
      label: 'Iuran',
      data: [],
      borderColor: 'rgb(54, 162, 235)',
      backgroundColor: 'rgba(54, 162, 235, 0.1)',
      tension: 0.4,
      fill: true
    },
    {
      label: 'Pemasukan Lain',
      data: [],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.1)',
      tension: 0.4,
      fill: true
    },
    {
      label: 'Pengeluaran',
      data: [],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
})

const trendChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 15
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          label += new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
          }).format(context.parsed.y)
          return label
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return new Intl.NumberFormat('id-ID', {
            notation: 'compact',
            compactDisplay: 'short'
          }).format(value)
        }
      }
    }
  }
}

// Chart 4: Sumber Pemasukan (Pie Chart)
const pemasukanChartData = reactive({
  labels: ['Iuran Rutin', 'Donasi', 'Usaha', 'Lainnya'],
  datasets: [{
    data: [45, 25, 20, 10],
    backgroundColor: [
      'rgba(54, 162, 235, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(255, 206, 86, 0.8)',
      'rgba(153, 102, 255, 0.8)'
    ],
    borderWidth: 2
  }]
})

const pemasukanChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 10,
        font: {
          size: 10
        }
      }
    }
  }
}

// Chart 5: Kategori Pengeluaran (Pie Chart)
const pengeluaranChartData = reactive({
  labels: ['Operasional', 'Gaji', 'Pemeliharaan', 'Lainnya'],
  datasets: [{
    data: [40, 35, 15, 10],
    backgroundColor: [
      'rgba(255, 99, 132, 0.8)',
      'rgba(255, 159, 64, 0.8)',
      'rgba(255, 205, 86, 0.8)',
      'rgba(201, 203, 207, 0.8)'
    ],
    borderWidth: 2
  }]
})

const pengeluaranChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 10,
        font: {
          size: 10
        }
      }
    }
  }
}

// Chart 6: Status Pembayaran (Radar Chart)
const statusChartData = reactive({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Lunas (%)',
    data: [85, 90, 88, 92, 87, 95],
    borderColor: 'rgb(75, 192, 192)',
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    pointBackgroundColor: 'rgb(75, 192, 192)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(75, 192, 192)'
  }]
})

const statusChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      beginAtZero: true,
      max: 100,
      ticks: {
        stepSize: 20
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
}

// Fetch Iuran Data
const fetchIuranData = async () => {
  loadingIuran.value = true
  try {
    const response = await axios.get(`${BASE_URL}bayar/iuran/deret/bulan`)
    
    if (response.data && response.data.result) {
      iuranChartData.labels = response.data.result.map(item => item.bulan)
      iuranChartData.datasets[0].data = response.data.result.map(item => item.total)
    }
  } catch (error) {
    console.error('Error fetching iuran data:', error)
    // Fallback data
    iuranChartData.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    iuranChartData.datasets[0].data = [1200000, 1500000, 1300000, 1800000, 2000000, 1900000]
  } finally {
    loadingIuran.value = false
  }
}

// Fetch Distribusi Data
const fetchDistribusiData = async () => {
  loadingDistribusi.value = true
  try {
    const response = await axios.get(`${BASE_URL}bayar/total/total`)
    
    if (response.data) {
      const totalIuran = parseInt(response.data.totalIuranKabeh) || 0
      const totalMasuk = parseInt(response.data.totalMasukKabeh) || 0
      const totalKeluar = parseInt(response.data.totalKeluarKabeh) || 0
      
      distribusiChartData.datasets[0].data = [totalIuran, totalMasuk, totalKeluar]
    }
  } catch (error) {
    console.error('Error fetching distribusi data:', error)
    // Fallback data
    distribusiChartData.datasets[0].data = [35000000, 25000000, 15000000]
  } finally {
    loadingDistribusi.value = false
  }
}

// Fetch Trend Data
const fetchTrendData = async () => {
  loadingTrend.value = true
  try {
    const [iuranRes, masukRes, keluarRes] = await Promise.all([
      axios.get(`${BASE_URL}bayar/iuran/deret/bulan`),
      axios.get(`${BASE_URL}bayar/masuk/deret/bulan`),
      axios.get(`${BASE_URL}bayar/keluar/deret/bulan`)
    ])

    if (iuranRes.data && iuranRes.data.result) {
      trendChartData.labels = iuranRes.data.result.map(item => item.bulan)
      trendChartData.datasets[0].data = iuranRes.data.result.map(item => item.total)
      trendChartData.datasets[1].data = masukRes.data.result.map(item => item.total)
      trendChartData.datasets[2].data = keluarRes.data.result.map(item => item.total)
    }
  } catch (error) {
    console.error('Error fetching trend data:', error)
    // Fallback data
    trendChartData.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    trendChartData.datasets[0].data = [1200000, 1500000, 1300000, 1800000, 2000000, 1900000]
    trendChartData.datasets[1].data = [800000, 1200000, 1000000, 1400000, 1600000, 1500000]
    trendChartData.datasets[2].data = [600000, 900000, 700000, 1100000, 1300000, 1200000]
  } finally {
    loadingTrend.value = false
  }
}

// Refresh functions
const refreshIuranData = () => fetchIuranData()
const refreshDistribusiData = () => fetchDistribusiData()
const refreshTrendData = () => fetchTrendData()

// Load all data on mount
onMounted(() => {
  fetchIuranData()
  fetchDistribusiData()
  fetchTrendData()
})
</script>

<style scoped>
.dashboard-charts {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

@media (max-width: 768px) {
  .dashboard-charts {
    padding: 10px;
  }
}
</style>
