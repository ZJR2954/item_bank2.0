<template>
  <div class="login_container">
    <div class="login_box">
      <div class="login_title">研究生招生考试试题库系统</div>
      <el-form class="login_form" label-width="80px" hide-required-asterisk
               ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <!--学校-->
        <el-form-item label="学校" prop="u_school">
          <el-select class="select" placeholder="请选择学校" v-model="loginForm.u_school">
            <el-option v-for="item in schoolList" :key="item.school_id" :label="item.school_name"
                       :value="item.school_name">
            </el-option>
          </el-select>
        </el-form-item>
        <!--用户类型-->
        <el-form-item label="用户类型" prop="u_type">
          <el-select class="select" placeholder="请选择用户类型" v-model="loginForm.u_type">
            <el-option v-for="item in userTypeList" :key="item.u_type" :label="item.u_type_name"
                       :value="item.u_type">
            </el-option>
          </el-select>
        </el-form-item>
        <!--用户名-->
        <el-form-item label="用户名" prop="job_number">
          <el-input placeholder="请输入职工号" prefix-icon="el-icon-user"
                    v-model="loginForm.job_number">
          </el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item label="登录密码" prop="password">
          <el-input placeholder="请输入登录密码" prefix-icon="el-icon-lock" type="password"
                    v-model="loginForm.password">
          </el-input>
        </el-form-item>
        <!--忘记密码-->
        <el-form-item class="other">
          <el-link :underline="false" target="_blank" href="/forget_password">忘记密码？</el-link>
        </el-form-item>
        <!--按钮区域-->
        <el-form-item class="buttons" label-width="0">
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    name: "login",
    data() {
      return {
        //学校列表
        schoolList: [],
        //用户类型列表
        userTypeList: [],
        //登录表单数据
        loginForm: {
          u_school: '',
          u_type: null,
          job_number: '202022222',
          password: '123456'
        },
        //登录表单验证规则对象
        loginFormRules: {
          u_school: [
            {required: true, message: '请选择学校'}
          ],
          u_type: [
            {required: true, message: '请选择用户类型'}
          ],
          job_number: [
            {required: true, message: '请输入用户名'}
          ],
          password: [
            {required: true, message: '请输入登录密码'}
          ],
        }
      }
    },
    methods: {
      //从vuex获取相关方法
      ...mapActions(['saveUser', 'saveUserType', 'saveSchoolId', 'saveFacultyId']),
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
      //点击按钮发起登录请求
      login() {
        this.$refs.loginFormRef.validate(async valid => { //简化promise操作
          if (!valid) return;
          //网络请求
          this.$http.post('/user/login', this.loginForm).then(res => {
            if (res.data.code !== 200) {
              return this.$message.error(res.data.message);
            }
            window.sessionStorage.setItem("token", res.data.data.token);
            this.saveUser(res.data.data.userMsg.user);
            this.saveUserType(res.data.data.userMsg.userType);
            this.saveSchoolId(res.data.data.userMsg.school_id);
            this.saveFacultyId(res.data.data.userMsg.faculty_id);
            this.$message.success("登录成功！");
            this.$router.push("/home").catch(err => err);
          });
        });
      }
    },
    created() {
      this.getSchoolList();
      this.getUserTypeList();
    },
    mounted() {
      const that = this;
      //监听键盘事件
      document.onkeyup = function (e) {
        if (e.keyCode === 13) { //如果按下enter键
          that.login();
        }
      };
    }
  }
</script>

<style scoped>
  .login_container {
    height: 100%;
    background-image: linear-gradient(#2b4b6b, #ffffff);
  }

  .login_box {
    width: 450px;
    height: 450px;
    margin: auto;
    border-radius: 3px;
    position: relative;
    top: 80px;
    background-color: #fff;
  }

  .login_title {
    padding: 20px 0 30px 0;
    text-align: center;
    color: #409eff;
    font-size: 25px;
    font-weight: 700;
  }

  .login_form {
    padding: 0 20px;
    /*防止输入框右边超出*/
    box-sizing: border-box;
  }

  .select {
    width: 100%;
  }

  .other {
    margin-bottom: 0;
    text-align: right;
  }

  .buttons {
    text-align: center;
  }

  .buttons .el-button {
    width: 90%;
  }
</style>