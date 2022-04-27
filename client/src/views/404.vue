<template>
  <section class="page-404">
    <div class="container">
      <div class="card">
        <h1>404</h1>
        <h3>Page not found</h3>
        <p>The page you are looking for doesn't exist or an other error ocurred.</p>
        <p>Please, go to homepage.</p>
        <router-link :to="{ name: 'home' }" class="btn btn-primary"
          >Go home</router-link
        >
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "404",
};
</script>