<template>
  <Tooltip
    content="点击复制"
    placement="top"
    v-clipboard:copy="text"
    v-clipboard:success="() => $Message.success('复制成功!')"
    style="cursor:pointer"
  >
    <strong>{{text}}</strong>
  </Tooltip>
</template>

<script>
export default {
  props: {
    text: {
      type: String
    }
  }
};
</script>
