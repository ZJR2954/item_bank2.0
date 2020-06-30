<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的试卷</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card class="my_exam_paper_list">
      <!--我的试卷列表区域-->
      <el-table border stripe :data="myExamPaperList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="组卷方式" prop="finish_type"></el-table-column>
        <el-table-column label="试卷标题" prop="e_title"></el-table-column>
        <el-table-column label="组卷时间" prop="finish_time"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="showExamPaperDetail(scope.row.e_id)">
              详情
            </el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteExamPaperById(scope.row.e_id)">
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
    name: "my-exam-paper",
    data() {
      return {
        //我的试卷列表
        myExamPaperList: [],
        //获取我的试卷列表的参数对象
        queryInfo: {
          query: '',
          // 当前的页数
          pageNum: 1,
          // 当前每页显示多少条数据
          pageSize: 5
        },
        //我的试卷列表数据总数
        total: 0,
      }
    },
    methods: {
      //获取我的试卷列表数据
      getMyExamPaperList() {
        //网络请求
        this.$http.get("/exam_paper/my_exam_papers/" + this.queryInfo.pageNum + "/" + this.queryInfo.pageSize).then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.myExamPaperList = res.data.data.rows;
          for (let i = 0; i < this.myExamPaperList.length; i++) {
            this.myExamPaperList[i].finish_time = moment(new Date(this.myExamPaperList[i].finish_time)).format("YYYY-MM-DD HH:mm");
          }
          this.total = res.data.data.total;
        });
      },
      //监听pageSize改变
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize;
        this.getMyExamPaperList();
      },
      //监听页码值改变
      handleCurrentChange(newCurrent) {
        this.queryInfo.pageNum = newCurrent;
        this.getMyExamPaperList();
      },
      //点击按钮显示试卷信息详情
      showExamPaperDetail(e_id) {
        //跳转到详情页
        this.$router.push({
          path: '/exam_paper_detail',
          query: {e_id: e_id}
        }).catch(err => err);
      },
      //点击按钮发起根据id删除试题请求
      async deleteExamPaperById(e_id) {
        //弹框询问用户是否保存修改
        const confirmResult = await this.$confirm('此操作将永久删除此试卷，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消！');
        }
        //网络请求
        this.$http.delete("/exam_paper/delete_exam_paper/" + e_id).then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.$message.success(res.data.message);
          this.getMyExamPaperList();
        });
      }
    },
    created() {
      this.getMyExamPaperList();
    }
  }
</script>

<style scoped>
  .my_exam_paper_list div {
    font-size: 14px;
  }
</style>