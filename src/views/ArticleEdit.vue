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
                <input v-model="title" type="text" class="form-control form-control-lg">
            </fieldset>
            <fieldset class="form-group">
                <input v-model="body" type="text" class="form-control">
            </fieldset>
            <fieldset class="form-group">
                <textarea v-model="description" class="form-control" rows="8"></textarea>
            </fieldset>
            <fieldset class="form-group">
                <input v-model="tags" type="text" class="form-control"><div class="tag-list"></div>
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
export default {
  name: 'EditorEdit',
  props: ["slug"],
  data: function() {
    return {
      errors: [],
      title: "",
      body: "",
      description: "",
      tags: "",
      tagList: [],
    };
  },
  beforeMount() {
    this.getArticle();
  },
  computed: {
    tagListString() {
      return this.getArticle.tagList.join(" ");
    }
  },
  methods: {
    getArticle() {
      let article = this.$store.getters["articles/getArticle"];
      this.title = article.title;
      this.body = article.body;
      this.description = article.description;
      this.tags = article.tagList.join(" ");
      return this.$store.getters["articles/getArticle"];
    },
    editArticle() {
      console.log('in edit article');
      this.$store.dispatch("articles/postArticle",{
        title: this.title,
        body: this.body,
        description: this.description,
        tagList: this.tags.split(" "),
        type: "update",
      }).then(() => {
          this.errors = [];
        })
        .catch(err => {
          if(err.response.status == 401)
            this.errors.push("Only Signed in or Signed up user can update articles. Please Sign in");
        });
    },
    validateForm() {
      console.log('in validate form');
      if(this.title == "" || this.body == "" || this.description == ""){
        if(this.errors.length == 0)
          this.errors.push("Please enter all the mandatory fields title, body and description");
        return;
      }
      else{
        this.errors = [];
        this.editArticle();
        return;
      } 
    }
  }
}
</script>
<style scoped>
.error-p b , .error-p ul li {
  color: red;
}
</style>

