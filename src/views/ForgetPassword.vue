<template>
  <div>
    <el-card>
      <el-form class="search_form" size="mini" label-width="85px" ref="searchUserFormRef"
               :model="searchUserForm" :rules="searchUserFormRules">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="所属学校" prop="u_school">
              <el-select placeholder="请选择所属学校" v-model="searchUserForm.u_school">
                <el-option v-for="item in schoolList" :label="item.school_name" :key="item.school_id"
                           :value="item.school_name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="职工号" prop="job_number">
              <el-input placeholder="请输入职工号" v-model="searchUserForm.job_number" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button size="mini" type="primary" @click="searchUser">检索账户</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!--检索结果卡片-->
    <el-card class="search_result">
      <div>检索结果</div>
      <!--用户列表区域-->
      <el-table size="mini" border stripe :data="userList">
        <el-table-column label="所属学校" prop="user.u_school"></el-table-column>
        <el-table-column label="用户类型" prop="userType.u_type_name"></el-table-column>
        <el-table-column label="姓名" prop="user.name"></el-table-column>
        <el-table-column label="用户状态">
          <template slot-scope="scope">
            {{scope.row.user.u_state == 1 ? '正常' : '异常'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="showChangePasswordDetailDialog(scope.row)">
              使用绑定邮箱验证改密
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--修改登录密码的对话框-->
    <el-dialog :title="'修改登录密码，绑定邮箱为：' + userDetail.user.email" width="650px"
               :visible.sync="changePasswordDialogVisible" @close="changePasswordDialogClosed">
      <el-form size="mini" label-width="100px" ref="changePasswordFormRef"
               :model="changePasswordForm" :rules="changePasswordFormRules">
        <el-row :gutter="10">
          <el-col :span="18">
            <el-form-item label="邮箱验证码" prop="verificationCode">
              <el-input v-model="changePasswordForm.verificationCode"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button size="mini" :disabled="time != 0" type="primary" @click="getVerificationCode">
              {{time == 0 ? "获取验证码" : time+"秒后可重新获取"}}
            </el-button>
          </el-col>
        </el-row>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="changePasswordForm.newPassword"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword">
          <el-input type="password" v-model="changePasswordForm.rePassword"/>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer">
    <el-button type="primary" @click="changePassword()">确定</el-button>
    <el-button @click="changePasswordDialogVisible = false">取消</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "forget-password",
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
        //学校列表
        schoolList: [],
        //用户类型列表
        userTypeList: [],
        //检索用户表单数据
        searchUserForm: {
          u_school: '',
          job_number: ''
        },
        //检索用户表单信息的验证规则
        searchUserFormRules: {
          u_school: [
            {required: true, message: '请选择所属学校'}
          ],
          job_number: [
            {required: true, message: '请输入用户职工号'}
          ]
        },
        //用户列表
        userList: [],
        //控制修改密码对话框是否可见
        changePasswordDialogVisible: false,
        //用户详情信息
        userDetail: {
          user: {},
          userType: {}
        },
        //修改密码表单信息
        changePasswordForm: {
          verificationCode: '',
          newPassword: '',
          rePassword: ''
        },
        //修改密码表单信息的验证规则
        changePasswordFormRules: {
          verificationCode: [
            {required: true, message: '请输入邮箱验证码'}
          ],
          newPassword: [
            {required: true, message: '请输入新密码'}
          ],
          rePassword: [
            {required: true, message: '请确认密码'},
            {validator: validatePassword, trigger: ['blur', 'change']}
          ]
        },
        //倒计时
        time: 0
      }
    },
    methods: {
      //获取学校列表数据
      getSchoolList() {
        //网络请求
        this.$http.get('/school/school_list').then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.schoolList = [];
          res.data.data.rows.forEach((item) => {
            this.schoolList.push(item.school);
          });
        });
      },
      //获取用户类型列表数据
      getUserTypeList() {
        //网络请求
        this.$http.get('/user_type/get_all_utype').then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.userTypeList = res.data.data;
        });
      },
      //点击按钮发起检索请求
      searchUser() {
        this.$refs.searchUserFormRef.validate(async (valid) => {
          if (!valid) return;
          //网络请求
          this.$http.post("/user/search_user/1/1000", this.searchUserForm).then((res) => {
            if (res.data.code !== 200) {
              return this.$message.error(res.data.message);
            }
            this.$message.success(res.data.message);
            this.userList = res.data.data.rows;
            this.userList.forEach((item) => {
              let email = item.user.email;
              if (String(email).indexOf('@') > 0) {
                let newEmail, str = email.split('@'), _s = '';
                if (str[0].length > 4) {
                  _s = str[0].substr(0, 4);
                  for (let i = 0; i < str[0].length - 4; i++) {
                    _s += '*';
                  }
                } else {
                  _s = str[0].substr(0, 1);
                  for (let i = 0; i < str[0].length - 1; i++) {
                    _s += '*';
                  }
                }
                newEmail = _s + '@' + str[1];
                item.user.email = newEmail;
              }
            });
          });
        });
      },
      showChangePasswordDetailDialog(obj) {
        //乞丐版深拷贝
        this.userDetail = JSON.parse(JSON.stringify(obj));
        this.changePasswordDialogVisible = true;
      },
      //获取验证码
      getVerificationCode() {
        this.time = 60;
        let timer = setInterval(() => {
          this.time--;
          if (this.time <= 0) {
            clearInterval(timer);
          }
        }, 1000);
        //网络请求
        this.$http.get("/user/get_verification_code/" + this.userDetail.user.u_id).then((res) => {
          if (res.data.code != 200) {
            return this.$message.error(res.data.message);
          }
          return this.$message.success(res.data.message);
        });
      },
      changePassword() {
        this.$refs.changePasswordFormRef.validate(async (valid) => {
          if (!valid) return;
          //弹框询问用户是否保存修改
          const confirmResult = await this.$confirm('此操作将修改登录密码，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err);
          if (confirmResult !== 'confirm') {
            return this.$message.info('已取消！');
          }
          // 网络请求
          this.$http.put('/user/change_password_by_verification_code/' + this.userDetail.user.u_id, this.changePasswordForm).then((res) => {
            if (res.data.code !== 200) {
              return this.$message.error(res.data.message);
            }
            this.changePasswordDialogVisible = false;
            this.$router.replace('/login').catch(err => err);
            this.$message.success(res.data.message);
          });
        });
      },
      //监听添加用户对话框关闭事件
      changePasswordDialogClosed() {
        this.$refs.changePasswordFormRef.resetFields();
      }
    },
    created() {
      this.getSchoolList();
      this.getUserTypeList();
    }
  }
</script>

<style scoped>
  .search_form .el-input, .el-select {
    width: 100%;
  }

  .search_result div {
    font-size: 14px;
  }
</style>