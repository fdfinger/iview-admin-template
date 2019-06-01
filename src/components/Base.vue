<template>
  <section></section>
</template>

<script>
export default {
  data() {
    return {
      imgUrl: process.env.VUE_APP_IMG_URL,
      webUrl: process.env.VUE_APP_WEB_URL,
      searchForm: {
        ...this.$route.query
      },
      searchParams: {
        ...this.$route.query
      },
      checkAll: false,
      checkIds: [],
      indeterminate: false,
      selectedShop: {
        id: this.$route.query.shopId,
        name: this.$route.query.shopName
      },
      excelUrl: "",
      modal: false,
      modalData: {},
      base: {
        list: [],
        current: 1,
        p: 1,
        size: this.$route.query.size || 20,
        total: 0
      }
    };
  },
  methods: {
    onSearch() {
      this.searchParams = { ...this.searchForm };
      this.getList();
      this.$router.replace({
        path: this.$route.path,
        query: this.searchParams
      });
    },
    onClear() {
      this.searchForm = {};
      this.searchParams = {};
      this.selectedShop = {};
      this.dateRange = [];
    },
    onChangePage(p) {
      this.searchParams.p = p;
      if (!this.searchParams.size) this.searchParams.size=this.base.size
      this.getList(p, this.searchParams.size);
      this.$router.replace({
        path: this.$route.path,
        query: this.searchParams
      });
    },
    onChangeSize(size) {
      this.searchParams.size = size;
      this.getList(this.searchParams.p, size);
      this.$router.replace({
        path: this.$route.path,
        query: this.searchParams
      });
    },
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;
      if (this.checkAll) {
        this.checkIds = this.base.list.map(item => item.id.toString());
      } else {
        this.checkIds = [];
      }
    },
    checkAllGroupChange(data) {
      if (data.length === this.base.list.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    clickTab(name) {
      if (name != "All") this.searchParams.status = name;
      this.searchParams.p = 1;
      this.getList();
      this.$router.replace({
        path: this.$route.path,
        query: this.searchParams
      });
    },
    async onExcel() {
      const res = await this.$service[this.$route.name].excel(this.searchForm);
      this.excelUrl = res.data;
    },
    selectShop(value) {
      this.searchForm.shopId = value.id;
      this.searchForm.shopName = value.name;
      this.selectedShop = { id: value.id, name: value.name };
    },
    getList(p = 1, size = 10) {
      var params = { ...this.searchParams, p: p, size: size };
      if (params.status == "ALL") params.status = undefined;
      this.$service[this.$route.name].select(params).then(res => {
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
    async handleUpdate(data) {
      await this.$service[this.$route.name].update({ ...data, id: data.id.toString() });
      await this.getList()
    },
    async handleInsert(data) {
      await this.$service[this.$route.name].insert(data);
      await this.getList()
    }
  },
  mounted() {
    this.getList(this.searchParams.p, this.searchParams.size);
  }
};
</script>
