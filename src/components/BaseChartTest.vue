<template>
  <div class="test-container">
    <h1 class="text-3xl font-bold mb-8 text-center">BaseChart Component Test</h1>
    
    <!-- Test 1: Simple Bar Chart -->
    <div class="test-card">
      <h2 class="test-title">✅ Test 1: Simple Bar Chart</h2>
      <BaseChart
        type="bar"
        :data="simpleBarData"
        height="250px"
      />
    </div>

    <!-- Test 2: Line Chart with Options -->
    <div class="test-card">
      <h2 class="test-title">✅ Test 2: Line Chart with Options</h2>
      <BaseChart
        type="line"
        :data="lineData"
        :options="lineOptions"
        height="250px"
      />
    </div>

    <!-- Test 3: Pie Chart -->
    <div class="test-card">
      <h2 class="test-title">✅ Test 3: Pie Chart</h2>
      <BaseChart
        type="pie"
        :data="pieData"
        height="250px"
      />
    </div>

    <!-- Test 4: Doughnut Chart -->
    <div class="test-card">
      <h2 class="test-title">✅ Test 4: Doughnut Chart</h2>
      <BaseChart
        type="doughnut"
        :data="doughnutData"
        :options="doughnutOptions"
        height="250px"
      />
    </div>

    <!-- Test 5: Multiple Datasets -->
    <div class="test-card">
      <h2 class="test-title">✅ Test 5: Multiple Datasets (Line)</h2>
      <BaseChart
        type="line"
        :data="multiLineData"
        :options="multiLineOptions"
        height="250px"
      />
    </div>

    <!-- Test 6: Stacked Bar Chart -->
    <div class="test-card">
      <h2 class="test-title">✅ Test 6: Stacked Bar Chart</h2>
      <BaseChart
        type="bar"
        :data="stackedBarData"
        :options="stackedBarOptions"
        height="250px"
      />
    </div>

    <!-- Test 7: Radar Chart -->
    <div class="test-card">
      <h2 class="test-title">✅ Test 7: Radar Chart</h2>
      <BaseChart
        type="radar"
        :data="radarData"
        height="250px"
      />
    </div>

    <!-- Test 8: Dynamic Data Update -->
    <div class="test-card">
      <h2 class="test-title">✅ Test 8: Dynamic Data Update</h2>
      <div class="mb-4">
        <button @click="updateDynamicData" class="btn-primary">
          🔄 Update Data
        </button>
        <span class="ml-4 text-sm text-gray-600">
          Click to see reactive update
        </span>
      </div>
      <BaseChart
        type="bar"
        :data="dynamicData"
        height="250px"
      />
    </div>

    <!-- Test 9: With Rupiah Format -->
    <div class="test-card">
      <h2 class="test-title">✅ Test 9: Rupiah Format</h2>
      <BaseChart
        type="bar"
        :data="rupiahData"
        :options="rupiahOptions"
        height="250px"
      />
    </div>

    <!-- Test 10: Responsive Test -->
    <div class="test-card">
      <h2 class="test-title">✅ Test 10: Responsive (Resize Window)</h2>
      <BaseChart
        type="line"
        :data="responsiveData"
        :options="responsiveOptions"
        height="250px"
      />
    </div>

    <!-- Test Results -->
    <div class="test-results">
      <h2 class="text-2xl font-bold mb-4">Test Results</h2>
      <div class="result-item">
        <span class="result-label">Total Tests:</span>
        <span class="result-value">10</span>
      </div>
      <div class="result-item">
        <span class="result-label">Status:</span>
        <span class="result-value text-green-600">✅ All tests should render correctly</span>
      </div>
      <div class="result-item">
        <span class="result-label">Component:</span>
        <span class="result-value">BaseChart.vue</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import BaseChart from './BaseChart.vue'

// Test 1: Simple Bar Chart
const simpleBarData = reactive({
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
  datasets: [{
    label: 'Votes',
    data: [12, 19, 3, 5, 2],
    backgroundColor: 'rgba(54, 162, 235, 0.7)'
  }]
})

// Test 2: Line Chart with Options
const lineData = reactive({
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [{
    label: 'Sales',
    data: [65, 59, 80, 81, 56],
    borderColor: 'rgb(75, 192, 192)',
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    tension: 0.4
  }]
})

const lineOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Monthly Sales Report'
    }
  }
}

// Test 3: Pie Chart
const pieData = reactive({
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [{
    data: [300, 50, 100],
    backgroundColor: [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)'
    ]
  }]
})

// Test 4: Doughnut Chart
const doughnutData = reactive({
  labels: ['Completed', 'In Progress', 'Pending'],
  datasets: [{
    data: [45, 30, 25],
    backgroundColor: [
      'rgba(75, 192, 192, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(255, 99, 132, 0.7)'
    ]
  }]
})

const doughnutOptions = {
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}

// Test 5: Multiple Datasets
const multiLineData = reactive({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [12, 19, 15, 25, 22],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)'
    },
    {
      label: 'Dataset 2',
      data: [8, 12, 10, 14, 16],
      borderColor: 'rgb(54, 162, 235)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)'
    }
  ]
})

const multiLineOptions = {
  plugins: {
    title: {
      display: true,
      text: 'Multiple Datasets'
    }
  }
}

// Test 6: Stacked Bar Chart
const stackedBarData = reactive({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Income',
      data: [12, 15, 13, 18, 20],
      backgroundColor: 'rgba(75, 192, 192, 0.7)',
      stack: 'Stack 0'
    },
    {
      label: 'Expense',
      data: [8, 9, 7, 11, 13],
      backgroundColor: 'rgba(255, 99, 132, 0.7)',
      stack: 'Stack 1'
    }
  ]
})

const stackedBarOptions = {
  scales: {
    x: { stacked: true },
    y: { stacked: true }
  }
}

// Test 7: Radar Chart
const radarData = reactive({
  labels: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency'],
  datasets: [{
    label: 'Product A',
    data: [85, 90, 80, 95, 88],
    borderColor: 'rgb(255, 99, 132)',
    backgroundColor: 'rgba(255, 99, 132, 0.2)'
  }]
})

// Test 8: Dynamic Data
const dynamicData = reactive({
  labels: ['A', 'B', 'C', 'D', 'E'],
  datasets: [{
    label: 'Dynamic Values',
    data: [10, 20, 30, 40, 50],
    backgroundColor: 'rgba(153, 102, 255, 0.7)'
  }]
})

const updateDynamicData = () => {
  dynamicData.datasets[0].data = dynamicData.datasets[0].data.map(() => 
    Math.floor(Math.random() * 100)
  )
}

// Test 9: Rupiah Format
const rupiahData = reactive({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [{
    label: 'Revenue',
    data: [1200000, 1900000, 1500000, 2500000, 2200000],
    backgroundColor: 'rgba(54, 162, 235, 0.7)'
  }]
})

const rupiahOptions = {
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

// Test 10: Responsive
const responsiveData = reactive({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Responsive Chart',
    data: [12, 19, 3, 5, 2, 3],
    borderColor: 'rgb(255, 159, 64)',
    backgroundColor: 'rgba(255, 159, 64, 0.2)',
    tension: 0.4
  }]
})

const responsiveOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Try resizing the window'
    }
  }
}
</script>

<style scoped>
.test-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.test-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.test-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2937;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.test-results {
  background: #f3f4f6;
  border-radius: 8px;
  padding: 24px;
  margin-top: 32px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
}

.result-item:last-child {
  border-bottom: none;
}

.result-label {
  font-weight: 600;
  color: #4b5563;
}

.result-value {
  color: #1f2937;
}
</style>
