<template>
  <ul class="paginator">
    <!-- First page -->
    <li v-if="currentPage > 1">
      <router-link :to="{ query: { page: 1 } }">1</router-link>
    </li>
    <!-- First page ... -->
    <li v-if="currentPage >= 1 + 4" :class="{ disabled: currentPage != 1 + 4 }">
      <router-link v-if="currentPage == 1 + 4" :to="{ query: { page: 2 } }"
        >2</router-link
      >
      <a v-else>...</a>
    </li>
    <!-- Current page - 2 -->
    <li v-if="currentPage > 1 + 2">
      <router-link :to="{ query: { page: currentPage - 2 } }">{{
        currentPage - 2
      }}</router-link>
    </li>
    <!-- Current page - 1 -->
    <li v-if="currentPage > 1 + 1">
      <router-link :to="{ query: { page: currentPage - 1 } }">{{
        currentPage - 1
      }}</router-link>
    </li>
    <!-- Current page -->
    <li v-if="totalPages > 1" class="selected">
      <router-link :to="{ query: { page: currentPage } }">{{
        currentPage
      }}</router-link>
    </li>
    <!-- Current page + 1 -->
    <li v-if="currentPage < totalPages - 1">
      <router-link :to="{ query: { page: currentPage + 1 } }">{{
        currentPage + 1
      }}</router-link>
    </li>
    <!-- Current page + 2 -->
    <li v-if="currentPage < totalPages - 2">
      <router-link :to="{ query: { page: currentPage + 2 } }">{{
        currentPage + 2
      }}</router-link>
    </li>
    <!-- Last page ... -->
    <li
      v-if="currentPage <= totalPages - 4"
      :class="{ disabled: currentPage != totalPages - 4 }"
    >
      <router-link
        v-if="currentPage == 1 - 4"
        :to="{ query: { page: totalPages - 1 } }"
        >{{ totalPages - 1 }}</router-link
      >
      <router-link :to="{ query: { page: currentPage } }">...</router-link>
    </li>
    <!-- Last page -->
    <li v-if="currentPage < totalPages">
      <router-link :to="{ query: { page: totalPages } }">{{
        totalPages
      }}</router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: "Paginator",
  data: () => ({
    currentPage: 1,
    totalPages: 1,
  }),
  props: {
    total: Number,
    limit: Number,
  },
  watch: {
    "$route.query.page": {
      immediate: true,
      handler(page) {
        this.totalPages = Math.ceil(this.$props.total / this.$props.limit);
        this.currentPage = parseInt(page) || 1;
        this.$emit("updatePage");
      },
    },
  },
};
</script>