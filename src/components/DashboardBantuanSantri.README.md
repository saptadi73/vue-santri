# Dashboard Bantuan Sosial Santri

Dashboard lengkap untuk monitoring dan pelaporan program bantuan pemerintah untuk santri menggunakan BaseChart component.

## 📊 Fitur Dashboard

### 1. Summary Cards (4 Cards)
- **Total Santri Terbantu**: 45,750 santri
- **Total Bantuan**: Rp 687.5 Miliar
- **Dalam Verifikasi**: 3,250 santri
- **Disetujui**: 42,500 santri

### 2. Pie Chart - Distribusi Bantuan per Kategori
Menampilkan distribusi bantuan berdasarkan kategori santri:
- Prestasi Akademik: 8,500 santri
- Keluarga Tidak Mampu: 18,200 santri
- Disabilitas: 4,300 santri
- Prestasi Olahraga: 3,800 santri
- Korban Bencana/HAM: 6,450 santri
- Jasa & Penghargaan Lain: 4,500 santri

### 3. Bar Chart - Kenaikan Bantuan Sosial
Menampilkan kenaikan bantuan sosial dari Januari hingga Desember dalam ratusan juta rupiah.

### 4. Line Chart - Jumlah Santri Terbantu
Menampilkan trend jumlah santri yang terbantu dari Januari hingga Desember dalam ribuan santri.

### 5. Doughnut Chart - Kontribusi Sumber Bantuan
Menampilkan kontribusi dari berbagai sumber:
- Pemerintah Pusat: 35%
- CSR Swasta: 25%
- Kementerian Keuangan: 15%
- Kementerian Agama: 12%
- BAZIS: 8%
- Lain-lain: 5%

### 6. Status Verifikasi
Menampilkan status verifikasi dengan:
- Progress bars
- Table detail
- Doughnut chart visualisasi

Status:
- Dalam Verifikasi: 3,250 santri (7.1%)
- Disetujui: 42,500 santri (92.9%)
- Tahap Penyaluran: 38,750 santri (84.7%)

### 7. Table Penerima Bantuan per Provinsi
Table lengkap dengan fitur sorting yang menampilkan:
- Nomor urut
- Nama provinsi
- Jumlah santri penerima
- Total bantuan (dalam ratusan juta)
- Rata-rata bantuan per santri

Data mencakup 14 provinsi dengan total nasional.

## 🚀 Cara Menggunakan

### 1. Import Component

```vue
<script setup>
import DashboardBantuanSantri from '@/components/DashboardBantuanSantri.vue'
</script>

<template>
  <DashboardBantuanSantri />
</template>
```

### 2. Integrasi ke Router

```javascript
// router/index.js
import DashboardBantuanSantri from '@/components/DashboardBantuanSantri.vue'

const routes = [
  {
    path: '/bantuan-santri',
    name: 'BantuanSantri',
    component: DashboardBantuanSantri
  }
]
```

### 3. Integrasi ke Menu/Sidebar

```vue
<template>
  <nav>
    <router-link to="/bantuan-santri">
      Dashboard Bantuan Santri
    </router-link>
  </nav>
</template>
```

## 📝 Data Structure

### Summary Data
```javascript
const totalSantri = 45750
const totalBantuan = 687500000000 // 687.5 Miliar
const dalamVerifikasi = 3250
const disetujui = 42500
```

### Chart Data Format
```javascript
// Pie Chart
const kategoriBantuanData = {
  labels: ['Kategori 1', 'Kategori 2', ...],
  datasets: [{
    data: [value1, value2, ...],
    backgroundColor: [color1, color2, ...]
  }]
}

// Bar Chart
const kenaikanBantuanData = {
  labels: ['Jan', 'Feb', ...],
  datasets: [{
    data: [320, 380, ...]
  }]
}

// Line Chart
const santriTerbantuData = {
  labels: ['Jan', 'Feb', ...],
  datasets: [{
    data: [12.5, 15.8, ...]
  }]
}
```

### Table Data Format
```javascript
const provinsiData = [
  {
    provinsi: 'Jawa Barat',
    jumlahSantri: 8500,
    totalBantuan: 127500000000
  },
  // ...
]
```

## 🎨 Customization

### 1. Mengubah Warna Summary Cards

```vue
<!-- Blue Card -->
<div class="summary-card bg-gradient-to-br from-blue-500 to-blue-600">

<!-- Green Card -->
<div class="summary-card bg-gradient-to-br from-green-500 to-green-600">

<!-- Yellow Card -->
<div class="summary-card bg-gradient-to-br from-yellow-500 to-yellow-600">

<!-- Purple Card -->
<div class="summary-card bg-gradient-to-br from-purple-500 to-purple-600">
```

### 2. Mengubah Data Chart

Edit data di section `<script setup>`:

```javascript
// Ubah data kategori bantuan
const kategoriBantuanData = reactive({
  labels: ['Kategori Baru 1', 'Kategori Baru 2'],
  datasets: [{
    data: [nilai1, nilai2]
  }]
})
```

### 3. Menambah Provinsi

```javascript
const provinsiData = reactive([
  // Data existing...
  { 
    provinsi: 'Provinsi Baru', 
    jumlahSantri: 1000, 
    totalBantuan: 15000000000 
  }
])
```

## 🔧 Fitur Interaktif

### 1. Sorting Table
Klik header kolom untuk sorting:
- **Provinsi**: Sort alfabetis
- **Jumlah**: Sort berdasarkan jumlah santri
- **Total**: Sort berdasarkan total bantuan

### 2. Hover Effects
- Summary cards: Animasi lift saat hover
- Table rows: Highlight saat hover
- Chart tooltips: Detail data saat hover

### 3. Responsive Design
- Mobile: 1 kolom
- Tablet: 2 kolom
- Desktop: 2-4 kolom

## 💡 Tips Penggunaan

### 1. Integrasi dengan API

Untuk data dinamis, ubah data static menjadi fetch dari API:

```javascript
import { onMounted } from 'vue'
import axios from 'axios'

const fetchData = async () => {
  try {
    const response = await axios.get('API_URL')
    // Update reactive data
    kategoriBantuanData.datasets[0].data = response.data.values
  } catch (error) {
    console.error('Error:', error)
  }
}

onMounted(() => {
  fetchData()
})
```

### 2. Export Data

Tambahkan fungsi export:

```javascript
const exportToExcel = () => {
  // Logic export to Excel
}

const exportToPDF = () => {
  // Logic export to PDF
}
```

### 3. Filter Data

Tambahkan filter berdasarkan periode:

```javascript
const selectedPeriod = ref('2024')
const filteredData = computed(() => {
  return data.filter(item => item.year === selectedPeriod.value)
})
```

## 📱 Responsive Breakpoints

```css
/* Mobile: < 768px */
@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr; }
}

/* Tablet: 768px - 1024px */
@media (min-width: 768px) and (max-width: 1024px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop: > 1024px */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(4, 1fr); }
}
```

## 🎯 Use Cases

### 1. Monitoring Program
- Track jumlah santri terbantu
- Monitor distribusi bantuan
- Evaluasi sumber kontribusi

### 2. Pelaporan
- Generate laporan bulanan
- Analisis trend bantuan
- Evaluasi per provinsi

### 3. Decision Making
- Identifikasi kategori prioritas
- Alokasi budget
- Perencanaan program

## 🔄 Update Data

### Manual Update
Edit langsung di file:
```javascript
const totalSantri = 50000 // Update nilai
```

### Auto Update (dengan API)
```javascript
setInterval(() => {
  fetchData()
}, 300000) // Update setiap 5 menit
```

## 📊 Chart Options

Semua chart menggunakan BaseChart component dengan options yang dapat dikustomisasi:

```javascript
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'right' },
    tooltip: { enabled: true }
  }
}
```

## 🎨 Color Palette

Dashboard menggunakan color palette yang konsisten:

```javascript
// Primary Colors
Blue: 'rgba(59, 130, 246, 0.8)'
Green: 'rgba(16, 185, 129, 0.8)'
Yellow: 'rgba(245, 158, 11, 0.8)'
Red: 'rgba(239, 68, 68, 0.8)'
Purple: 'rgba(139, 92, 246, 0.8)'
Pink: 'rgba(236, 72, 153, 0.8)'
```

## 📚 Dependencies

- Vue 3
- BaseChart component (Chart.js)
- Tailwind CSS (untuk styling)

## 🐛 Troubleshooting

### Chart tidak muncul?
- Pastikan BaseChart.vue sudah ada
- Cek import path
- Verifikasi data structure

### Data tidak update?
- Gunakan `reactive()` untuk data
- Pastikan watcher berjalan
- Cek console untuk error

### Styling tidak sesuai?
- Pastikan Tailwind CSS terinstall
- Cek class names
- Verifikasi responsive breakpoints

## 📝 Notes

- Data yang ditampilkan adalah data static untuk demo
- Untuk production, integrasikan dengan API backend
- Customize sesuai kebutuhan organisasi
- Tambahkan fitur export jika diperlukan

## 🎓 Learning Resources

- [BaseChart Documentation](./BaseChart.README.md)
- [Chart.js Docs](https://www.chartjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Created with ❤️ for Monitoring Bantuan Sosial Santri**

Version: 1.0.0
Last Updated: 2024
