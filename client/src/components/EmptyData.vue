<template>
  <div class="container card no-games">
    <h2>Empty data</h2>
    <p>There are no games added.</p>
    <div>
      <router-link v-if="$route.name != 'home'" :to="{ name: 'home' }" class="btn btn-secondary"
        >Go home</router-link
      >
      <router-link
        v-if="$route.name != 'games.liked' && token"
        :to="{ name: 'games.add' }"
        class="btn btn-primary"
        >Add new game</router-link
      >
      <router-link v-else-if="$route.name != 'games.liked' && !token" :to="{ name: 'login' }" class="btn btn-primary"
        >Sign in to add one</router-link
      >
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "EmptyData",
  computed: {
    ...mapState(["token"]),
  },
};
</script>