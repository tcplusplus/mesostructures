<template>
   <div>
    <GrayCodes
      :direction="direction"
      :level="level"
      :inverse="inverse"
    />
    <img v-for="image in images" :src="image" :key="image" alt="recording" />
    <camera
      style="display: none;"
      ref="camera"
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

// grab snapshots here: https://vuejsexamples.com/a-simple-to-use-but-extensive-camera-component-for-vue-3-with-typescript/

export default defineComponent({
  name: 'RecorderView',
  components: {
    GrayCodes,
  },
  data: () => ({
    level: 1,
    direction: 'horizontal',
    inverse: false,
  }),
  setup() {
    const images = ref<string[]>([]);
    // Get a reference of the component
    const camera = ref<InstanceType<typeof Camera>>();
    // Use camera reference to call functions
    const snapshot = async () => {
      const blob = await camera.value?.snapshot();
      if (blob) {
        const url = URL.createObjectURL(blob);
        images.value.push(url);
      }
    };
    return {
      camera,
      snapshot,
      images,
    };
  },
  async mounted() {
    await this.record();
  },
  methods: {
    async record() {
      await sleep(3000);
      for (const direction of ['horizontal', 'vertical']) {
        this.direction = direction;
        for (let level = 1; level <= 6; ++level) {
          this.level = level;
          for (const inverse of [false, true]) {
            this.inverse = inverse;
            await this.snapshot();
          }
        }
      }
    },
  },
});

</script>
