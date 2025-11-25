<template>
  <div class="keuangan-chart-container">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Memuat data...</p>
    </div>
    <BaseChart
      v-else
      type="bar"
      :data="chartData"
      :options="chartOptions"
      height="400px"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import BaseChart from './BaseChart.vue'
import axios from 'axios'
import { BASE_URL } from '../base.url.utils'

/**
 * KeuanganLineChartNew - Versi baru menggunakan BaseChart component
 * Menggantikan KeuanganLineChart.vue yang lama
 * 
 * Keuntungan menggunakan BaseChart:
 * - Lebih mudah maintain
 * - Tidak perlu register Chart.js components manual
 * - Reactive data handling otomatis
 * - Reusable untuk chart lain
 */

const loading = ref(false)

// Chart data menggunakan reactive untuk auto-update
const chartData = reactive({
  labels: [],
  datasets: [
    {
      label: 'Iuran',
      data: [],
      backgroundColor: 'rgba(255, 99, 132, 0.7)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
      stack: 'stack1'
    },
    {
      label: 'Pemasukan Lain',
      data: [],
      backgroundColor: 'rgba(54, 162, 235, 0.7)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 2,
      stack: 'stack1'
    },
    {
      label: 'Pengeluaran',
      data: [],
      backgroundColor: 'rgba(255, 206, 86, 0.7)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 2,
      stack: 'stack2'
    }
  ]
})

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false
  },
  plugins: {
    title: {
      display: true,
      text: 'Perbandingan Data (Iuran + Pemasukan Lain vs Pengeluaran)',
      font: {
        size: 16,
        weight: 'bold'
      },
      padding: {
        top: 10,
        bottom: 20
      }
    },
    legend: {
      display: true,
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 14
      },
      bodyFont: {
        size: 13
      },
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
        },
        afterBody: function(context) {
          // Hitung total pemasukan (Iuran + Pemasukan Lain)
          if (context[0].dataset.stack === 'stack1') {
            const dataIndex = context[0].dataIndex
            const iuran = chartData.datasets[0].data[dataIndex] || 0
            const pemasukanLain = chartData.datasets[1].data[dataIndex] || 0
            const total = iuran + pemasukanLain
            
            return [
              '',
              'Total Pemasukan: ' + new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
              }).format(total)
            ]
          }
          return []
        }
      }
    }
  },
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 11
        }
      }
    },
    y: {
      stacked: true,
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        font: {
          size: 11
        },
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

// Fetch data dari API
const fetchChartData = async () => {
  loading.value = true
  
  try {
    // Fetch data dari 3 endpoint secara parallel
    const [marketingRes, incomeRes, expenseRes] = await Promise.all([
      axios.get(`${BASE_URL}bayar/iuran/deret/bulan`),
      axios.get(`${BASE_URL}bayar/masuk/deret/bulan`),
      axios.get(`${BASE_URL}bayar/keluar/deret/bulan`)
    ])

    // Update chart data
    if (marketingRes.data && marketingRes.data.result) {
      chartData.labels = marketingRes.data.result.map(item => item.bulan)
      chartData.datasets[0].data = marketingRes.data.result.map(item => item.total)
      chartData.datasets[1].data = incomeRes.data.result.map(item => item.total)
      chartData.datasets[2].data = expenseRes.data.result.map(item => item.total)
    }
  } catch (err) {
    console.error('Gagal mengambil data chart:', err)
    
    // Fallback data jika API error
    chartData.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    chartData.datasets[0].data = [1200000, 1500000, 1300000, 1800000, 2000000, 1900000]
    chartData.datasets[1].data = [800000, 1200000, 1000000, 1400000, 1600000, 1500000]
    chartData.datasets[2].data = [600000, 900000, 700000, 1100000, 1300000, 1200000]
  } finally {
    loading.value = false
  }
}

// Load data saat component mounted
onMounted(() => {
  fetchChartData()
})

// Expose refresh function untuk parent component
defineExpose({
  refresh: fetchChartData
})
</script>

<style scoped>
.keuangan-chart-container {
  width: 100%;
  position: relative;
  min-height: 400px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 400px;
  color: #6b7280;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p {
  font-size: 14px;
  margin: 0;
}
</style>
