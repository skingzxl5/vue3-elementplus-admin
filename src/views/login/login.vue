<template>
  <div class="login-container">
    <div class="login-contant">
      <div class="login-contantLeft">
        <div style="font-size: 42px;font-weight: bold;color: #FCFEFE;margin:10% 0 0 10%">ADMIN SYSTEM</div>
        <div style="font-size: 30px;font-weight: bold;color: #b0d0fe;margin:4% 0 0 10%">VUE3-ELEMENT-PLUS-ADMIN</div>
      </div>
      <div class="login-contantRight">
        <el-form ref="loginForm" :model="formModel" :rules="loginRules" class="login-form" autocomplete="on" label-position="left" label-width="80px">
          <div class="title-container">
            <div class="title">
              欢迎登录
            </div>
            <!-- <lang-select class="set-language" /> -->
          </div>
          <div class="userpassword" style="margin: 0 60px">
            <el-form-item prop="username">
             <span class="svg-container">
               <img src="../../../public/img/icon1.png">
            </span>
              <el-input ref="loginName" class="inputStyle" v-model="formModel.loginName" @click="cancelLoading" placeholder="请输入用户名" name="loginName" type="text" tabindex="1" autocomplete="on" />
            </el-form-item>
            <el-tooltip :disabled="true" style="margin: 26px 0 " placement="right" >
              <el-form-item prop="loginPassword">
                <span class="svg-container">
                  <img src="../../../public/img/icon2.png">
                </span>
                <el-input
                    @click="cancelLoading"
                    class="inputStyle"
                    :key="passwordType"
                    ref="loginPassword"
                    v-model="formModel.loginPassword"
                    :type="passwordType"
                    placeholder="请输入密码"
                    name="loginPassword"
                    tabindex="2"
                    autocomplete="on"
                    @keyup.enter="handleLogin"
                />
              </el-form-item>
            </el-tooltip>
            <el-tooltip :disabled="true" placement="right">
              <el-form-item prop="verifyCode">
                <span class="svg-container">
                  <img src="../../../public/img/icon3.png">
                </span>
                <el-input ref="verifyCode"  @click="cancelLoading" @keyup.enter="handleLogin"  class="inputStyle"  v-model="formModel.verifyCode" type="text" placeholder="验证码" name="validCode" tabindex="3" autocomplete="on" />
                <div class="show-valid-code" style="height: 47px" @click="showValidCode">
                  <img class="login-captcha" :src="validCodeUrl">
                </div>
              </el-form-item>
            </el-tooltip>
            <el-form-item class="mybutton">
              <el-button :loading="loading" type="primary" style="width: 100%; height: 60px; font-size: 16px;border-radius: 4px" @click="handleLogin">立即登录</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, toRefs } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import {generateDynamicRoutes} from '@/router';
import { getUUID } from "@/utils/uuid.js"
import {userPermissionValue} from "../../api/user";
export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    const loginForm = ref(null);
    let state = reactive({
      uuid:"",
      formModel: {
        loginName: "",
        loginPassword: "",
        machineCode: "",
        verifyCode: ""
      },
      loading: false,
      passwordType: "password",
      validCodeUrl:"",
      loginRules: {
        loginName: [{ required: true, message: "请输入用户名" }],
        loginPassword: [{ required: true, message: "请输入密码" }],
      },
    });
    /* 输入框点击事件*/
    const cancelLoading = () => {
      state.loading = false; // 登录加载框去掉
    }

    /* 获取验证码*/
    const showValidCode =()=> {
      state.uuid = getUUID()
      state.validCodeUrl = "/api/authority/validata/code/" + state.uuid
    };
    const handleLogin = () => {
      loginForm.value.validate(async (valid) => {
        if (valid) {
          state.loading = true;
          state.formModel.machineCode = state.uuid
          try {
            // 登录
            const logdata = await store.dispatch("user/login", state.formModel);
            console.log("登录",logdata)
            // 权限菜单
            const routes = await store.dispatch("menu/generateRoutes");
           // 权限按钮集值
            userPermissionValue().then((res) => {
              window.localStorage.setItem( 'permission', JSON.stringify(res.data))
            });

            if (!routes) {
              ElMessage.error("该账号没有权限");
            } else {
              await generateDynamicRoutes(routes)
              router.push('/');
            }
            router.push('/');
            state.loading = false;
          } catch (error) {
            showValidCode()
            console.log("出现异常",error)
            state.loading = false;
            ElMessage.error(error);
          }
        }
      });
    };

    return {
      ...toRefs(state),
      loginForm,
      handleLogin,
      showValidCode,
      cancelLoading, // 输入框点击事件
    };
  },
  created() {
    this.showValidCode();
  }
};
</script>
<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
@media (min-width:1366px) {
  body{
    .login-container {
      min-height: 100%;
      width: 100%;
      background: url("../../../public/img/bg.jpg") no-repeat;
      background-size: cover;
      /*background-color: $bg;*/
      overflow: hidden;
      position:relative;

      .login-contant{
        background-color: #FFFFFF;
        width: 65%;
        height: 70%;
        border-radius: 6px;
        position: absolute;top:50%;left:50%;transform:translate(-50%,-50%);
        .login-contantLeft{
          border-radius: 6px 0 0 6px;
          width: 50%;
          height: 100%;
          float: left;
          background: url("../../../public/img/left_bg.jpg") no-repeat;
          background-size: cover;
          overflow: hidden;
        }
        .login-contantRight{
          width: 50%;
          height: 100%;
          float: right;
          border-radius: 0 6px 6px 0;
          box-shadow: 0 0 18px rgba(84,116,178,0.15);
        }
      }

      .login-form {
        position: relative;
        width: 520px;
        max-width: 100%;
        padding: 10% 0 0 0;
        margin: 0 auto;
        overflow: hidden;
      }

      .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
          &:first-of-type {
            margin-right: 16px;
          }
        }
      }

      .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
      }

      .title-img{
        text-align: center;
        max-height: 20%;
      }

      .title-container {
        position: relative;
        max-height: 10%;

        .title {
          font-size: 22px;
          color: #6c6f74;
          margin: 56px auto 36px auto;
          text-align: center;
        }

        .set-language {
          color: #fff;
          position: absolute;
          top: 3px;
          font-size: 18px;
          right: 0px;
          cursor: pointer;
        }
      }
      .show-valid-code {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
      }
      .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
      }

      .thirdparty-button {
        position: absolute;
        right: 0;
        bottom: 6px;
      }

      @media only screen and (max-width: 470px) {
        .thirdparty-button {
          display: none;
        }
      }
    }
  }
}
@media (max-width:1366px) {
  body{
    .login-container {
      min-height: 100%;
      width: 100%;
      background: url("../../../public/img/bg.jpg") no-repeat;
      background-size: cover;
      /*background-color: $bg;*/
      overflow: hidden;
      position:relative;

      .login-contant{
        background-color: #FFFFFF;
        width: 980px;
        height: 600px;
        border-radius: 6px;
        position: absolute;top:50%;left:50%;transform:translate(-50%,-50%);
        .login-contantLeft{
          border-radius: 6px 0 0 6px;
          width: 50%;
          height: 100%;
          float: left;
          background: url("../../../public/img/left_bg.jpg") no-repeat;
          background-size: cover;
          overflow: hidden;
        }
        .login-contantRight{
          width: 50%;
          height: 100%;
          float: right;
          border-radius: 0 6px 6px 0;
          box-shadow: 0 0 18px rgba(84,116,178,0.15);
        }
      }

      .login-form {
        position: relative;
        width: 520px;
        max-width: 100%;
        padding: 10% 0 0 0;
        margin: 0 auto;
        overflow: hidden;
      }

      .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
          &:first-of-type {
            margin-right: 16px;
          }
        }
      }

      .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
      }

      .title-img{
        text-align: center;
        max-height: 20%;
      }

      .title-container {
        position: relative;
        max-height: 10%;

        .title {
          font-size: 22px;
          color: #6c6f74;
          margin: 56px auto 36px auto;
          text-align: center;
        }

        .set-language {
          color: #fff;
          position: absolute;
          top: 3px;
          font-size: 18px;
          right: 0px;
          cursor: pointer;
        }
      }
      .show-valid-code {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
      }
      .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
      }

      .thirdparty-button {
        position: absolute;
        right: 0;
        bottom: 6px;
      }

      @media only screen and (max-width: 470px) {
        .thirdparty-button {
          display: none;
        }
      }
    }
  }
}
</style>
<style>
.login-container .login-contant .login-contantRight .el-form-item .el-form-item__content{
  margin-left:0px!important;
}
.login-container .login-contant .login-contantRight .el-form-item .el-form-item__content .inputStyle .el-input__wrapper{
  padding: 0!important;
}
.login-container .login-contant .login-contantRight .el-form-item .el-form-item__content .inputStyle .el-input__wrapper .el-input__inner{
  border: solid 1px #1a76d3;
  background: #f0f7ff;
}
.login-container .login-contant .login-contantRight .el-form-item .el-form-item__content .inputStyle .el-input__wrapper .el-input__inner{
  height: 60px;
  padding-left: 52px;
  border-radius: 4px;
  background: #F6F9F9;
  color: #a3a3a3;
  font-size: 14px;
}
.login-container .login-contant .login-contantRight .userpassword{
  max-height: 58%;
}
.login-container .login-contant .login-contantRight .userpassword .el-form-item{
  margin: 26px 0!important;
}
.login-container .login-contant .login-contantRight .userpassword .mybutton{
  margin-top: 34px!important;
}
.login-container .svg-container[data-v-a49090ce] {
  padding: 6px 5px 6px 15px;
  color: #889aa4;
  vertical-align: middle;
  width: 30px;
  text-align: center;
  display: inline-block;
  position: absolute;
  top: 13px;
  z-index: 3;
}
.login-container .show-valid-code[data-v-a49090ce] {
  position: absolute;
  right: 10px;
  top: 11px;
  font-size: 16px;
  color: #889aa4;
  cursor: pointer;
  user-select: none;
}
</style>

