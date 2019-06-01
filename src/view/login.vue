<template>
  <div id="login">
    <div class="login-wrap">
      <div class="login-banner"></div>
      <div class="login-form">
        <form @submit.prevent="login">
          <div class="item">
            <Input placeholder="请输入你的账号" size="large" v-model="username" prefix="ios-contact" />
          </div>
          <div class="item">
            <Input placeholder="请输入登录密码" size="large" type="password" v-model="password" prefix="ios-lock" />
          </div>
          <div class="item"><button type="submit" class="ivu-btn ivu-btn-primary ivu-btn-large">登录</button></div>
          <div style="font-size:12px;">忘记密码请联系对接人或管理员</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import $cookies from 'vue-cookies'
  import $UserService from './../service/user'
  export default {
    data(){
      return {
        referer:this.$route.query.referer || '/',
        username:null,
        password:null
      }
    },
    methods:{
      login(){
        this.$Message.config({
          top: '50%'
        });
        if (!this.username||!this.password){
          this.$Message.error('请填写用户名和密码')
          return false
        }
        $UserService.login({username:this.username,password:this.password}).then(res=>{
          if (res.code===1){
            $cookies.set('AUTH_TOKEN',res.data.accessToken)
            this.LocalStorage.setItem('USER_INFO',{
              name:res.data.username,
              role:{
                code:res.data.roles[0].code,
                name:res.data.roles[0].name
              }
            })
            this.LocalStorage.setItem('NAVIGATE_MENU',res.data.menus)
            if (this.referer.indexOf('login')!=-1){
              this.$router.replace('/')
            }else{
              this.$router.replace(this.referer)
            }

          }
        })
      }
    }
  }
</script>

<style lang="less">
  #login {
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background-color:#fff;
    background-size:cover;
  }
  .login-wrap {
    position:absolute;
    display:flex;
    justify-content: space-between;
    width:760px;
    height:400px;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    border-top-left-radius:10px;
    border-bottom-right-radius:10px;
    box-shadow:0 10px 20px rgba(0,0,0,0.5);
    .login-banner {
      border-top-left-radius:10px;
      width:420px;
      height:400px;
      background-color:#fff;
      background-size: cover;
    }
    .login-form {
      border-bottom-right-radius:10px;
      background:rgba(255,255,255,0.85);
      -webkit-backdrop-filter: blur(20px);
      width:340px;
      height:400px;
      box-sizing: border-box;
      padding:100px 40px;
      text-align:center;
      .item {
        margin-bottom:25px;
        button {width:100%}
      }
    }
  }

</style>
