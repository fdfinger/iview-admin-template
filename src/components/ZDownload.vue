<template functional>
  <Poptip title="是否下载？" placement="right-end" @on-popper-show="props.onClick">
    <i-button icon="md-download" style="margin-left:5px;"> 导出</i-button>
    <div class="api" slot="content">
      <i-button type="primary" ghost :to="props.excelUrl" target="_blank">下载</i-button>
    </div>
  </Poptip>
</template>

<script>
export default {
  props: {
    onClick: Function,
    excelUrl: String
  }
}
</script>
