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
      <z-col :xxl="3" :xl="4" :lg="5" :md="6" label="订单编号">
        <Input v-model="searchForm.orderSn" clearable/>
      </z-col>
      <z-col :xxl="5" :xl="6" :lg="7" :md="8" label="商品">
        <i-input v-model="searchForm[searchType]" clearable>
          <Select
            v-model="searchType"
            @on-change="changeSearchType"
            style="width:100px"
            slot="prepend"
          >
            <Option value="productName">根据名称</Option>
            <Option value="skuSn">根据货号</Option>
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
      <z-col :xxl="3" :xl="3" :lg="5" :md="8" label="订单类型">
        <i-select v-model="searchForm.type">
          <i-option label="拼团" value="CROWD"/>
          <i-option label="普通" value="NORMAL"/>
        </i-select>
      </z-col>
      <z-col :xxl="3" :xl="3" :lg="5" :md="8" label="选择店铺">
        <ShopSelect
          v-model="selectedShop"
          :shop="selectedShop"
          :clearable="true"
          @on-select="selectShop"
        />
      </z-col>
    </template>

    <template #tabs>
      <div class="list-tabs">
        <Tabs v-model="searchParams.status" @on-click="clickTab">
          <TabPane label="全部" name="ALL"></TabPane>
          <TabPane label="待付款" name="WAIT_PAY"></TabPane>
          <TabPane label="已付款" name="PAID"></TabPane>
          <TabPane label="待发货" name="WAIT_DELIVER"></TabPane>
          <TabPane label="已发货" name="DELIVERED"></TabPane>
          <TabPane label="已收货" name="RECEIVED"></TabPane>
          <TabPane label="关闭" name="CLOSE"></TabPane>
        </Tabs>
      </div>
    </template>

    <template #data>
      <table class="table order-table padding-10" v-if="base.list.length>0">
        <tr class="header">
          <td width="15%" class="center">订单编号</td>
          <td width="30%" class="center">商品信息</td>
          <td class="center">支付信息</td>
          <td width="90" class="center">订单类型</td>
          <td width="100" class="center">状态</td>
          <td>物流信息</td>
        </tr>
        <tr v-for="item in base.list" :key="item.id.toString()">
          <td>
            <p class="text-desc">创建时间：{{item.createDate}}</p>
            <p>
              <z-copy :text="item.orderSn"/>
            </p>
            <p class="text-desc">
              下单用户：
              <MemberCard :member-id="item.memberId.toString()" :text="item.memberAccount"></MemberCard>
            </p>
            <p class="text-desc">
              所属店铺：
              <ShopCard :shop-name="item.shopName" :shop-id="item.shopId"></ShopCard>
            </p>
          </td>
          <td>
            <div style="float:left;margin-right:10px">
              <a
                :href="'http://www.responsinator.com/?url='+encodeURIComponent(webUrl+'/product/'+item.productId.toString())"
                target="_blank"
              >
                <img :src="imgUrl+item.productPic+'!/both/100x100'" style="width:60px;padding:1px;">
              </a>
            </div>
            <div>
              <p style="height:40px;overflow:hidden;">
                <strong>{{item.productName}}</strong>
              </p>
              <p>规格：{{item.standard}} &nbsp;&nbsp;&nbsp; 数量：{{item.quantity}}</p>
            </div>
          </td>
          <td class="center">
            <p>
              <strong class="text-primary">{{item.payAmount | formatCurrency}}</strong> 元
            </p>
            <p
              v-if="item.paymentTypeName"
              class="text-desc"
            >{{item.paymentTypeName}} {{item.paymentType}}</p>
            <p v-if="item.paymentSn" class="text-desc">{{item.paymentSn}}</p>
          </td>
          <td class="center">
            <Tag :color="item.type=='NORMAL'?'primary':'success'">{{item.typeName}}</Tag>
          </td>
          <td class="center">{{item.statusName}}</td>
          <td>
            <template v-if="item.logisticsCom&&item.logisticsNum">
              <p>快递公司：{{item.logisticsCom}}</p>
              <p>
                快递单号：{{item.logisticsNum}}
                <Poptip title="快递查询" placement="right">
                  <a>查询</a>
                  <div slot="content" style="width:375px;overflow:hidden;">
                    <iframe
                      frameborder="0"
                      style="margin-top:-88px;width:395px;height:500px"
                      :src="'https://m.kuaidi100.com/result.jsp?com='+item.logisticsCom+'&nu='+item.logisticsNum"
                    ></iframe>
                  </div>
                </Poptip>
              </p>
            </template>
          </td>
        </tr>
      </table>
      <template v-else>
        <z-nodata/>
      </template>
    </template>
  </z-layout>
</template>

<script>
import Base from "_c/Base";
import MemberCard from "_c/MemberCard";
import ShopCard from "_c/ShopCard";
import ShopSelect from "_c/ShopSelect";

export default {
  name: "OrderItem",
  extends: Base,
  data() {
    return {
      searchType: "productName",
      dateRange: [this.$route.query.createDateL, this.$route.query.createDateR],
      selectedShop: {
        id: this.$route.query.shopId,
        name: this.$route.query.shopName
      }
    };
  },
  components: {
    ShopSelect,
    MemberCard,
    ShopCard
  },
  methods: {
    selectDateRange(value) {
      this.searchForm.createDateL = value[0] + ":00";
      this.searchForm.createDateR = value[1] + ":00";
    },
    selectShop(value) {
      this.searchForm.shopId = value.id;
      this.searchForm.shopName = value.name;
      this.selectedShop = { id: value.id, name: value.name };
    },
    changeSearchType(value) {
      var searchForm = this.searchForm;
      if (value == "productName") delete searchForm.productSn;
      if (value == "productSn") delete searchForm.productName;
      this.searchForm = searchForm;
    }
  }
};
</script>
