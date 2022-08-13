<template>
  <div :class="['graycodes', direction]">
    <div
      v-for="(code, index) in codes"
      :key="`code_${index}`"
      :class="code ? 'white' : 'black'"
      :style="style"
    >
      &nbsp;
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GrayCodes',
  props: {
    direction: {
      type: String as () => 'horizontal'|'vertical',
      required: true,
      validator: (value: string) => ['horizontal', 'vertical'].includes(value),
    },
    level: {
      type: Number,
      required: true,
      validator: (value: number) => value >= 0 && value <= 8,
    },
    inverse: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    codes() {
      const codes: boolean[] = [];
      const count = 2 ** this.level;
      let start = this.inverse;
      let previous = this.inverse;
      for (let i = 0; i < count; ++i) {
        codes.push(start);
        if (previous === start) {
          previous = start;
          start = !start;
        } else {
          previous = start;
        }
      }
      return codes;
    },
    style() {
      const scaledSize = 100 / (2 ** this.level);
      if (this.direction === 'horizontal') {
        return {
          width: '100%',
          height: `${scaledSize}%`,
        };
      }
      return {
        height: '100%',
        width: `${scaledSize}%`,
      };
    },
  },
});

</script>

<style>
.graycodes {
  height: 100%;
  width: 100%;
  display: flex;
  position: absolute;
}

.horizontal {
  flex-direction: column;
}

.vertical {
  flex-direction: row;
}

.white {
  background-color: #FFF;
}

.black {
  background-color: #000;
}
</style>
