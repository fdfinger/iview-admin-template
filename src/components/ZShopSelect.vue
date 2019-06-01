<template>
  <div>
    <Input
      :value="shopName"
      :clearable="clearable"
      :placeholder="placeholder"
      @on-focus="shopModal"
    />
    <Modal v-model="show" title="选择店铺" footer-hide @on-cancel="show=false">
      <div>
        <i-input v-model="searchParams[searchType]">
          <Select v-model.trim="searchType" slot="prepend" style="width: 80px">
            <Option value="name">按名称</Option>
            <Option value="id">按ID</Option>
          </Select>
          <Button icon="ios-search" slot="append" @click="onSearch">搜索</Button>
        </i-input>
      </div>
      <table class="table hover" style="margin-top:10px">
        <tr v-for="item in modalData.list" :key="item.id.toString()">
          <td width="40%" class="center">{{item.id.toString()}}</td>
          <td>{{item.name}}</td>
          <td width="77" class="center">
            <Button
              type="primary"
              size="small"
              v-if="item.id.toString()!=shopId"
              @click="choose(item)"
            >选择</Button>
            <Icon v-else type="ios-checkmark-circle" size="24" color="#19be6b"/>
          </td>
        </tr>
      </table>
      <Page
        :current="modalData.current"
        :total="modalData.total"
        :page-size="modalData.size"
        @on-change="onChangePage"
        @on-page-size-change="onChangeSize"
        style="text-align:right;margin-top:10px;"
      />
    </Modal>
  </div>
</template>

<script>
export default {
  name: "ZShopSelect",
  data() {
    return {
      show: false,
      searchType: "name",
      searchParams: {},
      modalData: {
        list: [],
        current: 1,
        p: 1,
        size: 10,
        total: 0
      },
      list: []
    };
  },

  model: {
    prop: "shopId",
    event: "on-select"
  },

  props: {
    shopId: {
      type: String
    },
    shopName: {
      type: String
    },
    clearable: {
      type: Boolean,
      default: () => true
    },
    placeholder: {
      type: String,
      default: () => "请选择"
    }
  },

  methods: {
    choose(obj) {
      this.show = false;
      this.$emit("update:shopName", obj.name)
      this.$emit("on-select", obj.id.toString());
    },
    shopModal() {
      this.show = true;
      if (this.modalData.list.length == 0) {
        this.getModalList();
      }
    },
    getModalList(p = 1, size = 10) {
      this.searchParams.size = size;
      this.searchParams.p = p;
      var params = { ...this.searchParams };
      if (params.id == "") delete params.id;
      if (params.name == "") delete params.name;
      this.$service["StoreList"].select(params).then(res => {
        if (res.code === 1) {
          this.modalData = {
            list: res.data.records,
            current: res.data.current,
            size: res.data.size,
            total: res.data.total
          };
        }
      });
    },
    onSearch() {
      this.getModalList();
    },
    onClear() {
      this.searchParams = {};
    },
    onChangePage(p) {
      this.getModalList(p, this.searchParams.size);
    },
    onChangeSize(size) {
      this.getModalList(this.searchParams.p, size);
    },
    changeSearchType(value) {
      var searchParams = this.searchParams;
      if (value == "id") delete searchParams.name;
      if (value == "name") delete searchParams.id;
      this.searchParams = searchParams;
    }
  }
};
</script>
