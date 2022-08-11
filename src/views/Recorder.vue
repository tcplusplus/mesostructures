<template>
   <div>
    <camera
      style="display: none;"
      :resolution="{ width: 480, height: 640 }"
      autoplay
    />
    <GrayCodes
      :direction="direction"
      :level="level"
      :inverse="inverse"
    />
   </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GrayCodes from '@/components/GrayCodes.vue';

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
  async mounted() {
    await this.record();
  },
  methods: {
    async record() {
      for (const direction of ['horizontal', 'vertical']) {
        this.direction = direction;
        for (let level = 1; level <= 6; ++level) {
          this.level = level;
          for (const inverse of [false, true]) {
            this.inverse = inverse;
          }
        }
      }
    },
  },
});

</script>
