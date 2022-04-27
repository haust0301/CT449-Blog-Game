<template>
  <div>
    <Navbar />
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script>
import "@/assets/css/normalize.css";
import "@/assets/css/styles.css";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

import { mapActions } from "vuex";

export default {
  name: "App",
  components: {
    Navbar,
    Footer,
  },
  created() {
    this.checkToken();
  },
  methods: {
    ...mapActions(["checkToken"]),
  },
};
</script>