<template>
  <section>
    <i-button @click="show=true">发货</i-button>
    <Modal v-model="show" title="发货">
      <i-form :label-width="70" :model="formData" ref="formInline" :show-message="false">
        <form-item prop="logisticsCom" label="物流公司" required>
          <i-select v-model="formData.logisticsCom" @on-change="formData.logisticsCode = logisticsData.find(e => e.l == arguments[0]).c">
            <i-option
              v-for="(item, index) in logisticsData"
              :key="index"
              :value="item.l"
              :label="item.l"
            />
          </i-select>
        </form-item>
        <form-item prop="logisticsNum" label="物流单号" required>
          <i-input v-model="formData.logisticsNum"/>
        </form-item>
      </i-form>
      <div slot="footer">
        <i-button type="text" @click="cancel">取消</i-button>
        <i-button type="primary" @click="ok" :disabled="check">提交</i-button>
      </div>
    </Modal>
  </section>
</template>

<script>
export default {
  data() {
    return {
      formData: {},
      check: true,
      show: false,
      logisticsData: [
        { l: "顺丰速递", c: "shunfeng" },
        { l: "申通快递", c: "shentong" },
        { l: "圆通快递", c: "yuantong" },
        { l: "中通快递", c: "zhongtong" },
        { l: "韵达快递", c: "yunda" },
        { l: "百世汇通", c: "huitongkuaidi" },
        { l: "EMS", c: "ems" },
        { l: "京东快递", c: "jd" },
        { l: "德邦快递", c: "debangwuliu" },
        { l: "快捷快递", c: "kuaijiesudi" },
        { l: "其他", c: "other" }
      ]
    };
  },
  watch: {
    formData: {
      handler() {
        this.$refs["formInline"].validate(valid => {
          if (valid) this.check = false;
          else this.check = true;
        });
      },
      deep: true
    }
  },

  props: {
    id: String,
    submit: Function
  },

  methods: {
    ok() {
      this.submit({ ...this.formData, id: this.id });
    },
    cancel() {
      this.show = false;
    }
  }
};
</script>
