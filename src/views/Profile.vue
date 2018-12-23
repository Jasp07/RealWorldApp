<template>
    <div class="profile-page">

  <div class="user-info">
    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <img :src="user.image" class="user-img" />
          <h4>{{ user.username }}</h4>
          <p>
            {{ user.bio }}
          </p>
          <button class="btn btn-sm btn-outline-secondary action-btn">
            <i class="ion-plus-round"></i>
            &nbsp;
            Follow {{ user.username }}
          </button>
        </div>

      </div>
    </div>
  </div>

  <div class="container">
    <div class="row">

      <div class="col-xs-12 col-md-10 offset-md-1">
        <div class="articles-toggle">
          <ul class="nav nav-pills outline-active">
             <li class="nav-item">
              <a 
              class="nav-link"
              @click="setFeed('myarticles');"
              :class="{ active: activeFeed === 'myarticles' }"
              >
              My Articles
              </a>
            </li>
            <li class="nav-item">
              <a 
              class="nav-link"
              @click="setFeed('favorited');"
              :class="{ active: activeFeed === 'favorited' }"
              >
              Favorited Articles
              </a>
            </li>
          </ul>
        </div>

        <ArticlePreview 
          v-for="article in globalArticles" 
          :key="article.slug"
          :article="article"
        ></ArticlePreview>
      </div>
    </div>
  </div>

</div>
</template>
<script>
import ArticlePreview from "@/components/ArticlePreview.vue";
export default {
  name: "Profile",
  components: {
    ArticlePreview
  },
  created() {
    this.setFeed("myarticles");
  },
  data: function() {
    return {
      activeFeed: ""
    };
  },
  computed: {
    globalArticles() {
      return this.$store.state.articles.feed || [];
    },
    user() {
      return this.$store.getters["users/user"];
    }
  },
  methods: {
    setFeed(feedType) {
      if (feedType === "myarticles") {
        this.activeFeed = "myarticles";
        this.$store.dispatch("articles/getGlobalFeed", {
          author: this.user.username
        });
      } else if (feedType === "favorited") {
        this.activeFeed = "favorited";
        this.$store.dispatch("articles/getGlobalFeed", {
          favorited: this.user.username
        });
      }
    }
  }
};
</script>
