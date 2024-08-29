<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>Total Consommateurs</v-card-title>
              <v-card-subtitle>{{ statistics.total_consommateurs }}</v-card-subtitle>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>Total Consommations</v-card-title>
              <v-card-subtitle>{{ statistics.total_consommations }}</v-card-subtitle>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>Prix Totales(non anomalie)</v-card-title>
              <v-card-subtitle>{{ statistics.prixNonAnomalies }}(€)</v-card-subtitle>
            </v-card>
          </v-col>
           <v-col cols="12" md="4">
            <v-card>
              <v-card-title>Quantités Totales</v-card-title>
              <v-card-subtitle>{{ statistics.quantites_totales }}</v-card-subtitle>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>Total Anomalies</v-card-title>
              <v-card-subtitle>{{ statistics.anomaliesCount }}</v-card-subtitle>
            </v-card>
          </v-col>
         
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>Prix Total Anomalies</v-card-title>
              <v-card-subtitle>{{ statistics.prix_total_anomalies }}(€)</v-card-subtitle>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card>
              <v-card-title>Statistiques</v-card-title>
              <v-card-subtitle>
                <chart-js :data="chartData" :options="chartOptions" :key="chartKey" />
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  components: {
    ChartJs: Bar
  },
  data() {
    return {
      statistics: {},
      chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Consommations',
            data: [], // Initialize with empty data array
            backgroundColor: '#42A5F5',
          },
          {
            label: 'Anomalies',
            data: [], // Initialize with empty data array
            backgroundColor: 'rgb(177 67 67)',
          },
        ],
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.raw}`;
              }
            }
          }
        }
      },
      chartKey: 0, // Key to force re-render
    };
  },
  created() {
    this.fetchStatistics();
  },
  methods: {
    async fetchStatistics() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/statistics'); // Verify the endpoint
        const data = await response.json();
        console.log('API Data:', data); // Debug: Log the received data
        this.statistics = data;

        // Ensure the data is an array of numbers
        this.chartData.datasets[0].data = data.monthly_data.map(value => Number(value) || 0);
        this.chartData.datasets[1].data = data.monthly_data_anomalies.map(value => Number(value) || 0);

        // Update chartKey to force re-render
        this.chartKey += 1;

        console.log('Chart Data:', this.chartData.datasets[0].data); // Debug: Log the chart data
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    }
  }
};
</script>

<style scoped>
.app-drawer {
  background-color: #2c3e50;
  color: #ecf0f1;
}

.v-list-item {
  border-radius: 4px;
  transition: background-color 0.3s;
}

.v-list-item:hover {
  background-color: #34495e;
}

.v-app-bar {
  background-color: #2980b9;
  color: white;
}

.headline {
  font-weight: bold;
}
</style>
