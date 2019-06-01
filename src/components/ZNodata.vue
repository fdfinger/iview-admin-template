<template functional>
  <div class="no-data" style="padding:50px 0;line-height:40px;text-align:center;">
    <slot>
    <p>
      <Icon type="ios-infinite" size="80"/>
    </p>
    <p>{{props.text}}</p>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: () => "该条件下暂无数据"
    }
  }
}
</script>
