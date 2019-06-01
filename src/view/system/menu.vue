<template>
  <div>
    <Row :gutter="30">
      <i-col :xxl="8" :xl="10" :lg="12" :md="12">
        <Card dis-hover>
          <p slot="title">
            <Icon type="md-grid"/>菜单管理
          </p>
          <a @click="addNew()" slot="extra">新增</a>
          <div class="menu-tree scrollbar">
            <Tree :data="menuList" @on-select-change="selectChange"></Tree>
          </div>
        </Card>
      </i-col>
      <i-col :xxl="8" :xl="10" :lg="12" :md="12">
        <Card dis-hover>
          <p slot="title">
            <Icon type="md-code"/>
            {{formData.id?'编辑菜单':'增加菜单'}}
          </p>
          <Alert type="warning" banner show-icon>菜单权限新增修改后，需要用户重新登录才生效</Alert>
          <Form
            ref="formValidate"
            :rules="formValidate"
            :model="formData"
            :label-width="80"
            style="padding-right:10%"
          >
            <FormItem>
              <div style="position:relative">
                <div style="position:absolute;left:0;right:0;top:0;bottom:0;z-index:2"></div>
                <RadioGroup v-model="formData.type" type="button">
                  <Radio label="DIR">目录</Radio>
                  <Radio label="MENU">菜单</Radio>
                  <Radio label="BUTTON">按钮</Radio>
                </RadioGroup>
              </div>
            </FormItem>
            <FormItem label="上级菜单" prop="name">
              <Cascader :data="menuList" v-model="formData.parentId" change-on-select></Cascader>
            </FormItem>
            <FormItem label="菜单名称" prop="name">
              <Input v-model="formData.name"/>
            </FormItem>
            <FormItem label="请求路径" prop="path">
              <Input v-model="formData.path"/>
            </FormItem>
            <FormItem label="前端路由" prop="route">
              <Input v-model="formData.route"/>
            </FormItem>
            <FormItem label="前端组件" prop="assembly">
              <Input v-model="formData.assembly"/>
            </FormItem>
            <FormItem label="菜单图标">
              <Input v-model="formData.logo" icon="md-help-circle" style="width:90%"/>
              <Icon :type="formData.logo" size="30"/>
            </FormItem>
            <FormItem label="菜单排序">
              <Input v-model="formData.sort"/>
            </FormItem>
            <FormItem label="是否启用">
              <i-switch v-model="formData.status" :true-value="1" :false-value="0"></i-switch>
            </FormItem>
            <FormItem style="text-align:right">
              <div style="display:flex;justify-content: space-between">
                <div>
                  <a
                    @click="remove(formData)"
                    slot="extra"
                    style="color:#FF0000"
                    v-if="formData.children && formData.children.length==0"
                  >删除</a>
                </div>
                <div>
                  <Button
                    style="margin-right:15px"
                    @click="addNew(formData)"
                    v-if="formData.id && formData.type!='BUTTON'"
                  >新增下级</Button>
                  <Button type="primary" :loading="saveLoading" @click="saveMenu">保存</Button>
                </div>
              </div>
            </FormItem>
          </Form>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import { listToTree, findParent } from "../../utils";
import $MenuService from "../../service/menu";
export default {
  name: "Menu",
  data() {
    return {
      saveLoading: false,
      menuList: [],
      formData: { type: "DIR", sort: 0, status: 1 },
      formValidate: {
        name: [
          {
            type: "string",
            required: true,
            message: "请填写菜单名称",
            trigger: "blur"
          }
        ],
        path: [
          {
            type: "string",
            required: true,
            message: "请填写请求路径",
            trigger: "blur"
          }
        ],
        route: [
          {
            type: "string",
            required: true,
            message: "请填写前端路由",
            trigger: "blur"
          }
        ],
        assembly: [
          {
            type: "string",
            required: true,
            message: "请填写前端组件",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    saveMenu() {
      this.$refs["formValidate"].validate(valid => {
        if (valid) {
          this.saveLoading = true;
          let formData = { ...this.formData };
          formData.parentId = formData.parentId[formData.parentId.length - 1];
          let service = formData.id
            ? $MenuService.update(formData)
            : $MenuService.insert(formData);
          service.then(res => {
            if (res.code === 1) {
              this.$Message.success(
                formData.id ? "菜单编辑成功" : "菜单新增成功"
              );
              if (!formData.id) {
                var result = { ...res.data };
                result.parentId = findParent(
                  this.menuList,
                  result.parentId.toString(),
                  []
                );
                this.formData = result;
              }
              this.getMenuList();
            }
            setTimeout(() => {
              this.saveLoading = false;
            }, 600);
          });
        }
      });
    },
    getMenuList() {
      $MenuService.select({ ps: 500 }).then(res => {
        if (res.code === 1) {
          this.menuList = listToTree(res.data.records);
          console.log(this.menuList);
        }
      });
    },
    selectChange(array, obj) {
      var item = { ...obj };
      if (item.parentId) {
        item.parentId = findParent(this.menuList, item.parentId.toString(), []);
      } else {
        item.parentId = [];
      }
      this.formData = item;
    },
    remove(data) {
      this.$Modal.confirm({
        title: "系统警告",
        content: "确定要删除这个菜单吗？删除后无法恢复！",
        onOk: () => {
          $MenuService.delete({ ids: data.id.toString() }).then(res => {
            if (res.code === 1) {
              this.$Message.success("菜单删除成功");
              this.addNew();
              this.getMenuList();
            } else {
              this.$Message.error(res.msg);
            }
          });
        }
      });
    },
    addNew(data = null) {
      if (data) {
        var parentId = [];
        if (data.id) {
          parentId = findParent(this.menuList, data.id.toString(), []);
        }
        var formData = { parentId: parentId, sort: 0, status: 1 };
        formData.type = data.type == "DIR" ? "MENU" : "BUTTON";
        this.formData = formData;
      } else {
        this.formData = { type: "DIR", sort: 0, status: 1 };
      }
    }
  }
};
</script>

<style lang="less" scoped>
.menu-tree {
  position: relative;
  max-height: 69vh;
  height: 100%;
  overflow: auto;
}
</style>
