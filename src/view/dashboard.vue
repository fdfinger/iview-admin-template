<template>
  <div class="layout">
    <Layout>
      <Header class="layout-header">
        <div class="layout-logo">
          <div><img src="../assets/logo.png"></div>
        </div>
        <div class="layout-breadcrumb">
        </div>
        <div class="layout-nav">
          <Menu mode="horizontal" theme="dark" active-name="1" @on-select="menuSelect">
            <MenuItem name="clearCache">
              <Icon type="md-refresh-circle" />
              清理缓存
            </MenuItem>
            <Submenu name="3">
              <template slot="title">
                <Avatar style="background-color: #87d068" icon="ios-person" />
                {{userInfo.name}}
              </template>
              <MenuItem name="modifyPassword"><Icon type="md-unlock" /> 修改密码</MenuItem>
              <MenuItem name="logout" ><Icon type="md-power" /> 退出登录</MenuItem>
            </Submenu>
          </Menu>
        </div>
      </Header>
      <Sider class="layout-sider scrollbar" hide-trigger>
        <Menu :active-name="$route.name" theme="light" width="auto" :open-names="defaultOpenKeys" @on-select="onTurnPage">
          <template v-for="menu in menus">
            <template v-if="menu.children.length>0">
              <Submenu :name="menu.route" :key="menu.route" >
                <template slot="title">
                  <Icon :type="menu.logo"></Icon>
                  {{menu.name}}
                </template>
                <MenuItem :name="item.route" :key="item.route" v-for="item in menu.children">{{item.name}}</MenuItem>
              </Submenu>
            </template>
            <template v-else>
              <MenuItem :name="menu.route" :key="menu.route">
                <Icon :type="menu.logo"></Icon>
                {{menu.name}}</MenuItem>
            </template>
          </template>
        </Menu>
      </Sider>
      <Layout class="layout-content scrollbar" id="layout-wraper">
        <Content style="padding:1.5rem;background:#FFF;box-shadow:0 0 5px rgba(0,0,0,0.07)">
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive">
            </router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive">
          </router-view>
        </Content>
      </Layout>
    </Layout>
    <Modal v-model="modifyPasswordModalShow" :loading="saveLoading" width="400" title="修改密码" @on-ok="saveModifyPassword">
      <div style="margin-top:20px">
        <Form :model="formData" ref="formValidate" :rules="formValidate" :label-width="90" style="padding-right:5%">
          <FormItem label="设置密码：" prop="password" required>
            <Input type="password" v-model="formData.password" />
          </FormItem>
          <FormItem label="确认密码：" prop="confirmPassword" required>
            <Input type="password" v-model="formData.confirmPassword" />
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
  import $cookies from 'vue-cookies'
  import $UserService from '../service/user'
  export default {
    data(){
      const validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.formData.confirmPassword !== '') {
            // 对第二个密码框单独验证
            this.$refs.formValidate.validateField('confirmPassword');
          }
          callback();
        }
      };
      const validatePasswordCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.formData.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      };
      return {
        saveLoading:true,
        modifyPasswordModalShow:false,
        userInfo:this.LocalStorage.getItem('USER_INFO') || {},
        collapsed: false,
        defaultOpenKeys:[this.$route.path.split('/')[1]?this.$route.path.split('/')[1]:'/'],
        openKeys:[this.$route.path.split('/')[1]?this.$route.path.split('/')[1]:'/'],
        menus:this.LocalStorage.getItem('NAVIGATE_MENU'),
        formData:{password:'',confirmPassword:''},
        formValidate: {
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          confirmPassword: [
            { validator: validatePasswordCheck, trigger: 'blur' }
          ]
        }
      }
    },
    created(){
      if(this.menus.length==1){
        this.defaultOpenKeys=[this.menus[0].route]
      }
    },
    methods:{
      menuSelect(name){
        this[name]()
      },
      clearCache(){
        this.LocalStorage.removeItem('CLASSIFY_LIST')
        this.LocalStorage.removeItem('CLEAN_CLASSIFY')
        this.$Message.success('缓存清理成功')
      },
      modifyPassword(){
        this.modifyPasswordModalShow=true
      },
      saveModifyPassword(){
        this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            $UserService.resetPassword({password:this.formData.password}).then(res=>{
              if (res.code===1){
                $cookies.remove('AUTH_TOKEN')
                this.LocalStorage.removeItem('USER_INFO')
                this.LocalStorage.removeItem('NAVIGATE_MENU')
                this.$Message.success('密码修改成功，请重新登录')
                setTimeout(()=>{
                  this.$router.replace('/login')
                },800)
              }else{
                this.$Message.error(res.msg)
              }
            })
          }else {
            setTimeout(() => {
              this.saveLoading = false;
              this.$nextTick(() => {
                this.saveLoading = true;
              });
            }, 500);
          }
        })
      },
      logout(){
        this.$Modal.confirm(
          {
            title: '警告',
            content: '确定要退出登录吗？',
            onOk: () => {
              $cookies.remove('AUTH_TOKEN')
              this.LocalStorage.removeItem('USER_INFO')
              this.LocalStorage.removeItem('NAVIGATE_MENU')
              setTimeout(()=>{
                this.$router.replace('/login?referer='+encodeURIComponent(this.$route.fullPath))
              },600)
            },
            onCancel: () => {

            }
          })
      },
      onTurnPage(item){
        this.$router.push({name:item})
      },
      onOpenChange (openKeys) {
        const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1)
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      },
    }
  }
</script>
<style lang="less">
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    position:absolute;
    left:0;top:0;right:0;bottom:0;
    &-header {
      position:absolute;left:0;top:0;right:0;z-index:2;padding:0 20px;display:flex;
      background: linear-gradient(60deg, #4751a7, #7891e5);
      .layout-logo{
        width: 150px;
        div {
          width: 150px;
          height: 30px;
          margin-top:15px;
          img {
            width:100%
          }
        }
      }
      .layout-breadcrumb {
        flex:5;
        .ivu-breadcrumb {
          color:#F2F2F2;
          :last-child {
            color:#CCC;
          }
        }
      }
      .layout-nav{
        margin: 0 auto;
        .ivu-menu-dark {
          background:transparent;
        }
        .ivu-avatar {
          .ivu-icon {margin:0;}
        }
      }
    }
    &-sider {
      position:absolute;box-shadow:0 0 5px rgba(0,0,0,0.1);background:#FFF;top:64px;left:0;bottom:0;overflow:auto;z-index:1;
    }
    &-content {
      padding: 18px;
      position: absolute;
      top: 64px;
      left: 200px;
      right: 0;
      bottom: 0;
      overflow: auto;
    }
  }

  .ivu-menu-vertical.ivu-menu-light:after {display:none}
</style>

