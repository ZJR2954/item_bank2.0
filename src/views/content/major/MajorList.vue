<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>专业列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--&lt;!&ndash; 卡片视图区域 &ndash;&gt;-->
    <!--<el-card class="school_list">-->
      <!--&lt;!&ndash; 学校列表区域 &ndash;&gt;-->
      <!--<el-table border stripe :data="schoolList">-->
        <!--<el-table-column type="index" label="#"></el-table-column>-->
        <!--<el-table-column label="学校名" prop="school.school_name"></el-table-column>-->
        <!--<el-table-column label="管理员姓名" prop="user.name"></el-table-column>-->
        <!--<el-table-column label="管理员状态" prop="user.u_state"></el-table-column>-->
        <!--<el-table-column label="操作" width="180px">-->
          <!--<template slot-scope="scope">-->
            <!--<el-button type="danger" size="mini" icon="el-icon-delete"-->
                       <!--@click="deleteSchoolById(scope.row.school.school_id)">-->
              <!--删除-->
            <!--</el-button>-->
          <!--</template>-->
        <!--</el-table-column>-->
      <!--</el-table>-->
      <!--&lt;!&ndash; 分页区域 &ndash;&gt;-->
      <!--<el-row class="pagination">-->
        <!--<el-col :span="18">-->
          <!--<el-pagination layout="total, sizes, prev, pager, next, jumper"-->
                         <!--:total="total"-->
                         <!--:page-sizes="[5, 10, 30]"-->
                         <!--:page-size="queryInfo.pageSize"-->
                         <!--:current-page="queryInfo.pageNum"-->
                         <!--@size-change="handleSizeChange"-->
                         <!--@current-change="handleCurrentChange">-->
          <!--</el-pagination>-->
        <!--</el-col>-->
        <!--<el-col :span="6" align="right">-->
          <!--<el-button type="primary" size="medium" @click="addSchoolDialogVisible = true">添加学校</el-button>-->
        <!--</el-col>-->
      <!--</el-row>-->
    <!--</el-card>-->

    <!--&lt;!&ndash; 添加学校的对话框 &ndash;&gt;-->
    <!--<el-dialog title="添加学校" width="650px"-->
               <!--:visible.sync="addSchoolDialogVisible" @close="addSchoolDialogClosed">-->
      <!--<el-form size="mini" label-width="100px" ref="addSchoolFormRef" :model="addSchoolInfo"-->
               <!--:rules="addSchoolFormRules">-->
        <!--<el-form-item label="学校名称" prop="school_name">-->
          <!--<el-input v-model="addSchoolInfo.school_name"></el-input>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!--&lt;!&ndash; 底部区域 &ndash;&gt;-->
      <!--<span slot="footer">-->
        <!--<el-button type="primary" @click="addSchool">确定</el-button>-->
        <!--<el-button @click="addSchoolDialogVisible = false">取消</el-button>-->
      <!--</span>-->
    <!--</el-dialog>-->

  </div>
</template>

<script>
  export default {
    name: "major-list",
    data() {
      return {
        // //学校列表
        // schoolList: [],
        // //获取学校列表的参数对象
        // queryInfo: {
        //   query: '',
        //   // 当前的页数
        //   pageNum: 1,
        //   // 当前每页显示多少条数据
        //   pageSize: 1
        // },
        // //学校列表数据总数
        // total: 0,
        // //控制添加学校对话框是否可见
        // addSchoolDialogVisible: false,
        // //发布新通知的表单信息
        // addSchoolInfo: {
        //   school_name: ''
        // },
        // //发布新通知表单信息的验证规则
        // addSchoolFormRules: {
        //   school_name: [
        //     {required: true, message: '请输入学校名称', trigger: 'blur'}
        //   ]
        // }
      }
    },
    methods: {
      // //获取学校列表数据
      // getSchoolList() {
      //   //模拟网络请求
      //   const {data: res} = {
      //     data: {
      //       data: {
      //         total: 5,
      //         pageNum: 1,
      //         schoolList: [
      //           {school: {school_id: 1, school_name: "长江大学", u_id: 1}, user: {u_id: 1, name: "正经仁", u_state: "正常"}},
      //           {school: {school_id: 2, school_name: "清华大学", u_id: 2}, user: {u_id: 2, name: "李二狗", u_state: "正常"}},
      //           {school: {school_id: 3, school_name: "北京大学", u_id: 3}, user: {u_id: 3, name: "李三狗", u_state: "正常"}},
      //           {school: {school_id: 4, school_name: "华中科技大学", u_id: 4}, user: {u_id: 4, name: "李四狗", u_state: "限制登录"}},
      //           {school: {school_id: 5, school_name: "武汉大学", u_id: 5}, user: {u_id: 5, name: "李五狗", u_state: "正常"}}
      //         ]
      //       },
      //       meta: {msg: "", status: 200}
      //     }
      //   };
      //   if (res.meta.status !== 200) {
      //     return this.$message.error('获取学校列表失败！');
      //   }
      //   console.log(res);//---------------------------------------------------------------------------------------------
      //   this.schoolList = res.data.schoolList;
      //   this.total = res.data.total;
      // },
      // //监听pageSize改变
      // handleSizeChange(newSize) {
      //   this.queryInfo.pageSize = newSize;
      //   this.getSchoolList();
      // },
      // //监听页码值改变
      // handleCurrentChange(newCurrent) {
      //   this.queryInfo.pageNum = newCurrent;
      //   this.getSchoolList();
      // },
      // //点击按钮发起根据id删除学校请求
      // async deleteSchoolById(school_id) {
      //   //弹框询问用户是否保存修改
      //   const confirmResult = await this.$confirm('此操作将永久删除此学校及其关联的院系、专业、学科、试卷，是否继续？', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).catch(err => err);
      //   if (confirmResult !== 'confirm') {
      //     return this.$message.info('已取消删除');
      //   }
      //   const {data: res} = {
      //     data: {meta: {msg: "", status: 200}}
      //   };
      //   if (res.meta.status !== 200) {
      //     return this.$message.error('删除学校失败！');
      //   }
      //   console.log(res);//---------------------------------------------------------------------------------------------
      //   this.getSchoolList();
      // },
      // //点击按钮发起添加学校请求
      // addSchool() {
      //   this.$refs.addSchoolFormRef.validate(async (valid) => {
      //     if (!valid) return;
      //     //弹框询问用户是否保存修改
      //     const confirmResult = await this.$confirm('此操作将添加此新学校，是否继续？', '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }).catch(err => err);
      //     if (confirmResult !== 'confirm') {
      //       return this.$message.info('已取消添加');
      //     }
      //     const {data: res} = {
      //       data: {meta: {msg: "", status: 200}}
      //     };
      //     if (res.meta.status !== 200) {
      //       return this.$message.error('添加学校失败！');
      //     }
      //     console.log(res);//---------------------------------------------------------------------------------------------
      //     this.addSchoolDialogVisible = false;
      //     this.getSchoolList();
      //   });
      // },
      // //监听添加学校对话框关闭事件
      // addSchoolDialogClosed() {
      //   this.$refs.addSchoolFormRef.resetFields();
      // }
    },
    created() {
      // this.getSchoolList();
    }
  }
</script>

<style scoped>
  /*.school_list div {*/
    /*font-size: 14px;*/
  /*}*/

  /*.school_list .pagination .el-button {*/
    /*width: 180px;*/
    /*margin-top: 10px;*/
  /*}*/
</style>