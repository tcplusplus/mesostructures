<template>
  <div class="home">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">Mesostructures</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <a class="nav-item nav-link" href="/">Home</a>
          <a class="nav-item nav-link" href="/recorder">Record</a>
          <a class="nav-item nav-link" href="/results">Results</a>
        </div>
      </div>
    </nav>
    <main>
      <h3>Results</h3>
      <img v-for="img in results" :src="img" :key="img" alt="result" />
    </main>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView',
  computed: {
    results() {
      return [
        require('@/assets/results/result1.png'),
      ];
    },
  },
});
</script>

<style lang="scss">
.home {
  background-color: #8390f8;
  height: 100%;
  width: 100%;
  position: absolute;

  .navbar {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  main {
    padding: 1rem;
    text-align: justify;

    a {
      color: white;
    }

    img {
      width: 100%;
    }
  }
}
</style>
