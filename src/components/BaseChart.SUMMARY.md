# BaseChart Component - Summary

## 📦 File yang Telah Dibuat

### 1. **BaseChart.vue** (Core Component)
Komponen utama yang reusable untuk semua jenis chart menggunakan Chart.js.

**Fitur:**
- ✅ Support 8 tipe chart (line, bar, pie, doughnut, radar, polarArea, bubble, scatter)
- ✅ Props validation
- ✅ Reactive data updates
- ✅ Auto-register Chart.js components
- ✅ Responsive design
- ✅ Exposed methods (getChart, update, destroy, toBase64Image)
- ✅ TypeScript-friendly

**Props:**
- `type` (required): Tipe chart
- `data` (required): Data chart
- `options`: Konfigurasi Chart.js
- `height`: Tinggi chart (default: '400px')
- `width`: Lebar chart (default: '100%')
- `responsive`: Enable responsive (default: true)
- `maintainAspectRatio`: Maintain aspect ratio (default: true)

### 2. **BaseChartExamples.vue** (Examples)
File contoh lengkap dengan 8 jenis chart berbeda.

**Contoh yang Tersedia:**
1. Line Chart - Static Data
2. Bar Chart - Static Data
3. Pie Chart - Static Data
4. Doughnut Chart - Static Data
5. Bar Chart - Dynamic Data (API)
6. Line Chart - Multiple Datasets
7. Stacked Bar Chart
8. Radar Chart

### 3. **BaseChart.README.md** (Full Documentation)
Dokumentasi lengkap dengan:
- Instalasi
- Penggunaan dasar
- Props detail
- Tipe chart yang didukung
- Contoh penggunaan lengkap
- Methods yang tersedia
- Tips & best practices
- Referensi

### 4. **BaseChart.QUICKSTART.md** (Quick Start Guide)
Panduan cepat untuk mulai menggunakan dalam 5 menit:
- Import component
- Setup data
- Data dinamis dari API
- Penggunaan dalam card
- Format Rupiah
- Multiple datasets
- Template siap pakai
- Troubleshooting

### 5. **DashboardChartCards.vue** (Real Implementation)
Implementasi praktis dalam dashboard dengan 6 chart cards:
1. Iuran Bulanan (Bar Chart)
2. Distribusi Keuangan (Doughnut Chart)
3. Trend Keuangan (Line Chart - Full Width)
4. Sumber Pemasukan (Pie Chart)
5. Kategori Pengeluaran (Pie Chart)
6. Status Pembayaran (Radar Chart)

**Fitur:**
- ✅ Fetch data dari API
- ✅ Loading states
- ✅ Refresh buttons
- ✅ Responsive grid layout
- ✅ Error handling dengan fallback data
- ✅ Format Rupiah di tooltip

### 6. **KeuanganLineChartNew.vue** (Migration Example)
Contoh migrasi dari chart lama ke BaseChart:
- Menggantikan KeuanganLineChart.vue
- Menggunakan BaseChart component
- Stacked bar chart
- Custom tooltip dengan total
- Loading state
- Exposed refresh method

## 🚀 Cara Menggunakan

### Quick Start (5 Menit)

```vue
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
</script>

<template>
  <BaseChart type="bar" :data="chartData" height="300px" />
</template>
```

### Dengan API (Dynamic Data)

```vue
<script setup>
import { ref, reactive, onMounted } from 'vue'
import BaseChart from '@/components/BaseChart.vue'
import axios from 'axios'

const loading = ref(false)
const chartData = reactive({
  labels: [],
  datasets: [{ data: [] }]
})

const fetchData = async () => {
  loading.value = true
  try {
    const response = await axios.get('YOUR_API_URL')
    chartData.labels = response.data.map(item => item.label)
    chartData.datasets[0].data = response.data.map(item => item.value)
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchData())
</script>

<template>
  <div v-if="loading">Loading...</div>
  <BaseChart v-else type="bar" :data="chartData" />
</template>
```

### Dalam Card Design

```vue
<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h3 class="text-xl font-bold mb-4">Chart Title</h3>
    <BaseChart 
      type="line" 
      :data="chartData" 
      :options="chartOptions"
      height="300px"
    />
  </div>
</template>
```

## 📊 Tipe Chart yang Didukung

| Type | Use Case | Example |
|------|----------|---------|
| `line` | Trend over time | Sales trend, temperature |
| `bar` | Compare values | Monthly comparison |
| `pie` | Show proportions | Market share, budget |
| `doughnut` | Show proportions | Similar to pie |
| `radar` | Multivariate data | Performance metrics |
| `polarArea` | Cyclical data | Seasonal data |
| `bubble` | 3D data points | Risk vs return |
| `scatter` | Correlation | Price vs quantity |

## 🎨 Color Palettes

### Professional Theme
```javascript
backgroundColor: [
  'rgba(54, 162, 235, 0.7)',   // Blue
  'rgba(255, 99, 132, 0.7)',   // Red
  'rgba(255, 206, 86, 0.7)',   // Yellow
  'rgba(75, 192, 192, 0.7)',   // Teal
  'rgba(153, 102, 255, 0.7)'   // Purple
]
```

### Financial Theme
```javascript
backgroundColor: [
  'rgba(75, 192, 192, 0.7)',   // Green (Income)
  'rgba(255, 99, 132, 0.7)',   // Red (Expense)
  'rgba(54, 162, 235, 0.7)'    // Blue (Balance)
]
```

## 💰 Format Rupiah

```javascript
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
  },
  scales: {
    y: {
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
```

## 🔧 Common Configurations

### Responsive Chart
```javascript
{
  responsive: true,
  maintainAspectRatio: false
}
```

### Hide Legend
```javascript
{
  plugins: {
    legend: {
      display: false
    }
  }
}
```

### Stacked Chart
```javascript
{
  scales: {
    x: { stacked: true },
    y: { stacked: true }
  }
}
```

### Smooth Line
```javascript
{
  datasets: [{
    tension: 0.4  // 0 = straight, 1 = very curved
  }]
}
```

## 📱 Responsive Grid Layout

```vue
<template>
  <!-- 2 Columns on Desktop, 1 on Mobile -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <BaseChart type="bar" :data="data1" height="250px" />
    </div>
    <div class="bg-white rounded-lg shadow-lg p-6">
      <BaseChart type="pie" :data="data2" height="250px" />
    </div>
  </div>

  <!-- Full Width -->
  <div class="bg-white rounded-lg shadow-lg p-6 mt-6">
    <BaseChart type="line" :data="data3" height="300px" />
  </div>

  <!-- 3 Columns on Desktop -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <BaseChart type="pie" :data="data4" height="200px" />
    </div>
    <div class="bg-white rounded-lg shadow-lg p-6">
      <BaseChart type="pie" :data="data5" height="200px" />
    </div>
    <div class="bg-white rounded-lg shadow-lg p-6">
      <BaseChart type="radar" :data="data6" height="200px" />
    </div>
  </div>
</template>
```

## 🎯 Best Practices

### 1. Use Reactive for Dynamic Data
```javascript
import { reactive } from 'vue'

const chartData = reactive({
  labels: [],
  datasets: [{ data: [] }]
})

// Update will trigger chart re-render
chartData.datasets[0].data = newData
```

### 2. Loading State
```vue
<template>
  <div v-if="loading" class="h-64 flex items-center justify-center">
    <div class="spinner"></div>
  </div>
  <BaseChart v-else type="bar" :data="chartData" />
</template>
```

### 3. Error Handling
```javascript
try {
  const response = await axios.get(API_URL)
  chartData.labels = response.data.labels
  chartData.datasets[0].data = response.data.values
} catch (error) {
  console.error('Error:', error)
  // Fallback data
  chartData.labels = ['No Data']
  chartData.datasets[0].data = [0]
}
```

### 4. Refresh Functionality
```vue
<template>
  <button @click="refresh">🔄 Refresh</button>
  <BaseChart type="bar" :data="chartData" />
</template>

<script setup>
const refresh = async () => {
  await fetchData()
}
</script>
```

### 5. Export Chart
```vue
<script setup>
const chartRef = ref(null)

const exportChart = () => {
  const base64 = chartRef.value.toBase64Image()
  // Download or use the image
  const link = document.createElement('a')
  link.download = 'chart.png'
  link.href = base64
  link.click()
}
</script>

<template>
  <button @click="exportChart">📥 Export</button>
  <BaseChart ref="chartRef" type="bar" :data="chartData" />
</template>
```

## 🆘 Troubleshooting

### Chart tidak muncul?
1. Cek struktur data (harus ada `labels` dan `datasets`)
2. Pastikan `height` sudah di-set
3. Cek console untuk error
4. Pastikan Chart.js sudah terinstall

### Data tidak update?
1. Gunakan `reactive()` bukan `ref()`
2. Update data dengan assignment langsung
3. Pastikan watcher berjalan

### Chart terlalu kecil/besar?
1. Set prop `height` dan `width`
2. Set `maintainAspectRatio: false` di options
3. Gunakan container dengan ukuran tetap

### Tooltip tidak muncul?
1. Cek `options.plugins.tooltip.enabled`
2. Pastikan data tidak null/undefined
3. Cek callback functions

## 📚 File References

- **Core Component**: `src/components/BaseChart.vue`
- **Examples**: `src/components/BaseChartExamples.vue`
- **Full Docs**: `src/components/BaseChart.README.md`
- **Quick Start**: `src/components/BaseChart.QUICKSTART.md`
- **Dashboard Implementation**: `src/components/DashboardChartCards.vue`
- **Migration Example**: `src/components/KeuanganLineChartNew.vue`

## 🎓 Learning Path

1. **Beginner**: Baca `BaseChart.QUICKSTART.md`
2. **Intermediate**: Lihat `BaseChartExamples.vue`
3. **Advanced**: Baca `BaseChart.README.md`
4. **Implementation**: Lihat `DashboardChartCards.vue`

## 🚀 Next Steps

1. Import BaseChart ke component Anda
2. Setup data dengan `reactive()`
3. Pilih tipe chart yang sesuai
4. Customize dengan options
5. Deploy! 🎉

## 📞 Support

Jika ada pertanyaan atau issue:
1. Cek dokumentasi di `BaseChart.README.md`
2. Lihat contoh di `BaseChartExamples.vue`
3. Cek troubleshooting guide
4. Buat issue di repository

---

**Happy Charting! 📊✨**

Created with ❤️ using Chart.js and Vue 3
