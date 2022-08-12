<template>
  <div>
    <canvas ref="input" height="640" width="480" v-show="false" />
    <canvas ref="output" height="640" width="480" />
  </div>
</template>

<script lang="ts">
import { Dataset } from '@/classes/dataset';
import { fromGrayCode } from '@/classes/graycodes';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MesoCalculator',
  setup() {
    const dataset = Dataset.loadTestSet();
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
      for (let level = 0; level < maxLevels; ++level) {
        const main = await this.getImageData('horizontal', level, 'main');
        const reverse = await this.getImageData('horizontal', level, 'reverse');
        for (let i = 0; i < main.data.length; i += 4) {
          const mainPixel = main.data[i] + main.data[i + 1] + main.data[i + 2];
          const reversePixel = reverse.data[i] + reverse.data[i + 1] + reverse.data[i + 2];
          const diff = mainPixel > reversePixel ? 1 : 0;
          output.data[i] = output.data[i] * 2 + diff;
          output.data[i + 1] = 0;
          output.data[i + 2] = 0;
          output.data[i + 3] = 255;
        }
      }
      for (let i = 0; i < output.data.length; i += 4) {
        output.data[i] = fromGrayCode(output.data[i]) * 64;
      }
      console.log('output', { output });
      context.putImageData(output, 0, 0);
    },
  },
});

</script>
