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
                <el-option label="正常" value=1></el-option>
                <el-option label="异常" value=0></el-option>
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
        <el-table-column label="用户状态">
          <template slot-scope="scope">
            {{scope.row.user.u_state == 1 ? '正常' : '异常'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="showUserDetailDialog(scope.row)">
              详情
            </el-button>
            <!--<el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteUserById(scope.row.user.u_id)">-->
            <!--删除-->
            <!--</el-button>-->
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
          <el-button size="medium" type="primary" @click="addUserDialogVisible = true">添加用户</el-button>
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
                <el-option v-for="item in subjectList"
                           :label="item.subject.subject_name + '(' + item.major.major_name + ')'"
                           :key="item.subject.subject_id" :value="item.subject.subject_id">
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
                <el-option label="正常" :value="1"></el-option>
                <el-option label="异常" :value="0"></el-option>
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

    <!--添加用户的对话框-->
    <el-dialog title="添加用户" width="650px"
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
              <el-select v-model="addUserForm.u_school" @change="getFacultyList(addUserForm.u_school)">
                <el-option v-for="item in schoolList" :label="item.school_name" :key="item.school_id"
                           :value="item.school_name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="用户类型" prop="u_type">
              <el-select v-model="addUserForm.u_type">
                <el-option v-for="item in userTypeList" :label="item.u_type_name" :key="item.u_type"
                           :value="item.u_type">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属院系" prop="u_faculty">
              <el-select v-model="addUserForm.u_faculty" @change="getSubjectList(addUserForm.u_faculty)">
                <el-option v-for="item in facultyList" :label="item.faculty_name" :key="item.faculty_id"
                           :value="item.faculty_name">
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
            <el-form-item label="操作学科" prop="operate_subject">
              <el-select v-model="addUserForm.operate_subject">
                <el-option v-for="item in subjectList"
                           :label="item.subject.subject_name + '(' + item.major.major_name + ')'"
                           :key="item.subject.subject_id" :value="item.subject.subject_id">
                </el-option>
              </el-select>
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
            <el-form-item label="职工号" prop="job_number">
              <el-input v-model="addUserForm.job_number"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
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
        ...mapGetters(['getUserType', 'getUser']),
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
          u_state: null
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
          u_faculty: '',
          operate_subject: null,
          u_type: null,
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
          u_faculty: [],
          operate_subject: [],
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
          ]
        },
        //是否管理用户
        isUserManager: false
      }
    },
    methods: {
      //获取学校列表数据
      getSchoolList() {
        //网络请求
        this.$http.get('/school/school_list').then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.schoolList = [];
          res.data.data.rows.forEach((item) => {
            if (this.getUserType().u_type == 1 || this.getUser().u_school == item.school.school_name) {
              this.schoolList.push(item.school);
            }
          });
          this.searchUserForm.u_school = this.schoolList[0].school_name;
        });
      },
      //获取用户类型列表数据
      getUserTypeList() {
        //模拟网络请求
        this.$http.get('/user_type/get_all_user_type').then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.userTypeList = res.data.data;
          this.searchUserForm.u_type = this.userTypeList[0].u_type;
        });
      },
      //获取用户列表
      getUserList() {
        //网络请求
        this.$http.post('/user/search_user/' + this.queryInfo.pageNum + '/' + this.queryInfo.pageSize, this.searchUserForm).then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.$message.success(res.data.message);
          this.userList = res.data.data.rows;
          this.total = res.data.data.total;
        });
      },
      //点击按钮发起检索请求
      searchUser() {
        if (this.searchUserForm.u_id.trim().length == 0 &&
            this.searchUserForm.u_type == null &&
            this.searchUserForm.u_school.trim().length == 0 &&
            this.searchUserForm.job_number.trim().length == 0 &&
            this.searchUserForm.name.trim().length == 0 &&
            this.searchUserForm.u_state == null) {
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
      getFacultyList(school_name) {
        //网络请求
        this.$http.get('/faculty/faculty_list/' + school_name).then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message);
          }
          this.facultyList = [];
          res.data.data.rows.forEach((item) => {
            this.facultyList.push(item.faculty);
          });
          this.facultyDisabled = false;
        });
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
      getSubjectList(faculty_name) {
        let faculty_id = 0;
        this.facultyList.forEach((item) => {
          if (item.faculty_name == faculty_name) {
            faculty_id = item.faculty_id;
          }
        });
        //网络请求
        this.$http.get('/subject/subject_list/' + faculty_id + '/1/1000').then((res) => {
          if (res.data.code !== 200) {
            return this.$message.error('操作学科' + res.data.message);
          }
          this.subjectList = res.data.data.rows;
          this.subjectDisabled = false;
        });
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
          //网络请求
          this.$http.put('/user/edit_user_type', this.userDetail.user).then((res) => {
            if (res.data.code !== 200) {
              return this.$message.error(res.data.message);
            }
            this.$message.success(res.data.message);
            this.getUserList();
          });
        });
      },
      // //点击按钮发起根据id删除用户请求
      // async deleteUserById(u_id) {
      //   //弹框询问用户是否保存修改
      //   const confirmResult = await this.$confirm('此操作将永久删除此用户，是否继续？', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).catch(err => err);
      //   if (confirmResult !== 'confirm') {
      //     return this.$message.info('已取消！');
      //   }
      //   console.log("根据id删除用户提交的数据：", u_id);//----------------------------------------------------------------
      //   //模拟网络请求
      //   setTimeout(() => {
      //     const {data: res} = {
      //       data: {meta: {msg: "", status: 200}}
      //     };
      //     console.log("根据id删除用户返回的数据：", res);//---------------------------------------------------------------
      //     if (res.meta.status !== 200) {
      //       return this.$message.error('删除用户失败！');
      //     }
      //     this.$message.success('删除用户成功！');
      //     this.getUserList();
      //   }, 300);
      // },
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
          //网络请求
          if (this.addUserForm.u_type == 2) {
            this.$http.post('/super_admin/add_school_admin', this.addUserForm).then((res) => {
              if (res.data.code !== 200) {
                return this.$message.error(res.data.message);
              }
              this.$message.success(res.data.message);
              this.addUserDialogVisible = false;
              this.getUserList();
            });
          } else if (this.addUserForm.u_type == 3) {
            if (this.addUserForm.u_faculty.trim().length <= 0) {
              return this.$message.error('请选择所属院系');
            }
            this.$http.post('/school_admin/add_faculty_admin', this.addUserForm).then((res) => {
              if (res.data.code !== 200) {
                return this.$message.error(res.data.message);
              }
              this.$message.success(res.data.message);
              this.addUserDialogVisible = false;
              this.getUserList();
            });
          } else if (this.addUserForm.u_type == 4 || this.addUserForm.u_type == 5) {
            if (this.addUserForm.operate_subject == null) {
              return this.$message.error('请选择操作学科');
            }
            this.$http.post('/faculty_admin/add_teacher', this.addUserForm).then((res) => {
              if (res.data.code !== 200) {
                return this.$message.error(res.data.message);
              }
              this.$message.success(res.data.message);
              this.addUserDialogVisible = false;
              this.getUserList();
            });
          }else {
            return this.$message.warning('暂时不支持添加该类型的用户');
          }

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
          if ('0' == item.trim() || '7' == item.trim()) {
            this.isUserManager = true;
          }
        }
      }
    },
    created() {
      this.getSchoolList();
      this.getUserTypeList();
      // this.getUserList();
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