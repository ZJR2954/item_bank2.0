<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--查询用户卡片-->
    <el-card>
      <el-form class="search_form" size="mini" label-width="85px" ref="searchUserFormRef" :model="searchUserForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="用户id">
              <el-input placeholder="请输入用户id" v-model="searchUserForm.u_id" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="职工号">
              <el-input placeholder="请输入职工号" v-model="searchUserForm.job_number" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户姓名">
              <el-input placeholder="请输入用户姓名" v-model="searchUserForm.name" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="所属学校">
              <el-select placeholder="请选择所属学校" v-model="searchUserForm.u_school">
                <el-option v-for="item in schoolList" :label="item.school_name" :key="item.school_id"
                           :value="item.school_name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户类型">
              <el-select placeholder="请选择用户类型" v-model="searchUserForm.u_type">
                <el-option v-for="item in userTypeList" :label="item.u_type_name" :key="item.u_type"
                           :value="item.u_type">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户状态">
              <el-select placeholder="请选择用户状态" v-model="searchUserForm.u_state">
                <el-option label="正常" value="正常"></el-option>
                <el-option label="限制登录" value="限制登录"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col align="center">
            <el-button size="medium" type="primary" @click="searchUser">检索用户</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!--检索结果卡片-->
    <el-card class="search_result">
      <div>检索结果</div>
      <!--用户列表区域-->
      <el-table size="mini" border stripe :data="userList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="用户类型" prop="userType.u_type_name"></el-table-column>
        <el-table-column label="所属学校" prop="user.u_school"></el-table-column>
        <el-table-column label="姓名" prop="user.name"></el-table-column>
        <el-table-column label="用户状态" prop="user.u_state"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="showUserDetailDialog(scope.row)">
              详情
            </el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteUserById(scope.row.user.u_id)">
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
          <el-button size="medium" type="primary" @click="addUserDialogVisible = true">添加校级管理员</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!--用户信息详情对话框-->
    <el-dialog :title="'用户信息详情（用户id：' + userDetail.user.u_id + '）'" width="650px"
               :visible.sync="userDetailDialogVisible" @close="userDetailDialogClosed">
      <el-form :disabled="!isUserManager" size="mini" label-width="100px" ref="userDetailFormRef"
               :model="userDetail" :rules="userDetailRules">
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="用户姓名" prop="user.name">
              <el-input v-model="userDetail.user.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属学校" prop="user.u_school">
              <el-select v-model="userDetail.user.u_school" @change="schoolChanged">
                <el-option v-for="item in schoolList" :key="item.school_id" :label="item.school_name"
                           :value="item.school_name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="用户类型" prop="user.u_type">
              <el-select v-model="userDetail.user.u_type">
                <el-option v-for="item in userTypeList" :label="item.u_type_name" :key="item.u_type"
                           :value="item.u_type">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属院系">
              <el-select :disabled="facultyDisabled" v-model="userDetail.user.u_faculty"
                         @change="facultyChanged">
                <el-option v-for="item in facultyList" :label="item.faculty_name" :key="item.faculty_id"
                           :value="item.faculty_name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="身份证号" prop="user.id_number">
              <el-input v-model="userDetail.user.id_number"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作学科">
              <el-select :disabled="subjectDisabled" v-model="userDetail.user.operate_subject">
                <el-option v-for="item in subjectList" :label="item.subject_name" :key="item.subject_id"
                           :value="item.subject_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="绑定邮箱" prop="user.email">
              <el-input v-model="userDetail.user.email"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职工号" prop="user.job_number">
              <el-input v-model="userDetail.user.job_number"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="绑定手机号" prop="user.telephone">
              <el-input v-model="userDetail.user.telephone"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户状态" prop="user.u_state">
              <el-select v-model="userDetail.user.u_state">
                <el-option label="正常" value="正常"></el-option>
                <el-option label="限制登录" value="限制登录"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!--底部区域-->
      <span slot="footer">
        <el-button type="primary" @click="saveUserInfo">保存</el-button>
        <el-button @click="userDetailDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <!--添加校级管理员的对话框-->
    <el-dialog title="添加校级管理员" width="650px"
               :visible.sync="addUserDialogVisible" @close="addUserDialogClosed">
      <el-form size="mini" label-width="100px" ref="addUserFormRef" :model="addUserForm" :rules="addUserFormRules">
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="用户姓名" prop="name">
              <el-input v-model="addUserForm.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属学校" prop="u_school">
              <el-select v-model="addUserForm.u_school">
                <el-option v-for="item in schoolList" :label="item.school_name" :key="item.school_id"
                           :value="item.school_name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="身份证号" prop="id_number">
              <el-input v-model="addUserForm.id_number"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职工号" prop="job_number">
              <el-input v-model="addUserForm.job_number"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="绑定邮箱" prop="email">
              <el-input v-model="addUserForm.email"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="绑定手机号" prop="telephone">
              <el-input v-model="addUserForm.telephone"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!--底部区域-->
      <span slot="footer">
        <el-button type="primary" @click="addUser">确定</el-button>
        <el-button @click="addUserDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "user-list",
    data() {
      return {
        //从vuex获取相关方法
        ...mapGetters(['getUserType']),
        //学校列表
        schoolList: [],
        //用户类型列表
        userTypeList: [],
        //检索用户表单数据
        searchUserForm: {
          u_id: '',
          u_type: null,
          u_school: '',
          job_number: '',
          name: '',
          u_state: ''
        },
        //用户列表
        userList: [],
        //获取用户列表的参数对象
        queryInfo: {
          query: '',
          // 当前的页数
          pageNum: 1,
          // 当前每页显示多少条数据
          pageSize: 5
        },
        //用户列表数据总数
        total: 0,
        //控制用户详情对话框是否可见
        userDetailDialogVisible: false,
        //用户详情信息
        userDetail: {
          user: {},
          userType: {}
        },
        //保存用户信息详情的验证规则
        userDetailRules: {
          user: {
            name: [
              {required: true, message: '请输入用户姓名'}
            ],
            u_school: [
              {required: true, message: '请选择所属学校'}
            ],
            u_type: [
              {required: true, message: '请选择用户类型'}
            ],
            id_number: [
              {required: true, message: '请输入用户身份证号'}
            ],
            email: [
              {required: true, message: '请输入用户绑定邮箱'},
              {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
            ],
            job_number: [
              {required: true, message: '请输入用户职工号'}
            ],
            telephone: [
              {required: true, message: '请输入用户绑定手机号'}
            ],
            u_state: [
              {required: true, message: '请选择用户状态'}
            ]
          }
        },
        //院系列表
        facultyList: [],
        //院系不可选
        facultyDisabled: false,
        //学科列表
        subjectList: [],
        //学科不可选
        subjectDisabled: false,
        //控制添加用户对话框是否可见
        addUserDialogVisible: false,
        //添加用户表单信息
        addUserForm: {
          u_school: '',
          job_number: '',
          name: '',
          id_number: '',
          email: '',
          telephone: ''
        },
        //添加用户表单信息的验证规则
        addUserFormRules: {
          name: [
            {required: true, message: '请输入用户姓名'}
          ],
          u_school: [
            {required: true, message: '请选择所属学校'}
          ],
          id_number: [
            {required: true, message: '请输入用户身份证号'}
          ],
          email: [
            {required: true, message: '请输入用户绑定邮箱'},
            {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
          ],
          job_number: [
            {required: true, message: '请输入用户职工号'}
          ],
          telephone: [
            {required: true, message: '请输入用户绑定手机号'}
          ]
        },
        //是否管理用户
        isUserManager: false
      }
    },
    methods: {
      //获取学校列表数据
      getSchoolList() {
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {
              data: {
                schoolList: [
                  {school_id: 1, school_name: "长江大学"},
                  {school_id: 2, school_name: "清华大学"},
                  {school_id: 3, school_name: "北京大学"},
                  {school_id: 4, school_name: "华中科技大学"},
                  {school_id: 5, school_name: "武汉大学"}
                ]
              },
              meta: {msg: '', status: 200}
            }
          };
          console.log("获取学校列表返回的数据：", res);//-----------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error('获取学校列表失败！');
          }
          this.schoolList = res.data.schoolList;
        }, 300);
      },
      //获取用户类型列表数据
      getUserTypeList() {
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {
              data: {
                userTypeList: [
                  {u_type: 1, u_type_name: "超级管理员"},
                  {u_type: 2, u_type_name: "校级管理员"},
                  {u_type: 3, u_type_name: "院级管理员"},
                  {u_type: 4, u_type_name: "命题教师"},
                  {u_type: 5, u_type_name: "审核教师"}
                ]
              },
              meta: {msg: '', status: 200}
            }
          };
          console.log("获取用户类型列表返回的数据：", res);//-------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error("获取用户类型列表失败！");
          }
          this.userTypeList = res.data.userTypeList;
        }, 300);
      },
      //获取用户列表
      getUserList() {
        console.log("获取用户列表提交的数据：", {searchUserForm: this.searchUserForm, queryInfo: this.queryInfo});//------
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {
              data: {
                total: 2,
                pageNum: 1,
                userList: [
                  {
                    user: {
                      u_id: 1,
                      u_type: 1,
                      u_school: "长江大学",
                      u_faculty: "计算机科学学院",
                      job_number: "111111111",
                      name: "正经仁",
                      id_number: "111111111111111111",
                      email: "1111111111@qq.com",
                      telephone: "11111111111",
                      operate_subject: 1,
                      u_state: "正常"
                    },
                    userType: {
                      u_type: 1,
                      u_type_name: "超级管理员",
                      u_power: "0"
                    }
                  },
                  {
                    user: {
                      u_id: 7,
                      u_type: 2,
                      u_school: "长江大学",
                      u_faculty: "计算机科学学院",
                      job_number: "222222222",
                      name: "李二",
                      id_number: "222222222222222222",
                      email: "222222222@qq.com",
                      telephone: "22222222222",
                      operate_subject: 2,
                      u_state: "正常"
                    },
                    userType: {
                      u_type: 2,
                      u_type_name: "校级管理员",
                      u_power: "1, 7, 9, 10"
                    }
                  }
                ]
              },
              meta: {msg: "获取用户列表成功", status: 200}
            }
          };
          console.log("获取用户列表返回的数据：", res);//-----------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error('获取用户列表失败！');
          }
          this.userList = res.data.userList;
          this.total = res.data.total;
        }, 300);
      },
      //点击按钮发起检索请求
      searchUser() {
        if (this.searchUserForm.u_id.trim().length == 0 &&
            this.searchUserForm.u_type == null &&
            this.searchUserForm.u_school.trim().length == 0 &&
            this.searchUserForm.job_number.trim().length == 0 &&
            this.searchUserForm.name.trim().length == 0 &&
            this.searchUserForm.u_state.trim().length == 0) {
          return this.$message.error('请至少填写一项查询条件！');
        }
        this.getUserList();
      },
      //监听pageSize改变
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize;
        this.getUserList();
      },
      //监听页码值改变
      handleCurrentChange(newCurrent) {
        this.queryInfo.pageNum = newCurrent;
        this.getUserList();
      },
      //点击按钮显示用户详情对话框
      showUserDetailDialog(obj) {
        //乞丐版深拷贝
        this.userDetail = JSON.parse(JSON.stringify(obj));
        if (this.userDetail.user.u_school) {
          this.getFacultyList(this.userDetail.user.u_school);
        }
        if (this.userDetail.user.u_faculty) {
          this.getSubjectList(this.userDetail.user.u_faculty);
        }
        this.userDetailDialogVisible = true;
      },
      //监听用户详情对话框所属学校改变
      schoolChanged() {
        if (this.userDetail.user.u_school) {
          this.userDetail.user.u_faculty = null;
          this.facultyDisabled = true;
          this.getFacultyList(this.userDetail.user.u_school);
        }
      },
      //获取院系列表数据
      getFacultyList(school_id) {
        console.log("获取院系列表提交的数据：", school_id);//-------------------------------------------------------------
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {
              data: {
                facultyList: [
                  {faculty_id: 1, faculty_name: "计算机科学与技术"},
                  {faculty_id: 2, faculty_name: "软件工程"},
                  {faculty_id: 3, faculty_name: "物联网工程"},
                  {faculty_id: 4, faculty_name: "网络工程"}
                ]
              },
              meta: {msg: "", status: 200}
            }
          };
          console.log("获取用户列表返回的数据：", res);//-----------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error('获取院系列表失败！');
          }
          this.facultyList = res.data.facultyList;
          this.facultyDisabled = false;
        }, 300);
      },
      //监听用户详情对话框所属院系改变
      facultyChanged() {
        if (this.userDetail.user.u_faculty) {
          this.userDetail.user.operate_subject = null;
          this.subjectDisabled = true;
          this.getSubjectList(this.userDetail.user.u_faculty);
        }
      },
      //获取学科列表数据
      getSubjectList(faculty_id) {
        console.log("获取学科列表提交的数据：", faculty_id);//------------------------------------------------------------
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {
              data: {
                subjectList: [
                  {subject_id: 1, subject_name: "数据结构"},
                  {subject_id: 2, subject_name: "计算机网络"},
                  {subject_id: 3, subject_name: "计算机组成原理及应用"}
                ]
              },
              meta: {msg: "", status: 200}
            }
          };
          console.log("获取学科列表返回的数据：", res);//-----------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error('获取学科列表失败！');
          }
          this.subjectList = res.data.subjectList;
          this.subjectDisabled = false;
        }, 300);
      },
      //监听用户详情对话框关闭事件
      userDetailDialogClosed() {
        this.$refs.userDetailFormRef.resetFields();
      },
      //点击按钮发起保存用户信息请求
      saveUserInfo() {
        this.$refs.userDetailFormRef.validate(async (valid) => {
          if (!valid) return;
          //弹框询问用户是否保存修改
          const confirmResult = await this.$confirm('此操作将保存用户信息，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err);
          if (confirmResult !== 'confirm') {
            return this.$message.info('已取消！');
          }
          console.log("保存用户信息提交的数据：", this.userDetail);//-----------------------------------------------------
          //模拟网络请求
          setTimeout(() => {
            const {data: res} = {
              data: {meta: {msg: "", status: 200}}
            };
            console.log("保存用户信息返回的数据：", res);//---------------------------------------------------------------
            if (res.meta.status !== 200) {
              return this.$message.error('保存用户信息失败！');
            }
            this.$message.success('保存用户信息成功！')
            this.userDetailDialogVisible = false;
            this.getUserList();
          }, 300);
        });
      },
      //点击按钮发起根据id删除用户请求
      async deleteUserById(u_id) {
        //弹框询问用户是否保存修改
        const confirmResult = await this.$confirm('此操作将永久删除此用户，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消！');
        }
        console.log("根据id删除用户提交的数据：", u_id);//----------------------------------------------------------------
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {meta: {msg: "", status: 200}}
          };
          console.log("根据id删除用户返回的数据：", res);//---------------------------------------------------------------
          if (res.meta.status !== 200) {
            return this.$message.error('删除用户失败！');
          }
          this.$message.success('删除用户成功！');
          this.getUserList();
        }, 300);
      },
      //点击按钮发起添加用户请求
      addUser() {
        this.$refs.addUserFormRef.validate(async (valid) => {
          if (!valid) return;
          //弹框询问用户是否保存修改
          const confirmResult = await this.$confirm('此操作将添加此新用户，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err);
          if (confirmResult !== 'confirm') {
            return this.$message.info('已取消！');
          }
          console.log("添加用户提交的数据：", this.addUserForm);//-------------------------------------------------------
          //模拟网络请求
          setTimeout(() => {
            const {data: res} = {
              data: {meta: {msg: "", status: 200}}
            };
            console.log("添加用户返回的数据：", res);//------------------------------------------------------------------
            if (res.meta.status !== 200) {
              return this.$message.error('添加用户失败！');
            }
            this.$message.success('添加用户成功！');
            this.addUserDialogVisible = false;
            this.getUserList();
          }, 300);
        });
      },
      //监听添加用户对话框关闭事件
      addUserDialogClosed() {
        this.$refs.addUserFormRef.resetFields();
      },
      //权限管理方法
      powerManager() {
        let userType = this.getUserType();
        let userTypePowerList = userType.u_power ? userType.u_power.split(',') : [];
        for (let item of userTypePowerList) {
          if ('0' == item.trim()) {
            this.isUserManager = true;
          }
        }
      }
    },
    created() {
      this.getSchoolList();
      this.getUserTypeList();
      this.getUserList();
      this.powerManager();
    }
  }
</script>

<style scoped>
  .search_form .el-input, .el-select {
    width: 100%;
  }

  .search_result div {
    font-size: 14px;
  }

  .search_result .pagination .el-button {
    width: 180px;
    margin-top: 10px;
  }
</style>