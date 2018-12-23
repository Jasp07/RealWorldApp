import { api, setToken, clearToken } from "../api";
import Router from "../../router";
export default {
  namespaced: true,
  state: {
    user: null
  },
  getters: {
    username: function(state) {
      return (state.user && state.user.username) || null;
    },
    user: function(state) {
      return state.user || null;
    }
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    }
  },
  actions: {
    getUser: async function({ commit }) {
      const response = await api.get("/user");
      commit("setUser", response.data);
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
    },
    registerUser: async function(context, payload) {
      clearToken();
      try {
        const response = await api.post("users", {
          user: {
            username: payload.username,
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
