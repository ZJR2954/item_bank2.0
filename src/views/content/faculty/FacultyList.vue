<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>院系列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card class="faculty_list">
      <!--院系列表区域-->
      <el-table border stripe :data="facultyList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="院系名" prop="faculty.faculty_name"></el-table-column>
        <el-table-column label="管理员姓名" prop="user.name"></el-table-column>
        <el-table-column label="管理员状态">
          <template slot-scope="scope">
            {{scope.row.user.u_state == 1 ? '正常' : '异常'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" icon="el-icon-delete"
                       @click="deleteFacultyById(scope.row.faculty.faculty_id)">
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
          <el-button type="primary" size="medium" @click="addFacultyDialogVisible = true">添加院系</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!--添加院系的对话框-->
    <el-dialog title="添加院系" width="650px"
               :visible.sync="addFacultyDialogVisible" @close="addFacultyDialogClosed">
      <el-form size="mini" label-width="100px" ref="addFacultyFormRef"
               :model="addFacultyForm" :rules="addFacultyFormRules">
        <el-form-item label="院系名称" prop="faculty_name">
          <el-input v-model="addFacultyForm.faculty_name"/>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer">
        <el-button type="primary" @click="addFaculty">确定</el-button>
        <el-button @click="addFacultyDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "faculty-list",
    data() {
      return {
        //从vuex获取相关方法
        ...mapGetters(['getSchoolId', 'getUser']),
        //院系列表
        facultyList: [],
        //获取院系列表的参数对象
        queryInfo: {
          query: '',
          // 当前的页数
          pageNum: 1,
          // 当前每页显示多少条数据
          pageSize: 5
        },
        //院系列表数据总数
        total: 0,
        //控制添加院系对话框是否可见
        addFacultyDialogVisible: false,
        //添加院系的表单信息
        addFacultyForm: {
          faculty_name: '',
          school: ''
        },
        //添加院系表单信息的验证规则
        addFacultyFormRules: {
          faculty_name: [
            {required: true, message: '请输入院系名称'}
          ]
        }
      }
    },
    methods: {
      //获取院系列表数据
      getFacultyList() {
        this.facultyList = [];
        //网络请求
        this.$http.get('/faculty/faculty_list/' + this.getUser().u_school + '/' + this.queryInfo.pageNum + '/' + this.queryInfo.pageSize).then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.facultyList = res.data.data.rows;
          this.total = res.data.data.total;
        });
      },
      //监听pageSize改变
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize;
        this.getFacultyList();
      },
      //监听页码值改变
      handleCurrentChange(newCurrent) {
        this.queryInfo.pageNum = newCurrent;
        this.getFacultyList();
      },
      //点击按钮发起根据id删除院系请求
      async deleteFacultyById(faculty_id) {
        //弹框询问用户是否保存修改
        const confirmResult = await this.$confirm('此操作将永久删除此院系及其关联的专业、学科、试卷，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消！');
        }
        //网络请求
        this.$http.delete('/faculty/delete_faculty/' + this.getUser().u_school + '/' + faculty_id).then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.$message.success(res.data.message);
          this.getFacultyList();
        });
      },
      //点击按钮发起添加院系请求
      addFaculty() {
        this.$refs.addFacultyFormRef.validate(async (valid) => {
          if (!valid) return;
          //弹框询问用户是否保存修改
          const confirmResult = await this.$confirm('此操作将添加此新院系，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err);
          if (confirmResult !== 'confirm') {
            return this.$message.info('已取消！');
          }
          this.addFacultyForm.school = this.getUser().u_school;
          //网络请求
          this.$http.post('/faculty/add_faculty', this.addFacultyForm).then((res) => {
            if (res.data.code !== 200) {
              return this.$message.error(res.data.message);
            }
            this.$message.success(res.data.message);
            this.addFacultyDialogVisible = false;
            this.getFacultyList();
          });
        });
      },
      //监听添加院系对话框关闭事件
      addFacultyDialogClosed() {
        this.$refs.addFacultyFormRef.resetFields();
      }
    },
    created() {
      this.getFacultyList();
    }
  }
</script>

<style scoped>
  .faculty_list div {
    font-size: 14px;
  }

  .faculty_list .pagination .el-button {
    width: 180px;
    margin-top: 10px;
  }
</style>