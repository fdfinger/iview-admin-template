<template>
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
      <z-col :xxl="3" :xl="4" :lg="5" :md="6" label="订单编号"><i-input v-model="searchForm.sn"/></z-col>
      <z-col :xxl="5" :xl="6" :lg="7" :md="8" label="收货人信息">
        <i-input v-model="searchForm[reciveType]" clearable>
          <Select
            v-model="reciveType"
            @on-change="changeReciveType"
            style="width:100px"
            slot="prepend"
          >
            <Option value="name">收货人姓名</Option>
            <Option value="mobile">收货人手机</Option>
          </Select>
        </i-input>
      </z-col>
      <z-col :xxl="4" :xl="4" :lg="5" :md="5" label="下单时间范围">
        <DatePicker
                :value="dateRange"
                format="yyyy-MM-dd HH:mm"
                confirm
                type="datetimerange"
                placement="bottom-end"
                placeholder="选择时间"
                style="width:100%"
                @on-change="selectDateRange"
        ></DatePicker>
      </z-col>
      <z-col :xxl="3" :xl="3" :lg="5" :md="8" label="会员账号">
        <i-input v-model="searchForm.memberAccount"/>
      </z-col>
      <z-col :xxl="3" :xl="4" :lg="5" :md="8" label="选择店铺">
        <ShopSelect v-model="selectedShop" :shop="selectedShop" :clearable="true" @on-select="selectShop" />
      </z-col>
    </template>
    <template #tabs>
      <div class="list-tabs">
        <Tabs v-model="searchParams.status" @on-click="clickTab">
          <TabPane label="全部" name="ALL"></TabPane>
          <TabPane label="待付款" name="WAIT_PAY"></TabPane>
          <TabPane label="已付款" name="PAID"></TabPane>
          <TabPane label="交易成功" name="SUCCESS"></TabPane>
          <TabPane label="关闭" name="CLOSED"></TabPane>
        </Tabs>
      </div>
    </template>
    <template #buttons>
      <z-download :on-click="onExcel" :excel-url="excelUrl" />
    </template>
    <template #data>
      <template v-if="base.list.length>0">
        <table class="table order-table padding-10 hover">
          <tr class="center header">
            <td width="20%">订单信息</td>
            <td width="12%" class="center">所属店铺</td>
            <td width="15%" class="center">支付信息</td>
            <td>收货信息</td>
            <td width="100" class="center">状态</td>
            <td width="130" class="center">操作</td>
          </tr>
          <template  v-for="(order, i) in base.list">
          <tr :key="i">
            <td>
              <p>
                订单类型：
                <Tag :color="order.type=='NORMAL'?'primary':'success'">{{order.typeName}}</Tag>
              </p>
              <p>
                订单编号：
                <strong>{{order.sn}}</strong>
              </p>
              <p>创建时间：{{order.createDate}}</p>
            </td>
            <td class="center" style="position:relative;">
              <ShopCard :shop-name="order.shopName" :shop-id="order.shopId"></ShopCard>
            </td>
            <td class="center">
              <p>
                <strong class="text-primary">{{order.payAmount | formatCurrency}}</strong> 元
              </p>
              <p
                v-if="order.paymentTypeName"
                class="text-desc"
              >{{order.paymentTypeName}} {{order.paymentType}}</p>
              <p v-if="order.paymentSn" class="text-desc">{{order.paymentSn}}</p>
            </td>
            <td style="position:relative;">
              <p>
                下单会员：{{order.memberAccount}} (ID:
                <MemberCard :member-id="order.memberId.toString()"></MemberCard>)
              </p>
              <p>收货信息：{{order.province}}{{order.city}}{{order.district}}{{order.address}}/{{order.name}}/{{order.mobile}}</p>
            </td>
            <td class="center">{{order.statusName}}</td>
            <td class="center">
              <i-button @click="viewDetail(order)">
                查看明细
                <Icon :type="order.orderItemList.length>0?'ios-arrow-up':'ios-arrow-down'"/>
              </i-button>
            </td>
          </tr>
          <tr v-if="order.orderItemList.length>0" :key="i">
            <td colspan="6" class="td-thin">
              <table class="table table-thin">
                <tr>
                  <td width="31.95%">商品信息</td>
                  <td width="15.05%" class="center">实际支付</td>
                  <td width="10%" class="center">数量</td>
                  <td class="center">发货信息</td>
                  <td width="100" class="center">状态</td>
                  <td width="129"></td>
                </tr>
                <tr v-for="item in order.orderItemList" :key="order.id.toString()+'-'+item.id.toString()">
                  <td>
                    <a :href="'http://www.responsinator.com/?url='+encodeURIComponent(webUrl+'/product/'+item.productId.toString())" target="_blank"><img :src="imgUrl+item.productPic+'!/both/100x100'" style="width:65px;float:left;margin-right:10px;" /></a>
                    <div>
                      <p class="title" style="height:35px;">
                        <strong>{{item.productName}}</strong>
                      </p>
                      <p
                        class="desc"
                      >规格：{{item.standard | formatStandard}} &nbsp;&nbsp; 单价：{{item.productPrice}} 元</p>
                    </div>
                  </td>
                  <td class="center">{{item.payAmount | formatCurrency}}</td>
                  <td class="center">{{item.quantity}}</td>
                  <td>
                    <div v-if="item.logisticsCom">
                      <p>快递公司：{{item.logisticsCom}}</p>
                      <p>快递单号：{{item.logisticsNum}}</p>
                    </div>
                  </td>
                  <td class="center">{{item.statusName}}</td>
                  <td></td>
                </tr>
              </table>
            </td>
          </tr>
          </template>
        </table>
      </template>
      <template v-else>
        <z-nodata/>
      </template>
    </template>
  </z-layout>
</template>

<script>
import Base from '_c/Base'
import MemberCard from '_c/MemberCard'
import ShopCard from '_c/ShopCard'
import ShopSelect from '_c/ShopSelect'
import itemTask from '@/service/orderItem'

export default {
  name: "OrderList",
  extends: Base,
  data() {
    return {
      viewProductId: null,
      buttonLoading: false,
      reciveType: 'name',
      dateRange:[this.$route.query.createDateL,this.$route.query.createDateR],
      selectedShop: {id: this.$route.query.shopId, name: this.$route.query.shopName}
    }
  },
  watch: {
    "$route.query.memberId": "getRoute",
    "$route.query.shopId": "getRoute",
    "$route.query.shopName": "getRoute"
  },
  components: {
    ShopSelect,
    MemberCard,
    ShopCard
  },
  methods:{
    getRoute(){
      this.searchParams.memberId=this.$route.query.memberId
      this.searchParams.shopId=this.$route.query.shopId
      this.searchParams.shopName=this.$route.query.shopName
      this.selectedShop={id:this.$route.query.shopId,name:this.$route.query.shopName}
      this.getList()
    },
    selectShop(value) {
      this.searchForm.shopId = value.id;
      this.searchForm.shopName = value.name;
      this.selectedShop = { id: value.id, name: value.name };
    },
    selectDateRange(value) {
      this.searchForm.createDateL = value[0] + ":00";
      this.searchForm.createDateR = value[1] + ":00";
    },
    async viewDetail(order) {
      if (order.orderItemList.length > 0) {
        order.orderItemList = [];
      } else {
        let res = await itemTask.select({ orderSn: order.sn });
        if (res.code === 1) {
          order.orderItemList = res.data.records;
        }
      }
    },
    changeReciveType(value) {
      var searchParams = this.searchParams;
      if (value == "reciver") delete searchParams.contact;
      if (value == "contact") delete searchParams.reciver;
      this.searchParams = searchParams;
    }
  }
};
</script>
