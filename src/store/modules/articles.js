import { api } from "../api";
import Router from "../../router";
export default {
  namespaced: true,
  state: {
    feed: [],
    count: 0,
    article: {}
  },
  getters: {
    getArticle: function(state) {
      console.log("getter called" + state.article);
      return state.article;
    }
  },
  mutations: {
    setArticles(state, { articles, articlesCount }) {
      state.feed = articles;
      state.count = articlesCount;
    },
    setArticle(state, payload) {
      console.log("in mutation" + payload.article);
      state.article = payload.article;
    }
  },
  actions: {
    getGlobalFeed: async function({ commit }, payload = { page: 1 }) {
      let route = "/articles";
      if (payload) {
        const {
          tag = null,
          author = null,
          favorited = null,
          page = 1
        } = payload;
        route += tag ? `?tag=${tag}&` : "";
        route += author ? `?author=${author}&` : "";
        route += favorited ? `?favorited=${favorited}&` : "";
        route += page ? `?offset=${(page - 1) * 10}&limit=10` : "";
      }
      const response = await api.get(route);
      commit("setArticles", response.data);
    },
    getUserFeed: async function({ commit }, payload = { page: 1 }) {
      let route = "/articles/feed";
      if (payload) {
        const { page = 1 } = payload;
        route += page ? `?offset=${(page - 1) * 10}&limit=10` : "";
      }
      const response = await api.get(route);
      commit("setArticles", response.data);
    },
    getSelfFeed: async function({ commit }, payload = { page: 1 }) {
      let route = "/articles";
      if (payload) {
        const { author = null, page = 1 } = payload;
        route += author ? `?author=${author}&` : "";
        route += page ? `?offset=${(page - 1) * 10}&limit=10` : "";
      }
      const response = await api.get(route);
      commit("setArticles", response.data);
    },
    getArticle: async function({ commit }, payload) {
      console.log("slug:" + payload.slug);
      let route = "/articles/";
      route += payload.slug;
      const response = await api.get(route);
      console.log(response);
      commit("setArticle", response.data);
    },
    deleteArticle: async function(context) {
      console.log("in delete" + context.state.article);
      console.log(context.state.user);
      if (context.state.user == undefined) {
        Router.push("/");
      }
      try {
        var slug = context.state.article.slug;
        let route = "/articles/";
        route += slug;
        const response = await api.delete(route);
        context.commit("setArticle", response.data);
        console.log(response);
        Router.push("/");
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    postArticle: async function(context, payload) {
      console.log("again in post article for api hit");
      try {
        if (payload.type == "create") {
          const response = await api.post("articles", {
            article: {
              title: payload.title,
              description: payload.description,
              body: payload.body,
              tagList: payload.tagList
            }
          });
          console.log(response.data);
          Router.push({
            name: "Article",
            params: { slug: response.data.article.slug }
          });
        } else if (payload.type == "update") {
          var slug = context.state.article.slug;
          let route = "/articles/";
          route += slug;
          const response = await api.put(route, {
            article: {
              title: payload.title,
              description: payload.description,
              body: payload.body,
              tagList: payload.tagList
            }
          });
          console.log(response.data);
          if (response.data) {
            Router.push({
              name: "Article",
              params: { slug: response.data.article.slug }
            });
          }
        }
      } catch (e) {
        console.error(e);
        throw e;
      }
    }
  }
};
