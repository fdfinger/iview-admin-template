<template>
  <z-layout
    :on-search="onSearch"
    :on-clear="onClear"
    :page-totel="base.total"
    :page-change="onChangePage"
    :page-size-change="onChangeSize"
    :current="base.current"
    :table-list="base.list"
    :table-columns="columns"
  >
    <template #query>
      <z-col label="商品ID">
        <i-input v-model="searchForm.productId"/>
      </z-col>
    </template>
  </z-layout>
</template>
<script>
import Base from "_c/Base";
import task from "@/service/productSku";
export default {
  name: "ProductSku",
  extends: Base,
  data() {
    return {
      columns: [
        { title: "商品ID", key: "productId" },
        { title: "规格", key: "standard" },
        { title: "销售价", key: "sellPrice" },
        { title: "库存", key: "stock" },
        { title: "预警库存", key: "warnStock" }
      ]
    };
  },
  methods: {
    getList(p = 1, size = 10) {
      task.select({ ...this.searchParams, size: size, p: p }).then(res => {
        if (res.code === 1) {
          this.base = {
            list: res.data.records,
            current: res.data.current,
            size: res.data.size,
            total: res.data.total
          };
        }
      });
    }
  }
};
</script>
