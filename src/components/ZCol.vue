<template functional>
  <i-col :xxl="props.xxl" :xl="props.xl" :lg="props.lg" :md="props.md" :style="{paddingLeft: `${props.gutter/2}px`,paddingRight: `${props.gutter/2}px`}">
    <div class="title">{{props.label}}</div>
    <slot></slot>
  </i-col>
</template>

<script>
export default {
  props: {
    label: {
      type: String
    },
    gutter: {
      type: Number,
      default: () => 15
    },
    xxl: {
      type: Number,
      default: () => 4
    },
    xl: {
      type: Number,
      default: () => 4
    },
    lg: {
      type: Number,
      default: () => 4
    },
    md: {
      type: Number,
      default: () => 6
    }
  }
}
</script>
