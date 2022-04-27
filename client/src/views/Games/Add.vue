<template>
  <section>
    <div class="container">
      <div class="card">
        <form @submit.prevent="addGame()">
          <h2>Add new game</h2>
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
            <div v-if="filePreview && file" class="image-preview">
              <figure>
                <img :src="filePreview" :alt="file.name" />
              </figure>
            </div>
          </div>
          <div class="form-50 buttons">
            <router-link :to="{ name: 'games' }" class="btn btn-secondary"
              >Back</router-link
            >
            <input type="submit" value="Add game" class="btn btn-primary" />
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
    this.getCategories();
  },
  methods: {
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
    addGame() {
      this.errors.clearAll();
      this.$swal({
        title: "Adding",
        text: "Please, wait...",
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
      this.$swal.showLoading();
      this.axios
        .post("/games", this.game, { headers: { "x-token": this.token } })
        .then((res) => {
          this.uploadImage(res.data.game._id);
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
            title: "Game registered successfully!",
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
            title: `Game registered without image.`,
            text: msg,
          });
        })
        .finally(() => {
          this.$router.push({
            name: "games",
          });
        });
    },
  },
  computed: {
    ...mapState(["token"]),
  },
};
</script>