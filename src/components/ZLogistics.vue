<template functional>
  <section v-if="props.num && props.com">
    <p>快递公司：{{props.com}}</p>
    <p>
      快递单号：{{props.num}}
      <Poptip title="快递查询" placement="right">
        <a>查询</a>
        <div slot="content" style="width:375px;overflow:hidden;">
          <iframe
            frameborder="0"
            style="margin-top:-88px;width:395px;height:500px"
            :src="'https://m.kuaidi100.com/result.jsp?com='+props.com+'&nu='+props.num"
          ></iframe>
        </div>
      </Poptip>
    </p>
  </section>
</template>

<script>
export default {
  props: {
    com: String,
    num: String
  }
}
</script>
