<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center">
        <v-card>
          <v-card-title>
            <h1>Déconnexion</h1>
          </v-card-title>
          <v-card-subtitle>
            <p>Vous êtes maintenant déconnecté.</p>
            <v-btn @click="goTo('login')" color="primary">Retour à la connexion</v-btn>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  methods: {
    goTo(page) {
      this.$router.push({ name: page });
    }
  },
  mounted() {
    // Ajoutez ici la logique pour se déconnecter si nécessaire
  }
};
</script>

<style scoped>
.v-card {
  margin-top: 50px;
  padding: 20px;
}
.v-btn {
  margin: 10px;
}
</style>
