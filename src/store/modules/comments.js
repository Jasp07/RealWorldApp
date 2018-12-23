import { api } from "../api";
import Router from "../../router";
import { Store } from "vuex";
export default {
  namespaced: true,
  state: {
    feed: []
  },
  getters: {},
  mutations: {
    setComments(state, { comments }) {
      state.feed = comments;
    },
    addComment(state, { comment }) {
      console.log(comment);
      state.feed.push(comment);
      console.log(state.feed);
    }
  },
  actions: {
    getComments: async function(context, payload) {
      var slug = payload.slug;
      let route = "/articles/";
      route += slug;
      route += "/comments";
      try {
        const response = await api.get(route);
        context.commit("setComments", response.data);
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    postComment: async function(context, payload) {
      var slug = payload.slug;
      let route = "/articles/";
      route += slug;
      route += "/comments";
      try {
        const response = await api.post(route, {
          comment: {
            body: payload.body
          }
        });
        if (response.data.comment) {
          console.log(context.state.feed);
          context.commit("addComment", response.data);
          Router.push("/article/" + payload.slug);
        }
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    deleteComment: async function(context, payload) {
      console.log("ready to delete request");
      console.log(payload.slug, payload.id);
      var slug = payload.slug;
      let route = "/articles/";
      route += slug;
      route += "/comments/";
      route += payload.id;
      try {
        const response = await api.delete(route);
        if (response.data == undefined) {
          Store.dispatch("getComments");
        }
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
  }
};
