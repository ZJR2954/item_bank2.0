<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!--我的信息卡片-->
    <el-card class="user_detail">
      <div class="title">个人信息（用户id：{{userDetail.user.u_id}}）</div>
      <!--个人信息区域-->
      <el-form size="mini" label-width="100px" hide-required-asterisk
               ref="userDetailFormRef" :model="userDetail" :rules="userDetailRules">
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="用户姓名：">
              {{userDetail.user.name}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属学校：">
              {{userDetail.user.u_school}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="用户类型：">
              {{userDetail.userType.u_type_name}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属院系：">
              {{userDetail.user.u_faculty}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="身份证号：">
              {{userDetail.user.id_number}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作学科：">
              {{userDetail.user.operate_subject}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="绑定邮箱：" prop="user.email">
              <el-input v-model="userDetail.user.email"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职工号：">
              {{userDetail.user.job_number}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="绑定手机号：" prop="user.telephone">
              <el-input v-model="userDetail.user.telephone"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户状态：">
              {{userDetail.user.u_state}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col align="center">
            <el-button size="medium" type="primary" @click="saveUserInfo">保存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!--修改登录密码卡片-->
    <el-card class="change_password">
      <div class="title">修改登录密码</div>
      <!--修改登录密码区域-->
      <el-form size="mini" label-width="100px" ref="changePasswordFormRef"
               :model="changePasswordForm" :rules="changePasswordFormRules">
        <el-row>
          <el-col :span="10">
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input placeholder="请输入旧密码" type="password" v-model="changePasswordForm.oldPassword"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="新密码" prop="newPassword">
              <el-input placeholder="请输入新密码" type="password" v-model="changePasswordForm.newPassword"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="确认密码" prop="rePassword">
              <el-input placeholder="请再次输入新密码" type="password" v-model="changePasswordForm.rePassword"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col align="center">
            <el-button size="medium" type="primary" @click="changePassword">提交修改</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "profile",
    data() {
      //自定义修改登录密码表单数据验证规则
      var validatePassword = (rule, value, callback) => {
        if (value !== this.changePasswordForm.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        }
        else {
          callback();
        }
      };
      return {
        //用户详情信息
        userDetail: {
          user: {},
          userType: {}
        },
        //修改用户信息详情的验证规则
        userDetailRules: {
          user: {
            email: [
              {required: true, message: '请输入绑定邮箱'},
              {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
            ],
            telephone: [
              {required: true, message: '请输入绑定手机号'}
            ]
          }
        },
        //修改登录密码表单数据
        changePasswordForm: {
          oldPassword: '',
          newPassword: '',
          rePassword: ''
        },
        //修改登录密码表单数据的验证规则
        changePasswordFormRules: {
          oldPassword: [
            {required: true, message: '请输入旧密码'}
          ],
          newPassword: [
            {required: true, message: '请输入新密码'}
          ],
          rePassword: [
            {required: true, message: '请确认密码'},
            {validator: validatePassword, trigger: ['blur', 'change']}
          ],
        }
      }
    },
    methods: {
      //获取我的信息数据
      getProfile() {
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {
              data: {
                user: {
                  u_id: 1,
                  u_type: 1,
                  u_school: "长江大学",
                  u_faculty: "计算机科学学院",
                  job_number: "111111111",
                  name: "正经仁",
                  id_number: "111111111111111111",
                  email: "1111111111@qq.com",
                  telephone: "11111111111",
                  operate_subject: 1,
                  u_state: "正常"
                },
                userType: {
                  u_type: 1,
                  u_type_name: "超级管理员",
                  u_power: "0"
                }
              },
              meta: {msg: "", status: 200}
            }
          };
          //用vuex模拟后台返回数据
          res.data.user = this.$store.state.user.user;
          res.data.userType = this.$store.state.user.userType;
          console.log("获取个人信息返回的数据：", res);//-----------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error('获取个人信息失败！');
          }
          this.userDetail = res.data;
        }, 300);
      },
      //点击按钮发起保存个人信息请求
      saveUserInfo() {
        this.$refs.userDetailFormRef.validate(async (valid) => {
          if (!valid) return;
          //弹框询问用户是否保存修改
          const confirmResult = await this.$confirm('此操作将保存个人信息，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err);
          if (confirmResult !== 'confirm') {
            return this.$message.info('已取消！');
          }
          console.log("保存个人信息提交的数据：", this.userDetail);//-----------------------------------------------------
          //模拟网络请求
          setTimeout(() => {
            const {data: res} = {
              data: {meta: {msg: "", status: 200}}
            };
            console.log("保存个人信息返回的数据：", res);//---------------------------------------------------------------
            if (res.meta.status !== 200) {
              return this.$message.error('保存个人信息失败！');
            }
            this.$message.success('保存个人信息成功！');
            this.getProfile();
          }, 300);
        });
      },
      //点击按钮发起修改登录密码请求
      changePassword() {
        this.$refs.changePasswordFormRef.validate(async (valid) => {
          if (!valid) return;
          //弹框询问用户是否保存修改
          const confirmResult = await this.$confirm('此操作将修改登录密码，修改成功后需要重新登录，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err);
          if (confirmResult !== 'confirm') {
            return this.$message.info('已取消！');
          }
          console.log("修改登录密码提交的数据：", this.changePasswordForm);//---------------------------------------------
          //模拟网络请求
          setTimeout(() => {
            const {data: res} = {
              data: {meta: {msg: "", status: 200}}
            };
            console.log("修改登录密码返回的数据：", res);//---------------------------------------------------------------
            if (res.meta.status !== 200) {
              return this.$message.error('修改登录密码失败！');
            }
            this.$message.success('修改登录密码成功！');
            this.$bus.$emit('logout');
          }, 300);
        });
      }
    },
    created() {
      this.getProfile();
    }
  }
</script>

<style scoped>
  .user_detail .el-input, .el-select {
    width: 80%;
  }

  .title {
    margin-bottom: 10px;
    font-size: 14px;
  }
</style>