<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/pending_questions'}">待审试题</el-breadcrumb-item>
      <el-breadcrumb-item>待审试题详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="pending_question_detail">
      <!-- 待审试题信息详情 -->
      <u-editor class="u_editor" readonly v-model="pendingQuestionDetail.question.q_content"/>
      <el-form size="mini" label-width="100px" ref="pendingQuestionDetailFormRef" :model="pendingQuestionDetail">
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="试题题型：">
              {{pendingQuestionDetail.question.q_type}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属章节：">
              {{pendingQuestionDetail.question.q_chapter}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="试题难度：">
              {{pendingQuestionDetail.question.difficulty}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="知识点：">
              {{pendingQuestionDetail.question.knowledge}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="试题答案：">
              <el-input type="textarea" disabled v-model="pendingQuestionDetail.question.answer"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="审核意见：">
              <el-input placeholder="若试题未通过，请在此输入原因" v-model="pendingQuestionDetail.question.opinion"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col align="center">
            <el-button type="primary" size="medium" @click="passExamine">通过</el-button>
            <el-button size="medium" @click="notPassExamine">未通过</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

  </div>
</template>

<script>
  import UEditor from '@/components/ueditor/UEditor'

  export default {
    name: "pending-question-detail",
    components: {
      UEditor
    },
    data() {
      return {
        //试题详情信息
        pendingQuestionDetail: {
          question: {}
        }
      }
    },
    methods: {
      //获取试题信息详情数据
      getPendingQuestionDetail(q_id) {
        //模拟网络请求
        const {data: res} = {
          data: {
            data: {
              pendingQuestionDetail: {
                question: {
                  q_id: 1,
                  q_category: "工学",
                  q_major: "计算机科学与技术",
                  q_subject: "数据结构",
                  q_chapter: "链表",
                  q_state: "待审核",
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
                  u_id: 5
                }
              }
            },
            meta: {msg: "", status: 200}
          }
        };
        if (res.meta.status !== 200) {
          return this.$message.error('获取试题信息失败！');
        }
        console.log(res);//---------------------------------------------------------------------------------------------
        this.pendingQuestionDetail = res.data.pendingQuestionDetail;
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
          return this.$message.info('已取消');
        }
        const {data: res} = {
          data: {meta: {msg: "", status: 200}}
        };
        if (res.meta.status !== 200) {
          return this.$message.error('审核失败！');
        }
        console.log(res);//---------------------------------------------------------------------------------------------
        this.$message.success('审核成功！');
        this.$router.push('/pending_questions').catch(err => err);
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
          return this.$message.info('已取消');
        }
        const {data: res} = {
          data: {meta: {msg: "", status: 200}}
        };
        if (res.meta.status !== 200) {
          return this.$message.error('审核失败！');
        }
        console.log(res);//---------------------------------------------------------------------------------------------
        this.$message.success('审核成功！');
        this.$router.push('/pending_questions').catch(err => err);
      }
    },
    created() {
      this.getPendingQuestionDetail(this.$route.query.q_id);
    }
  }
</script>

<style scoped>
  .pending_question_detail .u_editor {
    margin-bottom: 10px;
  }

  .pending_question_detail .el-row .el-button {
    margin: 10px 30px 0 30px;
  }
</style>