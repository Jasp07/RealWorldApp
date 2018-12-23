<template>
    <div class="article-page">
      <div v-if="getMyArticle.author != undefined">
  <div class="banner">
    <div class="container">
      <h1>{{getMyArticle.title}}</h1>
      <div class="article-meta">       
        <a href=""><img :src="getMyArticle.author.image" /></a>
        <div class="info">
          <a href="" class="author">{{getMyArticle.author.username}}</a>
          <span class="date">{{ formatDate(getMyArticle.createdAt) }}</span>
        </div>
        <button v-if="(user == undefined) || (user != undefined && user.username != getMyArticle.author.username)" class="btn btn-sm btn-outline-secondary">
          <i class="ion-plus-round"></i>
          &nbsp;
          Follow {{getMyArticle.author.username}} <span class="counter">(10)</span>
        </button>
        &nbsp;&nbsp;
        <button v-if="(user == undefined) || (user != undefined && user.username != getMyArticle.author.username)" class="btn btn-sm btn-outline-primary">
          <i class="ion-heart"></i>
          &nbsp;
          Favorite Post <span class="counter">{{ getMyArticle.favoritesCount }}</span>
        </button>
        <router-link v-if="(user != undefined && user.username == getMyArticle.author.username)" class="btn btn-sm btn-outline-secondary nav-link preview-link" :to="{
          name : 'EditorEdit',
          params: {
            slug : getMyArticle.slug
          }
        }">
        <i class="ion-plus-round"></i>
        &nbsp;
          Edit Article
        </router-link>
        &nbsp;
        <button @click="deleteArticle" v-if="(user != undefined && user.username == getMyArticle.author.username)" class="btn btn-sm btn-outline-primary">
          <i class="ion-heart"></i>
          &nbsp;
          Delete Article
        </button>
      </div>
    </div>
  </div>
  <div class="container page">
    <div class="row article-content">
      <div class="col-md-12">
        <p>
       {{ getMyArticle.body }}
        </p>
        <h2 id="introducing-ionic">{{ getMyArticle.description}}</h2>
        <p></p>
      </div>
    </div>
    <hr />
    <div class="article-actions">
      <div class="article-meta">
        <a href="profile.html"><img :src="getMyArticle.author.image" /></a>
        <div class="info">
          <a href="" class="author">{{getMyArticle.author.username}}</a>
          <span class="date">{{ formatDate(getMyArticle.createdAt) }}</span>
        </div>
        <button v-if="(user == undefined) || (user != undefined && user.username != getMyArticle.author.username)" class="btn btn-sm btn-outline-secondary">
          <i class="ion-plus-round"></i>
          &nbsp;
          Follow {{getMyArticle.author.username}} <span class="counter">(10)</span>
        </button>
        &nbsp;
        <button  v-if="(user == undefined) || (user != undefined && user.username != getMyArticle.author.username)" class="btn btn-sm btn-outline-primary">
          <i class="ion-heart"></i>
          &nbsp;
          Favorite Post <span class="counter">{{ getMyArticle.favoritesCount }}</span>
        </button>  
        <router-link v-if="(user != undefined && user.username == getMyArticle.author.username)" class="btn btn-sm btn-outline-secondary nav-link preview-link" :to="{
          name : 'EditorEdit',
          params: {
            slug : getMyArticle.slug
          }
        }">
        <i class="ion-plus-round"></i>
        &nbsp;
          Edit Article
        </router-link>
        &nbsp;
        <button @click="deleteArticle" v-if="(user != undefined && user.username == getMyArticle.author.username)" class="btn btn-sm btn-outline-primary">
          <i class="ion-heart"></i>
          &nbsp;
          Delete Article
        </button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-md-8 offset-md-2">
        <form v-if="user!=undefined" class="card comment-form">
          <div class="card-block">
            <textarea v-model="body" class="form-control" placeholder="Write a comment..." rows="3"></textarea>
          </div>
          <div class="card-footer">
            <img :src="getMyArticle.author.image" class="comment-author-img" />
            <button @click="postComment" class="btn btn-sm btn-primary">
             Post Comment
            </button>
          </div>
        </form>
        <div v-if="user==undefined">
          <p><router-link to="/login">
                Sign in
              </router-link> or <router-link to="/register">
                Sign up
              </router-link> to add comments on this article.</p>
        </div>
      <div v-if="errors.length == 0">
        <Comment 
            v-for="comment in articleComments" 
            :key="comment.id"
            :comment="comment"
        ></Comment>
      </div>
        <p v-if="errors.length" class="error-p">
            <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
          </ul>
        </p>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
import moment from "moment";
import Router from "../router";
import Comment from "@/components/Comment.vue";
export default {
  name: "Article",
  props: ["slug"],
  components: {
    Comment
  },
  data: function() {
    return {
      errors: [],
      body: ""
    };
  },
  beforeMount() {
    this.getArticle();
    this.fetchComments();
  },
  computed: {
    articleComments() {
      return this.$store.state.comments.feed || [];
    },
    user() {
      return this.$store.getters["users/user"];
    },
    getMyArticle() {
      return this.$store.getters["articles/getArticle"];
    },
    user() {
      return this.$store.getters["users/user"];
    }
  },
  methods: {
    getArticle() {
      this.$store.dispatch("articles/getArticle", { slug: this.slug });
    },
    formatDate(dateString) {
      return moment(dateString).format("MMMM Do, YYYY");
    },
    deleteArticle() {
      this.$store
        .dispatch("articles/deleteArticle")
        .then(() => {
          Router.push("/");
        })
        .catch(err => {
          Router.push("/");
        });
    },
    fetchComments() {
      try {
        this.errors = [];
        this.$store.dispatch("comments/getComments", { slug: this.slug });
      } catch (e) {
        errors.push("Error file fetching the comments");
      }
    },
    postComment() {
      console.log("in post comment");
      try {
        this.errors = [];
        this.$store.dispatch("comments/postComment", {
          slug: this.slug,
          body: this.body
        });
      } catch (e) {
        errors.push("Error while posting comment over article");
      }
    }
  }
};
</script>
