<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Tableau de Vérification des Anomalies
          </v-card-title>
          <v-card-subtitle>
            <v-btn style="float:right;" @click="fetchMonthlyAnomalies" color="primary">REFRESH</v-btn>
            <v-btn style="float:right;  margin-right: 20px;" @click="openSelectYear" color="secondary">SELECT
              YEAR</v-btn>
          </v-card-subtitle>
          <v-data-table :headers="headers" :items="anomalies" item-key="month">
            <template v-slot:default="{ items }">
              <thead>
                <tr>
                  <th v-for="header in headers" :key="header.value">{{ header.text }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in items" :key="item.month">
                  <td>{{ item.month }}</td>
                  <td>{{ item.anomalies_count }}</td>
                  <td>
                    <v-btn style="margin-right: 10px;" @click="viewMonthlyConsumption(item.month.split('/')[0])"
                      color="primary">VIEW</v-btn>
                    <v-btn @click="openClearMsg(item.month.split('/')[0])" color="red">CLEAR</v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="1200px">
      <v-card>
        <v-card-title>
          Consommations pour le mois {{ selectedMonth }}
        </v-card-title>
        <v-card-subtitle>
          <v-btn style="float:right; " @click="dialog = false" color="primary">Fermer</v-btn>
          <v-btn style="float:right; margin-right: 10px;" @click="downloadExcel" color="primary">Télécharger en
            Excel</v-btn>
        </v-card-subtitle>
        <v-card-text>
          <v-data-table :headers="consumptionHeaders" :items="consumption" item-key="id">
            <template v-slot:default="{ items }">
              <thead>
                <tr>
                  <th v-for="header in consumptionHeaders" :key="header.value">{{ header.text }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in items" :key="item.id">
                  <td>{{ item.matricule }}</td>
                  <td>{{ item.nomPrenom }}</td>
                  <td>{{ item.date }}</td>
                  <td>{{ item.heure }}</td>
                  <td>{{ item.description }}</td>
                  <td>{{ item.quantite }}</td>
                  <td>{{ item.mt_sub }}</td>
                  <td>{{ item.dateControle }}</td>
                  <td>{{ item.anomalie }}</td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
  <template>
    <div class="text-center pa-4">
      <v-dialog v-model="clearMSGSuccess" max-width="500" persistent>
        <v-card class="confirmDialogInterface" prepend-icon="mdi-trash-can-outline"
          text="The consumptions have been cleared successfully" title="CONSUMPTIONS CLEARED">
          <template v-slot:actions>
            <v-spacer></v-spacer>

            <v-btn @click="clearMSGSuccess = false"> Close </v-btn>

          </template>
        </v-card>
      </v-dialog>
    </div>
  </template>
  <template>
    <div class="text-center pa-4">
      <v-dialog v-model="clearMSG" max-width="500" persistent>
        <v-card class="confirmDialogInterface" prepend-icon="mdi-trash-can-outline"
          text="Are you sure you want to clear this month?" title="CLEAR CONSUMPTIONS">
          <template v-slot:actions>
            <v-spacer></v-spacer>

            <v-btn @click="clearMSG = false"> No </v-btn>

            <v-btn @click="clearMonthlyConsumption"> Yes </v-btn>
          </template>
        </v-card>
      </v-dialog>
    </div>
  </template>
  <template>
    <div class="text-center pa-4">
      <v-dialog v-model="showSelectYear" max-width="500" persistent>
        <v-card class="confirmDialogInterface" prepend-icon="mdi-trash-can-outline" title="SELECT THE YEAR">
          <v-card-text>
            Select the Year(by default its 2024)<br>
            <v-select
                label="Select"
                clearable
                v-model="modalCaledarSelectedYear"
                :items="items"
              ></v-select>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn @click="showSelectYear = false"> CANCEL </v-btn>

            <v-btn @click="fetchMonthlyAnomalies"> SELECT </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
</template>


<script>
import axios from 'axios';
import * as XLSX from 'xlsx'; // Importer la bibliothèque xlsx

export default {
  data() {
    return {
      headers: [
        { text: 'Mois', value: 'month' },
        { text: 'Nombre d\'Anomalies', value: 'anomalies_count' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      consumptionHeaders: [
        { text: 'Matricule', value: 'matricule' },
        { text: 'Nom & Prénom', value: 'nomPrenom' },
        { text: 'Date', value: 'date' },
        { text: 'Heure', value: 'heure' },
        { text: 'Description', value: 'description' },
        { text: 'Quantité', value: 'quantite' },
        { text: 'Montant', value: 'mt_sub' },
        { text: 'Date de Contrôle', value: 'dateControle' },
        { text: 'Anomalie', value: 'anomalie' }
      ],
      anomalies: [],
      consumption: [],
      dialog: false,
      selectedMonth: '',
      selectedYear: 2024,
      clearMSG: false,
      clearMSGSuccess: false,
      showSelectYear: false,
      modalCaledarSelectedYear:2024
      ,
      items: [],
    };
  },
  methods: {
    saveYear(year) {
      this.$refs.menu.save(year)

      // Reset activePicker to type YEAR
      this.$refs.picker.activePicker = 'YEAR'

      // Close the menu/datepicker
    },
    setSelectedYear() {
      console.log("modalCaledarSelectedYear :", this.modalCaledarSelectedYear);
      this.showSelectYear = false;
    },
    openSelectYear() {
      this.showSelectYear = true;
    },
    openClearMsg(month) {
      this.selectedMonth = month;
      this.clearMSG = true;
    },
    async fetchMonthlyAnomalies() {
      this.anomalies = [];
      this.selectedYear=this.modalCaledarSelectedYear;
      try {

        axios.get('http://127.0.0.1:8000/api/consommations/anomalies/' + this.selectedYear).then((e) => {
          console.log("this test tes :", e.data.payload);
          e.data.payload.map((c) => {
            this.anomalies.push({
              month: c.month + "/" + this.selectedYear,
              anomalies_count: c.countAnomalies
            });
          });
          this.showSelectYear=false;
        });

        //const anomalyRequests = months.map(month =>
        //);
        //const responses = await Promise.all(anomalyRequests);
        //this.anomalies = responses.map((response, index) => ({
        //  month: `${index + 1}/${year}`, // Formater le mois/année
        //  anomalies_count: response.data.anomalies_count
        //}));
      } catch (error) {
        console.error('Erreur lors de la récupération des anomalies mensuelles:', error.message);
        // Afficher un message d'erreur dans l'interface utilisateur si nécessaire
      }
    },
    async viewMonthlyConsumption(month) {
      try {
        this.selectedMonth = month;
        const response = await axios.get(`http://127.0.0.1:8000/api/consommations/month/${month}`);

        this.consumption = response.data;
        this.dialog = true;
      } catch (error) {
        console.error('Erreur lors de la récupération des consommations mensuelles:', error.message);
        // Afficher un message d'erreur dans l'interface utilisateur si nécessaire
      }
    },
    async clearMonthlyConsumption() {
      try {

        await axios.get(`http://127.0.0.1:8000/api/consommations/month/clear/${this.selectedMonth}`).then(() => {
          this.clearMSG = false;
          this.clearMSGSuccess = true;
        })


      } catch (error) {
        console.error('Erreur lors de la récupération des consommations mensuelles:', error.message);
        // Afficher un message d'erreur dans l'interface utilisateur si nécessaire
      }
    },
    downloadExcel() {
      // Convertir les données en format Excel
      const ws = XLSX.utils.json_to_sheet(this.consumption, {
        header: this.consumptionHeaders.map(header => header.value)
      });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `Consommations-${this.selectedMonth}`);

      // Générer le fichier Excel et le télécharger
      XLSX.writeFile(wb, `Consommations-${this.selectedMonth}.xlsx`);
    }
  },
  mounted() {
    this.fetchMonthlyAnomalies();
    const date = new Date();
    const year = date.getFullYear(); 

    this.selectedYear = parseInt(year, 10);
    this.modalCaledarSelectedYear = parseInt(year, 10);
    let yearToBeging=this.selectedYear-5;
    for (let index = 1; index < 20; index++) {
      this.items.push(
        yearToBeging+index
      )
     
      
    }
  }
};
</script>
<style scoped>
.v-card {
  margin-bottom: 20px;
}
</style>
