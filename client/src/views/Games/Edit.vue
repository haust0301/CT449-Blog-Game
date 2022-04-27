<template>
  <section>
    <div class="container">
      <div class="card">
        <form @submit.prevent="editGame()">
          <h2>Edit game</h2>
          <div class="form-item">
            <label for="title">Title</label>
            <input type="text" v-model="game.title" name="title" id="title" />
            <span class="errors" v-if="errors.has('title')">{{
              errors.get("title")
            }}</span>
          </div>
          <div class="form-item">
            <label for="description">Description</label>
            <input
              type="text"
              v-model="game.description"
              name="description"
              id="description"
            />
            <span class="errors" v-if="errors.has('description')">{{
              errors.get("description")
            }}</span>
          </div>
          <div class="form-item">
            <label for="Category">Category</label>
            <select name="category" id="category" v-model="game.category">
              <option disabled value="">Select category...</option>
              <option
                v-for="(category, index) in categories"
                :key="index"
                v-bind:value="category._id"
              >
                {{ category.name }}
              </option>
            </select>
            <span class="errors" v-if="errors.has('category')">{{
              errors.get("category")
            }}</span>
          </div>
          <div class="form-item">
            <label for="file">Image file</label>
            <input
              @change="handleFileUpload($event)"
              type="file"
              name="file"
              id="file"
            />
            <div class="image-preview">
              <figure v-if="filePreview && file">
                <img :src="filePreview" :alt="file.name" />
              </figure>
              <figure v-else>
                <img
                  :src="`${axios.defaults.baseURL}/uploads/games/${this.$route.params.id}`"
                  :alt="game.title"
                />
              </figure>
            </div>
          </div>
          <div class="form-50 buttons">
            <router-link
              :to="{
                name: 'games.show',
                params: { id: this.$route.params.id },
              }"
              class="btn btn-secondary"
              >Back</router-link
            >
            <input type="submit" value="Edit game" class="btn btn-primary" />
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
<script>
import { mapState } from "vuex";
import Errors from "@/utilities/Errors";
export default {
  data: () => ({
    errors: new Errors(),
    game: {
      title: "",
      description: "",
      category: "",
    },
    filePreview: null,
    file: null,
    categories: [],
  }),
  mounted() {
    this.getGame();
    this.getCategories();
  },
  methods: {
    getGame() {
      this.$swal({
        title: "Getting",
        text: "Please, wait...",
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
      this.$swal.showLoading();
      this.axios
        .get(`/games/${this.$route.params.id}`)
        .then((res) => {
          this.game = res.data.game;
          this.game.category = res.data.game.category._id;
          this.$swal.closeModal();
        })
        .catch((err) => {
          this.$router.push({
            name: "404",
          });
          this.$swal.closeModal();
        });
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.file = file;

      // File preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.filePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    getCategories() {
      this.axios
        .get("/categories")
        .then((res) => {
          this.categories = res.data.categories;
        })
        .catch((err) => {
          if (err.response.status === 400) {
            console.log(err.response.data.errors);
          } else {
            console.log(err.response.data.msg);
          }
        });
    },
    editGame() {
      this.errors.clearAll();
      this.$swal({
        title: "Editting",
        text: "Please, wait...",
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
      this.$swal.showLoading();
      this.axios
        .put(`/games/${this.$route.params.id}`, this.game, {
          headers: { "x-token": this.token },
        })
        .then((res) => {
          if (this.file) {
            return this.uploadImage(res.data.newGame._id);
          } else {
            this.$swal({
              icon: "success",
              title: "Game modified successfully!",
              allowEscapeKey: false,
              allowOutsideClick: false,
            }).then((result) => {
              if (result.isConfirmed) {
                this.$router.push({
                  name: "games.show",
                  params: { id: this.$route.params.id },
                });
              }
            });
          }
        })
        .catch((err) => {
          const errorData = err.response.data;
          let msg = "";

          if (errorData.errors) {
            this.errors.record(errorData.errors);
            msg = "The fields are not valid";
          } else if (errorData.msg) {
            msg = errorData.msg;
          } else {
            msg = err;
          }

          this.$swal({
            icon: "error",
            title: `An error has ocurred.`,
            text: msg,
          });
        });
    },
    uploadImage(_id) {
      const formData = new FormData();
      formData.append("file", this.file);
      return this.axios
        .put(`/uploads/games/${_id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-token": this.token,
          },
        })
        .then((res) => {
          this.$swal({
            icon: "success",
            title: "Game modified successfully!",
          });
        })
        .catch((err) => {
          const errorData = err.response.data;
          let msg = "";
          if (errorData.msg) {
            msg = errorData.msg;
          } else {
            msg = err;
          }

          this.$swal({
            icon: "warning",
            title: `Game modified without image.`,
            text: msg,
          });
        })
        .finally(() => {
          this.$router.push({
            name: "games.show",
            params: { id: this.$route.params.id },
          });
        });
    },
  },
  computed: {
    ...mapState(["token"]),
  },
};
</script>