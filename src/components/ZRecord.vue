<template>
  <section>
    <a @click="shopModal">{{text}}</a>
    <Modal
      v-model="show"
      :title="text"
      footer-hide
      @on-cancel="show=false"
      style="font-size:12px;"
      :width="width"
    >
      <table class="table hover" style="margin-top:10px" v-if="modalData.list.length > 0">
        <tr class="header">
          <td v-for="(th,thIndex) in col.map(i => i.title)" :key="thIndex">{{th}}</td>
        </tr>
        <tr v-for="(item,index) in modalData.list" :key="index">
          <td v-for="(td,tdIndex) in col.map(i => i.key)" :key="tdIndex">{{item[td]}}</td>
        </tr>
      </table>
      <z-nodata v-if="modalData.list.length == 0"/>
    </Modal>
  </section>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      modalData: {
        list: []
      }
    };
  },
  props: {
    service: String,
    params: Object,
    text: String,
    col: Array,
    width: {
      type: String,
      default: () => "500"
    }
  },
  methods: {
    shopModal() {
      this.show = true;
      if (this.modalData.list.length == 0) {
        this.$service[this.service].select(this.params).then(res => {
          this.modalData.list = res.data.records;
        });
      }
    }
  }
};
</script>
