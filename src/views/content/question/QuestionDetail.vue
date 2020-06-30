<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>试题详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card class="question_detail">
      <!--试题信息详情-->
      <u-editor v-if="uEditorIsShow" class="u_editor" :readonly="isReadOnly" v-model="questionDetail.question.q_content"/>
      <el-form size="mini" label-width="100px" hide-required-asterisk ref="questionDetailFormRef"
               :model="questionDetail" :rules="questionDetailRules">
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="试题题型" prop="question.q_type">
              <el-select :disabled="isReadOnly" v-model="questionDetail.question.q_type">
                <el-option v-for="item in qTypeList" :label="item.q_type_name" :key="item.q_type_id"
                           :value="item.q_type_name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属章节" prop="question.q_chapter">
              <el-select :disabled="isReadOnly" v-model="questionDetail.question.q_chapter">
                <el-option v-for="item in chapterList" :key="item.chapter_id" :label="item.chapter_name"
                           :value="item.chapter_name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="试题难度" prop="question.difficulty">
              <el-select :disabled="isReadOnly" v-model="questionDetail.question.difficulty">
                <el-option v-for="(item, index) in difficultyList" :key="index" :label="item"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="知识点">
              <el-input :disabled="isReadOnly" v-model="questionDetail.question.knowledge"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="试题答案" prop="question.answer">
              <el-input :disabled="isReadOnly" type="textarea" v-model="questionDetail.question.answer"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="isExamine">
          <el-col :span="12">
            <el-form-item label="审核意见">
              <el-input placeholder="若试题未通过，请在此输入原因" v-model="questionDetail.question.opinion"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col align="right">
            <div>
              <div>试题id：{{questionDetail.question.q_id}}</div>
              <div>上传时间：{{questionDetail.question.upload_time}}</div>
              <div>
                试题状态：
                <span v-if="questionDetail.question.q_state == 1">通过</span>
                <span v-if="questionDetail.question.q_state == 2">未通过</span>
                <span v-if="questionDetail.question.q_state == 3">待审核</span>
                <span v-if="questionDetail.question.q_state == 4">未完成</span>
              </div>
              <div>上传者：{{questionDetail.user.name}}</div>
              <div v-if="questionDetail.question.q_state == 2">
                审核意见：{{questionDetail.question.opinion}}
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col align="center">
            <el-button v-if="!isReadOnly" size="medium" type="primary"
                       @click="saveQuestion">
              保存试题
            </el-button>
            <el-button v-if="!isReadOnly" size="medium"
                       :disabled="questionDetail.question.q_content == '' || questionDetail.question.q_state == 3"
                       @click="submitExamine">
              提交审核
            </el-button>
            <el-button v-if="questionDetail.question.q_state == 1" size="medium" type="primary"
                       :disabled="isInMyOption" @click="addToMyOption">
              加入我的选题
            </el-button>
            <el-button v-if="questionDetail.question.q_state == 1" size="medium"
                       :disabled="!isInMyOption" @click="removeQuestionById(questionDetail.question.q_id)">
              移出我的选题
            </el-button>
            <el-button v-if="isExamine" type="primary" size="medium"
                       @click="passExamine">
              通过
            </el-button>
            <el-button v-if="isExamine" size="medium"
                       @click="notPassExamine">
              未通过
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

  </div>
</template>

<script>
  import moment from 'moment'
  import {mapGetters, mapActions} from 'vuex'
  import UEditor from '@/components/ueditor/UEditor'

  export default {
    name: "question-detail",
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
        //试题详情信息
        questionDetail: {
          question: {},
          user: {}
        },
        //保存试题信息详情的验证规则
        questionDetailRules: {
          question: {
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
        },
        //是否只读
        isReadOnly: true,
        //是否在我的选题
        isInMyOption: false,
        //是否审核
        isExamine: false,
        uEditorIsShow: false
      }
    },
    computed: {},
    methods: {
      //从vuex获取相关方法
      ...mapGetters(['getUser', 'getUserType', 'getOption', 'getFacultyId']),
      ...mapActions(['saveOption']),
      //获取题型列表数据
      getQTypeList() {
        //网络请求
        this.$http.get('/subject/subject_list/' + this.getFacultyId() + '/1/1000').then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error('获取题型列表失败！');
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
            }
          });
        });
      },
      //获取试题信息详情数据
      async getQuestionDetail() {
        //数据获取后决定权限，此方法须同步化
        //网络请求
        const {data: res} = await this.$http.get('/question/question_detail/' + this.$route.query.q_id);
        if (res.code !== 200) {
          return this.$message.error(res.data.message);
        }
        this.questionDetail = res.data.questionDetail;
        this.questionDetail.question.upload_time = moment(new Date(this.questionDetail.question.upload_time)).format("YYYY-MM-DD HH:mm");
        this.powerManager();
        this.uEditorIsShow = true;
      },
      //点击按钮发起保存试题请求
      saveQuestion() {
        this.$refs.questionDetailFormRef.validate(async (valid) => {
          if (!valid) return;
          this.questionDetail.question.q_state = 4;
          this.questionDetail.question.upload_time = null;
          //网络请求
          this.$http.post('/question/save_question', this.questionDetail.question).then((res) => {
            if (res.data.code !== 200) {
              return this.$message.error(res.data.message);
            }
            this.$message.success(res.data.message);
            this.getQuestionDetail();
          });
        });
      },
      //点击按钮发起提交审核试题请求
      submitExamine() {
        this.$refs.questionDetailFormRef.validate(async (valid) => {
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
          this.questionDetail.question.q_state = 3;
          this.questionDetail.question.upload_time = null;
          //网络请求
          this.$http.post('/question/save_question', this.questionDetail.question).then((res) => {
            if (res.data.code !== 200) {
              return this.$message.error(res.data.message);
            }
            this.$message.success(res.data.message);
            this.$router.push('/my_questions').catch(err => err);
          });
        });
      },
      //点击按钮加入我的选题
      addToMyOption() {
        this.questionDetail.question.upload_time = null;
        let myOptions = this.getOption();
        myOptions.push(this.questionDetail.question);
        this.saveOption(myOptions);
        this.isInMyOption = true;
        this.$message.success('添加选题成功！');
      },
      //点击按钮根据id从我的选题中移除试题
      async removeQuestionById(q_id) {
        //弹框询问用户是否保存修改
        const confirmResult = await this.$confirm('此操作将从我的选题移除此试题，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消！');
        }
        let myOptions = this.getOption();
        for (let i = 0; i < myOptions.length; i++) {
          if (q_id == myOptions[i].q_id) {
            myOptions.splice(i, 1);
          }
        }
        this.saveOption(myOptions);
        this.isInMyOption = false;
        this.$message.success('移除试题成功！');
      },
      //点击按钮发起审核通过请求
      async passExamine() {
        //弹框询问用户是否保存修改
        const confirmResult = await this.$confirm('是否确定通过审核？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消！');
        }
        this.questionDetail.question.q_state = 1;
        this.questionDetail.question.upload_time = '';
        //网络请求
        this.$http.put('/question/examine_question', this.questionDetail.question).then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.$message.success(res.data.message);
          this.$router.push('/pending_questions').catch(err => err);
        });
      },
      //点击按钮发起审核未通过请求
      async notPassExamine() {
        //弹框询问用户是否保存修改
        const confirmResult = await this.$confirm('是否确定未通过审核？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消！');
        }
        if (this.questionDetail.question.opinion == null || this.questionDetail.question.opinion.trim().length == 0) {
          return this.$message.error('请填写审核意见！');
        }
        this.questionDetail.question.q_state = 2;
        this.questionDetail.question.upload_time = '';
        //网络请求
        this.$http.put('/question/examine_question', this.questionDetail.question).then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.$message.success(res.data.message);
          this.$router.push('/pending_questions').catch(err => err);
        });
      },
      //权限管理方法
      powerManager() {
        let user = this.getUser();
        let userType = this.getUserType();
        let userTypePowerList = userType.u_power ? userType.u_power.split(',') : [];
        let myOptions = this.getOption();
        for (let item of userTypePowerList) {
          if ('3' == item.trim() && this.questionDetail.question.u_id == user.u_id) {
            this.isReadOnly = false;
          }
          if ('6' == item.trim()) {
            this.isExamine = true;
          }
        }
        if (this.questionDetail.question.q_state == 1) this.isReadOnly = true;
        for (let item of myOptions) {
          if (this.questionDetail.question.q_id == item.q_id) {
            this.isInMyOption = true;
          }
        }
      },
    },
    created() {
      this.getQTypeList();
      this.getChapterList();
      this.getQuestionDetail();
    }
  }
</script>

<style scoped>
  .question_detail div {
    font-size: 14px;
  }

  .question_detail .u_editor {
    margin-bottom: 10px;
  }

  .question_detail .el-row .el-button {
    margin: 10px 30px 0 30px;
  }
</style>