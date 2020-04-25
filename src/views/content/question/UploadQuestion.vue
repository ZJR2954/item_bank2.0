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
          q_chapter: '',
          q_type: '',
          q_content: '',
          difficulty: '',
          knowledge: '',
          answer: ''
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
      //获取题型列表数据
      getQTypeList() {
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {
              data: {
                qTypeList: [
                  {q_type_id: 1, q_type_name: "选择题", subject_id: 1},
                  {q_type_id: 2, q_type_name: "填空题", subject_id: 1},
                  {q_type_id: 3, q_type_name: "简答题", subject_id: 1}
                ]
              },
              meta: {msg: "", status: 200}
            }
          };
          console.log("获取题型列表返回的数据：", res);//-----------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error('获取题型列表失败！');
          }
          this.qTypeList = res.data.qTypeList;
        }, 300);
      },
      //获取章节列表数据
      getChapterList() {
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {
              data: {
                chapterList: [
                  {chapter_id: 1, chapter_name: "绪论", subject_id: 1},
                  {chapter_id: 2, chapter_name: "链表", subject_id: 1}
                ]
              },
              meta: {msg: "", status: 200}
            }
          };
          console.log("获取章节列表返回的数据：", res);//-----------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error('获取章节列表失败！');
          }
          this.chapterList = res.data.chapterList;
        }, 300);
      },
      //点击按钮发起保存试题请求
      saveQuestion() {
        this.$refs.uploadQuestionFormRef.validate(async (valid) => {
          if (!valid) return;
          console.log("保存试题提交的数据：", this.uploadQuestionForm);//------------------------------------------------
          //模拟网络请求
          setTimeout(() => {
            const {data: res} = {
              data: {meta: {msg: "", status: 200}}
            };
            console.log("保存试题返回的数据：", res);//------------------------------------------------------------------
            if (res.meta.status !== 200) {
              return this.$message.error('保存失败！');
            }
            this.$message.success('保存成功！');
            this.$router.push('/my_questions').catch(err => err);
          }, 300);
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
          console.log("提交审核提交的数据：", this.uploadQuestionForm);//------------------------------------------------
          //模拟网络请求
          setTimeout(() => {
            const {data: res} = {
              data: {meta: {msg: "", status: 200}}
            };
            console.log("提交审核返回的数据：", res);//------------------------------------------------------------------
            if (res.meta.status !== 200) {
              return this.$message.error('提交失败！');
            }
            this.$message.success('提交成功！');
            this.$router.push('/my_questions').catch(err => err);
          }, 300);
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