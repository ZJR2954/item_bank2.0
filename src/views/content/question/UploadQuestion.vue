<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>上传试题</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card class="upload_question">
      <!--试题信息-->
      <u-editor class="u_editor" v-model="uploadQuestionForm.q_content"/>
      <el-form size="mini" label-width="100px" ref="uploadQuestionFormRef"
               :model="uploadQuestionForm" :rules="uploadQuestionFormRules">
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="试题题型" prop="q_type">
              <el-select placeholder="请选择试题题型" v-model="uploadQuestionForm.q_type">
                <el-option v-for="item in qTypeList" :label="item.q_type_name" :key="item.q_type_id"
                           :value="item.q_type_name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属章节" prop="q_chapter">
              <el-select placeholder="请选择所属章节" v-model="uploadQuestionForm.q_chapter">
                <el-option v-for="item in chapterList" :key="item.chapter_id" :label="item.chapter_name"
                           :value="item.chapter_name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="试题难度" prop="difficulty">
              <el-select placeholder="请选择试题难度" v-model="uploadQuestionForm.difficulty">
                <el-option v-for="(item, index) in difficultyList" :key="index" :label="item"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="知识点">
              <el-input v-model="uploadQuestionForm.knowledge"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="试题答案" prop="answer">
              <el-input placeholder="请输入试题答案" type="textarea" v-model="uploadQuestionForm.answer"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col align="center">
            <el-button size="medium" type="primary" @click="saveQuestion">
              保存试题
            </el-button>
            <el-button size="medium" type="primary" :disabled="uploadQuestionForm.q_content == ''"
                       @click="submitExamine">
              提交审核
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import UEditor from '@/components/ueditor/UEditor'

  export default {
    name: "upload-question",
    components: {
      UEditor
    },
    data() {
      return {
        //题型列表
        qTypeList: [],
        //章节列表
        chapterList: [],
        //试题难度列表
        difficultyList: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        //上传试题表单信息
        uploadQuestionForm: {
          q_category: '',
          q_major: '',
          q_subject: '',
          q_chapter: '',
          q_type: '',
          q_content: '',
          difficulty: '',
          knowledge: '',
          answer: '',
          tags: '',
          q_state: null
        },
        //上传试题表单信息的验证规则
        uploadQuestionFormRules: {
          q_chapter: [
            {required: true, message: '请选择所属章节'}
          ],
          q_type: [
            {required: true, message: '请选择试题题型'}
          ],
          difficulty: [
            {required: true, message: '请选择试题难度'}
          ],
          answer: [
            {required: true, message: '请输入试题答案'}
          ]
        }
      }
    },
    methods: {
      //从vuex获取相关方法
      ...mapGetters(['getUser', 'getFacultyId']),
      //获取题型列表数据
      getQTypeList() {
        //网络请求
        this.$http.get('/subject/subject_list/' + this.getFacultyId() + '/1/1000').then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          res.data.data.rows.forEach((item) => {
            if (item.subject.subject_id == this.getUser().operate_subject) {
              this.qTypeList = item.questionTypes;
            }
          });
        });
      },
      //获取章节列表数据
      getChapterList() {
        //网络请求
        this.$http.get('/subject/subject_list/' + this.getFacultyId() + '/1/1000').then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error('获取章节列表失败！');
          }
          res.data.data.rows.forEach((item) => {
            if (item.subject.subject_id == this.getUser().operate_subject) {
              this.chapterList = item.characters;
              this.uploadQuestionForm.q_category = item.subject.category;
              this.uploadQuestionForm.q_subject = item.subject.subject_name;
              this.uploadQuestionForm.q_major = item.major.major_name;
            }
          });
        });
      },
      //点击按钮发起保存试题请求
      saveQuestion() {
        this.$refs.uploadQuestionFormRef.validate(async (valid) => {
          if (!valid) return;
          this.uploadQuestionForm.q_state = 4;
          this.uploadQuestionForm.tags = this.uploadQuestionForm.q_subject + ',' +
              this.uploadQuestionForm.q_chapter + ',' +
              this.uploadQuestionForm.q_type + ',' +
              this.uploadQuestionForm.knowledge;
          //网络请求
          this.$http.post('/question/save_question', this.uploadQuestionForm).then((res) => {
            if (res.data.code !== 200) {
              return this.$message.error(res.data.message);
            }
            this.$message.success(res.data.message);
            this.$router.push('/my_questions').catch(err => err);
          });
        });
      },
      //点击按钮发起提交审核试题请求
      submitExamine() {
        this.$refs.uploadQuestionFormRef.validate(async (valid) => {
          if (!valid) return;
          //弹框询问用户是否保存修改
          const confirmResult = await this.$confirm('此操作将提交审核试题信息，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err);
          if (confirmResult !== 'confirm') {
            return this.$message.info('已取消！');
          }
          this.uploadQuestionForm.q_state = 3;
          this.uploadQuestionForm.tags = this.uploadQuestionForm.q_subject + ',' +
              this.uploadQuestionForm.q_chapter + ',' +
              this.uploadQuestionForm.q_type + ',' +
              this.uploadQuestionForm.knowledge;
          //网络请求
          this.$http.post('/question/save_question', this.uploadQuestionForm).then((res) => {
            if (res.data.code !== 200) {
              return this.$message.error(res.data.message);
            }
            this.$message.success(res.data.message);
            this.$router.push('/my_questions').catch(err => err);
          });
        });
      }
    },
    created() {
      this.getQTypeList();
      this.getChapterList();
    }
  }
</script>

<style scoped>
  .upload_question .u_editor {
    margin-bottom: 10px;
  }

  .upload_question .el-row .el-button {
    margin: 10px 30px 0 30px;
  }
</style>