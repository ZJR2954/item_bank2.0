<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>组卷</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <!--<el-card>-->
      <!--<div class="title">自动组卷</div>-->
      <!--<el-form size="mini" label-width="150px" ref="autoMakeExamPaperFormRef" :model="autoMakeExamPaperForm">-->
        <!--<el-row>-->
          <!--<el-col :span="8">-->
            <!--<el-form-item label="试卷标题">-->
              <!--<el-input placeholder="请输入试卷标题" v-model="autoMakeExamPaperForm.e_title" clearable/>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
        <!--</el-row>-->
        <!--<el-divider/>-->
        <!--<el-row>-->
          <!--<el-col>-->
            <!--<el-row v-for="(item, index) in autoMakeExamPaperForm.qTypeList" :key="item.q_type_id">-->
              <!--<el-col>-->
                <!--<el-form-item :label="item.q_type_name + ' 题量'">-->
                  <!--<el-input-number v-model="autoMakeExamPaperForm.qNum[index]" @change="qNumChanged"/>-->
                <!--</el-form-item>-->
              <!--</el-col>-->
            <!--</el-row>-->
          <!--</el-col>-->
        <!--</el-row>-->
        <!--<el-divider/>-->
        <!--<el-row v-for="(item1, index1) in autoMakeExamPaperForm.qSection" :key="index1">-->
          <!--<el-col>-->
            <!--<el-row>-->
              <!--<el-col :span="4" align="center">-->
                <!--<el-form-item label="从" label-width="40px">-->
                  <!--<el-input disabled type="number" v-model="item1.start"/>-->
                <!--</el-form-item>-->
              <!--</el-col>-->
              <!--<el-col :span="2" align="center">~</el-col>-->
              <!--<el-col :span="3">-->
                <!--<el-form-item label-width="0">-->
                  <!--<el-input :disabled="index1 != autoMakeExamPaperForm.qSection.length - 1" type="number"-->
                            <!--min="1" :max="autoMakeExamPaperForm.qNumTotal" v-model="item1.end"/>-->
                <!--</el-form-item>-->
              <!--</el-col>-->
              <!--<el-col :span="7">-->
                <!--<el-form-item label="题试题难度" label-width="100px">-->
                  <!--<el-select v-model="item1.difficulty">-->
                    <!--<el-option v-for="(item2, index2) in difficultyList" :label="item2" :key="index2"-->
                               <!--:value="item2">-->
                    <!--</el-option>-->
                  <!--</el-select>-->
                <!--</el-form-item>-->
              <!--</el-col>-->
              <!--<el-col :span="4" align="center">-->
                <!--<el-button v-if="index1 == 0" size="mini"-->
                           <!--@click="addQuestionSection(autoMakeExamPaperForm.qSection.length)">-->
                  <!--添加-->
                <!--</el-button>-->
                <!--<el-button v-if="index1 != 0" size="mini" @click="removeQuestionSection(index1)">-->
                  <!--删除-->
                <!--</el-button>-->
              <!--</el-col>-->
            <!--</el-row>-->
          <!--</el-col>-->
        <!--</el-row>-->
        <!--<el-divider/>-->
        <!--<el-row>-->
          <!--<el-col align="center">-->
            <!--<el-button type="primary" size="medium">立即组卷</el-button>-->
          <!--</el-col>-->
        <!--</el-row>-->
      <!--</el-form>-->
    <!--</el-card>-->

    <!--卡片视图区域-->
    <el-card>
      <div class="title">手动组卷</div>
      <el-form size="mini" label-width="100px" ref="manualMakeExamPaperFormRef"
               :model="manualMakeExamPaperForm" :rules="manualMakeExamPaperFormRules">
        <el-row>
          <el-col :span="8">
            <el-form-item label="试卷标题" prop="examPaper.e_title">
              <el-input placeholder="请输入试卷标题" v-model="manualMakeExamPaperForm.examPaper.e_title" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <div>
          组卷所用试题来自“我的试题”
        </div>
        <el-row>
          <el-col align="center">
            <el-button type="primary" size="medium" @click="makeExamPaper">立即组卷</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "make-exam-paper",
    data() {
      return {
        //题型列表
        qTypeList: [],
        //试题难度列表
        difficultyList: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        //自动组卷表单数据
        autoMakeExamPaperForm: {
          e_title: '',
          e_subject: '',
          qTypeList: [],
          qNum: [],
          qNumTotal: 0,
          qSection: []
        },
        //手动组卷表单数据
        manualMakeExamPaperForm: {
          examPaper: {
            e_title: '',
            e_subject: '',
            finish_type: '手动组卷'
          },
          questionList: []
        },
        //手动组卷表单数据验证规则
        manualMakeExamPaperFormRules: {
          examPaper: {
            e_title: [
              {required: true, message: '请输入试卷标题'}
            ]
          }
        }
      }
    },
    methods: {
      //从vuex获取相关方法
      ...mapGetters(['getUser', 'getFacultyId', 'getOption']),
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
              this.manualMakeExamPaperForm.examPaper.e_subject = item.subject.subject_name;
              this.autoMakeExamPaperForm.e_subject = item.subject.subject_name;
            }
          });
          this.autoMakeExamPaperForm.qTypeList = this.qTypeList;
          for (let i = 0; i < this.autoMakeExamPaperForm.qTypeList.length; i++) {
            this.autoMakeExamPaperForm.qNum[i] = 0;
          }
          this.autoMakeExamPaperForm.qSection.push({
            start: 1,
            end: this.autoMakeExamPaperForm.qNumTotal,
            difficulty: null
          })
        });
      },
      //监听题量改变
      qNumChanged() {
        let sum = 0;
        for (let item of this.autoMakeExamPaperForm.qNum) {
          sum += item;
        }
        this.autoMakeExamPaperForm.qNumTotal = sum;
      },
      //添加试题难度区间
      addQuestionSection(qSectionLength) {
        this.autoMakeExamPaperForm.qSection.push({
          start: this.autoMakeExamPaperForm.qSection[qSectionLength - 1].end,
          end: this.autoMakeExamPaperForm.qNumTotal,
          difficulty: null
        });
      },
      //移除试题难度区间
      removeQuestionSection(index) {
        this.autoMakeExamPaperForm.qSection.splice(index, 1);
      },
      //手动组卷
      makeExamPaper() {
        this.$refs.manualMakeExamPaperFormRef.validate(async (valid) => {
          if (!valid) return;
          //弹框询问用户是否保存
          const confirmResult = await this.$confirm('此操作会将“我的选题”中的试题组成试卷，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err);
          if (confirmResult !== 'confirm') {
            return this.$message.info('已取消！');
          }
          this.manualMakeExamPaperForm.questionList = this.getOption();
          if (this.manualMakeExamPaperForm.questionList.length <= 0) {
            return this.$message.warning("“我的试题”中无试题！");
          }
          //网络请求
          this.$http.post("/exam_paper/save_exam_paper", this.manualMakeExamPaperForm).then((res) => {
            if (res.data.code !== 200) {
              return this.$message.error(res.data.message);
            }
            this.$message.success(res.data.message);
            this.$router.push('/my_exam_paper').catch(err => err);
          });
        });
      }
    },
    created() {
      this.getQTypeList();
    }
  }
</script>

<style scoped>
  .title {
    margin-bottom: 10px;
    font-size: 14px;
  }
</style>