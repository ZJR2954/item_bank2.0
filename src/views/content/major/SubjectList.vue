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
          pageSize: 1
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
      //获取学科列表数据
      getSubjectList() {
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {
              data: {
                total: 3,
                pageNum: 1,
                subjectList: [
                  {
                    subject: {subject_id: 1, subject_name: "数据结构", category: "工学", major_id: 1},
                    major: {major_id: 1, major_name: "计算机科学与技术", faculty_id: 1},
                    qTypeList: [
                      {q_type_id: 1, q_type_name: "选择题", subject_id: 1},
                      {q_type_id: 2, q_type_name: "填空题", subject_id: 1},
                      {q_type_id: 3, q_type_name: "简答题", subject_id: 1}
                    ]
                  },
                  {
                    subject: {subject_id: 2, subject_name: "计算机网络", category: "工学", major_id: 4},
                    major: {major_id: 4, major_name: "网络工程", faculty_id: 1},
                    qTypeList: [
                      {q_type_id: 4, q_type_name: "选择题", subject_id: 1},
                      {q_type_id: 5, q_type_name: "填空题", subject_id: 1},
                      {q_type_id: 6, q_type_name: "简答题", subject_id: 1}
                    ]
                  },
                  {
                    subject: {subject_id: 3, subject_name: "计算机组成原理及应用", category: "工学", major_id: 3},
                    major: {major_id: 3, major_name: "物联网工程", faculty_id: 1},
                    qTypeList: [
                      {q_type_id: 7, q_type_name: "选择题", subject_id: 1},
                      {q_type_id: 8, q_type_name: "填空题", subject_id: 1},
                      {q_type_id: 9, q_type_name: "简答题", subject_id: 1}
                    ]
                  },
                ]
              },
              meta: {msg: "", status: 200}
            }
          };
          console.log("获取学科列表返回的数据：", res);//-----------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error('获取学科列表失败！');
          }
          this.subjectList = res.data.subjectList;
          this.total = res.data.total;
        }, 300);
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
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {
              data: {
                majorList: [
                  {major_id: 1, major_name: "计算机科学与技术", faculty_id: 1},
                  {major_id: 2, major_name: "软件工程", faculty_id: 1},
                  {major_id: 3, major_name: "物联网工程", faculty_id: 1},
                  {major_id: 4, major_name: "网络工程", faculty_id: 1}
                ]
              },
              meta: {msg: "", status: 200}
            }
          };
          console.log("获取专业列表返回的数据：", res);//-----------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error('获取专业列表失败！');
          }
          this.majorList = res.data.majorList;
        }, 300);
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
        console.log("根据id删除学科提交的数据：", subject_id);//----------------------------------------------------------
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {meta: {msg: "", status: 200}}
          };
          console.log("根据id删除学科返回的数据：", res);//---------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error('删除学科失败！');
          }
          this.$message.success('删除学科成功！');
          this.getSubjectList();
        }, 300);
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
          console.log("添加学科提交的数据：", this.addSubjectForm);//-----------------------------------------------------
          //模拟网络请求
          setTimeout(() => {
            const {data: res} = {
              data: {meta: {msg: "", status: 200}}
            };
            console.log("添加学科返回的数据：", res);//-------------------------------------------------------------------
            if (res.meta.status !== 200) {
              return this.$message.error('添加学科失败！');
            }
            this.$message.success('添加学科成功！');
            this.addSubjectDialogVisible = false;
            this.getSubjectList();
          }, 300);
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