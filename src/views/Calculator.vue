<template>
  <div>
    <button type="button" class="btn btn-success" @click="goHome">Home</button>
    <canvas ref="input" height="640" width="480" v-show="false" />
    <canvas ref="output" height="640" width="480" />
  </div>
</template>

<script lang="ts">
import { Dataset } from '@/classes/dataset';
import { fromGrayCode } from '@/classes/graycodes';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'MesoCalculator',
  setup() {
    const store = useStore();
    const dataset: Dataset = store.state.currentDataset;
    return {
      dataset,
    };
  },
  async mounted() {
    await this.calculate();
  },
  computed: {
    canvas() {
      return this.$refs.input as HTMLCanvasElement;
    },
    output() {
      return this.$refs.output as HTMLCanvasElement;
    },
  },
  methods: {
    goHome() {
      this.$router.push({ name: 'home' });
    },
    getImageData(direction: 'horizontal'|'vertical', level: number, type: 'main'|'reverse'): Promise<ImageData> {
      return new Promise((resolve) => {
        const context = this.canvas.getContext('2d');
        if (context === null) throw Error('No render context');
        const img = new Image();
        img.src = this.dataset[direction].levels[level][type];
        img.onload = () => {
          context.drawImage(img, 0, 0);
          resolve(context.getImageData(0, 0, this.canvas.width, this.canvas.height));
        };
      });
    },
    async calculate() {
      const maxLevels = this.dataset.numLevels;
      const context = this.output.getContext('2d');
      if (context === null) throw new Error('context is null');
      const output = context.getImageData(0, 0, this.output.width, this.output.height);
      for (const direction of ['horizontal', 'vertical'] as const) {
        for (let level = 0; level < maxLevels; ++level) {
          const main = await this.getImageData(direction, level, 'main');
          const reverse = await this.getImageData(direction, level, 'reverse');
          for (let i = 0; i < main.data.length; i += 4) {
            const mainPixel = main.data[i] + main.data[i + 1] + main.data[i + 2];
            const reversePixel = reverse.data[i] + reverse.data[i + 1] + reverse.data[i + 2];
            const diff = mainPixel > reversePixel ? 1 : 0;
            if (direction === 'horizontal') output.data[i] = output.data[i] * 2 + diff;
            if (direction === 'vertical') output.data[i + 1] = output.data[i + 1] * 2 + diff;
            output.data[i + 3] = 255;
          }
        }
      }
      for (let i = 0; i < output.data.length; i += 4) {
        const max = 2 ** maxLevels;
        const x = (0.5 - fromGrayCode(output.data[i]) / max);
        const y = (0.5 - fromGrayCode(output.data[i + 1]) / max);
        output.data[i] = (x + 0.5) * 128;
        output.data[i + 1] = (y + 0.5) * 128;
        output.data[i + 2] = Math.sqrt(1 - (x * x) - (y * y)) * 255;
      }
      context.putImageData(output, 0, 0);
    },
  },
});

</script>
