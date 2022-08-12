<template>
   <div>
    <GrayCodes
      v-if="recording"
      style="height: 100rem; position: relative;"
      :direction="direction"
      :level="level + 1"
      :inverse="inverse"
    />
    {{ counter }}
    <camera
      style="display: none;"
      ref="camera"
      facingMode="user"
      :resolution="{ width: 480, height: 640 }"
      autoplay
    />
   </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import GrayCodes from '@/components/GrayCodes.vue';
import Camera from 'simple-vue-camera';
import { sleep } from '@/classes/sleep';
import { Dataset } from '@/classes/dataset';
import { useStore } from 'vuex';

// grab snapshots here: https://vuejsexamples.com/a-simple-to-use-but-extensive-camera-component-for-vue-3-with-typescript/

export default defineComponent({
  name: 'RecorderView',
  components: {
    GrayCodes,
  },
  data: () => ({
    maxLevel: 4,
    level: 1,
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
    await this.record();
  },
  methods: {
    async record() {
      await sleep(3000);
      this.recording = true;
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
      this.store.dispatch('updateDataset', this.dataset);
      this.$router.push('calculator');
      this.recording = false;
    },
  },
});

</script>
