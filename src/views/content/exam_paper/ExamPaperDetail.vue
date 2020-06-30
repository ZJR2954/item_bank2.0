<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/my_exam_paper'}">我的试卷</el-breadcrumb-item>
      <el-breadcrumb-item>试卷详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card class="exam_paper_detail">
      <!--试卷信息详情-->
      <u-editor class="u_editor" v-model="examPaperContent"/>
    </el-card>
  </div>
</template>

<script>
  import UEditor from '@/components/ueditor/UEditor'

  export default {
    name: "exam-paper-detail",
    components: {
      UEditor
    },
    data() {
      return {
        //试卷详情信息
        examPaperDetail: {
          exam_paper: {},
          questionList: []
        },
        //试卷内容
        examPaperContent: ''
      }
    },
    methods: {
      //获取试卷信息详情数据
      getExamPaperDetail() {
        //网络请求
        this.$http.get("/exam_paper/exam_paper_detail/" + this.$route.query.e_id).then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.examPaperDetail = res.data.data.examPaperDetail;
          this.examPaperContent += "试卷标题：" + this.examPaperDetail.examPaper.e_title + "<br/><br/>";
          for (let i = 0; i < this.examPaperDetail.questionList.length; i++) {
            this.examPaperContent += this.examPaperDetail.questionList[i].q_content;
          }
        });
      }
    },
    created() {
      this.getExamPaperDetail();
    }
  }
</script>

<style scoped>
  .exam_paper_detail .u_editor {
    margin-bottom: 10px;
  }

  .exam_paper_detail .el-row .el-button {
    margin: 10px 30px 0 30px;
  }
</style>