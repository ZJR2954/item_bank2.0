<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的试题</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card class="question_list">
      <!--试题列表区域-->
      <el-table border stripe :data="questionList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="题型" prop="q_type"></el-table-column>
        <el-table-column label="试题内容预览" width="320px">
          <template slot-scope="scope">
            <p class="question_content_preview">{{scope.row.q_content}}</p>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" width="150px" prop="upload_time"></el-table-column>
        <el-table-column label="试题状态" prop="q_state"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="showQuestionDetail(scope.row.q_id)">
              详情
            </el-button>
            <el-button v-if="scope.row.q_state != '通过'" size="mini" type="danger" icon="el-icon-delete" @click="deleteQuestionById(scope.row.q_id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination layout="total, sizes, prev, pager, next, jumper"
                     :total="total" :page-sizes="[5, 10, 30]"
                     :page-size="queryInfo.pageSize" :current-page="queryInfo.pageNum"
                     @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: "my-questions",
    data() {
      return {
        //试题列表
        questionList: [],
        //获取试题列表的参数对象
        queryInfo: {
          query: '',
          // 当前的页数
          pageNum: 1,
          // 当前每页显示多少条数据
          pageSize: 5
        },
        //试题列表数据总数
        total: 0
      }
    },
    methods: {
      //获取试题列表数据
      getQuestionList() {
        //网络请求
        this.$http.get('/question/my_questions/' + this.queryInfo.pageNum + '/' + this.queryInfo.pageSize).then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.questionList = res.data.data.rows;
          for (let i = 0; i < this.questionList.length; i++) {
            this.questionList[i].upload_time = moment(new Date(this.questionList[i].upload_time)).format("YYYY-MM-DD HH:mm");
            if (this.questionList[i].q_state == 1) {
              this.questionList[i].q_state = "通过";
            } else if (this.questionList[i].q_state == 2) {
              this.questionList[i].q_state = "未通过";
            } else if (this.questionList[i].q_state == 3) {
              this.questionList[i].q_state = "待审核";
            } else if (this.questionList[i].q_state == 4) {
              this.questionList[i].q_state = "未完成";
            }
          }
          this.total = res.data.data.total;
        });
      },
      //监听pageSize改变
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize;
        this.getQuestionList();
      },
      //监听页码值改变
      handleCurrentChange(newCurrent) {
        this.queryInfo.pageNum = newCurrent;
        this.getQuestionList();
      },
      //点击按钮显示试题信息详情
      showQuestionDetail(q_id) {
        //跳转到详情页
        this.$router.push({
          path: '/question_detail',
          query: {q_id: q_id}
        }).catch(err => err);
      },
      //点击按钮发起根据id删除试题请求
      async deleteQuestionById(q_id) {
        //弹框询问用户是否保存修改
        const confirmResult = await this.$confirm('此操作将永久删除此试题，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消！');
        }
        //网络请求
        this.$http.delete('/question/delete_question/' + q_id).then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.$message.success(res.data.message);
          this.getQuestionList();
        });
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
    width: 300px;
    margin: 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; /*只显示两行*/
    overflow: hidden;
  }
</style>