<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>通知管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="notice_list">
      <div>通知列表</div>
      <!-- 通知列表区域 -->
      <el-table size="mini" stripe :data="noticeList">
        <el-table-column label="通知标题" prop="n_title"></el-table-column>
        <el-table-column label="发布时间" prop="publish_time"></el-table-column>
        <el-table-column label="发布者姓名" prop="u_name"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showNoticeDetailDialog(scope.row)">
              详情
            </el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteNoticeById(scope.row.n_id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-row class="pagination">
        <el-col :span="18">
          <el-pagination layout="total, sizes, prev, pager, next, jumper"
                         :total="total"
                         :page-sizes="[5, 10, 30]"
                         :page-size="queryInfo.pageSize"
                         :current-page="queryInfo.pageNum"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange">
          </el-pagination>
        </el-col>
        <el-col :span="6" align="right">
          <el-button type="primary" size="medium" @click="addNoticeDialogVisible = true">发布新通知</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 通知详情对话框 -->
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

    <!-- 发布新通知对话框 -->
    <el-dialog title="发布新通知"
               width="650px"
               :visible.sync="addNoticeDialogVisible"
               @close="addNoticeDialogClosed">
      <el-form size="mini" label-width="100px" ref="addNoticeFormRef" :model="addNoticeInfo"
               :rules="addNoticeFormRules">
        <div>
          <el-form-item label="通知标题" prop="n_title">
            <el-input placeholder="请输入通知标题" v-model="addNoticeInfo.n_title"/>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="通知内容" prop="n_content">
            <el-input type="textarea" placeholder="请输入通知内容" v-model="addNoticeInfo.n_content"/>
          </el-form-item>
        </div>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer">
        <el-button type="primary" @click="addNotice">确定</el-button>
        <el-button @click="addNoticeDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "notice-manager",
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
          pageSize: 1
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
        addNoticeInfo: {
          n_title: '',
          n_content: ''
        },
        //发布新通知表单信息的验证规则
        addNoticeFormRules: {
          n_title: [
            {required: true, message: '请输入通知标题', trigger: 'blur'}
          ],
          n_content: [
            {required: true, message: '请输入通知内容', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      //获取通知列表数据
      getNoticeList() {
        //模拟网络请求
        const {data: res} = {
          data: {
            data: {
              total: 5,
              pageNum: 1,
              noticeList: [
                {
                  n_id: 1,
                  n_title: "关于系统升级的通知",
                  n_content: "本系统将于2020年5月20日00:00~03:00进行系统更新，如果造成不便，敬请谅解！",
                  publish_time: "2020-05-01 00:00",
                  u_name: "正经仁"
                },
                {
                  n_id: 2,
                  n_title: "关于长江大学2020年研究生招生考试试题录入安排的通知",
                  n_content: "测试通知内容",
                  publish_time: "2020-04-02 00:00",
                  u_name: "李二狗"
                },
                {
                  n_id: 3,
                  n_title: "关于北京大学2020年研究生招生考试试题录入安排的通知",
                  n_content: "测试通知内容",
                  publish_time: "2020-04-01 03:00",
                  u_name: "李三狗"
                },
                {
                  n_id: 4,
                  n_title: "关于清华大学2020年研究生招生考试试题录入安排的通知",
                  n_content: "测试通知内容",
                  publish_time: "2020-04-01 00:00",
                  u_name: "李四狗"
                },
                {
                  n_id: 5,
                  n_title: "关于华中科技大学大学2020年研究生招生考试试题录入安排的通知",
                  n_content: "测试通知内容",
                  publish_time: "2020-05-01 00:00",
                  u_name: "李五狗"
                }
              ]
            },
            meta: {msg: "", status: 200}
          }
        };
        if (res.meta.status !== 200) {
          return this.$message.error('获取通知列表失败！');
        }
        console.log(res);//---------------------------------------------------------------------------------------------
        this.noticeList = res.data.noticeList;
        this.total = res.data.total;
      },
      //监听pageSize改变
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize;
        this.getNoticeList();
      },
      //监听页码值改变
      handleCurrentChange(newCurrent) {
        this.queryInfo.pageNum = newCurrent;
        this.getUserList();
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
          return this.$message.info('已取消删除');
        }
        const {data: res} = {
          data: {meta: {msg: "", status: 200}}
        };
        if (res.meta.status !== 200) {
          return this.$message.error('删除通知失败！');
        }
        console.log(res);//---------------------------------------------------------------------------------------------
        this.getNoticeList();
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
            return this.$message.info('已取消发布');
          }
          const {data: res} = {
            data: {meta: {msg: "", status: 200}}
          };
          if (res.meta.status !== 200) {
            return this.$message.error('发布通知失败！');
          }
          console.log(res);//---------------------------------------------------------------------------------------------
          this.addNoticeDialogVisible = false;
          this.getNoticeList();
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