<template>
  <div class="app-container">
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="100px"
      style="width: 60%"
      class="form"
    >
      <el-form-item label="账号" prop="loginName">
        <el-input v-model="form.loginName" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="stName">
        <el-input v-model="form.stName"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="stPhone">
        <el-input v-model="form.stPhone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="loginPassword">
        <el-input v-model="form.loginPassword" show-password></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-upload
          style="border: 1px solid #DCDFE6;border-radius: 4px"
          class="avatar-uploader"
          action="/api/authority/uploadFile"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="form.avatar" :src="form.avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">更新信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import storage from "@/utils/storage";
import { reactive, ref, toRefs } from "vue";
import { ElMessage } from "element-plus";
import { usersUPdate } from "@/api/user";
export default {
  name: "info",
  setup() {
    let userInfo = storage.get("userInfo");
    console.log("用户信息",userInfo);
    const formRef = ref(null);
    const state = reactive({
      form: {
        stId:userInfo.stId,
        stName: userInfo.stName,
        stPhone: userInfo.stPhone,
        avatar: userInfo.avatar,
        loginName: userInfo.loginName,
        loginPassword: userInfo.loginPassword
      },
      rules: {
        stName: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 1, message: '长度最少 1 个字符', trigger: 'blur' }
          ],
          loginPassword: [
            { min: 10, max: 20, message: '长度在 10 到 20 个字符', trigger: 'blur' }
          ],
      },
    });

    /* 更新信息接口 usersUPdate*/
    const submitForm = () => {
      // console.log(state.form);
      usersUPdate(state.form).then((res) => {
        if (res.code == 200){
          ElMessage.success(res.cnMessage)
        } else {
          ElMessage.success(res.cnMessage)
          return false;
        }
      })
    };

    const handleAvatarSuccess = (res, file) => {
      console.log("上传成功",res,file)
      state.form.avatar = res.data;
    };

    const beforeAvatarUpload = (file) => {
      const fileType = ["image/jpeg", "image/png"];
      const isJPG = fileType.includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        ElMessage.error("上传头像图片只能是 JPG、PNG 格式!");
      }
      if (!isLt2M) {
        ElMessage.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    };

    return {
        formRef,
      ...toRefs(state),
      submitForm,
      handleAvatarSuccess,
      beforeAvatarUpload,
      usersUPdate, // 更新的接口
    };
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  background-color: #fff;
}

.form {
  padding: 10px;
  max-width: 900px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
