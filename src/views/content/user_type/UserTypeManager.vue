<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户类型管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="user_type_list">
      <!-- 用户类型列表区域 -->
      <el-table border stripe :data="userTypeList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="用户类型名" prop="u_type_name"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="showUserTypeDetail(scope.row)">
              详情
            </el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteUserTypeById(scope.row.u_type)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部区域 -->
      <el-row>
        <el-col align="center">
          <el-button size="medium" type="primary" @click="addUserTypeDialogVisible = true">添加用户类型</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 用户类型详情对话框 -->
    <el-dialog class="user_type_detail" :title="'用户类型名：' + userTypeDetail.u_type_name" width="650px"
               :visible.sync="userTypeDialogVisible" @close="userTypeDetailClosed">
      <el-table size="mini" height="300px" :data="userPowerList" ref="userTypeDetailRef"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="35px"></el-table-column>
        <el-table-column label="#" prop="index" width="45px"></el-table-column>
        <el-table-column label="权限描述" width="150px" prop="desc"></el-table-column>
        <el-table-column label="系统功能" prop="power"></el-table-column>
      </el-table>
      <!-- 底部区域 -->
      <span slot="footer">
        <el-button type="primary" @click="saveUserTypeInfo">保存</el-button>
        <el-button @click="userTypeDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 添加用户类型的对话框 -->
    <el-dialog title="添加用户类型" width="650px"
               :visible.sync="addUserTypeDialogVisible" @close="addUserTypeDialogClosed">
      <el-form size="mini" label-width="120px" ref="addUserTypeFormRef"
               :model="addUserTypeForm" :rules="addUserTypeFormRules">
        <el-form-item label="用户类型名称" prop="u_type_name">
          <el-input v-model="addUserTypeForm.u_type_name"/>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer">
        <el-button type="primary" @click="addUserType">确定</el-button>
        <el-button @click="addUserTypeDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "user-type-manager",
    data() {
      return {
        //用户类型列表
        userTypeList: [],
        //控制用户类型详情对话框是否可见
        userTypeDialogVisible: false,
        //用户类型详情信息
        userTypeDetail: {},
        //用户类型详情权限列表
        userTypePowerList: [],
        //用户权限功能列表
        userPowerList: [
          {id: 1, desc: '系统最低权限', power: '登录、查询个人信息、修改个人信息'},
          {id: 2, desc: '系统基本权限', power: '接收通知'},
          {id: 3, desc: '命题功能的基本权限', power: '上传试题、查询本人试题信息、修改本人试题信息、删除本人试题'},
          {id: 4, desc: '访问题库的基本权限', power: '检索试题、查询题库试题信息、申报错误'},
          {id: 5, desc: '组卷功能的基本权限', power: '加入我的选题、组卷、查看本人试卷信息、修改本人试卷信息、下载本人试卷、删除本人试卷'},
          {id: 6, desc: '审核试题的基本权限', power: '查询待审核试题信息、审核试题'},
          {id: 7, desc: '管理用户的基本权限', power: '检索用户、查询用户信息、删除用户、注册用户'},
          {id: 8, desc: '管理专业、学科、题型以及章节的基本权限', power: '增加专业、删除专业、增加学科、查询学科信息、在学科增加题型、章节、在学科删除题型、章节、删除学科'},
          {id: 9, desc: '管理院系的基本权限', power: '增加院系、删除院系'},
          {id: 10, desc: '管理通知的基本权限', power: '发布通知、删除通知'},
          {id: 11, desc: '管理学校的基本权限', power: '增加学校、删除学校'}
        ],
        //控制添加用户类型对话框是否可见
        addUserTypeDialogVisible: false,
        //添加用户类型的表单信息
        addUserTypeForm: {
          u_type_name: ''
        },
        //添加用户类型表单信息的验证规则
        addUserTypeFormRules: {
          u_type_name: [
            {required: true, message: '请输入用户类型名称'}
          ]
        }
      }
    },
    methods: {
      //获取用户类型列表数据
      getUserTypeList() {
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {
              data: {
                userTypeList: [
                  {u_type: 2, u_type_name: "校级管理员", u_power: "1, 7, 9, 10"},
                  {u_type: 3, u_type_name: "院级管理员", u_power: "1, 2, 7, 8"},
                  {u_type: 4, u_type_name: "命题教师", u_power: "1, 2, 3, 4, 5"},
                  {u_type: 5, u_type_name: "审核教师", u_power: "1, 2, 6"}
                ]
              },
              meta: {msg: "", status: 200}
            }
          };
          console.log("获取用户类型列表返回的数据：", res);//-------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error("获取用户类型列表失败！");
          }
          this.userTypeList = res.data.userTypeList;
        }, 300);
      },
      //点击按钮发起根据id删除用户类型请求
      async deleteUserTypeById(u_type) {
        //弹框询问用户是否保存修改
        const confirmResult = await this.$confirm('此操作将永久删除此用户类型，与之关联的用户将变为最低权限类型的用户，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消！');
        }
        console.log("根据id删除用户类型提交的数据：", u_type);//----------------------------------------------------------
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {meta: {msg: "", status: 200}}
          };
          console.log("根据id删除用户类型返回的数据：", res);//-----------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error('删除用户类型失败！');
          }
          this.$message.success("删除用户类型成功！");
          this.getUserTypeList();
        }, 300);
      },
      //点击按钮显示用户类型详情对话框
      showUserTypeDetail(obj) {
        //乞丐版深拷贝
        this.userTypeDetail = JSON.parse(JSON.stringify(obj));
        let userTypePowerList = this.userTypeDetail.u_power ? this.userTypeDetail.u_power.split(',') : [];
        for (let item1 of userTypePowerList) {
          for (let item2 of this.userPowerList) {
            if (item1.trim() == item2.id) {
              this.userTypePowerList.push(item2);
            }
          }
        }
        this.userTypeDialogVisible = true;
        //刷新dom
        this.$nextTick(() => {
          this.toggleSelection(this.userTypePowerList);
        });
      },
      //控制用户类型权限列表选中
      toggleSelection(rows) {
        this.$refs.userTypeDetailRef.clearSelection();
        if (rows) {
          rows.forEach(row => {
            this.$refs.userTypeDetailRef.toggleRowSelection(row, true);
          });
        }
      },
      //监听用户类型详情权限列表改变事件
      handleSelectionChange(val) {
        this.userTypePowerList = val;
      },
      //点击按钮发起修改用户类型权限请求
      async saveUserTypeInfo() {
        //弹框询问用户是否保存修改
        const confirmResult = await this.$confirm('此操作将修改用户类型权限，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消！');
        }
        console.log("修改用户类型权限提交的数据：", this.userTypePowerList);//--------------------------------------------
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {meta: {msg: "", status: 200}}
          };
          console.log("修改用户类型权限返回的数据：", res);//-------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error('修改用户类型权限失败！');
          }
          this.$message.success('修改用户类型权限成功！');
          this.userTypeDialogVisible = false;
          this.getUserTypeList();
        }, 300);
      },
      //监听用户类型详情对话框关闭事件
      userTypeDetailClosed() {
        this.userTypePowerList = [];
      },
      //点击按钮发起添加用户类型请求
      addUserType() {
        this.$refs.addUserTypeFormRef.validate(async (valid) => {
          if (!valid) return;
          //弹框询问用户是否保存修改
          const confirmResult = await this.$confirm('此操作将添加此新用户类型，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err);
          if (confirmResult !== 'confirm') {
            return this.$message.info('已取消！');
          }
          console.log("添加用户类型提交的数据：", this.addUserTypeForm);//------------------------------------------------
          //模拟网络请求
          setTimeout(() => {
            const {data: res} = {
              data: {meta: {msg: "", status: 200}}
            };
            console.log("添加用户类型返回的数据：", res);//---------------------------------------------------------------
            if (res.meta.status !== 200) {
              return this.$message.error('添加用户类型失败！');
            }
            this.$message.success('添加用户类型成功！');
            this.addUserTypeDialogVisible = false;
            this.getUserTypeList();
          }, 300);
        });
      },
      //监听添加用户类型对话框关闭事件
      addUserTypeDialogClosed() {
        this.$refs.addUserTypeFormRef.resetFields();
      }
    },
    created() {
      this.getUserTypeList();
    }
  }
</script>

<style scoped>
  .user_type_list div {
    font-size: 14px;
  }

  .user_type_detail .el-table {
    margin: 0;
  }

  .user_type_list .el-row .el-button {
    margin-top: 10px;
  }
</style>