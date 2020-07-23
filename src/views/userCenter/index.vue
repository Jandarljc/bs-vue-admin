<template>
  <div class="app-container">
    <div class="top-bar">
      <div class="action">
        <el-button v-show="changePsw === true" size="mini" @click="changePsw = false">取消</el-button>
        <el-button size="mini" type="primary" @click="changePsw = true">修改密码</el-button>
        <el-button size="mini" type="primary" @click="save">保存</el-button>
      </div>
    </div>
    <div class="body">
      <el-form ref="form" :model="form" class="ali-form clearfix" :rules="userForm">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="权限">
          <el-input v-model="form.roles" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8888/user/sendUploadAvatarData.json"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.avatar" :src="form.avatar" class="avatar" style="border:1px dashed #CCCCCC;border-radius:10px;">
            <i v-else class="el-icon-plus avatar-uploader-icon" style="border:1px dashed #AAAAAA;border-radius:10px;" />
          </el-upload>
        </el-form-item>

        <el-form-item v-if="changePsw === true" label="请设置新密码" required prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item v-if="changePsw === true" label="再次输入新密码" required prop="password">
          <el-input v-model="form.password2" placeholder="请输入密码" show-password />
        </el-form-item>

        <el-form-item label="个人简介">
          <el-input v-model="form.introduction" type="textarea" :rows="5" placeholder="请输入个人简介" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getInfo, updateUserInfo } from '@/api/user'
import store from '@/store'

export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码至少6位！'))
      } else {
        callback()
      }
    }
    return {
      token: store.getters.token,
      changePsw: false,
      password: '',
      form: {
        avatar: '',
        id: '',
        introduction: '',
        password: '',
        password2: '',
        roles: '',
        username: ''
      },
      userForm: {
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        password2: [{ required: true, trigger: 'blur', validator: validatePassword }]
      }
    }
  },
  created() {
    getInfo(this.token).then(data => {
      this.form.avatar = data.data.avatar
      this.form.id = data.data.id
      this.form.introduction = data.data.introduction
      this.form.roles = data.data.roles
      this.form.username = data.data.username
      this.password = data.data.password
    })
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.form.avatar = URL.createObjectURL(file.raw)
      console.log(file)
      console.log(this.form.avatar)
    },
    async beforeAvatarUpload(file) {
      await this.$confirm('此操作将上传文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return true
      }).catch(() => {
        return false
      })
    },
    handleSuccess(res, file) {
      alert('上传成功')
      this.fileList = []
    },
    save() {
      try {
        if (this.changePsw === false) {
          console.log('不修改密码')
          this.form.password = this.password
          updateUserInfo(this.form).then((data) => {
            this.$message({
              message: data.data,
              type: 'success'
            })
          })
        } else if (this.changePsw === true) {
          console.log('修改密码')
          if (this.form.password === this.form.password2) {
            this.password = this.form.password
            this.form.password = this.password
            updateUserInfo(this.form).then((data) => {
              this.$message({
                message: data.data,
                type: 'success'
              })
            })
          } else {
            this.$message({
              message: '两次密码不一致',
              type: 'error'
            })
          }
        }
      } catch (error) {
        this.$message({
          message: error,
          type: 'error'
        })
      }
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}

 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
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

