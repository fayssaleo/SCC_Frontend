<template>
  <v-container fluid>
   
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
            <v-icon>mdi-upload</v-icon> Importation et Validation des Fichiers
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" sm="6">
        <v-file-input
          label="Import RH"
          @change="onFileChangeRH"
          accept=".xlsx,.xls"
          outlined
          dense
          prepend-icon="mdi-file-excel"
        ></v-file-input>
      </v-col>
      <v-col cols="12" sm="6">
        <v-file-input
          label="Import Cantine"
          @change="onFileChangeCantine"
          accept=".xlsx,.xls"
          outlined
          dense
          prepend-icon="mdi-file-excel"
        ></v-file-input>
      </v-col>
    </v-row>

   
    <v-row class="mt-4">
      <v-col cols="12" class="text-center">
        <v-btn 
          v-if="rhTableData.length && cantineTableData.length" 
          @click="validateFiles" 
          color="primary" 
          class="ma-2"
        >
          <v-icon>mdi-check</v-icon> Valider
        </v-btn>
      </v-col>
    </v-row>

    
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card v-if="rhTableData.length">
          <v-card-title>
            <v-icon>mdi-account-group</v-icon> Données RH
          </v-card-title>
          <v-card-text>
            <v-simple-table>
              <thead>
                <tr>
                  <th v-for="header in rhTableHeaders" :key="header">{{ header }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in rhTableData" :key="rowIndex">
                  <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

   
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card v-if="cantineTableData.length">
          <v-card-title>
            <v-icon>mdi-canteen</v-icon> Données Cantine
          </v-card-title>
          <v-card-text>
            <v-simple-table>
              <thead>
                <tr>
                  <th v-for="header in cantineTableHeaders" :key="header">{{ header }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in cantineTableData" :key="rowIndex">
                  <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card v-if="cantineTableData.length">
          <v-card-title>
            <v-icon>mdi-format-list-numbered</v-icon> Nombre d'enregistrements Cantine
          </v-card-title>
          <v-card-text>
            <p>Nombre d'enregistrements : {{ cantineTableData.length }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

   
<v-row class="mt-4">
  <v-col cols="12">
    <v-card v-if="anomalies.length">
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
            <tr v-for="(anomaly, index) in anomalies" :key="index">
              <td>{{ anomaly.matricule }}</td>
              <td>{{ anomaly.nomPrenom }}</td>
              <td>{{ anomaly.date }}</td>
              <td>{{ anomaly.heure }}</td>
              <td>{{ anomaly.description }}</td>
              <td>{{ anomaly.qte }}</td>
              <td>{{ anomaly.mtSub }}</td>
              <td>{{ anomaly.dateControle }}</td>
              <td>{{ anomaly.anomalie }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-col>
</v-row>

  </v-container>
</template>

<script>
import * as XLSX from 'xlsx';
import axios from 'axios';

export default {
  data() {
    return {
      rhTableHeaders: [],
      rhTableData: [],
      cantineTableHeaders: [],
      cantineTableData: [],
      anomalies: []
    }
  },
  methods: {
    onFileChangeRH(event) {
      this.importFile(event, 'RH');
    },
    onFileChangeCantine(event) {
      this.importFile(event, 'Cantine');
      this.sendDataToBackend(); 
    },
 async sendDataToBackend() {
  try {
    console.log('Tentative d\'envoi des données au backend');

    
    const existingConsumersResponse = await axios.get('http://127.0.0.1:8000/api/consommateurs');
    const existingConsumers = existingConsumersResponse.data;
    console.log('Consommateurs existants:', existingConsumers);

    
    const existingUsernames = new Set(existingConsumers.map(consumer => consumer.username));

    // Créez un ensemble des usernames à envoyer pour éviter les doublons dans les données de la cantine
    const seenUsernames = new Set();

    // Exclure la première ligne (les noms de champs) et filtrer les nouveaux consommateurs
    const newConsumers = this.cantineTableData
      .slice(1) // Exclure la première ligne
      .map(row => {
        const [username, name] = row;
        const [firstname, lastname] = (name && name.split(' ')) || [];
        return {
          username: username || '',
          firstname: firstname || null, // Permettre null si pas de prénom
          lastname: lastname || null,   // Permettre null si pas de nom de famille
        };
      })
      .filter(consumer => {
        if (!existingUsernames.has(consumer.username) && !seenUsernames.has(consumer.username)) {
          seenUsernames.add(consumer.username);
          return true;
        }
        return false;
      });

    console.log('Nouveaux consommateurs:', newConsumers);

    // Envoi des nouveaux consommateurs au backend
    if (newConsumers.length > 0) {
      await axios.post('http://127.0.0.1:8000/api/consommateurs/store', { consumers: newConsumers }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      alert('Les nouveaux consommateurs ont été ajoutés avec succès !');
    } else {
      alert('Aucun nouveau consommateur à ajouter.');
    }
  } catch (error) {
    if (error.response) {
      console.error('Erreur lors de l\'envoi des données au backend:', error.response.data);
      console.error('Détails de la validation:', error.response.data.details || 'Aucun détail disponible');
      alert('Erreur de validation : ' + JSON.stringify(error.response.data.details || 'Aucun détail disponible'));
    } else {
      console.error('Erreur lors de l\'envoi des données au backend:', error.message);
    }
  }
},
async sendAnomaliesToBackend() {
  try {
    const anomalies = this.anomalies.map(anomaly => {
      if (!anomaly.date || !anomaly.heure) {
        console.error('Champs requis manquants:', anomaly);
        return null; // Ignorez les anomalies invalides
      }
      return {
        matricule: anomaly.matricule,
        date: this.formatDateForBackend(anomaly.date),
        heure: this.formatTimeForBackend(anomaly.heure),
        description: anomaly.description,
        quantite: parseFloat(anomaly.quantite) || 0, // Convertir en nombre
        mt_sub: parseFloat(anomaly.mt_sub) || 0,    // Convertir en nombre
        dateControle: anomaly.dateControle ? this.formatDateForBackend(anomaly.dateControle) : null,
        anomalie: anomaly.anomalie === 'Pas d\'anomalie' ? false : true
      };
    }).filter(Boolean); // Supprime les anomalies invalides

    await axios.post('http://127.0.0.1:8000/api/consommations/store', { anomalies }, {
      headers: { 'Content-Type': 'application/json' }
    });

    alert('Les anomalies ont été ajoutées avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'envoi des anomalies au backend:', error.response ? error.response.data : error.message);
    alert('Erreur lors de l\'envoi des anomalies.');
  }
},


formatTimeForBackend(timeStr) {
  if (!timeStr) {
    console.error('Heure non fournie');
    return ''; // Retourner une valeur vide ou une valeur par défaut
  }
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) {
    console.error('Format d’heure invalide:', timeStr);
    return ''; // Retourner une valeur vide ou une valeur par défaut
  }
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`; // Format H:i
},
formatDateForBackend(date) {
  if (typeof date === 'string') {
    return date; // Assume it's already in correct format
  }

  if (date instanceof Date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Format d/m/Y
  }

  return date;
},

















    importFile(event, type) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

          const formatDate = (cell) => {
            if (cell instanceof Date) {
              return this.formatDate(cell);
            } else if (typeof cell === 'number') {
              const baseDate = new Date(1899, 11, 30);
              const excelDate = new Date(baseDate.getTime() + (cell - 1) * 86400 * 1000);
              return this.formatDate(excelDate);
            } else if (typeof cell === 'string') {
              return cell;
            }
            return '';
          };

          if (type === 'RH') {
            this.rhTableHeaders = jsonData[0] || [];
            this.rhTableData = jsonData.slice(1).map(row => row.map(cell => formatDate(cell)));
          } else if (type === 'Cantine') {
            this.cantineTableHeaders = jsonData[0] || [];
            this.cantineTableData = jsonData.slice(1).map(row => row.map(cell => formatDate(cell)));
          }
        };
        reader.readAsArrayBuffer(file);
      }
    },
     formatTime(time) {
      if (typeof time === 'string') {
        return time; // Assume it's already in correct format
      }

      if (time instanceof Date) {
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      }

      return time;
    },
    formatDate(date, isControlDate) {
  if (typeof date === 'string') {
    return date; // Assume it's already in correct format
  }

  if (date instanceof Date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return isControlDate ? `${month}/${day}/${year}` : `${day}/${month}/${year}`; // Format mm/dd/yyyy or dd/mm/yyyy
  }

  return date;
},

   parseDate(dateStr) {
  if (dateStr.includes('/')) {
    // Format mm/dd/yyyy
    const [month, day, year] = dateStr.split('/');
    return new Date(`20${year}-${month}-${day}`);
  } else {
    // Format dd/mm/yyyy
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`);
  }
},

    parseTime(timeStr) {
      if (!timeStr || typeof timeStr !== 'string') {
        console.error('Invalid time string:', timeStr);
        return null; // Return null or a default value if time is invalid
      }

      const [hours, minutes] = timeStr.split(':').map(Number);

      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        console.error('Invalid time format:', timeStr);
        return null; // Return null or a default value if time is invalid
      }

      return hours * 60 + minutes;
    },
    isTimeInRange(time, start, end) {
      const timeInMinutes = this.parseTime(time);
      const startInMinutes = this.parseTime(start);
      const endInMinutes = this.parseTime(end);

      if (timeInMinutes === null || startInMinutes === null || endInMinutes === null) {
        return false; // Return false if any time conversion fails
      }

      if (startInMinutes <= endInMinutes) {
        // Normal case: range does not cross midnight
        return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
      } else {
        // Case where the range crosses midnight
        return timeInMinutes >= startInMinutes || timeInMinutes <= endInMinutes;
      }
    },
   validateFiles() {
  this.anomalies = [];

  const rhData = this.rhTableData.slice(1).map(row => ({
    matricule: row[0],
    nom: row[1],
    dateDebut: this.parseDate(row[2]),
    e1: row[3], 
    s1: row[4], 
  }));

  const cantineData = this.cantineTableData.slice(1).map(row => ({
    matricule: row[0],
    nomPrenom: row[1],
    date: this.parseDate(row[2]),
    heure: row[3], // Time in hh:mm
    description: row[4],
    quantite: row[5] || 0, // Exemple d'ajout de la quantité
    mt_sub: row[6] || 0 // Exemple d'ajout du montant/subsistance
  }));

  cantineData.forEach(cantineEntry => {
    let rhEntry = rhData.find(rh =>
      rh.matricule === cantineEntry.matricule &&
      rh.dateDebut.toDateString() === cantineEntry.date.toDateString()
    );

    let e1Time = rhEntry ? rhEntry.e1 : null;
    let s1Time = rhEntry ? rhEntry.s1 : null;
    let dateControle = cantineEntry.date.toLocaleDateString();
    let anomalyDetected = false;

    // Si l'heure est entre 00:00 et 02:00
    if (this.parseTime(cantineEntry.heure) >= this.parseTime("00:00") && this.parseTime(cantineEntry.heure) < this.parseTime("02:00")) {
      const adjustedDate = new Date(cantineEntry.date);
      adjustedDate.setDate(adjustedDate.getDate() - 1);
      dateControle = this.formatDate(adjustedDate);

      // Rechercher rhEntry pour la date ajustée
      rhEntry = rhData.find(rh =>
        rh.matricule === cantineEntry.matricule &&
        rh.dateDebut.toDateString() === adjustedDate.toDateString()
      );

      e1Time = rhEntry ? rhEntry.e1 : null;
      s1Time = rhEntry ? rhEntry.s1 : null;

      // Si on ne trouve pas de correspondance pour la date ajustée
      if (!rhEntry) {
        this.anomalies.push({
          matricule: cantineEntry.matricule,
          nomPrenom: cantineEntry.nomPrenom,
          date: cantineEntry.date.toLocaleDateString(),
          heure: cantineEntry.heure,
          description: cantineEntry.description,
          dateControle: dateControle,
          quantite: cantineEntry.quantite, // Ajout du champ quantite
          mt_sub: cantineEntry.mt_sub, // Ajout du champ mt_sub
          anomalie: `Anomalie détectée : Le matricule ${cantineEntry.matricule} n'a pas de données RH pour la date ${dateControle}.`
        });
        return; // Passer à l'enregistrement suivant de Cantine
      }
    }

    // Vérifier si l'heure est dans la plage horaire
    if (e1Time && s1Time && !this.isTimeInRange(cantineEntry.heure, e1Time, s1Time)) {
      anomalyDetected = true;
    }

    if (anomalyDetected) {
      this.anomalies.push({
        matricule: cantineEntry.matricule,
        nomPrenom: cantineEntry.nomPrenom,
        date: cantineEntry.date.toLocaleDateString(),
        heure: cantineEntry.heure,
        description: cantineEntry.description,
        dateControle: dateControle,
        quantite: cantineEntry.quantite, // Ajout du champ quantite
        mt_sub: cantineEntry.mt_sub, // Ajout du champ mt_sub
        anomalie: `Anomalie détectée : L'heure ${cantineEntry.heure} ne correspond pas à la plage horaire (${e1Time} - ${s1Time}) pour le jour ${dateControle}.`
      });
    } else {
      // Ajouter une entrée avec "Pas d'anomalie" si aucune anomalie n'est détectée
      this.anomalies.push({
        matricule: cantineEntry.matricule,
        nomPrenom: cantineEntry.nomPrenom,
        date: cantineEntry.date.toLocaleDateString(),
        heure: cantineEntry.heure,
        description: cantineEntry.description,
        dateControle: dateControle,
        quantite: cantineEntry.quantite, // Ajout du champ quantite
        mt_sub: cantineEntry.mt_sub, // Ajout du champ mt_sub
        anomalie: 'Pas d\'anomalie'
      });
    }
  });

  console.log('Anomalies détectées:', this.anomalies);
  this.sendAnomaliesToBackend(); 

  this.$router.push({ name: 'AnomaliesPage', query: { anomalies: JSON.stringify(this.anomalies) } });
}
  }
}
</script>

<style scoped>
/* Ajoutez ici vos styles personnalisés */
.v-card {
  background-color: #f5f5f5;
}

.v-btn {
  border-radius: 20px;
}

.v-file-input {
  border: 1px solid #dcdcdc;
  border-radius: 4px;
}

.v-icon {
  margin-right: 8px;
}
</style>
