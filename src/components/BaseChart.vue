<template>
  <div class="base-chart-container" :style="containerStyle">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  BarController,
  LineController,
  PieController,
  DoughnutController,
  RadarController,
  PolarAreaController,
  BubbleController,
  ScatterController,
  Filler
} from 'chart.js'

/**
 * BaseChart - Reusable Chart.js Component
 * 
 * @component
 * @example
 * // Line Chart Example
 * <BaseChart
 *   type="line"
 *   :data="{
 *     labels: ['Jan', 'Feb', 'Mar'],
 *     datasets: [{
 *       label: 'Sales',
 *       data: [12, 19, 3],
 *       borderColor: 'rgb(75, 192, 192)',
 *       tension: 0.1
 *     }]
 *   }"
 *   :options="{ responsive: true }"
 *   height="300px"
 * />
 * 
 * // Bar Chart Example
 * <BaseChart
 *   type="bar"
 *   :data="barChartData"
 *   :options="barChartOptions"
 * />
 * 
 * // Pie Chart Example
 * <BaseChart
 *   type="pie"
 *   :data="pieChartData"
 * />
 */

// Props definition
const props = defineProps({
  /**
   * Chart type
   * @type {'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'bubble' | 'scatter'}
   */
  type: {
    type: String,
    required: true,
    validator: (value) => {
      return ['line', 'bar', 'pie', 'doughnut', 'radar', 'polarArea', 'bubble', 'scatter'].includes(value)
    }
  },
  
  /**
   * Chart data object
   * @type {Object}
   * @property {Array} labels - Chart labels
   * @property {Array} datasets - Array of dataset objects
   */
  data: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.labels && value.datasets && Array.isArray(value.datasets)
    }
  },
  
  /**
   * Chart.js options object
   * @type {Object}
   */
  options: {
    type: Object,
    default: () => ({})
  },
  
  /**
   * Chart height
   * @type {String | Number}
   */
  height: {
    type: [String, Number],
    default: '400px'
  },
  
  /**
   * Chart width
   * @type {String | Number}
   */
  width: {
    type: [String, Number],
    default: '100%'
  },
  
  /**
   * Enable/disable responsive behavior
   * @type {Boolean}
   */
  responsive: {
    type: Boolean,
    default: true
  },
  
  /**
   * Maintain aspect ratio
   * @type {Boolean}
   */
  maintainAspectRatio: {
    type: Boolean,
    default: true
  }
})

// Refs
const chartCanvas = ref(null)
const chartInstance = ref(null)

// Computed container style
const containerStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  position: 'relative'
}))

// Register all Chart.js components
const registerChartComponents = () => {
  Chart.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    RadialLinearScale,
    CategoryScale,
    LinearScale,
    BarController,
    LineController,
    PieController,
    DoughnutController,
    RadarController,
    PolarAreaController,
    BubbleController,
    ScatterController,
    Filler
  )
}

// Merge default options with user options
const getMergedOptions = () => {
  const defaultOptions = {
    responsive: props.responsive,
    maintainAspectRatio: props.maintainAspectRatio,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false
      }
    }
  }
  
  // Deep merge user options with defaults
  return {
    ...defaultOptions,
    ...props.options,
    plugins: {
      ...defaultOptions.plugins,
      ...(props.options.plugins || {})
    }
  }
}

// Create chart instance
const createChart = () => {
  if (!chartCanvas.value) return
  
  // Destroy existing chart if any
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }
  
  const ctx = chartCanvas.value.getContext('2d')
  
  chartInstance.value = new Chart(ctx, {
    type: props.type,
    data: props.data,
    options: getMergedOptions()
  })
}

// Update chart data
const updateChart = () => {
  if (!chartInstance.value) return
  
  chartInstance.value.data = props.data
  chartInstance.value.options = getMergedOptions()
  chartInstance.value.update()
}

// Watch for data changes
watch(() => props.data, () => {
  updateChart()
}, { deep: true })

// Watch for options changes
watch(() => props.options, () => {
  updateChart()
}, { deep: true })

// Watch for type changes (recreate chart)
watch(() => props.type, () => {
  createChart()
})

// Lifecycle hooks
onMounted(() => {
  registerChartComponents()
  createChart()
})

onBeforeUnmount(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy()
    chartInstance.value = null
  }
})

// Expose methods for parent components
defineExpose({
  /**
   * Get chart instance
   * @returns {Chart} Chart.js instance
   */
  getChart: () => chartInstance.value,
  
  /**
   * Update chart manually
   */
  update: () => updateChart(),
  
  /**
   * Destroy chart
   */
  destroy: () => {
    if (chartInstance.value) {
      chartInstance.value.destroy()
      chartInstance.value = null
    }
  },
  
  /**
   * Export chart as base64 image
   * @returns {String} Base64 image string
   */
  toBase64Image: () => {
    return chartInstance.value ? chartInstance.value.toBase64Image() : null
  }
})
</script>

<style scoped>
.base-chart-container {
  position: relative;
  width: 100%;
}

.base-chart-container canvas {
  max-width: 100%;
  height: auto;
}
</style>
