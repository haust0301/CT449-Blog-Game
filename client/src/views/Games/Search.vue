<template>
  <main>
    <div id="all-games" class="container">
      <div class="description">
        <h2>{{ total }} results for "{{ this.$route.params.term }}"</h2>
        <router-link :to="{ name: 'games' }" class="btn btn-primary"
          >All games</router-link
        >
        <router-link
          v-if="token"
          :to="{ name: 'games.add' }"
          class="btn btn-primary"
          >Add new game</router-link
        >
      </div>
      <div class="game-list">
        <GameItem
          v-for="(game, key) in games"
          :key="key"
          :_id="game._id"
          :title="game.title"
          :description="game.description"
          :likes="game.likes"
        />
      </div>
      <Paginator
        :key="total"
        :total="total"
        :limit="limit"
        @updatePage="searchGames()"
      />
    </div>
  </main>
</template>

<script>
import { mapState } from "vuex";
import GameItem from "@/components/GameItem.vue";
import Paginator from "@/components/Paginator.vue";
export default {
  components: {
    GameItem,
    Paginator,
  },
  data: () => ({
    total: 0,
    limit: 10,
    games: [],
  }),
  watch: {
    "$route.params.term": {
      immediate: true,
      handler() {
        this.searchGames();
      },
    },
  },
  methods: {
    searchGames() {
      const page = parseInt(this.$route.query.page) || 1;
      this.$swal({
        title: "Searching",
        text: "Please, wait...",
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
      this.axios
        .get(
          `/search/games/${this.$route.params.term}?page=${page}&limit=${this.limit}`
        )
        .then((res) => {
          this.total = res.data.total;
          this.games = res.data.results;
          this.$swal.closeModal();
        })
        .catch((err) => {
          this.$swal({
            icon: "error",
            title: "An error has ocurred.",
            text: err.response.data.msg ? err.response.data.msg : err,
          });
        });
    },
  },
  computed: {
    ...mapState(["token"]),
  },
};
</script>