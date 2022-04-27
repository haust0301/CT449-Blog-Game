<template>
  <section class="register">
    <div class="container">
      <div class="multi-card">
        <form class="card-white" @submit.prevent="register()">
          <h2>Create account</h2>
          <div class="form-item">
            <label for="name">Name</label>
            <input type="text" v-model="user.name" name="name" id="name" />
            <span class="errors" v-if="errors.has('name')">{{
              errors.get("name")
            }}</span>
          </div>
          <div class="form-item">
            <label for="email">Email</label>
            <input type="email" v-model="user.email" name="email" id="email" />
            <span class="errors" v-if="errors.has('email')">{{
              errors.get("email")
            }}</span>
          </div>
          <div class="form-50">
            <div class="form-item">
              <label for="password">Password</label>
              <input
                type="password"
                v-model="user.password"
                name="password"
                id="password"
              />
              <span class="errors" v-if="errors.has('password')">{{
                errors.get("password")
              }}</span>
            </div>
            <div class="form-item">
              <label for="passwordConfirmation">Confirm password</label>
              <input
                type="password"
                v-model="user.passwordConfirmation"
                name="passwordConfirmation"
                id="passwordConfirmation"
              />
              <span class="errors" v-if="errors.has('passwordConfirmation')">{{
                errors.get("passwordConfirmation")
              }}</span>
            </div>
          </div>
          <input type="submit" value="Sign Up" class="btn btn-primary" />
          <span class="or">OR</span>
          <div
            id="g_id_onload"
            data-client_id="549728898652-5dp8roml8cnkp61saupl0a6aht6ls02r.apps.googleusercontent.com"
            data-auto_prompt="false"
            data-callback="handleCredentialResponse"
          ></div>
          <div
            class="g_id_signin"
            data-type="standard"
            data-size="large"
            data-theme="outline"
            data-text="sign_in_with"
            data-shape="rectangular"
            data-logo_alignment="left"
          ></div>
        </form>
        <div class="card-color">
          <h2>Welcome again!</h2>
          <p>
            If you already have an account, please login with your information.
          </p>
          <router-link :to="{ name: 'login' }" class="btn btn-secondary"
            >Sign In</router-link
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions } from "vuex";
import Errors from "@/utilities/Errors";
import Storage from "@/utilities/Storage";
export default {
  name: "Register",
  data: () => ({
    errors: new Errors(),
    user: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  }),
  beforeMount() {
    window.handleCredentialResponse = (res) => {
      this.handleCredentialResponse(res);
    };
  },
  mounted() {
    const googleScript = document.createElement("script");
    googleScript.setAttribute("src", "https://accounts.google.com/gsi/client");
    document.head.appendChild(googleScript);
  },
  beforeDestroy() {
    delete window.handleCredentialResponse;
  },
  methods: {
    ...mapActions(["saveToken"]),
    handleCredentialResponse(response) {
      this.$swal({
        title: "Registering",
        text: "Please, wait...",
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
      this.$swal.showLoading();
      this.axios
        .post("/auth/google", {
          id_token: response.credential,
        })
        .then((res) => {
          this.saveToken(res.data.token);
          Storage.record("email", res.data.user.email);
          this.$router.push("/");
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
    register() {
      this.errors.clearAll();
      this.$swal({
        title: "Registering",
        text: "Please, wait...",
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
      this.$swal.showLoading();
      this.axios
        .post("/auth/register", this.user)
        .then((res) => {
          this.saveToken(res.data.token);
          this.$router.push("/");
          this.$swal.closeModal();
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
            title: "An error has ocurred.",
            text: msg,
          });
        });
    },
  },
};
</script>