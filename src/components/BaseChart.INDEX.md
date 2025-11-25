# 📊 BaseChart Component - Index

Selamat datang di dokumentasi BaseChart Component! Komponen reusable untuk Chart.js di Vue 3.

## 🗂️ Struktur File

```
src/components/
├── BaseChart.vue                    # ⭐ Core Component
├── BaseChartExamples.vue            # 📚 Contoh Lengkap
├── DashboardChartCards.vue          # 🎯 Implementasi Real
├── KeuanganLineChartNew.vue         # 🔄 Contoh Migrasi
├── BaseChart.INDEX.md               # 📑 File ini
├── BaseChart.SUMMARY.md             # 📋 Ringkasan
├── BaseChart.QUICKSTART.md          # 🚀 Quick Start
└── BaseChart.README.md              # 📖 Dokumentasi Lengkap
```

## 🎯 Mulai dari Mana?

### 👶 Pemula (Baru Pertama Kali)
**Baca:** `BaseChart.QUICKSTART.md`
- Panduan 5 menit
- Contoh sederhana
- Copy-paste ready
- Template siap pakai

### 👨‍💻 Developer (Sudah Familiar dengan Vue)
**Baca:** `BaseChart.SUMMARY.md`
- Overview lengkap
- Best practices
- Common configurations
- Troubleshooting

### 🎓 Advanced (Butuh Detail Lengkap)
**Baca:** `BaseChart.README.md`
- Dokumentasi lengkap
- Semua props & methods
- Contoh advanced
- Tips & tricks

### 👀 Visual Learner (Belajar dari Contoh)
**Lihat:** `BaseChartExamples.vue`
- 8 contoh chart berbeda
- Static & dynamic data
- Bisa langsung di-run
- Interactive examples

### 🏗️ Implementasi Real (Butuh Referensi)
**Lihat:** `DashboardChartCards.vue`
- Dashboard lengkap
- 6 chart cards
- API integration
- Responsive design

### 🔄 Migrasi (Dari Chart Lama)
**Lihat:** `KeuanganLineChartNew.vue`
- Contoh migrasi
- Before & after
- Best practices
- Migration guide

## 📚 Dokumentasi

### 1. BaseChart.vue
**Core Component** - Komponen utama yang reusable

**Key Features:**
- ✅ 8 tipe chart
- ✅ Reactive data
- ✅ Auto-register
- ✅ Responsive
- ✅ TypeScript-friendly

**Props:**
```vue
<BaseChart
  type="line"           // required
  :data="chartData"     // required
  :options="options"    // optional
  height="300px"        // optional
  width="100%"          // optional
/>
```

### 2. BaseChart.QUICKSTART.md
**Quick Start Guide** - Mulai dalam 5 menit

**Isi:**
- ✅ Import component
- ✅ Setup data
- ✅ Dynamic data (API)
- ✅ Card integration
- ✅ Format Rupiah
- ✅ Templates

**Cocok untuk:**
- Pemula
- Quick reference
- Copy-paste code

### 3. BaseChart.README.md
**Full Documentation** - Dokumentasi lengkap

**Isi:**
- ✅ Instalasi
- ✅ Props detail
- ✅ Methods
- ✅ Contoh lengkap
- ✅ Best practices
- ✅ Referensi

**Cocok untuk:**
- Developer berpengalaman
- Referensi lengkap
- Advanced usage

### 4. BaseChart.SUMMARY.md
**Summary** - Ringkasan lengkap

**Isi:**
- ✅ File overview
- ✅ Quick start
- ✅ Common configs
- ✅ Best practices
- ✅ Troubleshooting

**Cocok untuk:**
- Overview cepat
- Reference guide
- Problem solving

### 5. BaseChartExamples.vue
**Examples** - Contoh interaktif

**Contoh:**
1. Line Chart - Static
2. Bar Chart - Static
3. Pie Chart - Static
4. Doughnut Chart - Static
5. Bar Chart - Dynamic (API)
6. Line Chart - Multiple Datasets
7. Stacked Bar Chart
8. Radar Chart

**Cara Menggunakan:**
```vue
// Import ke router atau component
import BaseChartExamples from '@/components/BaseChartExamples.vue'
```

### 6. DashboardChartCards.vue
**Real Implementation** - Dashboard lengkap

**Features:**
- ✅ 6 chart cards
- ✅ API integration
- ✅ Loading states
- ✅ Refresh buttons
- ✅ Responsive grid
- ✅ Error handling

**Cara Menggunakan:**
```vue
// Import ke dashboard
import DashboardChartCards from '@/components/DashboardChartCards.vue'
```

### 7. KeuanganLineChartNew.vue
**Migration Example** - Contoh migrasi

**Features:**
- ✅ Menggantikan chart lama
- ✅ Menggunakan BaseChart
- ✅ Stacked bar chart
- ✅ Custom tooltip
- ✅ Loading state

**Cara Menggunakan:**
```vue
// Ganti import lama
// import KeuanganLineChart from './KeuanganLineChart.vue'
import KeuanganLineChart from './KeuanganLineChartNew.vue'
```

## 🚀 Quick Start

### 1. Import Component
```vue
<script setup>
import BaseChart from '@/components/BaseChart.vue'
import { reactive } from 'vue'
</script>
```

### 2. Setup Data
```vue
<script setup>
const chartData = reactive({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [{
    label: 'Sales',
    data: [12, 19, 3, 5, 2],
    backgroundColor: 'rgba(54, 162, 235, 0.7)'
  }]
})
</script>
```

### 3. Use Component
```vue
<template>
  <BaseChart type="bar" :data="chartData" height="300px" />
</template>
```

## 📊 Chart Types

| Type | Icon | Use Case |
|------|------|----------|
| `line` | 📈 | Trends, time series |
| `bar` | 📊 | Comparisons |
| `pie` | 🥧 | Proportions |
| `doughnut` | 🍩 | Proportions with center |
| `radar` | 🎯 | Multivariate data |
| `polarArea` | ⭕ | Cyclical data |
| `bubble` | 🫧 | 3D data points |
| `scatter` | 📍 | Correlations |

## 🎨 Quick Examples

### Bar Chart
```vue
<BaseChart 
  type="bar" 
  :data="{ 
    labels: ['A', 'B', 'C'], 
    datasets: [{ data: [10, 20, 30] }] 
  }" 
/>
```

### Line Chart
```vue
<BaseChart 
  type="line" 
  :data="{ 
    labels: ['Jan', 'Feb', 'Mar'], 
    datasets: [{ 
      data: [12, 19, 15],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.4
    }] 
  }" 
/>
```

### Pie Chart
```vue
<BaseChart 
  type="pie" 
  :data="{ 
    labels: ['Red', 'Blue', 'Yellow'], 
    datasets: [{ 
      data: [300, 50, 100],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)'
      ]
    }] 
  }" 
/>
```

## 🔗 Links

### Dokumentasi
- [Quick Start](./BaseChart.QUICKSTART.md) - Mulai dalam 5 menit
- [Full Documentation](./BaseChart.README.md) - Dokumentasi lengkap
- [Summary](./BaseChart.SUMMARY.md) - Ringkasan

### Contoh
- [Examples Component](./BaseChartExamples.vue) - Contoh interaktif
- [Dashboard Implementation](./DashboardChartCards.vue) - Real implementation
- [Migration Example](./KeuanganLineChartNew.vue) - Contoh migrasi

### External
- [Chart.js Docs](https://www.chartjs.org/docs/latest/) - Chart.js documentation
- [Vue Chart.js](https://vue-chartjs.org/) - Vue Chart.js wrapper

## 🆘 Need Help?

### Troubleshooting
1. Cek [BaseChart.SUMMARY.md](./BaseChart.SUMMARY.md#troubleshooting)
2. Lihat [BaseChart.README.md](./BaseChart.README.md#tips--best-practices)
3. Cek console untuk error messages

### Common Issues
- **Chart tidak muncul?** → Cek struktur data & height
- **Data tidak update?** → Gunakan `reactive()`
- **Tooltip tidak muncul?** → Cek options.plugins.tooltip

### Examples
- Lihat [BaseChartExamples.vue](./BaseChartExamples.vue)
- Lihat [DashboardChartCards.vue](./DashboardChartCards.vue)

## 📝 Checklist

### Untuk Pemula
- [ ] Baca `BaseChart.QUICKSTART.md`
- [ ] Copy contoh sederhana
- [ ] Test di component Anda
- [ ] Customize sesuai kebutuhan

### Untuk Developer
- [ ] Baca `BaseChart.SUMMARY.md`
- [ ] Lihat `BaseChartExamples.vue`
- [ ] Implementasi di project
- [ ] Baca `BaseChart.README.md` untuk detail

### Untuk Migrasi
- [ ] Lihat `KeuanganLineChartNew.vue`
- [ ] Identifikasi chart yang akan diganti
- [ ] Migrate satu per satu
- [ ] Test functionality

## 🎯 Recommended Path

```
1. Start Here (INDEX.md) ← You are here
   ↓
2. Quick Start (QUICKSTART.md)
   ↓
3. Try Examples (BaseChartExamples.vue)
   ↓
4. Read Summary (SUMMARY.md)
   ↓
5. Implement in Your Project
   ↓
6. Read Full Docs (README.md) if needed
```

## 📊 Component Hierarchy

```
BaseChart.vue (Core)
    ↓
    ├── BaseChartExamples.vue (Examples)
    ├── DashboardChartCards.vue (Dashboard)
    └── KeuanganLineChartNew.vue (Migration)
```

## 🎓 Learning Resources

### Beginner
1. `BaseChart.QUICKSTART.md` - Start here
2. Simple examples in QUICKSTART
3. Copy-paste templates

### Intermediate
1. `BaseChartExamples.vue` - See all examples
2. `DashboardChartCards.vue` - Real implementation
3. `BaseChart.SUMMARY.md` - Best practices

### Advanced
1. `BaseChart.README.md` - Full documentation
2. Chart.js official docs
3. Custom implementations

## 💡 Tips

1. **Start Simple** - Mulai dengan contoh sederhana
2. **Use Reactive** - Gunakan `reactive()` untuk data dinamis
3. **Check Examples** - Lihat contoh sebelum membuat sendiri
4. **Read Docs** - Baca dokumentasi untuk fitur advanced
5. **Test First** - Test di component sederhana dulu

## 🎉 Ready to Start?

Pilih salah satu:
- 🚀 [Quick Start Guide](./BaseChart.QUICKSTART.md) - Mulai sekarang!
- 📚 [See Examples](./BaseChartExamples.vue) - Lihat contoh
- 📖 [Read Full Docs](./BaseChart.README.md) - Baca dokumentasi

---

**Happy Charting! 📊✨**

Last Updated: 2024
Version: 1.0.0
