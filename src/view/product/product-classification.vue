<template>
  <section>
    <Row :gutter="10" class-name="mt-5">
      <i-col :md="8" :lg="8">
        <Card dis-hover :padding="0" shadow title="一级分类">
          <a slot="extra" @click="handleInsert({level:1, sort: 1, name: '未命名'})">新增分类</a>
          <i-table
            highlight-row
            :data="firstList"
            :columns="columns"
            @on-current-change="handleFirstTableClick"
          />
        </Card>
      </i-col>
      <i-col :md="8" :lg="8" v-show="secondList.length > 0">
        <Card dis-hover :padding="0" shadow title="二级分类">
          <i-table
            highlight-row
            :data="secondList"
            :columns="columns"
            @on-current-change="handleSecondTableClick"
          />
        </Card>
      </i-col>
      <i-col :md="8" :lg="8" v-show="thirdList.length > 0">
        <Card dis-hover :padding="0" shadow title="三级分类">
          <i-table highlight-row :data="thirdList" :columns="columns"/>
        </Card>
      </i-col>
    </Row>
    <Modal v-model="modal" :title="formStatus" @on-ok="ok" @on-cancel="cancel">
      <Form :label-width="60">
        <form-item label="名称">
          <i-input v-model="form.name"/>
        </form-item>
        <form-item label="排序">
          <input-number v-model="form.sort" style="width:100%;"/>
        </form-item>
        <form-item prop="pic" label="图片">
          <UploadImageUpyun
            :imgList="form.pic ? Array.of(form.pic) : []"
            @on-success="form.pic = arguments[0]"
          />
        </form-item>
      </Form>
    </Modal>
  </section>
</template>

<script>
import task from "@/service/productClassify";
import UploadImageUpyun from "_c/UploadImageUpyun";
export default {
  name: "ProductClassification",
  components: {
    UploadImageUpyun
  },
  data() {
    return {
      list: [],
      firstList: [],
      secondList: [],
      thirdList: [],
      formStatus: "新增分类",
      modal: false,
      form: {},
      columns: [
        { title: "名称", key: "name", align: "center" },
        { title: "排序", key: "sort", maxWidth: 100, align: "center" },
        {
          title: "图片",
          key: "pic",
          render: (h, params) => {
            return h("img", {
              attrs: { src: process.env.VUE_APP_IMG_URL + params.row.pic, width: 50 }
            })
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            return h("ButtonGroup", [
              h(
                "i-button",
                {
                  props: { size: "small" },
                  style: {
                    display: params.row.level === 3 ? "none" : "inline"
                  },
                  on: {
                    click: () => {
                      this.formStatus = "新增分类";
                      this.handleInsert({
                        parentId: params.row.id.toString(),
                        level: params.row.level + 1,
                        sort: 1,
                        name: "未命名"
                      });
                    }
                  }
                },
                "新增下级"
              ),
              h(
                "i-button",
                {
                  props: { size: "small" },
                  on: {
                    click: () => {
                      this.formStatus = "编辑分类";
                      this.handleInsert({
                        ...params.row,
                        id: params.row.id.toString(),
                        parentId: params.row.parentId
                          ? params.row.parentId.toString()
                          : undefined
                      });
                    }
                  }
                },
                "编辑"
              ),
              h(
                "i-button",
                {
                  props: { size: "small", type: "error" },
                  on: {
                    click: () => {
                      this.handleDelete([params.row.id.toString()]);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ]
    };
  },
  methods: {
    getList() {
      task.select({ p: 1, size: 1000, decs: "sort" }).then(res => {
        if (res.code === 1) {
          this.list = res.data.records;
          this.firstList = res.data.records.filter(item => item.level === 1);
        }
      });
    },

    handleInsert(params) {
      this.form = {
        name: "未命名",
        ...params
      };
      this.modal = true;
    },

    async handleDelete(params) {
      await task.delete({ ids: params });
      this.getList();
      this.secondList = [];
      this.thirdList = [];
    },

    async ok() {
      switch (this.formStatus) {
        case "编辑分类":
          await task.update(this.form);
          break;
        default:
          await task.insert(this.form);
          break;
      }
      this.getList();
      this.secondList = [];
      this.thirdList = [];
    },

    cancel() {
      this.$Message.info("取消");
    },

    handleFirstTableClick(params) {
      this.secondList = this.list
        .filter(item => item.parentId)
        .filter(
          element => element.parentId.toString() === params.id.toString()
        );
    },

    handleSecondTableClick(params) {
      this.thirdList = this.list
        .filter(item => item.parentId)
        .filter(
          element => element.parentId.toString() === params.id.toString()
        );
    }
  },
  mounted() {
    this.getList();
  }
};
</script>
