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
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteQuestionById(scope.row.q_id)">
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
          pageSize: 1
        },
        //试题列表数据总数
        total: 0
      }
    },
    methods: {
      //获取试题列表数据
      getQuestionList() {
        console.log("获取试题列表提交的数据：", {searQuestionForm: this.searchQuestionForm, queryInfo: this.queryInfo});//-
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {
              data: {
                total: 4,
                pageNum: 1,
                questionList: [
                  {
                    q_id: 1,
                    q_state: "未完成",
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
                    q_state: "未通过",
                    q_type: "填空题",
                    q_content: "<p>\n" +
                    "    在一个单链表head中，若要在指针p所指结点后插入一个q指针所指结点，则执行_____。\n" +
                    "</p>\n",
                    upload_time: "2020-01-18 15:30"
                  },
                  {
                    q_id: 3,
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
                    upload_time: "2020-01-18 16:00"
                  },
                  {
                    q_id: 4,
                    q_state: "待审核",
                    q_type: "填空题",
                    q_content: "<p>\n" +
                    "    在一个单链表head中，若要在指针p所指结点后插入一个q指针所指结点，则执行_____。\n" +
                    "</p>\n",
                    upload_time: "2020-01-18 16:30"
                  }
                ]
              },
              meta: {msg: "", status: 200}
            }
          };
          console.log("获取试题列表返回的数据：", res);//-----------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error('获取试题列表失败！');
          }
          this.questionList = res.data.questionList;
          this.total = res.data.total;
        }, 300);
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
        console.log("根据id删除试题提交的数据：", q_id);//----------------------------------------------------------------
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {meta: {msg: "", status: 200}}
          };
          console.log("根据id删除试题返回的数据：", res);//---------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error('删除试题失败！');
          }
          this.$message.success('删除试题成功！');
          this.getQuestionList();
        }, 300);
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