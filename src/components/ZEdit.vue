<template>
  <Modal :value="show" :title="modalData.id?'编辑':title?title:'新增'" @on-cancel="cancel" :width="width">
    <i-form :label-width="70" :model="modalData" ref="formInline" :show-message="false">
      <slot/>
    </i-form>
    <div slot="footer">
      <i-button type="text" @click="cancel">取消</i-button>
      <i-button type="primary" @click="ok" :disabled="check">{{modalData.id?'确认':'保存'}}</i-button>
    </div>
  </Modal>
</template>

<script>
export default {
  data() {
    return {
      check: true
    };
  },

  model: {
    prop: "modalData",
    event: "change"
  },

  props: {
    show: Boolean,
    modalData: Object,
    update: Function,
    insert: Function,
    title: String,
    width: {
      type: Number,
      default: () => 500
    }
  },

  watch: {
    modalData: {
      handler() {
        this.handleSubmit();
      },
      deep: true
    },
    show: 'handleSubmit'
  },

  methods: {
    async ok() {
      if (this.modalData.id) await this.update(this.modalData);
      else await this.insert(this.modalData);
      this.cancel();
    },
    cancel() {
      this.$emit("update:show", false);
    },
    handleSubmit() {
      this.$refs["formInline"].validate(valid => {
        if (valid) this.check = false;
        else this.check = true;
      });
    }
  }
};
</script>
