import { createStore } from "vuex";
import axios from "axios";

import Storage from "../utilities/Storage";

export default createStore({
  state: {
    token: null,
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload;
    },
  },
  actions: {
    checkToken({ commit }) {
      if (Storage.has("token")) {
        commit("setToken", Storage.get("token"));
      } else {
        commit("setToken", null);
      }
    },
    saveToken({ commit }, token) {
      commit("setToken", token);
      Storage.record("token", token);
    },
    deleteToken({ commit }) {
      commit("setToken", null);
      localStorage.removeItem("token");
    },
  },
  modules: {},
});
