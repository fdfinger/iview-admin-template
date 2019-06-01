<template>
  <div>
    <div style="margin-bottom:5px;">
      <Button icon="md-add" type="primary" @click="addCategory(0)">新增一级分类</Button>
    </div>
    <table class="table padding-10 hover">
      <tr class="header">
        <td>分类名称</td>
        <td class="center">图片</td>
        <td class="center">排序</td>
        <td class="center">ICON图</td>
        <td class="center">
          是否首页
          <Tooltip content="首页最多展示8个类目">
            <Icon type="md-help-circle" size="18" color="#2d8cf0" style="vertical-align:-3px"/>
          </Tooltip>
        </td>
        <td class="right">操作</td>
      </tr>
      <tbody>
        <template v-for="(item,i) in categoryList">
          <tr :key="i">
            <td>
              <strong>{{item.name}}</strong>
              <span style="color:#CCC;font-size:12px;">({{item.id.toString()}})</span>
            </td>
            <td class="center">
              <img :src="imgUrl+item.pic+'!/fh/60'">
            </td>
            <td class="center">{{item.sort}}</td>
            <td class="center">
              <img v-if="item.icon" :src="imgUrl+item.icon">
            </td>
            <td class="center">
              <i-switch
                v-model="item.display"
                :true-value="1"
                :false-value="0"
                @on-change="changeDisplay(item)"
              ></i-switch>
            </td>
            <td class="right">
              <ButtonGroup>
                <Button icon="md-add-circle" @click="addCategory(item.id.toString())">新增下级</Button>
                <Button icon="md-build" @click="editCategory(item)">编辑</Button>
                <Button
                  icon="md-trash"
                  type="error"
                  @click="deleteCategory(item)"
                  :disabled="item.children && item.children.length>0"
                >删除</Button>
              </ButtonGroup>
            </td>
          </tr>
          <template v-if="item.children && item.children.length>0">
            <tr v-for="(element,ii) in item.children" :key="i+'-'+ii">
              <td>
                <span style="color:#CCC">{{item.children.length==ii+1?'└':'├'}}──</span>
                <strong>{{element.name}}</strong>
                <span style="color:#CCC;font-size:12px;">(ID:{{element.id.toString()}})</span>
              </td>
              <td class="center">
                <img :src="imgUrl+element.pic+'!/fh/60'">
              </td>
              <td class="center">{{element.sort}}</td>
              <td class="center">
                <img v-if="element.icon" :src="imgUrl+element.icon">
              </td>
              <td class="center">
                <i-switch
                  v-model="element.display"
                  :true-value="1"
                  :false-value="0"
                  @on-change="changeDisplay(item)"
                ></i-switch>
              </td>
              <td class="right">
                <ButtonGroup>
                  <Button icon="md-build" @click="editCategory(element)">编辑</Button>
                  <Button icon="md-trash" @click="deleteCategory(element)" type="error">删除</Button>
                </ButtonGroup>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
    <Modal
      :title="categoryModalTitle"
      :loading="saveLoading"
      v-model="categoryModalShow"
      @on-ok="saveCategory"
    >
      <div style="width:80%;margin:auto">
        <Form ref="formValidate" :model="formData" :rules="formValidate" :label-width="80">
          <FormItem label="上级分类">
            <Select v-model="formData.parentId" clearable>
              <Option :value="0">作为一级大类</Option>
              <Option
                v-for="category in categoryList"
                :key="category.id.toString()"
                :value="category.id.toString()"
              >{{category.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="分类名称" prop="name">
            <Input v-model="formData.name" clearable/>
          </FormItem>
          <FormItem label="分类图片" prop="pic">
            <upload-image-upyun
              :img-list="formData.pic"
              size="normal"
              :maxLength="num"
              @on-success="uploadPicSuccess"
              @on-remove="uploadPicRemove"
            ></upload-image-upyun>
          </FormItem>
          <FormItem label="首页ICON">
            <upload-image-upyun
              :img-list="formData.icon"
              size="small"
              :maxLength="num"
              @on-success="uploadIconSuccess"
              @on-remove="uploadIconRemove"
            ></upload-image-upyun>
          </FormItem>
          <FormItem label="首页显示">
            <i-switch v-model="formData.display" :true-value="1" :false-value="0"></i-switch>
          </FormItem>
          <FormItem label="显示排序">
            <i-input type="number" v-model="formData.sort" style="width:60px" clearable/>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
import UploadImageUpyun from "../../components/UploadImageUpyun";
import $ProductCategoryService from "../../service/productCategory";
import $ProductService from "../../service/product";
export default {
  data() {
    return {
      imgUrl: process.env.VUE_APP_IMG_URL,
      categoryModalShow: false,
      categoryModalTitle: "增加分类",
      categoryList: [],
      cleanCategory: [],
      saveLoading: true,
      num: 1,
      formData: {
        parentId: null,
        name: null,
        pic: [],
        icon: [],
        sort: 0,
        display: false
      },
      formValidate: {
        name: [{ required: true, message: "请填写分类名称", trigger: "blur" }],
        pic: [
          {
            type: "array",
            min: 1,
            required: true,
            message: "请上传图片",
            trigger: "blur"
          }
        ]
      }
    };
  },
  components: {
    UploadImageUpyun
  },
  created() {
    this.getList();
  },
  methods: {
    changeDisplay(item) {
      $ProductCategoryService
        .update({ id: item.id.toString(), display: item.display })
        .then(res => {
          if (res.code === 1) {
            this.$Message.success("设置成功");
          }
        });
    },
    saveCategory() {
      this.$refs["formValidate"].validate(valid => {
        if (valid) {
          this.saveCategoryAction();
        } else {
          setTimeout(() => {
            this.saveLoading = false;
            this.$nextTick(() => {
              this.saveLoading = true;
            });
          }, 500);
        }
      });
    },
    saveCategoryAction() {
      var formData = { ...this.formData };
      if (formData.parentId == 0) {
        formData.parentId = null;
        formData.level = 1;
      } else {
        formData.level = 2;
      }
      formData.pic = formData.pic.join(",");
      formData.icon = formData.icon.join(",");
      if (this.formData.id) {
        $ProductCategoryService.update(formData).then(res => {
          if (res.code === 1) {
            this.$Message.success("分类编辑成功");
            this.categoryModalShow = false;
            this.getList();
          } else {
            setTimeout(() => {
              this.saveLoading = false;
              this.$nextTick(() => {
                this.saveLoading = true;
              });
            }, 500);
          }
        });
      } else {
        $ProductCategoryService.insert(formData).then(res => {
          if (res.code === 1) {
            this.$Message.success("分类添加成功");
            this.categoryModalShow = false;
            this.getList();
          } else {
            setTimeout(() => {
              this.saveLoading = false;
              this.$nextTick(() => {
                this.saveLoading = true;
              });
            }, 500);
          }
        });
      }
    },
    deleteCategory(item) {
      if (item) {
        $ProductService.select({ categoryId: item.id.toString() }).then(res => {
          if (res.code == 1 && res.data.records.length > 0) {
            this.$Message.error("该分类下有商品，无法直接删除");
          } else {
            this.$Modal.confirm({
              title: "系统提醒",
              content: "确定要删除该分类吗？",
              onOk: () => {
                $ProductCategoryService
                  .delete({ ids: [item.id.toString()] })
                  .then(res => {
                    if (res.code === 1) {
                      this.getList();
                    }
                  });
              }
            });
          }
        });
      }
    },
    addCategory(id = null) {
      this.categoryModalTitle = "添加分类";
      this.formData = {
        parentId: id,
        name: null,
        pic: [],
        icon: [],
        sort: 0,
        display: false
      };
      this.categoryModalShow = true;
    },
    editCategory(item) {
      this.categoryModalTitle = "编辑分类";
      if (item) {
        var formData = { ...item };
        formData.parentId = formData.parentId
          ? formData.parentId.toString()
          : 0;
        formData.pic = formData.pic ? [formData.pic] : [];
        formData.icon = formData.icon ? [formData.icon] : [];
        this.formData = {
          id: formData.id.toString(),
          name: formData.name,
          parentId: formData.parentId,
          pic: formData.pic,
          icon: formData.icon,
          sort: formData.sort,
          display: formData.display
        };
        this.categoryModalShow = true;
      }
    },
    getList() {
      $ProductCategoryService.select({ ps: 1000, desc: "sort" }).then(res => {
        if (res.code === 1) {
          var cleanCategory = [],
            categoryList = [],
            secondCategory = [];
          res.data.records.forEach(item => {
            cleanCategory.push(item);
          });
          this.cleanCategory = cleanCategory;
          categoryList = cleanCategory.filter(item => item.level === 1);
          categoryList.forEach(item => {
            item.children = [];
          });
          secondCategory = cleanCategory.filter(item => item.level === 2);
          categoryList.map(item => {
            var i = secondCategory.filter(
              element => element.parentId.toString() === item.id.toString()
            );
            if (i.length > 0) {
              item.children = i;
            } else {
              delete item.children;
            }
          });
          this.categoryList = categoryList;
        }
      });
    },
    uploadPicSuccess(url) {
      this.formData.pic = [url];
    },
    uploadPicRemove() {
      this.formData.pic = [];
    },
    uploadIconSuccess(url) {
      this.formData.icon = [url];
    },
    uploadIconRemove() {
      this.formData.icon = [];
    }
  }
};
</script>

<style scoped>
</style>
