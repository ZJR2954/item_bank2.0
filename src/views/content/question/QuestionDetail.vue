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
      <u-editor class="u_editor" :readonly="isReadOnly" v-model="questionDetail.question.q_content"/>
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
              <div>试题状态：{{questionDetail.question.q_state}}</div>
              <div>上传者：{{questionDetail.user.name}}</div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col align="center">
            <el-button v-if="!isReadOnly" size="medium" type="primary"
                       @click="saveQuestion">
              保存试题
            </el-button>
            <el-button v-if="!isReadOnly" size="medium" :disabled="questionDetail.question.q_content == ''"
                       @click="submitExamine">
              提交审核
            </el-button>
            <el-button v-if="questionDetail.question.q_state == '通过'" size="medium" type="primary"
                       :disabled="isInMyOption" @click="addToMyOption">
              加入我的选题
            </el-button>
            <el-button v-if="questionDetail.question.q_state == '通过'" size="medium"
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
        isExamine: false
      }
    },
    computed: {},
    methods: {
      //从vuex获取相关方法
      ...mapGetters(['getUser', 'getUserType', 'getOption']),
      ...mapActions(['saveOption']),
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
      //获取试题信息详情数据
      async getQuestionDetail() {
        //数据获取后决定权限，此方法须同步化
        console.log("获取试题信息详情提交的数据：", this.$route.query.q_id);//--------------------------------------------
        //模拟网络请求
        const {data: res} = {
          data: {
            data: {
              questionDetail: {
                question: {
                  q_id: 1,
                  q_category: "工学",
                  q_major: "计算机科学与技术",
                  q_subject: "数据结构",
                  q_chapter: "链表",
                  q_state: "通过",
                  q_type: "选择题",
                  q_content: "<p>\n" +
                  "    在一个单链表head中，若要在指针p所指结点后插入一个q指针所指结点，则执行_____。\n" +
                  "</p>\n" +
                  "<p>\n" +
                  "    A. p-&gt;next=q-&gt;next; q-&gt;next=p;\n" +
                  "</p>\n" +
                  "<p>\n" +
                  "    B. q-&gt;next=p-&gt;next; p=q;\n" +
                  "</p>\n" +
                  "<p>\n" +
                  "    C. p-&gt;next=q-&gt;next; p-&gt;next=q;\n" +
                  "</p>\n" +
                  "<p>\n" +
                  "    D. q-&gt;next=p-&gt;next; p-&gt;next=q;\n" +
                  "</p>",
                  q_img_url: "",
                  difficulty: 0.9,
                  knowledge: "链表",
                  tags: "链表",
                  answer: "D",
                  upload_time: "2020-01-18 15:00",
                  opinion: "",
                  u_id: 4
                },
                user: {
                  u_id: 5,
                  u_type: 5,
                  u_school: "长江大学",
                  u_faculty: "计算机科学学院",
                  job_number: "555555555",
                  name: "李五",
                  id_number: "555555555",
                  email: "5555555555@qq.com",
                  telephone: "55555555555",
                  operate_subject: 1,
                  u_state: "正常"
                }
              }
            },
            meta: {msg: "", status: 200}
          }
        };
        if(this.$route.query.q_id != 1) {
          res.data.questionDetail.question.q_state = "待审核";
        }
        console.log("获取试题信息详情返回的数据：", res);//---------------------------------------------------------------
        if (res.meta.status !== 200) {
          return this.$message.error('获取试题信息失败！');
        }
        this.questionDetail = res.data.questionDetail;
      },
      //点击按钮发起保存试题请求
      saveQuestion() {
        this.$refs.questionDetailFormRef.validate(async (valid) => {
          if (!valid) return;
          console.log("保存试题提交的数据：", this.questionDetail.question);//-------------------------------------------
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
          }, 300);
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
      },
      //点击按钮加入我的选题
      addToMyOption() {
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
        console.log("通过审核提交的数据：", {q_id: this.questionDetail.question.q_id});//--------------------------------
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {meta: {msg: "", status: 200}}
          };
          console.log("通过审核返回的数据：", res);//--------------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error('审核失败！');
          }
          this.$message.success('审核成功！');
          this.$router.push('/pending_questions').catch(err => err);
        }, 300);
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
        if (this.questionDetail.question.opinion.trim().length == 0) {
          return this.$message.error('请填写审核意见！');
        }
        console.log("未通过审核提交的数据：", {
          q_id: this.questionDetail.question.q_id,
          opinion: this.questionDetail.question.opinion
        });//-----------------------------------------------------------------------------------------------------------
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {meta: {msg: "", status: 200}}
          };
          console.log("未通过审核返回的数据：", res);//-------------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error('审核失败！');
          }
          this.$message.success('审核成功！');
          this.$router.push('/pending_questions').catch(err => err);
        }, 300);
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
        if (this.questionDetail.question.q_state == "通过") this.isReadOnly = true;
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
      this.powerManager();
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