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
      <p>
        This is a mobile implementation of the
        <a href="https://documentserver.uhasselt.be/bitstream/1942/10524/1/3465.pdf">Normal Map Aquisition paper of Yannick et al.</a>
        Everything runs locally on your device.
      </p>

      <p>To scan a mesostructure:
        <ul>
          <li>Set your screen brightness to maximum</li>
          <li>Click <a href="/recorder">record</a> button</li>
          <li>Give the app permissions to access your camera</li>
          <li>Hold your mobile phone with the screen down around
            10cm above the surface you want to scan</li>
          <li>Wait until you hear a beap</li>
          <li>Wait a couple of seconds until the result appears on the screen</li>
        </ul>
      </p>

      <p>
        Go to github repo:
        <a href="https://github.com/tcplusplus/mesostructures">
          <img
            width="24px"
            src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
            alt="github"
          />
        </a>
      </p>
    </main>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView',
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
  }
}
</style>
