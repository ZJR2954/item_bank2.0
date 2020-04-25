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
      //获取专业列表数据
      getMajorList() {
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {
              data: {
                majorList: [
                  {major_id: 1, major_name: "计算机科学与技术", faculty_id: 1},
                  {major_id: 2, major_name: "软件工程", faculty_id: 1},
                  {major_id: 3, major_name: "物联网工程", faculty_id: 1},
                  {major_id: 4, major_name: "网络工程", faculty_id: 1}
                ]
              },
              meta: {msg: "", status: 200}
            }
          };
          console.log("获取专业列表返回的数据：", res);//-----------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error('获取专业列表失败！');
          }
          this.majorList = res.data.majorList;
        }, 300);
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
        console.log("根据id删除专业提交的数据：", major_id);//------------------------------------------------------------
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {meta: {msg: "", status: 200}}
          };
          console.log("根据id删除专业返回的数据：", res);//---------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error('删除专业失败！');
          }
          this.$message.success('删除专业成功！');
          this.getMajorList();
        }, 300);
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
          console.log("添加专业提交的数据：", this.addMajorForm);//------------------------------------------------------
          //模拟网络请求
          setTimeout(() => {
            const {data: res} = {
              data: {meta: {msg: "", status: 200}}
            };
            console.log("添加专业返回的数据：", res);//------------------------------------------------------------------
            if (res.meta.status !== 200) {
              return this.$message.error('添加专业失败！');
            }
            this.$message.success("添加专业成功！");
            this.addMajorDialogVisible = false;
            this.getMajorList();
          }, 300);
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