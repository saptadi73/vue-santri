# BaseChart Component Documentation

Komponen reusable untuk menampilkan berbagai jenis chart menggunakan Chart.js di Vue 3.

## 📋 Daftar Isi
- [Instalasi](#instalasi)
- [Penggunaan Dasar](#penggunaan-dasar)
- [Props](#props)
- [Tipe Chart yang Didukung](#tipe-chart-yang-didukung)
- [Contoh Penggunaan](#contoh-penggunaan)
- [Methods](#methods)
- [Tips & Best Practices](#tips--best-practices)

## 🚀 Instalasi

Komponen ini sudah menggunakan Chart.js yang sudah terinstall di project. Tidak perlu instalasi tambahan.

## 📖 Penggunaan Dasar

### Import Component

```vue
<script setup>
import BaseChart from '@/components/BaseChart.vue'
</script>
```

### Contoh Sederhana

```vue
<template>
  <BaseChart
    type="line"
    :data="chartData"
    :options="chartOptions"
    height="300px"
  />
</template>

<script setup>
import { reactive } from 'vue'
import BaseChart from '@/components/BaseChart.vue'

const chartData = reactive({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Sales',
    data: [12, 19, 3, 5, 2, 3],
    borderColor: 'rgb(75, 192, 192)',
    backgroundColor: 'rgba(75, 192, 192, 0.2)'
  }]
})

const chartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Monthly Sales'
    }
  }
}
</script>
```

## 🎛️ Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `type` | String | ✅ Yes | - | Tipe chart: 'line', 'bar', 'pie', 'doughnut', 'radar', 'polarArea', 'bubble', 'scatter' |
| `data` | Object | ✅ Yes | - | Data chart dengan struktur Chart.js |
| `options` | Object | ❌ No | `{}` | Konfigurasi Chart.js options |
| `height` | String/Number | ❌ No | `'400px'` | Tinggi chart |
| `width` | String/Number | ❌ No | `'100%'` | Lebar chart |
| `responsive` | Boolean | ❌ No | `true` | Enable responsive behavior |
| `maintainAspectRatio` | Boolean | ❌ No | `true` | Maintain aspect ratio |

### Data Structure

```javascript
{
  labels: ['Label 1', 'Label 2', 'Label 3'],
  datasets: [{
    label: 'Dataset Name',
    data: [10, 20, 30],
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    borderColor: 'rgb(75, 192, 192)',
    borderWidth: 1
  }]
}
```

## 📊 Tipe Chart yang Didukung

### 1. Line Chart
```vue
<BaseChart type="line" :data="lineData" />
```

### 2. Bar Chart
```vue
<BaseChart type="bar" :data="barData" />
```

### 3. Pie Chart
```vue
<BaseChart type="pie" :data="pieData" />
```

### 4. Doughnut Chart
```vue
<BaseChart type="doughnut" :data="doughnutData" />
```

### 5. Radar Chart
```vue
<BaseChart type="radar" :data="radarData" />
```

### 6. Polar Area Chart
```vue
<BaseChart type="polarArea" :data="polarData" />
```

### 7. Bubble Chart
```vue
<BaseChart type="bubble" :data="bubbleData" />
```

### 8. Scatter Chart
```vue
<BaseChart type="scatter" :data="scatterData" />
```

## 💡 Contoh Penggunaan

### 1. Static Data - Line Chart

```vue
<template>
  <div class="card">
    <BaseChart
      type="line"
      :data="salesData"
      :options="salesOptions"
      height="300px"
    />
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import BaseChart from '@/components/BaseChart.vue'

const salesData = reactive({
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [{
    label: 'Sales 2024',
    data: [12000000, 19000000, 15000000, 25000000, 22000000, 30000000],
    borderColor: 'rgb(75, 192, 192)',
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    tension: 0.4
  }]
})

const salesOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Monthly Sales Report'
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
      beginAtZero: true
    }
  }
}
</script>
```

### 2. Dynamic Data - Bar Chart dengan API

```vue
<template>
  <div class="card">
    <div class="card-header">
      <h3>Iuran Bulanan</h3>
      <button @click="refreshData">Refresh</button>
    </div>
    <div class="card-body">
      <div v-if="loading">Loading...</div>
      <BaseChart
        v-else
        type="bar"
        :data="iuranData"
        :options="iuranOptions"
        height="350px"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import BaseChart from '@/components/BaseChart.vue'
import { BASE_URL } from '@/base.url.utils'

const loading = ref(false)

const iuranData = reactive({
  labels: [],
  datasets: [{
    label: 'Iuran',
    data: [],
    backgroundColor: 'rgba(54, 162, 235, 0.7)',
    borderColor: 'rgba(54, 162, 235, 1)',
    borderWidth: 1
  }]
})

const iuranOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Data Iuran Bulanan'
    },
    legend: {
      display: false
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

const fetchIuranData = async () => {
  loading.value = true
  try {
    const response = await axios.get(`${BASE_URL}bayar/iuran/deret/bulan`)
    
    if (response.data && response.data.result) {
      iuranData.labels = response.data.result.map(item => item.bulan)
      iuranData.datasets[0].data = response.data.result.map(item => item.total)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchIuranData()
}

onMounted(() => {
  fetchIuranData()
})
</script>
```

### 3. Pie Chart - Distribusi Keuangan

```vue
<template>
  <div class="card">
    <BaseChart
      type="pie"
      :data="keuanganData"
      :options="keuanganOptions"
      height="300px"
    />
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import BaseChart from '@/components/BaseChart.vue'

const keuanganData = reactive({
  labels: ['Iuran', 'Pemasukan Lain', 'Pengeluaran'],
  datasets: [{
    label: 'Keuangan',
    data: [35000000, 25000000, 15000000],
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
    borderWidth: 2
  }]
})

const keuanganOptions = {
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
</script>
```

### 4. Multiple Datasets - Perbandingan

```vue
<template>
  <div class="card">
    <BaseChart
      type="line"
      :data="comparisonData"
      :options="comparisonOptions"
      height="350px"
    />
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import BaseChart from '@/components/BaseChart.vue'

const comparisonData = reactive({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Iuran',
      data: [12000000, 15000000, 13000000, 18000000, 20000000, 19000000],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      tension: 0.4
    },
    {
      label: 'Pemasukan',
      data: [8000000, 12000000, 10000000, 14000000, 16000000, 15000000],
      borderColor: 'rgb(54, 162, 235)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      tension: 0.4
    },
    {
      label: 'Pengeluaran',
      data: [6000000, 9000000, 7000000, 11000000, 13000000, 12000000],
      borderColor: 'rgb(255, 206, 86)',
      backgroundColor: 'rgba(255, 206, 86, 0.2)',
      tension: 0.4
    }
  ]
})

const comparisonOptions = {
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
</script>
```

### 5. Stacked Bar Chart

```vue
<template>
  <div class="card">
    <BaseChart
      type="bar"
      :data="stackedData"
      :options="stackedOptions"
      height="350px"
    />
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import BaseChart from '@/components/BaseChart.vue'

const stackedData = reactive({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Iuran',
      data: [12000000, 15000000, 13000000, 18000000, 20000000, 19000000],
      backgroundColor: 'rgba(255, 99, 132, 0.7)',
      stack: 'Stack 0'
    },
    {
      label: 'Pemasukan Lain',
      data: [8000000, 12000000, 10000000, 14000000, 16000000, 15000000],
      backgroundColor: 'rgba(54, 162, 235, 0.7)',
      stack: 'Stack 0'
    },
    {
      label: 'Pengeluaran',
      data: [6000000, 9000000, 7000000, 11000000, 13000000, 12000000],
      backgroundColor: 'rgba(255, 206, 86, 0.7)',
      stack: 'Stack 1'
    }
  ]
})

const stackedOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Pemasukan vs Pengeluaran (Stacked)'
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
</script>
```

### 6. Penggunaan dalam Card Design

```vue
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Card 1 -->
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h3 class="text-xl font-bold mb-4">Iuran Bulanan</h3>
      <BaseChart
        type="bar"
        :data="iuranData"
        :options="iuranOptions"
        height="250px"
      />
    </div>

    <!-- Card 2 -->
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h3 class="text-xl font-bold mb-4">Distribusi Keuangan</h3>
      <BaseChart
        type="doughnut"
        :data="distributionData"
        :options="distributionOptions"
        height="250px"
      />
    </div>

    <!-- Card 3 - Full Width -->
    <div class="bg-white rounded-lg shadow-lg p-6 md:col-span-2">
      <h3 class="text-xl font-bold mb-4">Trend Keuangan</h3>
      <BaseChart
        type="line"
        :data="trendData"
        :options="trendOptions"
        height="300px"
      />
    </div>
  </div>
</template>
```

## 🔧 Methods

Component ini meng-expose beberapa methods yang bisa diakses via ref:

```vue
<template>
  <BaseChart ref="chartRef" type="line" :data="data" />
  <button @click="exportChart">Export</button>
</template>

<script setup>
import { ref } from 'vue'
import BaseChart from '@/components/BaseChart.vue'

const chartRef = ref(null)

// Get chart instance
const getChartInstance = () => {
  const chart = chartRef.value.getChart()
  console.log(chart)
}

// Update chart manually
const updateChart = () => {
  chartRef.value.update()
}

// Export chart as image
const exportChart = () => {
  const base64Image = chartRef.value.toBase64Image()
  console.log(base64Image)
  // Download or use the image
}

// Destroy chart
const destroyChart = () => {
  chartRef.value.destroy()
}
</script>
```

## 💡 Tips & Best Practices

### 1. Gunakan `reactive` untuk Data yang Berubah

```javascript
import { reactive } from 'vue'

const chartData = reactive({
  labels: ['Jan', 'Feb', 'Mar'],
  datasets: [{
    label: 'Sales',
    data: [10, 20, 30]
  }]
})

// Update data
chartData.datasets[0].data = [15, 25, 35]
```

### 2. Format Rupiah di Tooltip

```javascript
const options = {
  plugins: {
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
  }
}
```

### 3. Responsive Design

```vue
<BaseChart
  type="line"
  :data="data"
  :responsive="true"
  :maintainAspectRatio="false"
  height="300px"
/>
```

### 4. Loading State

```vue
<template>
  <div class="chart-container">
    <div v-if="loading" class="loading">Loading...</div>
    <BaseChart v-else type="bar" :data="data" />
  </div>
</template>
```

### 5. Error Handling

```javascript
const fetchData = async () => {
  try {
    const response = await axios.get(API_URL)
    chartData.labels = response.data.labels
    chartData.datasets[0].data = response.data.values
  } catch (error) {
    console.error('Error:', error)
    // Set fallback data
    chartData.labels = ['No Data']
    chartData.datasets[0].data = [0]
  }
}
```

## 📚 Referensi

- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [Chart.js Samples](https://www.chartjs.org/docs/latest/samples/)
- [Vue Chart.js](https://vue-chartjs.org/)

## 🤝 Kontribusi

Jika ada bug atau saran improvement, silakan buat issue atau pull request.

## 📝 License

MIT License
