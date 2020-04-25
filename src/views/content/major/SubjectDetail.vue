<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/subject_list'}">学科列表</el-breadcrumb-item>
      <el-breadcrumb-item>学科详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card class="subject_detail">
      <!--学科信息详情-->
      <el-form size="mini" label-width="65px" ref="subjectDetailFormRef"
               :model="subjectDetail" :rules="subjectDetailRules">
        <el-row>
          <el-col :span="8">
            <el-form-item label="学科名" prop="subject.subject_name">
              <el-input v-model="subjectDetail.subject.subject_name"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button style="margin: 0 10px" size="mini" type="primary" @click="saveSubjectDetail">保存修改</el-button>
          </el-col>
        </el-row>
        <!--题型列表区域-->
        <el-table size="mini" border stripe :data="subjectDetail.qTypeList">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="题型名" prop="q_type_name"></el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteQTypeById(scope.row.q_type_id)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-col align="center">
            <el-button size="medium" type="primary" @click="addQTypeDialogVisible = true">添加题型</el-button>
          </el-col>
        </el-row>
        <!--章节列表区域-->
        <el-table size="mini" border stripe :data="subjectDetail.chapterList">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="章节名" prop="chapter_name"></el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" icon="el-icon-delete"
                         @click="deleteChapterById(scope.row.chapter_id)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-col align="center">
            <el-button size="medium" type="primary" @click="addChapterDialogVisible = true">添加章节</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!--添加题型的对话框-->
    <el-dialog title="添加题型" width="650px"
               :visible.sync="addQTypeDialogVisible" @close="addQTypeDialogClosed">
      <el-form size="mini" label-width="100px" ref="addQTypeFormRef"
               :model="addQTypeForm" :rules="addQTypeFormRules">
        <el-form-item label="题型名称" prop="q_type_name">
          <el-input v-model="addQTypeForm.q_type_name"/>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer">
        <el-button type="primary" @click="addQType">确定</el-button>
        <el-button @click="addQTypeDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <!--添加章节的对话框-->
    <el-dialog title="添加章节" width="650px"
               :visible.sync="addChapterDialogVisible" @close="addChapterDialogClosed">
      <el-form size="mini" label-width="100px" ref="addChapterFormRef"
               :model="addChapterForm" :rules="addChapterFormRules">
        <el-form-item label="章节名称" prop="chapter_name">
          <el-input v-model="addChapterForm.chapter_name"/>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer">
        <el-button type="primary" @click="addChapter">确定</el-button>
        <el-button @click="addChapterDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "subject-detail",
    data() {
      return {
        //学科详情信息
        subjectDetail: {
          subject: {},
          qTypeList: [],
          chapterList: []
        },
        //修改学科详情的验证规则
        subjectDetailRules: {
          subject: {
            subject_name: [
              {required: true, message: '请输入学科名'}
            ]
          }
        },
        //控制添加题型对话框是否可见
        addQTypeDialogVisible: false,
        //添加题型的表单信息
        addQTypeForm: {
          q_type_name: ''
        },
        //添加题型表单信息的验证规则
        addQTypeFormRules: {
          q_type_name: [
            {required: true, message: '请输入题型名称'}
          ]
        },
        //控制添加章节对话框是否可见
        addChapterDialogVisible: false,
        //添加章节的表单信息
        addChapterForm: {
          chapter_name: ''
        },
        //添加章节表单信息的验证规则
        addChapterFormRules: {
          chapter_name: [
            {required: true, message: '请输入章节名称'}
          ]
        }
      }
    },
    methods: {
      //获取学科信息详情数据
      getSubjectDetail() {
        console.log("获取学科信息详情提交的数据：", this.$route.query.subject_id);//--------------------------------------
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {
              data: {
                subjectDetail: {
                  subject: {subject_id: 1, subject_name: "数据结构", category: "工学", major_id: 1},
                  qTypeList: [
                    {q_type_id: 1, q_type_name: "选择题", subject_id: 1},
                    {q_type_id: 2, q_type_name: "填空题", subject_id: 1},
                    {q_type_id: 3, q_type_name: "简答题", subject_id: 1}
                  ],
                  chapterList: [
                    {chapter_id: 1, chapter_name: "绪论", subject_id: 1},
                    {chapter_id: 2, chapter_name: "链表", subject_id: 1}
                  ]
                }
              },
              meta: {msg: "", status: 200}
            }
          };
          console.log("获取章节列表返回的数据：", res);//-----------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error('获取学科信息失败！');
          }
          this.subjectDetail = res.data.subjectDetail;
        }, 300);
      },
      //点击按钮发起保存学科信息请求
      saveSubjectDetail() {
        this.$refs.subjectDetailFormRef.validate(async (valid) => {
          if (!valid) return;
          //弹框询问用户是否保存修改
          const confirmResult = await this.$confirm('此操作将保存学科信息，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err);
          if (confirmResult !== 'confirm') {
            return this.$message.info('已取消！');
          }
          console.log("保存学科信息提交的数据：", this.subjectDetail);//--------------------------------------------------
          //模拟网络请求
          setTimeout(() => {
            const {data: res} = {
              data: {meta: {msg: "", status: 200}}
            };
            console.log("保存学科信息返回的数据：", res);//---------------------------------------------------------------
            if (res.meta.status !== 200) {
              return this.$message.error('保存学科信息失败！');
            }
            this.$message.success('保存学科信息成功！');
            this.getSubjectDetail();
          }, 300);
        });
      },
      //点击按钮发起根据id删除题型请求
      async deleteQTypeById(q_type_id) {
        //弹框询问用户是否保存修改
        const confirmResult = await this.$confirm('此操作将永久删除此题型，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消！');
        }
        console.log("根据id删除题型提交的信息：", q_type_id);//-----------------------------------------------------------
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {meta: {msg: "", status: 200}}
          };
          console.log("根据id删除题型返回的信息：", res);//---------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error('删除题型失败！');
          }
          this.$message.success('删除题型成功！');
          this.getSubjectDetail();
        }, 300);
      },
      //点击按钮发起根据id删除章节请求
      async deleteChapterById(chapter_id) {
        //弹框询问用户是否保存修改
        const confirmResult = await this.$confirm('此操作将永久删除此章节，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消！');
        }
        console.log("根据id删除章节提交的数据：", chapter_id);//----------------------------------------------------------
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {meta: {msg: "", status: 200}}
          };
          console.log("根据id删除章节返回的数据：", res);//---------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error('删除章节失败！');
          }
          this.$message.success('删除章节成功！');
          this.getSubjectDetail();
        }, 300);

      },
      //点击按钮发起添加题型请求
      addQType() {
        this.$refs.addQTypeFormRef.validate(async (valid) => {
          if (!valid) return;
          //弹框询问用户是否保存修改
          const confirmResult = await this.$confirm('此操作将添加此新题型，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err);
          if (confirmResult !== 'confirm') {
            return this.$message.info('已取消！');
          }
          console.log("添加题型提交的数据：", this.addQTypeForm);//-------------------------------------------------------
          //模拟网络请求
          setTimeout(() => {
            const {data: res} = {
              data: {meta: {msg: "", status: 200}}
            };
            console.log("添加题型返回的数据：", res);//-------------------------------------------------------------------
            if (res.meta.status !== 200) {
              return this.$message.error('添加题型失败！');
            }
            this.$message.success('添加题型成功！');
            this.addQTypeDialogVisible = false;
            this.getSubjectDetail();
          }, 300);
        });
      },
      //监听添加题型对话框关闭事件
      addQTypeDialogClosed() {
        this.$refs.addQTypeFormRef.resetFields();
      },
      //点击按钮发起添加章节请求
      addChapter() {
        this.$refs.addChapterFormRef.validate(async (valid) => {
          if (!valid) return;
          //弹框询问用户是否保存修改
          const confirmResult = await this.$confirm('此操作将添加此新章节，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err);
          if (confirmResult !== 'confirm') {
            return this.$message.info('已取消！');
          }
          console.log("添加章节提交的信息：", this.addChapterForm);//----------------------------------------------------
          //模拟网络请求
          setTimeout(() => {
            const {data: res} = {
              data: {meta: {msg: "", status: 200}}
            };
            console.log("添加章节返回的信息：", res);//------------------------------------------------------------------
            if (res.meta.status !== 200) {
              return this.$message.error('添加章节失败！');
            }
            this.$message.success('添加章节成功！');
            this.addChapterDialogVisible = false;
            this.getSubjectDetail();
          }, 300);
        });
      },
      //监听添加章节对话框关闭事件
      addChapterDialogClosed() {
        this.$refs.addChapterFormRef.resetFields();
      }
    },
    created() {
      this.getSubjectDetail();
    }
  }
</script>

<style scoped>
  .subject_detail div {
    font-size: 14px;
  }

  .subject_detail .el-row .el-button {
    margin-top: 10px;
  }
</style>