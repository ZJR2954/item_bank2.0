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
      <el-row>
        <el-col align="center">
          <el-button size="medium" type="primary" @click="downloadExamPaper">下载</el-button>
        </el-col>
      </el-row>
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
        console.log("获取试卷信息详情提交的数据：", this.$route.query.e_id);//--------------------------------------------
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {
              data: {
                examPaperDetail: {
                  exam_paper: {},
                  questionList: [
                    {
                      q_id: 1,
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
                      upload_time: "2020-01-18 14:00"
                    },
                    {
                      q_id: 2,
                      q_state: "通过",
                      q_type: "填空题",
                      q_content: "<p>\n" +
                      "    在一个单链表head中，若要在指针p所指结点后插入一个q指针所指结点，则执行_____。\n" +
                      "</p>\n",
                      upload_time: "2020-01-18 15:30"
                    },
                  ]
                }
              },
              meta: {msg: "", status: 200}
            }
          };
          console.log("获取试卷信息详情返回的数据：", res);//-------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error('获取试卷信息失败！');
          }
          this.examPaperDetail = res.data.examPaperDetail;
          for (let item of this.examPaperDetail.questionList) {
            this.examPaperContent += item.q_content + "<br/>";
          }
        }, 300);
      },
      //点击按钮下载试卷
      downloadExamPaper() {
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