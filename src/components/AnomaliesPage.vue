<template>
  <v-container fluid>
    <!-- En-tête avec titre et logo -->
    <v-row>
      <v-col cols="12" class="text-center">
        <v-card class="pa-4" elevation="2">
          <v-card-title>
            <v-img
              src="@/assets/04-Tanger-Alliance.png"
              max-width="150"
              class="mx-auto"
            ></v-img>
          </v-card-title>
          <v-card-subtitle class="text-h5">
            <v-icon>mdi-alert-circle</v-icon> Anomalies détectées
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Champs de recherche -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="pa-4">
          <v-card-title>Filtrer les anomalies</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="filters.matricule"
                  label="Matricule"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="filters.dateControle"
                  label="Date Contrôle"
                  placeholder="Format: dd/mm/aaaa"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="filters.anomalie"
                  label="Filtrer par anomalie"
                  placeholder="Ex: Anomalie détectée, Pas d'anomalie"
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tableau pour afficher les anomalies avec icône -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card v-if="filteredAnomalies.length">
          <v-card-title>
            <v-icon>mdi-alert-circle</v-icon> Anomalies détectées
          </v-card-title>
          <v-card-text>
            <v-simple-table>
              <thead>
                <tr>
                  <th>Matricule</th>
                  <th>Nom & Prénom</th>
                  <th>Date</th>
                  <th>Heure</th>
                  <th>Description</th>
                  <th>Quantité</th>
                  <th>Montant Sub</th>
                  <th>Date Contrôle</th>
                  <th>Anomalie</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(anomaly, index) in filteredAnomalies" :key="index">
                  <td>{{ anomaly.matricule }}</td>
                  <td>{{ anomaly.nomPrenom }}</td>
                  <td>{{ anomaly.date }}</td>
                  <td>{{ anomaly.heure }}</td>
                  <td>{{ anomaly.description }}</td>
                  <td>{{ anomaly.quantite }}</td>
                  <td>{{ anomaly.mt_sub }}</td>
                  <td>{{ anomaly.dateControle }}</td>
                  <td>{{ anomaly.anomalie }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
        <v-card v-else>
          <v-card-title>Aucune anomalie trouvée</v-card-title>
          <v-card-text>Aucun résultat correspondant aux critères de filtrage.</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      anomalies: [],  // Données des anomalies
      filters: {
        matricule: '',
        dateControle: '',
        anomalie: ''  // Champ pour filtrer par chaîne d'anomalie
      }
    };
  },
  computed: {
    filteredAnomalies() {
      console.log('Filtres:', this.filters);
      
      return this.anomalies.filter(anomaly => {
        console.log('Anomalie:', anomaly);

        const matchesMatricule = this.filters.matricule
          ? anomaly.matricule === this.filters.matricule
          : true;
        const matchesDateControle = this.filters.dateControle
          ? anomaly.dateControle.includes(this.filters.dateControle)
          : true;
        
        // Convertir l'anomalie en chaîne pour la comparaison
        const anomalyText = anomaly.anomalie || '';
        const matchesAnomalie = this.filters.anomalie
          ? anomalyText.includes(this.filters.anomalie)
          : true;

        console.log('Résultats de filtrage:', matchesMatricule, matchesDateControle, matchesAnomalie);

        return matchesMatricule && matchesDateControle && matchesAnomalie;
      });
    }
  },
  created() {
    if (this.$route.query.anomalies) {
      try {
        this.anomalies = JSON.parse(this.$route.query.anomalies);
      } catch (error) {
        console.error('Erreur lors du parsing des anomalies:', error);
      }
    }
  }
};
</script>

<style scoped>
.v-card {
  background-color: #f5f5f5;
}

.v-icon {
  margin-right: 8px;
}

.v-text-field {
  margin-bottom: 16px;
}
</style>
