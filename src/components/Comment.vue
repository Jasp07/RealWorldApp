<template>
    <div class="card">
      <div class="card-block">
        <p class="card-text">{{comment.body}}</p>
      </div>
      <div class="card-footer">
        <a href="" class="comment-author">
          <img :src="comment.author.image" class="comment-author-img" />
          </a>
          &nbsp;
          <a href="" class="comment-author">{{ comment.author.username }}</a>
          <span class="date-posted">{{ formatDate(comment.createdAt) }}</span>
          <span v-if="user!=undefined && user.username == comment.author.username" class="mod-options">
            <i @click="deleteComment" class="ion-trash-a">Delete</i>
          </span>
      </div>
    </div>
</template>
<script>
import moment from "moment";
export default {
  props: ["comment"],
  data: function() {
    return {
      errors: []
    };
  },
  computed: {
    getMyArticle() {
      return this.$store.getters["articles/getArticle"];
    },
    user() {
      return this.$store.getters["users/user"];
    }
  },
  methods: {
    formatDate(dateString) {
      return moment(dateString).format("MMMM Do, YYYY");
    },
    deleteComment() {
      try {
        this.errors = [];
        this.$store.dispatch("comments/deleteComment", {
          slug: this.getMyArticle.slug,
          id: this.comment.id
        });
      } catch (e) {
        this.errors.push("Error while deleting comment from article");
      }
    }
  }
};
</script>
<style scoped>
span i {
  border-radius: 0.2rem;
  border: 2px solid #aaa;
  padding: 5px;
}
</style>
