<template>
  <div class="examples-container">
    <h1 class="text-3xl font-bold mb-8">BaseChart Component Examples</h1>
    
    <!-- Example 1: Line Chart (Static Data) -->
    <div class="card mb-8">
      <div class="card-header">
        <h2 class="text-xl font-semibold">1. Line Chart - Static Data</h2>
      </div>
      <div class="card-body">
        <BaseChart
          type="line"
          :data="lineChartData"
          :options="lineChartOptions"
          height="300px"
        />
      </div>
    </div>

    <!-- Example 2: Bar Chart (Static Data) -->
    <div class="card mb-8">
      <div class="card-header">
        <h2 class="text-xl font-semibold">2. Bar Chart - Static Data</h2>
      </div>
      <div class="card-body">
        <BaseChart
          type="bar"
          :data="barChartData"
          :options="barChartOptions"
          height="300px"
        />
      </div>
    </div>

    <!-- Example 3: Pie Chart (Static Data) -->
    <div class="card mb-8">
      <div class="card-header">
        <h2 class="text-xl font-semibold">3. Pie Chart - Static Data</h2>
      </div>
      <div class="card-body">
        <BaseChart
          type="pie"
          :data="pieChartData"
          :options="pieChartOptions"
          height="300px"
        />
      </div>
    </div>

    <!-- Example 4: Doughnut Chart (Static Data) -->
    <div class="card mb-8">
      <div class="card-header">
        <h2 class="text-xl font-semibold">4. Doughnut Chart - Static Data</h2>
      </div>
      <div class="card-body">
        <BaseChart
          type="doughnut"
          :data="doughnutChartData"
          :options="doughnutChartOptions"
          height="300px"
        />
      </div>
    </div>

    <!-- Example 5: Dynamic Data with API -->
    <div class="card mb-8">
      <div class="card-header">
        <h2 class="text-xl font-semibold">5. Bar Chart - Dynamic Data (API)</h2>
        <button 
          @click="fetchDynamicData" 
          class="btn btn-primary"
        >
          Refresh Data
        </button>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center py-8">
          <p>Loading data...</p>
        </div>
        <BaseChart
          v-else
          type="bar"
          :data="dynamicChartData"
          :options="dynamicChartOptions"
          height="300px"
        />
      </div>
    </div>

    <!-- Example 6: Multiple Datasets -->
    <div class="card mb-8">
      <div class="card-header">
        <h2 class="text-xl font-semibold">6. Line Chart - Multiple Datasets</h2>
      </div>
      <div class="card-body">
        <BaseChart
          type="line"
          :data="multiLineChartData"
          :options="multiLineChartOptions"
          height="300px"
        />
      </div>
    </div>

    <!-- Example 7: Stacked Bar Chart -->
    <div class="card mb-8">
      <div class="card-header">
        <h2 class="text-xl font-semibold">7. Stacked Bar Chart</h2>
      </div>
      <div class="card-body">
        <BaseChart
          type="bar"
          :data="stackedBarData"
          :options="stackedBarOptions"
          height="300px"
        />
      </div>
    </div>

    <!-- Example 8: Radar Chart -->
    <div class="card mb-8">
      <div class="card-header">
        <h2 class="text-xl font-semibold">8. Radar Chart</h2>
      </div>
      <div class="card-body">
        <BaseChart
          type="radar"
          :data="radarChartData"
          :options="radarChartOptions"
          height="300px"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import BaseChart from './BaseChart.vue'
import axios from 'axios'
import { BASE_URL } from '../base.url.utils'

// Loading state
const loading = ref(false)

// Example 1: Line Chart Data
const lineChartData = reactive({
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [{
    label: 'Sales 2024',
    data: [12, 19, 3, 5, 2, 3],
    borderColor: 'rgb(75, 192, 192)',
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    tension: 0.4
  }]
})

const lineChartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Monthly Sales Report'
    },
    legend: {
      display: true,
      position: 'bottom'
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

// Example 2: Bar Chart Data
const barChartData = reactive({
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [{
    label: 'Votes',
    data: [12, 19, 3, 5, 2, 3],
    backgroundColor: [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)'
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)'
    ],
    borderWidth: 1
  }]
})

const barChartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Color Preference Survey'
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

// Example 3: Pie Chart Data
const pieChartData = reactive({
  labels: ['Iuran', 'Pemasukan Lain', 'Pengeluaran'],
  datasets: [{
    label: 'Keuangan',
    data: [3500000, 2500000, 1500000],
    backgroundColor: [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)'
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)'
    ],
    borderWidth: 1
  }]
})

const pieChartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Distribusi Keuangan'
    },
    legend: {
      position: 'bottom'
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
          return label
        }
      }
    }
  }
}

// Example 4: Doughnut Chart Data
const doughnutChartData = reactive({
  labels: ['Completed', 'In Progress', 'Pending', 'Cancelled'],
  datasets: [{
    label: 'Project Status',
    data: [45, 25, 20, 10],
    backgroundColor: [
      'rgba(75, 192, 192, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 99, 132, 0.7)'
    ],
    borderWidth: 2
  }]
})

const doughnutChartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Project Status Overview'
    },
    legend: {
      position: 'right'
    }
  }
}

// Example 5: Dynamic Data
const dynamicChartData = reactive({
  labels: [],
  datasets: [{
    label: 'Iuran Bulanan',
    data: [],
    backgroundColor: 'rgba(75, 192, 192, 0.7)',
    borderColor: 'rgba(75, 192, 192, 1)',
    borderWidth: 1
  }]
})

const dynamicChartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Data Iuran dari API'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
          }).format(value)
        }
      }
    }
  }
}

// Fetch dynamic data from API
const fetchDynamicData = async () => {
  loading.value = true
  try {
    const response = await axios.get(`${BASE_URL}bayar/iuran/deret/bulan`)
    
    if (response.data && response.data.result) {
      dynamicChartData.labels = response.data.result.map(item => item.bulan)
      dynamicChartData.datasets[0].data = response.data.result.map(item => item.total)
    }
  } catch (error) {
    console.error('Error fetching dynamic data:', error)
    // Fallback to dummy data
    dynamicChartData.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    dynamicChartData.datasets[0].data = [1200000, 1900000, 800000, 1500000, 2000000, 1700000]
  } finally {
    loading.value = false
  }
}

// Example 6: Multiple Datasets
const multiLineChartData = reactive({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Iuran',
      data: [1200000, 1500000, 1300000, 1800000, 2000000, 1900000],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      tension: 0.4
    },
    {
      label: 'Pemasukan',
      data: [800000, 1200000, 1000000, 1400000, 1600000, 1500000],
      borderColor: 'rgb(54, 162, 235)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      tension: 0.4
    },
    {
      label: 'Pengeluaran',
      data: [600000, 900000, 700000, 1100000, 1300000, 1200000],
      borderColor: 'rgb(255, 206, 86)',
      backgroundColor: 'rgba(255, 206, 86, 0.2)',
      tension: 0.4
    }
  ]
})

const multiLineChartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Perbandingan Keuangan'
    },
    legend: {
      position: 'bottom'
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

// Example 7: Stacked Bar Chart
const stackedBarData = reactive({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Iuran',
      data: [1200000, 1500000, 1300000, 1800000, 2000000, 1900000],
      backgroundColor: 'rgba(255, 99, 132, 0.7)',
      stack: 'Stack 0'
    },
    {
      label: 'Pemasukan Lain',
      data: [800000, 1200000, 1000000, 1400000, 1600000, 1500000],
      backgroundColor: 'rgba(54, 162, 235, 0.7)',
      stack: 'Stack 0'
    },
    {
      label: 'Pengeluaran',
      data: [600000, 900000, 700000, 1100000, 1300000, 1200000],
      backgroundColor: 'rgba(255, 206, 86, 0.7)',
      stack: 'Stack 1'
    }
  ]
})

const stackedBarOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Stacked Bar Chart - Pemasukan vs Pengeluaran'
    }
  },
  scales: {
    x: {
      stacked: true
    },
    y: {
      stacked: true,
      beginAtZero: true
    }
  }
}

// Example 8: Radar Chart
const radarChartData = reactive({
  labels: ['Iuran', 'Kebersihan', 'Keamanan', 'Sosial', 'Infrastruktur', 'Pendidikan'],
  datasets: [{
    label: 'Target',
    data: [90, 85, 80, 75, 70, 85],
    borderColor: 'rgb(255, 99, 132)',
    backgroundColor: 'rgba(255, 99, 132, 0.2)'
  }, {
    label: 'Realisasi',
    data: [85, 80, 85, 70, 75, 80],
    borderColor: 'rgb(54, 162, 235)',
    backgroundColor: 'rgba(54, 162, 235, 0.2)'
  }]
})

const radarChartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Evaluasi Program Pesantren'
    }
  },
  scales: {
    r: {
      beginAtZero: true,
      max: 100
    }
  }
}

// Load dynamic data on mount
fetchDynamicData()
</script>

<style scoped>
.examples-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-body {
  padding: 20px;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}
</style>
