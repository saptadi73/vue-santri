# BaseChart Quick Start Guide

Panduan cepat untuk mulai menggunakan BaseChart component dalam 5 menit! 🚀

## 📦 Langkah 1: Import Component

```vue
<script setup>
import BaseChart from '@/components/BaseChart.vue'
import { reactive } from 'vue'
</script>
```

## 🎯 Langkah 2: Siapkan Data

### Contoh 1: Bar Chart Sederhana

```vue
<script setup>
import BaseChart from '@/components/BaseChart.vue'
import { reactive } from 'vue'

const chartData = reactive({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [{
    label: 'Penjualan',
    data: [12, 19, 3, 5, 2],
    backgroundColor: 'rgba(54, 162, 235, 0.7)'
  }]
})
</script>

<template>
  <BaseChart type="bar" :data="chartData" />
</template>
```

### Contoh 2: Line Chart dengan Options

```vue
<script setup>
import BaseChart from '@/components/BaseChart.vue'
import { reactive } from 'vue'

const chartData = reactive({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [{
    label: 'Revenue',
    data: [1200000, 1900000, 1500000, 2500000, 2200000],
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.4
  }]
})

const chartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Monthly Revenue'
    }
  }
}
</script>

<template>
  <BaseChart 
    type="line" 
    :data="chartData" 
    :options="chartOptions"
    height="300px"
  />
</template>
```

### Contoh 3: Pie Chart

```vue
<script setup>
import BaseChart from '@/components/BaseChart.vue'
import { reactive } from 'vue'

const chartData = reactive({
  labels: ['Iuran', 'Donasi', 'Usaha'],
  datasets: [{
    data: [45, 30, 25],
    backgroundColor: [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)'
    ]
  }]
})
</script>

<template>
  <BaseChart type="pie" :data="chartData" height="300px" />
</template>
```

## 🔄 Langkah 3: Data Dinamis dari API

```vue
<script setup>
import { ref, reactive, onMounted } from 'vue'
import BaseChart from '@/components/BaseChart.vue'
import axios from 'axios'

const loading = ref(false)

const chartData = reactive({
  labels: [],
  datasets: [{
    label: 'Iuran Bulanan',
    data: [],
    backgroundColor: 'rgba(54, 162, 235, 0.7)'
  }]
})

const fetchData = async () => {
  loading.value = true
  try {
    const response = await axios.get('YOUR_API_URL')
    chartData.labels = response.data.map(item => item.bulan)
    chartData.datasets[0].data = response.data.map(item => item.total)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div>
    <div v-if="loading">Loading...</div>
    <BaseChart v-else type="bar" :data="chartData" />
  </div>
</template>
```

## 🎨 Langkah 4: Gunakan dalam Card

```vue
<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h3 class="text-xl font-bold mb-4">Statistik Penjualan</h3>
    <BaseChart 
      type="bar" 
      :data="chartData" 
      :options="chartOptions"
      height="300px"
    />
  </div>
</template>

<script setup>
import BaseChart from '@/components/BaseChart.vue'
import { reactive } from 'vue'

const chartData = reactive({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [{
    label: 'Sales',
    data: [12, 19, 3, 5, 2],
    backgroundColor: 'rgba(54, 162, 235, 0.7)'
  }]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}
</script>
```

## 💰 Format Rupiah di Tooltip

```vue
<script setup>
const chartOptions = {
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
</script>
```

## 📊 Multiple Datasets

```vue
<script setup>
const chartData = reactive({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Pemasukan',
      data: [12, 19, 15, 25, 22],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)'
    },
    {
      label: 'Pengeluaran',
      data: [8, 12, 10, 14, 16],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)'
    }
  ]
})
</script>

<template>
  <BaseChart type="line" :data="chartData" />
</template>
```

## 🎯 Tipe Chart yang Tersedia

| Type | Deskripsi | Best For |
|------|-----------|----------|
| `line` | Line Chart | Trend data over time |
| `bar` | Bar Chart | Comparing values |
| `pie` | Pie Chart | Showing proportions |
| `doughnut` | Doughnut Chart | Showing proportions with center space |
| `radar` | Radar Chart | Multivariate data |
| `polarArea` | Polar Area Chart | Cyclical data |
| `bubble` | Bubble Chart | 3D data points |
| `scatter` | Scatter Chart | Correlation data |

## 🎨 Color Palettes

### Palette 1: Blue Theme
```javascript
backgroundColor: [
  'rgba(54, 162, 235, 0.7)',
  'rgba(75, 192, 192, 0.7)',
  'rgba(153, 102, 255, 0.7)'
]
```

### Palette 2: Warm Theme
```javascript
backgroundColor: [
  'rgba(255, 99, 132, 0.7)',
  'rgba(255, 159, 64, 0.7)',
  'rgba(255, 205, 86, 0.7)'
]
```

### Palette 3: Professional
```javascript
backgroundColor: [
  'rgba(54, 162, 235, 0.7)',
  'rgba(255, 99, 132, 0.7)',
  'rgba(255, 206, 86, 0.7)',
  'rgba(75, 192, 192, 0.7)',
  'rgba(153, 102, 255, 0.7)'
]
```

## 🔧 Common Options

### Responsive Chart
```javascript
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}
```

### Hide Legend
```javascript
const chartOptions = {
  plugins: {
    legend: {
      display: false
    }
  }
}
```

### Custom Title
```javascript
const chartOptions = {
  plugins: {
    title: {
      display: true,
      text: 'My Chart Title',
      font: {
        size: 16,
        weight: 'bold'
      }
    }
  }
}
```

### Start Y-axis at Zero
```javascript
const chartOptions = {
  scales: {
    y: {
      beginAtZero: true
    }
  }
}
```

## 🚀 Template Siap Pakai

### Template 1: Dashboard Card dengan Refresh

```vue
<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-bold">{{ title }}</h3>
      <button 
        @click="refresh" 
        class="text-blue-600 hover:text-blue-800"
        :disabled="loading"
      >
        🔄
      </button>
    </div>
    <div v-if="loading" class="h-64 flex items-center justify-center">
      Loading...
    </div>
    <BaseChart 
      v-else
      :type="type" 
      :data="chartData" 
      :options="chartOptions"
      height="300px"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import BaseChart from '@/components/BaseChart.vue'

const props = defineProps({
  title: String,
  type: String,
  apiUrl: String
})

const loading = ref(false)
const chartData = reactive({
  labels: [],
  datasets: [{ data: [] }]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

const fetchData = async () => {
  loading.value = true
  try {
    // Fetch your data here
    // Update chartData
  } finally {
    loading.value = false
  }
}

const refresh = () => fetchData()

onMounted(() => fetchData())
</script>
```

### Template 2: Grid Layout dengan Multiple Charts

```vue
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h3 class="text-xl font-bold mb-4">Chart 1</h3>
      <BaseChart type="bar" :data="chart1Data" height="250px" />
    </div>
    
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h3 class="text-xl font-bold mb-4">Chart 2</h3>
      <BaseChart type="pie" :data="chart2Data" height="250px" />
    </div>
    
    <div class="bg-white rounded-lg shadow-lg p-6 md:col-span-2">
      <h3 class="text-xl font-bold mb-4">Chart 3</h3>
      <BaseChart type="line" :data="chart3Data" height="300px" />
    </div>
  </div>
</template>
```

## 📚 Referensi Lengkap

Untuk dokumentasi lengkap, lihat:
- `BaseChart.README.md` - Dokumentasi lengkap
- `BaseChartExamples.vue` - Contoh-contoh lengkap
- `DashboardChartCards.vue` - Implementasi dalam dashboard

## 🆘 Troubleshooting

### Chart tidak muncul?
- Pastikan data memiliki struktur yang benar (labels dan datasets)
- Cek console untuk error
- Pastikan height sudah di-set

### Data tidak update?
- Gunakan `reactive()` untuk chartData
- Pastikan API response di-map dengan benar

### Chart terlalu kecil/besar?
- Atur prop `height` dan `width`
- Set `maintainAspectRatio: false` di options

## 💡 Tips

1. **Gunakan reactive()** untuk data yang berubah
2. **Format Rupiah** di tooltip untuk data keuangan
3. **Loading state** untuk UX yang lebih baik
4. **Error handling** untuk fallback data
5. **Responsive design** dengan Tailwind classes

---

Selamat menggunakan BaseChart! 🎉
