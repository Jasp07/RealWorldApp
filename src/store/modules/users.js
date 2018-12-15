import { api, setToken, clearToken } from "../api";
import Router from "../../router";
export default {
  namespaced: true,
  state: {
    user: null,
    profile: null
  },
  getters: {
    username: function(state) {
      return (state.user && state.user.username) || null;
    }
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setProfile(state, payload) {
      state.profile = payload;
    }
  },
  actions: {
    getUser: async function({ commit }) {
      const user = await api.get("/user");
      commit("setUser", user);
    },
    loginUser: async function(context, payload) {
      clearToken();
      try {
        const response = await api.post("users/login", {
          user: {
            email: payload.email,
            password: payload.password
          }
        });
        if (response.data.user) {
          setToken(response.data.user.token);
          context.commit("setUser", response.data.user);
          Router.push("/");
        }
      } catch (e) {
        console.error(e);
        throw e;
      }
    }
  }
};
