<template>
  <div class="game-item">
    <figure
      class="game-image"
      :class="{ deleted: !gameStatus }"
      style="max-height: 250px"
    >
      <img
        :src="`${axios.defaults.baseURL}/uploads/games/${_id}`"
        :alt="title"
      />
      <figcaption @click="sendShowPage()">
        <i class="fas fa-thumbs-up"></i> {{ likes }}
      </figcaption>
    </figure>
    <div class="game-description">
      <h2>{{ title }}</h2>
      <p>{{ String(description).substring(0, 120) + "..." }}</p>
      <div class="game-btn">
        <router-link
          v-if="gameStatus"
          :to="{ name: 'games.show', params: { id: _id } }"
          class="btn btn-primary"
          >View</router-link
        >
        <a v-else-if="!gameStatus && $route.name == 'games.owned'" @click="undeleteGameAlert()" class="btn btn-secondary"
          >Undelete</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "GameItem",
  props: {
    _id: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    likes: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
  },
  data() {
    return {
      gameStatus: this.status,
    };
  },
  methods: {
    sendShowPage() {
      if (this.gameStatus) {
        this.$router.push({
          name: "games.show",
          params: {
            id: this._id,
          },
        });
      }
    },
    undeleteGameAlert() {
      this.$swal({
        title: "¿Are you sure?",
        text: `The game '${this.title}' will be undeleted.`,
        icon: "warning",
        showCancelButton: true,
      })
        .then((result) => {
          if (result.isConfirmed) {
            this.$swal({
              title: "Undeleting",
              text: "Please, wait...",
              allowEscapeKey: false,
              allowOutsideClick: false,
            });
            this.$swal.showLoading();
            return this.undeleteGame();
          }
        })
        .catch((err) => {
          this.$swal({
            icon: "error",
            title: "An error has ocurred.",
            text: err.response.data.msg ? err.response.data.msg : err,
          });
        });
    },
    undeleteGame() {
      return this.axios
        .post(
          `/games/undelete/${this._id}`,
          {},
          {
            headers: {
              "x-token": this.token,
            },
          }
        )
        .then((res) => {
          this.$swal({
            icon: "success",
            title: `The game '${res.data.game.title}' was undeleted.`,
          });
          this.gameStatus = true;
        });
    },
  },
  computed: {
    ...mapState(["token"]),
  },
};
</script>