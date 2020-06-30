<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>专业列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card class="major_list">
      <!--专业列表区域-->
      <el-table border stripe :data="majorList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="专业名" prop="major_name"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" icon="el-icon-delete"
                       @click="deleteMajorById(scope.row.major_id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--底部区域-->
      <el-row>
        <el-col align="center">
          <el-button size="medium" type="primary" @click="addMajorDialogVisible = true">添加专业</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!--添加专业的对话框-->
    <el-dialog title="添加专业" width="650px"
               :visible.sync="addMajorDialogVisible" @close="addMajorDialogClosed">
      <el-form size="mini" label-width="100px" ref="addMajorFormRef"
               :model="addMajorForm" :rules="addMajorFormRules">
        <el-form-item label="专业名称" prop="major_name">
          <el-input v-model="addMajorForm.major_name"/>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer">
        <el-button type="primary" @click="addMajor">确定</el-button>
        <el-button @click="addMajorDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "major-list",
    data() {
      return {
        //专业列表
        majorList: [],
        //控制添加专业对话框是否可见
        addMajorDialogVisible: false,
        //发布新通知的表单信息
        addMajorForm: {
          major_name: ''
        },
        //发布新通知表单信息的验证规则
        addMajorFormRules: {
          major_name: [
            {required: true, message: '请输入专业名称'}
          ]
        }
      }
    },
    methods: {
      //从vuex获取相关方法
      ...mapGetters(['getFacultyId', 'getUser']),
      //获取专业列表数据
      getMajorList() {
        this.majorList = [];
        //网络请求
        this.$http.get('/major/major_list/' + this.getFacultyId()).then((res) => {
          if (res.data.code !== 200) {
          }
          this.majorList = [];
          res.data.data.forEach((item) => {
            this.majorList.push(item.major);
          });
        });
      },
      //点击按钮发起根据id删除专业请求
      async deleteMajorById(major_id) {
        //弹框询问用户是否保存修改
        const confirmResult = await this.$confirm('此操作将永久删除此专业及学科、试卷，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消！');
        }
        //网络请求
        this.$http.delete('/major/delete_major/' + this.getFacultyId() + '/' + major_id).then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.$message.success(res.data.message);
          this.getMajorList();
        });

      },
      //点击按钮发起添加专业请求
      addMajor() {
        this.$refs.addMajorFormRef.validate(async (valid) => {
          if (!valid) return;
          //弹框询问用户是否保存修改
          const confirmResult = await this.$confirm('此操作将添加此新专业，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err);
          if (confirmResult !== 'confirm') {
            return this.$message.info('已取消！');
          }
          //网络请求
          this.$http.post('/major/add_major/' + this.getFacultyId(), this.addMajorForm).then((res) => {
            if (res.data.code !== 200) {
              return this.$message.error(res.data.message);
            }
            this.$message.success(res.data.message);
            this.addMajorDialogVisible = false;
            this.getMajorList();
          });
        });
      },
      //监听添加专业对话框关闭事件
      addMajorDialogClosed() {
        this.$refs.addMajorFormRef.resetFields();
      }
    },
    created() {
      this.getMajorList();
    }
  }
</script>

<style scoped>
  .major_list div {
    font-size: 14px;
  }

  .major_list .el-row .el-button {
    margin-top: 10px;
  }
</style>