<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-if="isNoticeManager">通知管理</el-breadcrumb-item>
      <el-breadcrumb-item v-else>通知</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card class="notice_list">
      <!--通知列表区域-->
      <el-table size="mini" stripe :data="noticeList">
        <el-table-column label="通知标题" prop="n_title"></el-table-column>
        <el-table-column label="发布时间" prop="publish_time"></el-table-column>
        <el-table-column label="发布者姓名" prop="u_name"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary"
                       @click="showNoticeDetailDialog(scope.row)">
              详情
            </el-button>
            <el-button v-if="getUser().u_id == 1 || (isNoticeManager && scope.row.u_id == getUser().u_id)"
                       size="mini" type="danger" icon="el-icon-delete"
                       @click="deleteNoticeById(scope.row.n_id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-row class="pagination">
        <el-col :span="18">
          <el-pagination layout="total, sizes, prev, pager, next, jumper"
                         :total="total" :page-sizes="[5, 10, 30]"
                         :page-size="queryInfo.pageSize" :current-page="queryInfo.pageNum"
                         @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
        </el-col>
        <el-col :span="6" align="right">
          <el-button v-if="isNoticeManager" size="medium" type="primary" @click="addNoticeDialogVisible = true">
            发布新通知
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!--通知详情对话框-->
    <el-dialog class="notice_detail" :title="noticeDetail.n_title" width="650px"
               :visible.sync="noticeDetailDialogVisible">
      <div>
        <div>发布时间：{{noticeDetail.publish_time}}</div>
        <div>发布者：{{noticeDetail.u_name}}</div>
      </div>
      <div>
        <p>{{noticeDetail.n_content}}</p>
      </div>
    </el-dialog>

    <!--发布新通知对话框-->
    <el-dialog v-if="isNoticeManager" title="发布新通知" width="650px"
               :visible.sync="addNoticeDialogVisible" @close="addNoticeDialogClosed">
      <el-form size="mini" label-width="100px" ref="addNoticeFormRef"
               :model="addNoticeForm" :rules="addNoticeFormRules">
        <div>
          <el-form-item label="通知标题" prop="n_title">
            <el-input v-model="addNoticeForm.n_title"/>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="通知内容" prop="n_content">
            <el-input rows="10" type="textarea" v-model="addNoticeForm.n_content"/>
          </el-form-item>
        </div>
      </el-form>
      <!--底部区域-->
      <span slot="footer">
        <el-button type="primary" @click="addNotice">确定</el-button>
        <el-button @click="addNoticeDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "notice-list",
    data() {
      return {
        //通知列表
        noticeList: [],
        //获取通知列表的参数对象
        queryInfo: {
          query: '',
          // 当前的页数
          pageNum: 1,
          // 当前每页显示多少条数据
          pageSize: 5
        },
        //通知列表数据总数
        total: 0,
        //控制通知详情对话框是否可见
        noticeDetailDialogVisible: false,
        //通知详情信息
        noticeDetail: {},
        //控制发布新通知对话框是否可见
        addNoticeDialogVisible: false,
        //发布新通知的表单信息
        addNoticeForm: {
          n_title: '',
          n_content: '',
          u_name: '',
          u_id: null
        },
        //发布新通知表单信息的验证规则
        addNoticeFormRules: {
          n_title: [
            {required: true, message: '请输入通知标题'}
          ],
          n_content: [
            {required: true, message: '请输入通知内容'}
          ]
        }
      }
    },
    computed: {
      //是否为通知管理
      isNoticeManager() {
        return this.$route.fullPath == '/notice_manager';
      }
    },
    methods: {
      //从vuex获取相关方法
      ...mapGetters(['getSchoolId', 'getUser']),
      //获取通知列表数据
      getNoticeList() {
        //网络请求
        this.$http.get('/notice/get_notice_list/' + this.getSchoolId() + '/' + this.queryInfo.pageNum + '/' + this.queryInfo.pageSize).then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.noticeList = res.data.data.rows;
          this.total = res.data.data.total;
        });
      },
      //监听pageSize改变
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize;
        this.getNoticeList();
      },
      //监听页码值改变
      handleCurrentChange(newCurrent) {
        this.queryInfo.pageNum = newCurrent;
        this.getNoticeList();
      },
      //点击按钮显示通知详情对话框
      showNoticeDetailDialog(obj) {
        this.noticeDetail = obj;
        this.noticeDetailDialogVisible = true;
      },
      //点击按钮发起根据id删除通知请求
      async deleteNoticeById(n_id) {
        //弹框询问用户是否保存修改
        const confirmResult = await this.$confirm('此操作将永久删除此通知，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消！');
        }
        //网络请求
        this.$http.delete('/notice/delete_notice/' + n_id).then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.$message.success(res.data.message);
          this.getNoticeList();
        });
      },
      //点击按钮发起发布通知请求
      addNotice() {
        this.$refs.addNoticeFormRef.validate(async (valid) => {
          if (!valid) return;
          //弹框询问用户是否保存修改
          const confirmResult = await this.$confirm('此操作将发布此通知，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err);
          if (confirmResult !== 'confirm') {
            return this.$message.info('已取消！');
          }
          this.addNoticeForm.u_name = this.getUser().name;
          this.addNoticeForm.u_id = this.getUser().u_id;
          //网络请求
          this.$http.post('/notice/save_notice', this.addNoticeForm).then((res) => {
            if (res.data.code !== 200) {
              return this.$message.error(res.data.message);
            }
            this.$message.success(res.data.message);
            this.addNoticeDialogVisible = false;
            this.getNoticeList();
          });
        });
      },
      //监听发布通知对话框关闭事件
      addNoticeDialogClosed() {
        this.$refs.addNoticeFormRef.resetFields();
      }
    },
    created() {
      this.getNoticeList();
    }
  }
</script>

<style scoped>
  .notice_list div {
    font-size: 14px;
  }

  .notice_list .pagination .el-button {
    width: 180px;
    margin-top: 10px;
  }

  .notice_detail div {
    max-height: 300px;
    overflow: auto;
  }

  .notice_detail div p {
    font-size: 16px;
    font-weight: bold;
  }
</style>