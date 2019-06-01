<template>
  <date-picker :value="value" format="yyyy-MM-dd HH:mm:ss" @on-change="change" style="width:100%" :disabled="disabled"/>
</template>

<script>
export default {
  model: {
    prop: "value",
    event: "change"
  },

  props: {
    value: String,
    disabled: {
      type: Boolean,
      default: () => false
    }
  },

  methods: {
    change(v) {
      this.$emit("change", v);
    }
  }
};
</script>
