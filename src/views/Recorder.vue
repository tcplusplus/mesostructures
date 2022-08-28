<template>
  <div class="recorder">
    <p v-if="countdown > 0">
      Start in {{ countdown }} seconds
    </p>
    <Camera
      ref="camera"
      facingMode="user"
      :resolution="{ width: 480, height: 640 }"
      autoplay
    />
    <GrayCodes
      v-if="recording"
      style="height: 100rem; position: relative;"
      :direction="direction"
      :level="level + 1"
      :inverse="inverse"
    />
    <div style="display: none;">{{ counter }}</div>
   </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import GrayCodes from '@/components/GrayCodes.vue';
import Camera from '@/components/Camera.vue';
import { sleep } from '@/classes/sleep';
import { Dataset } from '@/classes/dataset';
import { useStore } from 'vuex';

// grab snapshots here: https://vuejsexamples.com/a-simple-to-use-but-extensive-camera-component-for-vue-3-with-typescript/

export default defineComponent({
  name: 'RecorderView',
  components: {
    GrayCodes,
    Camera,
  },
  data: () => ({
    countdown: 0,
    maxLevel: 6,
    level: -1,
    direction: 'horizontal',
    inverse: false,
    recording: false,
  }),
  setup() {
    const dataset = ref<Dataset>(new Dataset(4));
    // Get a reference of the component
    const camera = ref<InstanceType<typeof Camera>>();
    // Use camera reference to call functions
    const snapshot = async () => {
      const blob = await camera.value?.snapshot();
      if (!blob) return null;
      return URL.createObjectURL(blob);
    };
    return {
      camera,
      snapshot,
      dataset,
      counter: 0,
      store: useStore(),
    };
  },
  async mounted() {
    for (let i = 5; i >= 0; --i) {
      this.countdown = i;
      await sleep(1000);
    }
    await this.record();
  },
  methods: {
    setScreenToWhite() {
      this.level = -1;
      this.inverse = true;
      this.recording = true;
    },
    async record() {
      this.setScreenToWhite();
      await sleep(3000);
      for (const direction of ['horizontal', 'vertical'] as const) {
        this.direction = direction;
        for (let level = 0; level < this.dataset.numLevels; ++level) {
          this.level = level;
          for (const inverse of [false, true]) {
            this.inverse = inverse;
            const image = await this.snapshot();
            const version = inverse ? 'reverse' : 'main';
            if (image !== null) {
              this.dataset[direction].levels[level][version] = image;
            }
            this.counter++;
          }
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const audio = new Audio(require('@/assets/beep.wav'));
      audio.play();
      this.store.dispatch('updateDataset', this.dataset);
      this.$router.push('calculator');
      this.recording = false;
    },
  },
});

</script>

<style lang="scss">
.recorder {
  p {
    font-size: 3rem;
  }

  #camera-container {
    position: fixed;
    bottom: 0px;
    width: 10%;
    right: 0px;
    height: 10%;
  }
}
</style>
