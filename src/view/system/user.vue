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
      <z-col label="账号">
        <i-input v-model="searchForm.username"/>
      </z-col>
      <z-col label="状态">
        <i-select v-model="searchForm.status">
          <i-option v-for="(item, index) in ['禁用','启用']" :key="index" :value="index">{{item}}</i-option>
        </i-select>
      </z-col>
    </template>
    <template #buttons>
      <i-button
        type="info"
        class="mt-2 ml-2"
        icon="md-add"
        @click="modalData={username:'未命名',password:'',status:1};modal=true;"
      >添加</i-button>
    </template>

    <z-edit :show.sync="modal" v-model="modalData" :update="handleUpdate" :insert="handleInsert">
      <form-item prop="username" label="账号" required>
        <i-input v-model="modalData.username"/>
      </form-item>
      <form-item prop="password" label="密码" required>
        <i-input v-model="modalData.password"/>
      </form-item>
      <form-item prop="status" label="状态" required>
        <i-switch :true-value="1" :false-value="0" v-model="modalData.status"/>
      </form-item>
    </z-edit>
  </z-layout>
</template>

<script>
import Base from "_c/Base";
import task from "@/service/user";
import md5 from "md5";

export default {
  name: "user",
  extends: Base,
  data() {
    return {
      columns: [
        { title: "账号", key: "username", className: "text-primary" },
        {
          title: "状态",
          key: "status",
          render: (h, params) => {
            return h("i-switch", {
              props: {
                "false-value": 0,
                "true-value": 1,
                value: params.row.status
              },
              on: {
                "on-change": v => {
                  this.handleUpdate({ status: v }, params.row);
                }
              }
            });
          }
        },
        { title: "最后登陆时间", key: "loginDate" },
        {
          title: "操作",
          key: "action",
          render: (h, params) => {
            return h("ButtonGroup", { props: { size: "small" } }, [
              h(
                "i-button",
                {
                  on: {
                    click: () => {
                      this.modal = true;
                      this.modalData = params.row;
                    }
                  }
                },
                "编辑"
              )
            ]);
          }
        }
      ]
    };
  },
  methods: {
    getList(p = 1, size = 10) {
      this.searchParams.size = size;
      this.searchParams.p = p;
      var params = { ...this.searchParams };
      task.select(params).then(res => {
        if (res.code === 1) {
          this.base = {
            list: res.data.records,
            current: res.data.current,
            size: res.data.size,
            total: res.data.total
          };
        }
      });
    },
    async handleInsert(params) {
      await task.insert({
        ...params,
        password: md5(params.password)
      });
      this.getList();
    },
    async handleUpdate(params) {
      await task.update({ id: params.id.toString(), ...params });
      this.getList();
    }
  }
};
</script>
