<template>
    <div class="editor-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-10 offset-md-1 col-xs-12">
        <form>
        <p v-if="errors.length" class="error-p">
            <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
          </ul>
        </p>
          <fieldset>
            <fieldset class="form-group">
                <input v-model="title" type="text" class="form-control form-control-lg" placeholder="Article Title">
            </fieldset>
            <fieldset class="form-group">
                <input v-model="body" type="text" class="form-control" placeholder="What's this article about?">
            </fieldset>
            <fieldset class="form-group">
                <textarea v-model="description" class="form-control" rows="8" placeholder="Write your article (in markdown)"></textarea>
            </fieldset>
            <fieldset class="form-group">
                <input v-model="tags" type="text" class="form-control" placeholder="Enter tags"><div class="tag-list"></div>
            </fieldset>
            <button @click="validateForm" class="btn btn-lg pull-xs-right btn-primary" type="button">
                Publish Article
            </button>
          </fieldset>
        </form>
      </div>

    </div>
  </div>
</div>
</template>
<script>
import api from "../store/api";
import { error } from "util";
export default {
  data: function() {
    return {
      errors: [],
      title: "",
      body: "",
      description: "",
      tags: "",
      tagList: []
    };
  },
  methods: {
    postArticle() {
      console.log("in post article");
      this.$store
        .dispatch("articles/postArticle", {
          title: this.title,
          body: this.body,
          description: this.description,
          tagList: this.tags.split(" "),
          type: "create"
        })
        .then(() => {
          this.errors = [];
        })
        .catch(err => {
          if (err.response.status == 401)
            this.errors.push(
              "Only Signed in or Signed up user can create articles. Please Sign in"
            );
        });
    },
    validateForm() {
      console.log("in validate form");
      if (this.title == "" || this.body == "" || this.description == "") {
        if (this.errors.length == 0)
          this.errors.push(
            "Please enter all the mandatory fields title, body and description"
          );
        return;
      } else {
        this.errors = [];
        this.postArticle();
        return;
      }
    }
  }
};
</script>
<style scoped>
.error-p b,
.error-p b ul li {
  color: red;
}
</style>
