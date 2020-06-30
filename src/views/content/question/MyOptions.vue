<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的选题</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card class="question_list">
      <!--试题列表区域-->
      <el-table border stripe :data="questionList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="题型" prop="q_type"></el-table-column>
        <el-table-column label="试题内容预览" width="500px">
          <template slot-scope="scope">
            <p class="question_content_preview">{{scope.row.q_content}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="showQuestionDetail(scope.row.q_id)">
              详情
            </el-button>
            <el-button size="mini" type="warning" @click="removeQuestionById(scope.row.q_id)">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  export default {
    name: "my-options",
    data() {
      return {
        //试题列表
        questionList: []
      }
    },
    computed: {
      //试题列表数据总数
      total() {
        return this.questionList.length;
      }
    },
    methods: {
      //从vuex获取相关方法
      ...mapGetters(['getOption']),
      ...mapActions(['saveOption']),
      //获取试题列表数据
      getQuestionList() {
        this.questionList = this.getOption();
      },
      //点击按钮显示试题信息详情
      showQuestionDetail(q_id) {
        //跳转到详情页
        this.$router.push({
          path: '/question_detail',
          query: {q_id: q_id}
        }).catch(err => err);
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
        this.$message.success('移除试题成功！');
      }
    },
    created() {
      this.getQuestionList();
    }
  }
</script>

<style scoped>
  .question_list div {
    font-size: 14px;
  }

  .question_list .question_content_preview {
    width: 480px;
    margin: 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; /*只显示两行*/
    overflow: hidden;
  }
</style>