<template>
  <el-container class="home_container">
    <!--头部区域-->
    <el-header>
      <!--logo区域-->
      <div class="child1">
        <img src="../assets/img/logo/logo1.png">
      </div>
      <!--下拉菜单-->
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          {{userInfo.user.name}}
          <i class="el-icon-arrow-down el-icon--right"/>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="help">帮助</el-dropdown-item>
          <el-dropdown-item command="profile">个人信息</el-dropdown-item>
          <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>

    <!--页面主体区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside width="200px">
        <!--侧边栏菜单区域-->
        <el-menu background-color="#333744"
                 text-color="#fff"
                 active-text-color="#409eff"
                 :router="true"
                 :default-active="activePath">
          <el-menu-item v-for="item in menuList" :key="item.id" :index="item.path"
                        @click="saveNavState(item.path)">
            <i v-if="activePath == item.path" class="el-icon-star-on"></i>
            <i v-else class="el-icon-star-off"></i>
            <span>{{item.label}}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!--右侧内容主体-->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {mapActions} from 'vuex'

  export default {
    name: 'Home',
    data() {
      return {
        //菜单列表
        menuList: [],
        //处于活动状态的路由地址
        activePath: '',
        //用户信息
        userInfo: {
          user: {},
          user_type: {}
        }
      }
    },
    methods: {
      //从vuex获取相关方法
      ...mapGetters(['getUser', 'getUserType']),
      ...mapActions(['removeUser']),
      //获取菜单列表
      getMenuList() {
        //模拟网络请求
        const {data: res} = {
          data: {
            menuList: [],
            meta: {msg: "获取菜单列表成功", status: 200}
          }
        };
        //模拟后台判断
        let menuList = [
          {
            id: 3,
            menuNo: 1,
            power: "2",
            label: "通知",
            path: "notice",
          },
          {
            id: 15,
            menuNo: 2,
            power: "0, 10",
            label: "通知管理",
            path: "notice_manager",
          },
          {
            id: 2,
            menuNo: 3,
            power: "0, 1",
            label: "我的信息",
            path: "profile",
          },
          {
            id: 1,
            menuNo: 4,
            power: "0",
            label: "用户类型管理",
            path: "user_type_manager",
          },
          {
            id: 16,
            menuNo: 5,
            power: "0, 11",
            label: "学校列表",
            path: "school_list",
          },
          {
            id: 14,
            menuNo: 6,
            power: "9",
            label: "院系列表",
            path: "faculty_list",
          },
          {
            id: 12,
            menuNo: 7,
            power: "8",
            label: "专业列表",
            path: "major_list",
          },
          {
            id: 13,
            menuNo: 8,
            power: "8",
            label: "学科列表",
            path: "subject_list",
          },
          {
            id: 11,
            menuNo: 9,
            power: "0, 7",
            label: "用户列表",
            path: "user_list",
          },
          {
            id: 10,
            menuNo: 10,
            power: "6",
            label: "待审试题",
            path: "pending_questions",
          },
          {
            id: 5,
            menuNo: 11,
            power: "3",
            label: "我的试题",
            path: "my_questions",
          },
          {
            id: 4,
            menuNo: 12,
            power: "3",
            label: "上传试题",
            path: "upload_question",
          },
          {
            id: 9,
            menuNo: 13,
            power: "5",
            label: "我的试卷",
            path: "my_exam_paper",
          },
          {
            id: 8,
            menuNo: 14,
            power: "5",
            label: "组卷",
            path: "make_exam_paper",
          },
          {
            id: 7,
            menuNo: 15,
            power: "5",
            label: "我的选题",
            path: "my_options",
          },
          {
            id: 6,
            menuNo: 16,
            power: "4",
            label: "题库",
            path: "questions",
          }
        ];
        let userTypePowerList = this.userInfo.user_type.u_power ? this.userInfo.user_type.u_power.split(',') : [];
        for (let i = 0; i < userTypePowerList.length; i++) {
          userTypePowerList[i] = userTypePowerList[i].trim();
        }
        for (let item of menuList) {
          let power = item.power ? item.power.split(',') : [];
          for (let i = 0; i < power.length; i++) {
            power[i] = power[i].trim();
          }
          //power和userTypeList存在交集则符合条件
          if (power.filter(v => {
                return userTypePowerList.indexOf(v) > -1;
              }).length > 0) {
            res.menuList.unshift(item);
          }
        }
        if (res.meta.status !== 200) {
          return this.$message.error("获取菜单列表失败！");
        }
        console.log(res);//---------------------------------------------------------------------------------------------
        this.menuList = res.menuList;
      },
      //下拉菜单栏指令事件
      handleCommand(command) {
        if (command == "help") {
          window.open("#");
        } else if (command == "profile") {
          window.open("#");
        } else if (command == "logout") {
          this.logout();
        }
      },
      //退出登录事件
      logout() {
        this.removeUser();
        window.sessionStorage.clear();
        this.$router.replace('/login');
        this.$message.success("已退出！");
      },
      //保存菜单栏状态
      saveNavState(activePath) {
        window.sessionStorage.setItem('activePath', activePath);
        this.activePath = activePath;
      }
    },
    created() {
      this.userInfo.user = this.getUser();
      this.userInfo.user_type = this.getUserType();
      this.getMenuList();
      this.activePath = window.sessionStorage.getItem('activePath');
    },
    mounted() {
      //监听全局事件
      this.$bus.$on('logout', () => {
        this.logout();
      });
    }
  }
</script>

<style scoped>
  .home_container {
    height: 100%;
  }

  .el-header {
    display: flex;
    justify-content: space-between;
    background-color: #373d41;
    align-items: center;
    font-size: 20px;
    color: #fff;
  }

  .el-header .child1 {
    display: flex;
    align-items: center;
  }

  .el-header .el-dropdown-link {
    color: #fff;
    cursor: pointer;
  }

  .el-header .el-dropdown-link:hover {
    color: #66b1ff;
  }

  .el-dropdown-menu {
    min-width: 100px;
  }

  .el-aside {
    background-color: #333744;
  }

  .el-aside .el-menu {
    border-right: none;
  }


</style>
