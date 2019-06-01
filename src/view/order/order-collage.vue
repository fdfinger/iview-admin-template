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
      <z-col label="商品名称">
        <i-input v-model="searchForm.productName"/>
      </z-col>
      <z-col label="状态">
        <i-select v-model="searchForm.status">
          <i-option value="0">进行中</i-option>
          <i-option value="1">成功</i-option>
          <i-option value="-1">失败</i-option>
        </i-select>
      </z-col>
      <z-col label="过期时间起">
        <z-date v-model="searchForm.deadlineL"/>
      </z-col>
      <z-col label="过期时间止">
        <z-date v-model="searchForm.deadlineR"/>
      </z-col>
    </template>
  </z-layout>
</template>

<script>
import Base from "_c/Base";
import task from "@/service/crowdGroup";
export default {
  name: "OrderCollage",
  extends: Base,
  data() {
    return {
      columns: [
        {
          title: "主图",
          key: "productPic",
          maxWidth: 85,
          render: (h, params) => {
            return h(
              "a",
              {
                attrs: {
                  href: `${process.env.VUE_APP_IMG_URL}${
                    params.row.productPic
                  }`,
                  target: "_blank"
                }
              },
              [
                h("img", {
                  attrs: {
                    src: `${process.env.VUE_APP_IMG_URL}${
                      params.row.productPic
                    }!/fw/200`,
                    width: 50
                  }
                })
              ]
            );
          }
        },
        {
          title: "商品名称",
          key: "productName",
          minWidth: 130,
          render: (h, params) => {
            return h(
              "router-link",
              {
                props: {
                  to: {
                    name: "ProductList",
                    query: { id: params.row.productId.toString() }
                  }
                }
              },
              params.row.productName
            );
          }
        },
        { title: "商品规格", key: "standard" },
        { title: "商品单价", key: "productPrice", maxWidth: 90 },
        { title: "实时单价", key: "crowdPrice", maxWidth: 90 },
        { title: "成团人数", key: "crowdNum", maxWidth: 90 },
        { title: "参团人数", key: "attendNum", maxWidth: 90 },
        { title: "付款人数", key: "paidNum", maxWidth: 90 },
        { title: "过期时间", key: "deadline" },
        {
          title: "状态",
          key: "status",
          maxWidth: 100,
          render: (h, params) => {
            return h(
              "Tag",
              {
                props: {
                  color:
                    params.row.status > 0
                      ? "success"
                      : params.row.status
                      ? "error"
                      : "green"
                }
              },
              params.row.status > 0
                ? "成功"
                : params.row.status
                ? "失败"
                : "进行中"
            );
          }
        },
        {
          title: "头像列表",
          key: "avatars",
          render: (h, params) => {
            const avatars = JSON.parse(params.row.avatars);
            if (avatars) {
              return avatars.map(item =>
                h("Avatar", {
                  props: {
                    src: item.avatar
                      ? item.avatar
                      : "https://static.d2cmall.com/img/home/160627/images/headpic.png"
                  }
                })
              );
            }
            return h("span", params.row.avatars);
          }
        },
        { title: "拼团商品", key: "product" }
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
