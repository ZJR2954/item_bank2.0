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
              <el-input disabled v-model="subjectDetail.subject.subject_name"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button v-if="false" style="margin: 0 10px" size="mini" type="primary" @click="saveSubjectDetail">保存修改
            </el-button>
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
  import {mapGetters} from 'vuex'

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
          q_type_name: '',
          subject_id: null
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
          chapter_name: '',
          subject_id: null
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
      //从vuex获取相关方法
      ...mapGetters(['getFacultyId']),
      //获取学科信息详情数据
      getSubjectDetail() {
        //网络请求
        this.$http.get('/subject/subject_list/' + this.getFacultyId() + '/1/1000').then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error('获取学科信息失败！');
          }
          res.data.data.rows.forEach((item) => {
            if (item.subject.subject_id == this.$route.query.subject_id) {
              this.subjectDetail.subject = item.subject;
              this.subjectDetail.chapterList = item.characters;
              this.subjectDetail.qTypeList = item.questionTypes;
            }
          });
        });
      },
      //点击按钮发起保存学科信息请求-------此方法暂时未使用
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
        //网络请求
        this.$http.delete('/subject/delete_q_type/' + this.getFacultyId() + '/' + q_type_id).then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.$message.success(res.data.message);
          this.getSubjectDetail();
        });
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
        //网络请求
        this.$http.delete('/subject/delete_chapter/' + this.getFacultyId() + '/' + chapter_id).then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.$message.success(res.data.message);
          this.getSubjectDetail();
        });
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
          this.addQTypeForm.subject_id = this.$route.query.subject_id;
          //网络请求
          this.$http.post('/subject/add_q_type/' + this.getFacultyId(), this.addQTypeForm).then((res) => {
            if (res.data.code !== 200) {
              return this.$message.error(res.data.message);
            }
            this.$message.success(res.data.message);
            this.addQTypeDialogVisible = false;
            this.getSubjectDetail();
          });
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
          this.addChapterForm.subject_id = this.$route.query.subject_id;
          //网络请求
          this.$http.post('/subject/add_chapter/' + this.getFacultyId(), this.addChapterForm).then((res) => {
            if (res.data.code !== 200) {
              return this.$message.error(res.data.message);
            }
            this.$message.success(res.data.message);
            this.addChapterDialogVisible = false;
            this.getSubjectDetail();
          });
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