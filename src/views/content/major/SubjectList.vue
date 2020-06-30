<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学科列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card class="subject_list">
      <!--学科列表区域-->
      <el-table border stripe :data="subjectList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="学科名" prop="subject.subject_name"></el-table-column>
        <el-table-column label="所属专业" prop="major.major_name"></el-table-column>
        <el-table-column label="所属门类类别" prop="subject.category"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary"
                       @click="showSubjectDetail(scope.row)">
              详情
            </el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete"
                       @click="deleteSubjectById(scope.row.subject.subject_id)">
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
          <el-button size="medium" type="primary" @click="addSubjectDialogVisible = true">添加学科</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!--添加学科的对话框-->
    <el-dialog title="添加学科" width="650px"
               :visible.sync="addSubjectDialogVisible" @close="addSubjectDialogClosed">
      <el-form size="mini" label-width="120px" ref="addSubjectFormRef"
               :model="addSubjectForm" :rules="addSubjectFormRules">
        <el-form-item label="学科名称" prop="subject_name">
          <el-input v-model="addSubjectForm.subject_name"/>
        </el-form-item>
        <el-form-item label="所属专业" prop="major_id">
          <el-select v-model="addSubjectForm.major_id">
            <el-option v-for="item in majorList" :label="item.major_name" :key="item.major_id" :value="item.major_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属门类类别" prop="category">
          <el-select v-model="addSubjectForm.category">
            <el-option v-for="(item,index) in categoryList" :label="item" :key="index" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer">
        <el-button type="primary" @click="addSubject">确定</el-button>
        <el-button @click="addSubjectDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "subject-list",
    data() {
      return {
        //学科列表
        subjectList: [],
        //获取学科列表的参数对象
        queryInfo: {
          query: '',
          // 当前的页数
          pageNum: 1,
          // 当前每页显示多少条数据
          pageSize: 5
        },
        //学科列表数据总数
        total: 0,
        //控制添加学科对话框是否可见
        addSubjectDialogVisible: false,
        //添加新学科的表单信息
        addSubjectForm: {
          subject_name: '',
          major_id: null,
          category: ''
        },
        //专业列表
        majorList: [],
        //门类类别列表
        categoryList: ['哲学', '经济学', '法学', '教育学', '文学', '历史学', '理学', '工学', '农学', '医学', '军事学', '管理学', '艺术学'],
        //添加新学科表单信息的验证规则
        addSubjectFormRules: {
          subject_name: [
            {required: true, message: '请输入学科名称'}
          ],
          major_id: [
            {required: true, message: '请选择所属专业'}
          ],
          category: [
            {required: true, message: '请选择门类类别'}
          ]
        }
      }
    },
    methods: {
      //从vuex获取相关方法
      ...mapGetters(['getFacultyId']),
      //获取学科列表数据
      getSubjectList() {
        this.subjectList = [];
        //网络请求
        this.$http.get('/subject/subject_list/' + this.getFacultyId() + '/' + this.queryInfo.pageNum + '/' + this.queryInfo.pageSize).then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.subjectList = res.data.data.rows;
          this.total = res.data.data.total;
        });
      },
      //监听pageSize改变
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize;
        this.getSubjectList();
      },
      //监听页码值改变
      handleCurrentChange(newCurrent) {
        this.queryInfo.pageNum = newCurrent;
        this.getSubjectList();
      },
      //点击按钮显示学科信息详情
      showSubjectDetail(obj) {
        //跳转到详情页
        this.$router.push({
          path: '/subject_detail',
          query: {subject_id: obj.subject.subject_id}
        }).catch(err => err);
      },
      //获取专业列表数据
      getMajorList() {
        //网络请求
        this.$http.get('/major/major_list/' + this.getFacultyId()).then((res) => {
          if (res.data.code !== 200) {
          }
          this.majorList = [];
          res.data.data.forEach((item) => {
            this.majorList.push(item.major);
          });
        });
      },
      //点击按钮发起根据id删除学科请求
      async deleteSubjectById(subject_id) {
        //弹框询问用户是否保存修改
        const confirmResult = await this.$confirm('此操作将永久删除此学科及其关联的试卷，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除');
        }
        //网络请求
        this.$http.delete('/subject/delete_subject/' + this.getFacultyId() + '/' + subject_id).then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.$message.success(res.data.message);
          this.getSubjectList();
        });
      },
      //点击按钮发起添加学科请求
      addSubject() {
        this.$refs.addSubjectFormRef.validate(async (valid) => {
          if (!valid) return;
          //弹框询问用户是否保存修改
          const confirmResult = await this.$confirm('此操作将添加此新学科，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err);
          if (confirmResult !== 'confirm') {
            return this.$message.info('已取消添加');
          }
          //网络请求
          this.$http.post('/subject/add_subject/'+this.getFacultyId(), this.addSubjectForm).then((res)=> {
            if (res.data.code !== 200) {
              return this.$message.error(res.data.message);
            }
            this.$message.success(res.data.message);
            this.addSubjectDialogVisible = false;
            this.getSubjectList();
          });
        });
      },
      //监听添加学科对话框关闭事件
      addSubjectDialogClosed() {
        this.$refs.addSubjectFormRef.resetFields();
      }
    },
    created() {
      this.getSubjectList();
      this.getMajorList();
    }
  }
</script>

<style scoped>
  .subject_list div {
    font-size: 14px;
  }

  .subject_list .pagination .el-button {
    width: 180px;
    margin-top: 10px;
  }
</style>