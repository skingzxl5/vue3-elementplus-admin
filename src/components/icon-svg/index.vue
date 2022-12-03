<template>
  <svg :class="iconSvgClass" aria-hidden="true" v-bind="$attrs">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
import { computed } from "vue";
export default {
  name: "icon-svg",
  props: {
    name: {
      type: String,
    },
    size: {
      type: String,
    },
  },
  setup(props) {
    const iconName = computed(() => {
      if (props.name.includes('icon-')) {
        return `#${props.name}`;
      } else {
        return `#icon-${props.name}`;
      }
    });
    const iconSvgClass = computed(() => {
      if (props.size == 'small') {
        return `icon-svg-small`;
      } else if (props.size == 'big') {
        return `icon-svg-big`;
      } else {
        return `icon-svg-normal`;
      }
    });

    return {
      iconName,
      iconSvgClass
    };
  },
};
</script>

<style lang="scss" scoped>
.icon-svg-normal {
  width: 1.5em;
  height: 1.5em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  pointer-events: none;
}

.icon-svg-big {
  width: 4.5em;
  height: 4.5em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  pointer-events: none;
}

.icon-svg-small {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  pointer-events: none;
}
</style>