<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学校列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card class="school_list">
      <!--学校列表区域-->
      <el-table border stripe :data="schoolList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="学校名" prop="school.school_name"></el-table-column>
        <el-table-column label="管理员姓名" prop="user.name"></el-table-column>
        <el-table-column label="管理员状态">
          <template slot-scope="scope">
            {{scope.row.user.u_state == 1 ? '正常' : '异常'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" icon="el-icon-delete"
                       @click="deleteSchoolById(scope.row.school.school_id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-row class="pagination">
        <el-col :span="18">
          <el-pagination layout="total, sizes, prev, pager, next, jumper"
                         :total="total" :page-sizes="[5, 10, 30]"
                         :page-size="queryInfo.pageSize" :current-page="queryInfo.pageNum"
                         @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
        </el-col>
        <el-col :span="6" align="right">
          <el-button size="medium" type="primary" @click="addSchoolDialogVisible = true">添加学校</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!--添加学校的对话框-->
    <el-dialog title="添加学校" width="650px"
               :visible.sync="addSchoolDialogVisible" @close="addSchoolDialogClosed">
      <el-form size="mini" label-width="100px" ref="addSchoolFormRef"
               :model="addSchoolForm" :rules="addSchoolFormRules">
        <el-form-item label="学校名称" prop="school_name">
          <el-input v-model="addSchoolForm.school_name"/>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer">
        <el-button type="primary" @click="addSchool">确定</el-button>
        <el-button @click="addSchoolDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "school-list",
    data() {
      return {
        //学校列表
        schoolList: [],
        //获取学校列表的参数对象
        queryInfo: {
          query: '',
          // 当前的页数
          pageNum: 1,
          // 当前每页显示多少条数据
          pageSize: 5
        },
        //学校列表数据总数
        total: 0,
        //控制添加学校对话框是否可见
        addSchoolDialogVisible: false,
        //添加学校的表单信息
        addSchoolForm: {
          school_name: ''
        },
        //添加学校表单信息的验证规则
        addSchoolFormRules: {
          school_name: [
            {required: true, message: '请输入学校名称'}
          ]
        }
      }
    },
    methods: {
      //获取学校列表数据
      getSchoolList() {
        this.schoolList = [];
        //网络请求
        this.$http.get('/school/school_list/' + this.queryInfo.pageNum + '/' + this.queryInfo.pageSize).then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.schoolList = res.data.data.rows;
          this.total = res.data.data.total;
        });
      },
      //监听pageSize改变
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize;
        this.getSchoolList();
      },
      //监听页码值改变
      handleCurrentChange(newCurrent) {
        this.queryInfo.pageNum = newCurrent;
        this.getSchoolList();
      },
      //点击按钮发起根据id删除学校请求
      async deleteSchoolById(school_id) {
        //弹框询问用户是否保存修改
        const confirmResult = await this.$confirm('此操作将永久删除此学校及其关联的院系、专业、学科、试卷，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消！');
        }
        //网络请求
        this.$http.delete('/school/delete_school/' + school_id).then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.$message.success(res.data.message);
          this.getSchoolList();
        });
      },
      //点击按钮发起添加学校请求
      addSchool() {
        this.$refs.addSchoolFormRef.validate(async (valid) => {
          if (!valid) return;
          //弹框询问用户是否保存修改
          const confirmResult = await this.$confirm('此操作将添加此新学校，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err);
          if (confirmResult !== 'confirm') {
            return this.$message.info('已取消添加');
          }
          //网络请求
          this.$http.post('/school/add_school', this.addSchoolForm).then((res) => {
            if (res.data.code !== 200) {
              return this.$message.error(res.data.message);
            }
            this.$message.success(res.data.message);
            this.addSchoolDialogVisible = false;
            this.getSchoolList();
          });
        });
      },
      //监听添加学校对话框关闭事件
      addSchoolDialogClosed() {
        this.$refs.addSchoolFormRef.resetFields();
      }
    },
    created() {
      this.getSchoolList();
    }
  }
</script>

<style scoped>
  .school_list div {
    font-size: 14px;
  }

  .school_list .pagination .el-button {
    width: 180px;
    margin-top: 10px;
  }
</style>