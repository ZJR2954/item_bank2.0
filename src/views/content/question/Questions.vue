<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>题库</el-breadcrumb-item>
    </el-breadcrumb>

    <!--查询试题卡片-->
    <el-card>
      <el-form class="search_form" size="mini" label-width="85px"
               ref="searchQuestionFormRef" :model="searchQuestionForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="试题id">
              <el-input placeholder="请输入试题id" v-model="searchQuestionForm.q_id" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="试题题型">
              <el-select placeholder="请选择试题题型" v-model="searchQuestionForm.q_type">
                <el-option v-for="item in qTypeList" :label="item.q_type_name" :key="item.q_type_id"
                           :value="item.q_type_name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属章节">
              <el-select placeholder="请选择所属章节" v-model="searchQuestionForm.q_chapter">
                <el-option v-for="item in chapterList" :label="item.chapter_name" :key="item.chapter_id"
                           :value="item.chapter_name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关键字">
              <el-input placeholder="请输入试题关键字" v-model="searchQuestionForm.tags" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col align="center">
            <el-button size="medium" type="primary" @click="searchQuestion">检索试题</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!--检索结果卡片-->
    <el-card class="question_list">
      <div>检索结果</div>
      <!--试题列表区域-->
      <el-table border stripe :data="questionList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="题型" prop="q_type"></el-table-column>
        <el-table-column label="试题内容预览" width="400px">
          <template slot-scope="scope">
            <p class="question_content_preview">{{scope.row.q_content}}</p>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" width="150px" prop="upload_time">
          <template slot-scope="scope">
            {{scope.row.upload_time}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary"
                       @click="showQuestionDetail(scope.row.q_id)">
              详情
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
  import {mapGetters} from 'vuex'

  export default {
    name: "questions",
    data() {
      return {
        //题型列表
        qTypeList: [],
        //章节列表
        chapterList: [],
        //检索试题表单数据
        searchQuestionForm: {
          q_id: '',
          q_type: '',
          q_chapter: '',
          tags: '',
          q_state: 1
        },
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
      //从vuex获取相关方法
      ...mapGetters(['getUser', 'getFacultyId']),
      //获取题型列表数据
      getQTypeList() {
        //网络请求
        this.$http.get('/subject/subject_list/' + this.getFacultyId() + '/1/1000').then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error('获取题型列表失败！');
          }
          res.data.data.rows.forEach((item) => {
            if(item.subject.subject_id == this.getUser().operate_subject) {
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
            if(item.subject.subject_id == this.getUser().operate_subject) {
              this.chapterList = item.characters;
            }
          });
        });
      },
      //点击按钮发起检索请求
      searchQuestion() {
        if (this.searchQuestionForm.q_id.trim().length == 0 &&
            this.searchQuestionForm.q_chapter.trim().length == 0 &&
            this.searchQuestionForm.q_type.trim().length == 0 &&
            this.searchQuestionForm.tags.trim().length == 0) {
          return this.$message.error('请至少填写一项查询条件');
        }
        this.getQuestionList();
      },
      //获取试题列表数据
      getQuestionList() {
        //网络请求
        this.$http.post('/question/search_question/' + this.getUser().operate_subject + '/' + this.queryInfo.pageNum + '/' + this.queryInfo.pageSize, this.searchQuestionForm).then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.questionList = res.data.data.rows;
          for (let i = 0; i < this.questionList.length; i++) {
            this.questionList[i].upload_time = moment(new Date(this.questionList[i].upload_time)).format("YYYY-MM-DD HH:mm");
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
      }
    },
    created() {
      this.getQTypeList();
      this.getChapterList();
      this.getQuestionList();
    }
  }
</script>

<style scoped>
  .search_form .el-input, .el-select {
    width: 100%;
  }

  .question_list div {
    font-size: 14px;
  }

  .question_list .question_content_preview {
    width: 380px;
    margin: 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; /*只显示两行*/
    overflow: hidden;
  }
</style>