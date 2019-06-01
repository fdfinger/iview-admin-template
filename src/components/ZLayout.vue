<template functional>
  <section>
    <Row :gutter="15" class="search-bar">
      <slot name="query"/>
      <i-col :xxl="1" :xl="1" :lg="2" :md="2" class="search-buttons">
        <i-button type="primary" @click="props.onSearch">查询</i-button>
        <i-button @click="props.onClear">重置</i-button>
      </i-col>
    </Row>
    <slot name="tabs"/>
    <div class="list-buttons-bar no-margin">
      <div>
        <slot name="buttons"/>
      </div>
      <Page
        :total="props.pageTotel"
        @on-change="props.pageChange"
        @on-page-size-change="props.pageSizeChange"
        :current="props.current"
        :page-size="props.pageSize"
        show-total
        show-sizer
        show-elevator
        style="text-align:right;"
      />
    </div>
    <slot name="data">
      <i-table :data="props.tableList" :columns="props.tableColumns" border/>
    </slot>
    <div class="list-buttons-bar no-margin">
      <div>
        <slot name="buttons"/>
      </div>
      <Page
        :total="props.pageTotel"
        @on-change="props.pageChange"
        @on-page-size-change="props.pageSizeChange"
        :current="props.current"
        :page-size="props.pageSize"
        show-total
        show-sizer
        show-elevator
        style="text-align:right;"
      />
    </div>
    <slot/>
  </section>
</template>

<script>
export default {
  props: {
    onSearch: Function,
    onClear: Function,
    pageChange: Function,
    pageSizeChange: Function,
    pageTotel: Number,
    current: Number,
    pageSize:Number,
    tableList: Array,
    tableColumns: Array
  }
}
</script>
