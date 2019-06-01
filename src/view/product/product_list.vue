<template>
  <CheckboxGroup v-model="checkIds" @on-change="checkAllGroupChange">
  <z-layout
    :on-search="onSearch"
    :on-clear="onClear"
    :page-totel="base.total"
    :page-size="base.size"
    :page-change="onChangePage"
    :page-size-change="onChangeSize"
    :current="base.current"
  >
    <template #query>
      <z-col label="商品ID"><Input v-model="searchForm.id" clearable /></z-col>
      <z-col label="商品名称"><Input v-model="searchForm.name" clearable /></z-col>
      <z-col label="商品类型">
        <i-select v-model="searchForm.crowd" clearable>
          <Option value="0">普通</Option>
          <Option value="1">拼团</Option>
        </i-select>
      </z-col>
      <z-col label="选择分类">
        <ProductClassifyCascadar
          v-model="searchForm.classifyId"
          :classify-id="searchForm.classifyId"
        />
      </z-col>
      <z-col label="选择店铺">
        <ShopSelect v-model="selectedShop" :shop="selectedShop" @on-select="selectShop" />
      </z-col>
    </template>

    <template #tabs>
      <div class="list-tabs">
        <Tabs v-model="searchParams.status" @on-click="clickTab">
          <TabPane v-for="itemTab in [{l:'全部',k:'ALL'},{l:'已上架',k:1},{l:'下架',k:0}]" :key="itemTab.l" :label="itemTab.l" :name="`${itemTab.k}`"></TabPane>
        </Tabs>
      </div>

    </template>

    <template #buttons>
      <div style="padding-left:10px;">
        <Checkbox :indeterminate="indeterminate" :value="checkAll"  @click.prevent.native="handleCheckAll">全选</Checkbox>
        <ButtonGroup>
          <Button type="primary" icon="md-trending-up" :disabled="checkIds.length==0" @click="changeProductsStatus(1)">批量上架</Button>
          <Button type="primary" icon="md-trending-down" :disabled="checkIds.length==0" @click="changeProductsStatus(0)">批量下架</Button>
        </ButtonGroup>
        <Button type="warning" icon="md-trash" :disabled="checkIds.length==0" style="margin-left:15px;" @click="deleteProduct()">批量删除</Button>
      </div>
    </template>
    <template #data>
      <table class="table padding-10 hover hide-checkbox-label">
        <tr class="header">
          <td width="20"></td>
          <td>商品信息</td>
          <td width="8%" class="center">类型</td>
          <td width="15%" class="center">价格</td>
          <td width="5%" class="center">库存</td>
          <td width="8%" class="center">状态</td>
          <td width="8%" class="center">操作</td>
        </tr>
        <tr v-for="item in base.list" :key="item.id.toString()">
          <td class="center"><Checkbox :label="item.id.toString()"></Checkbox></td>
          <td style="position:relative;">
            <div style="float:left;padding-right:10px;"><a :href="'http://www.responsinator.com/?url='+encodeURIComponent(webUrl+'/product/'+item.id.toString())" target="_blank"><img :src="imgUrl+item.firstPic+'!/both/200x200'" style="width:105px" /></a></div>
            <div>
              <p>创建时间：{{item.createDate}}</p>
              <p class="title">{{item.name}}</p>
              <p>店铺ID：<ShopCard :shopId="item.shopId"></ShopCard></p>
              <p>商品ID：{{item.id}} <a v-clipboard:copy="webUrl+'/product/'+item.id.toString()" v-clipboard:success="copySuccess" style="cursor:pointer">复制链接</a></p>
            </div>
          </td>
          <td class="center"><Tag :color="item.crowd ? 'magenta':'primary'">{{item.crowd?'拼团':'普通'}}</Tag></td>
          <td class="center">
            <div v-if="item.crowdPrice>0">
              <p>&yen; <strong>{{item.crowdPrice | formatCurrency}}</strong></p>
              <p style="font-size:12px;">原价：&yen; {{item.price | formatCurrency}}</p>
            </div>
            <div v-else>
              &yen; <strong>{{item.price | formatCurrency}}</strong>
            </div>
          </td>
          <td class="center">{{item.stock}}</td>
          <td class="center"><i-switch v-model="item.status" :true-value="1" :false-value="0" size="large" @on-change="changeProductStatus(item.id)">
            <span slot="open">上架</span>
            <span slot="close">下架</span>
          </i-switch></td>
          <td class="center">
            <ProductSkuModal :product-id="item.id.toString()"></ProductSkuModal>
            <i-button icon="md-build" type="primary" style="margin-top:5px;" @click="$router.push('/product/edit/'+item.id.toString())">编辑商品</i-button>

            <i-button icon="md-trash" type="error" style="margin-top:5px;" @click="deleteProduct(item.id.toString())">删除商品</i-button>
          </td>
        </tr>
        <tr v-if="base.list.lenght == 0">
          <td colspan="6">暂无数据</td>
        </tr>
      </table>
    </template>
  </z-layout>
  </CheckboxGroup>
</template>


<script>
import Base from "_c/Base";
import task from "@/service/product";
import ProductClassifyCascadar from "_c/ProductClassifyCascadar";
import ShopSelect from "_c/ShopSelect";
import ProductSkuModal from "_c/ProductSkuModal";
import ShopCard from "_c/ShopCard";
export default {
  name: 'ProductList',
  data(){
    return {
      selectedShowp:{id:this.$route.query.shopId,name:this.$route.query.shopName},
      indeterminate: false,
      checkAll: false,
      checkIds:[],
    }
  },
  extends: Base,
  watch:{
    "$route.query.shopId":"getRoute",
    "$route.query.shopName":"getRoute"
  },
  components: {
    ShopCard,
    ProductClassifyCascadar,
    ProductSkuModal,
    ShopSelect
  },
  methods: {
    getRoute(){
      this.searchParams.shopId=this.$route.query.shopId
      this.searchParams.shopName=this.$route.query.shopName
      this.selectedShop={id:this.$route.query.shopId,name:this.$route.query.shopName}
      this.getList()
    },
    selectShop(value) {
      this.searchForm.shopId = value.id
      this.searchForm.shopName = value.name
      this.selectedShop={id:value.id,name:value.name}
    },
    copySuccess(){
      this.$Message.success('复制成功')
    },
    //批量处理上下架
    changeProductsStatus(status=1) {
      var name=status==1?'上架':'下架'
      this.$Modal.confirm(
        {
          title: '警告',
          content: '确定'+name+'所选择的商品吗？',
          loading: true,
          onOk: () => {
            this.changeProductsStatusAction(status)
          },
          onCancel: () => {

          }
        }
      )
    },
    //批量处理上下架方法
    changeProductsStatusAction(status){
      var name=status==1?'上架':'下架'
      var request=[]
      this.checkIds.forEach(productId=>{
        request.push(task.status(productId,status))
      })
      Promise.all(request).then(res=>{
        var resultArray=res.filter(item=>item.code!=1)
        if (resultArray.length>0){
          var str=''
          resultArray.map(item=>{
            str+=`${item.msg}<br />`
          })
          this.$Notice.warning({
            duration:0,
            title: `共有 ${resultArray.length} 个商品${name}失败`,
            desc: str
          })
        }
        if (res.length>resultArray.length) {
          this.$Modal.remove();
          this.$Message.success('商品'+name+'成功')
          this.getList(this.searchParams.p,this.searchParams.size)
        }
      }).catch(error=>{
        console.log(error)
      })
    },
    //处理单个商品上下架
    changeProductStatus(id){
      let product=this.base.list.find(item=>item.id===id)
      let status=product.status
      task.status(id.toString(),status).then(res=>{
        if (res.code===1){
          this.$Message.success('商品设置成功')
        }
      })
    },
    //批量删除
    deleteProduct(id=null) {
      this.$Modal.confirm(
        {
          title: '警告',
          content: '确定要删除所选择的商品吗？',
          loading: true,
          onOk: () => {
            this.deleteProductAction(id)
          },
          onCancel: () => {

          }
        }
      )
    },
    deleteProductAction(id){
      this.buttonLoading=true
      var ids=[]
      if (id) {
        ids = [id]
      } else if (this.checkIds.length > 0) {
        ids=this.checkIds
      }
      var request=[]
      ids.forEach(id=>{
        request.push(task.delete({ids:id}))
      })
      Promise.all(request).then(res=>{
        var resultArray=res.filter(item=>item.code!=1)
        if (resultArray.length>0){
          this.$Notice.warning({
            duration:0,
            title: '部分商品未删除成功',
            desc: `共有 ${resultArray.length} 个商品未删除成功，请检查`
          })
        }
        this.buttonLoading=false
        if (res.length>resultArray.length) {
          this.$Modal.remove();
          this.$Message.success('成功删除商品')
          this.getList(this.searchParams.p, this.searchParams.size)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    handleCheckAll () {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        this.checkIds = this.base.list.map(item=>item.id.toString())
      } else {
        this.checkIds = [];
      }
    },
    checkAllGroupChange (data) {
      if (data.length === this.base.list.length) {
        this.indeterminate = false
        this.checkAll = true
      } else if (data.length > 0) {
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.indeterminate = false
        this.checkAll = false
      }
    }
  }
};
</script>
<style>
  .table p.title {margin:5px 0;height:40px;font-weight:bold;}
</style>
