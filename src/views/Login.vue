<template>
  <div class="login_container">
    <div class="login_box">
      <div class="login_title">研究生招生考试试题库系统</div>
      <el-form class="login_form" label-width="80px" hide-required-asterisk
               ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <!--学校-->
        <el-form-item label="学校" prop="school">
          <el-select class="select" placeholder="请选择学校" v-model="loginForm.school">
            <el-option v-for="item in schoolList" :key="item.school_id" :label="item.school_name"
                       :value="item.school_id">
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
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="请输入职工号" prefix-icon="el-icon-user"
                    v-model="loginForm.username">
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
          <el-link :underline="false" target="_blank" href="#">忘记密码？</el-link>
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
          school: null,
          u_type: null,
          username: '',
          password: ''
        },
        //登录表单验证规则对象
        loginFormRules: {
          school: [
            {required: true, message: '请选择学校'}
          ],
          u_type: [
            {required: true, message: '请选择用户类型'}
          ],
          username: [
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
      ...mapActions(['saveUser', 'saveUserType']),
      //获取学校列表数据
      getSchoolList() {
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {
              data: {
                schoolList: [
                  {school_id: 1, school_name: "长江大学"},
                  {school_id: 2, school_name: "清华大学"},
                  {school_id: 3, school_name: "北京大学"},
                  {school_id: 4, school_name: "华中科技大学"},
                  {school_id: 5, school_name: "武汉大学"}
                ]
              },
              meta: {msg: '', status: 200}
            }
          };
          console.log("获取学校列表返回的数据：", res);//------------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error('获取学校列表失败！');
          }
          this.schoolList = res.data.schoolList;
        }, 300);
      },
      //获取用户类型列表数据
      getUserTypeList() {
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {
              data: {
                userTypeList: [
                  {u_type: 1, u_type_name: "超级管理员"},
                  {u_type: 2, u_type_name: "校级管理员"},
                  {u_type: 3, u_type_name: "院级管理员"},
                  {u_type: 4, u_type_name: "命题教师"},
                  {u_type: 5, u_type_name: "审核教师"}
                ]
              },
              meta: {msg: '', status: 200}
            }
          };
          console.log("获取用户类型列表返回的数据：", res);//-------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error("获取用户类型列表失败！");
          }
          this.userTypeList = res.data.userTypeList;
        }, 300);
      },
      //点击按钮发起登录请求
      login() {
        this.$refs.loginFormRef.validate(async valid => { //简化promise操作
          console.log("登录提交的信息：", this.loginForm);//-------------------------------------------------------------
          if (!valid) return;
          //模拟网络请求
          setTimeout(() => {
            // const {data: res} = {data:{data: null, meta: {msg: "用户名不存在", status: 400}}};
            const {data: res} = {
              data: {
                data: {},
                meta: {msg: "登录成功", status: 200}
              }
            };
            //模拟后台判断
            if (this.loginForm.password != "123456") {
              res.meta = {msg: "用户名或密码错误！", status: 401};
            } else if (this.loginForm.u_type == 1) {
              res.data = {
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
                  operate_subject: null,
                  u_state: "正常"
                },
                userType: {
                  u_type: 1,
                  u_type_name: "超级管理员",
                  u_power: "0"
                },
                token: "myToken"
              };
            } else if (this.loginForm.u_type == 2) {
              res.data = {
                user: {
                  u_id: 2,
                  u_type: 2,
                  u_school: "长江大学",
                  u_faculty: "计算机科学学院",
                  job_number: "222222222",
                  name: "李二",
                  id_number: "222222222",
                  email: "2222222222@qq.com",
                  telephone: "22222222222",
                  operate_subject: null,
                  u_state: "正常"
                },
                userType: {
                  u_type: 2,
                  u_type_name: "校级管理员",
                  u_power: "1, 7, 9, 10"
                },
                token: "myToken"
              };
            } else if (this.loginForm.u_type == 3) {
              res.data = {
                user: {
                  u_id: 3,
                  u_type: 3,
                  u_school: "长江大学",
                  u_faculty: "计算机科学学院",
                  job_number: "333333333",
                  name: "李三",
                  id_number: "333333333",
                  email: "3333333333@qq.com",
                  telephone: "33333333333",
                  operate_subject: null,
                  u_state: "正常"
                },
                userType: {
                  u_type: 3,
                  u_type_name: "院级管理员",
                  u_power: "1, 2, 7, 8"
                },
                token: "myToken"
              };
            } else if (this.loginForm.u_type == 4) {
              res.data = {
                user: {
                  u_id: 4,
                  u_type: 4,
                  u_school: "长江大学",
                  u_faculty: "计算机科学学院",
                  job_number: "444444444",
                  name: "李四",
                  id_number: "444444444",
                  email: "4444444444@qq.com",
                  telephone: "44444444444",
                  operate_subject: 1,
                  u_state: "正常"
                },
                userType: {
                  u_type: 4,
                  u_type_name: "命题教师",
                  u_power: "1, 2, 3, 4, 5"
                },
                token: "myToken"
              };
            } else if (this.loginForm.u_type == 5) {
              res.data = {
                user: {
                  u_id: 5,
                  u_type: 5,
                  u_school: "长江大学",
                  u_faculty: "计算机科学学院",
                  job_number: "555555555",
                  name: "李五",
                  id_number: "555555555",
                  email: "5555555555@qq.com",
                  telephone: "55555555555",
                  operate_subject: 1,
                  u_state: "正常"
                },
                userType: {
                  u_type: 4,
                  u_type_name: "审核教师",
                  u_power: "1, 2, 6"
                },
                token: "myToken"
              };
            }
            console.log("登录返回的信息：", res);//----------------------------------------------------------------------
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            window.sessionStorage.setItem("token", res.data.token);
            this.saveUser(res.data.user);
            this.saveUserType(res.data.userType);
            this.$message.success("登录成功！");
            this.$router.push("/home").catch(err => err);
          }, 300);
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