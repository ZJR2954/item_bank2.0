<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 查询用户卡片 -->
    <el-card>
      <el-form class="search_form" size="mini" label-width="85px" ref="searchUserFormRef" :model="searchUserForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="用户id">
              <el-input v-model="searchUserForm.u_id" placeholder="请输入用户id" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="职工号">
              <el-input v-model="searchUserForm.job_number" placeholder="请输入职工号" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户姓名">
              <el-input class="common_input" v-model="searchUserForm.name" placeholder="请输入用户姓名" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="所属学校">
              <el-select placeholder="请选择所属学校" v-model="searchUserForm.school">
                <el-option v-for="item in schoolList" :key="item.school_id" :label="item.school_name"
                           :value="item.school_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户类型">
              <el-select placeholder="请选择用户类型" v-model="searchUserForm.u_type">
                <el-option v-for="item in userTypeList" :key="item.u_type" :label="item.u_type_name"
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
            <el-button type="primary" size="medium" @click="searchUser">检索用户</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 检索结果卡片 -->
    <el-card class="search_result">
      <div>检索结果</div>
      <!-- 用户列表区域 -->
      <el-table size="mini" border stripe :data="userList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="用户类型" prop="user_type.u_type_name"></el-table-column>
        <el-table-column label="所属学校" prop="user.u_school"></el-table-column>
        <el-table-column label="姓名" prop="user.name"></el-table-column>
        <el-table-column label="用户状态" prop="user.u_state"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showUserDetailDialog(scope.row)">
              详情
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUserById(scope.row.user.u_id)">
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
                         :page-sizes="[1, 5, 10]"
                         :page-size="queryInfo.pageSize"
                         :current-page="queryInfo.pageNum"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange">
          </el-pagination>
        </el-col>
        <el-col :span="6" align="right">
          <el-button type="primary" size="medium" @click="addUserDialogVisible = true">添加校级管理员</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 用户详情 -->
    <el-dialog title="用户信息详情" width="650px"
               :visible.sync="userDetailDialogVisible" @close="userDetailDialogClosed">
      <el-form size="mini" label-width="100px" ref="userDetailFormRef" :model="userDetail" :rules="userDetailRules">
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="用户姓名" prop="user.name">
              <el-input v-model="userDetail.user.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属学校" prop="user.u_school">
              <el-select placeholder="请选择所属学校" v-model="userDetail.user.u_school" @change="schoolChanged">
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
              <el-select placeholder="请选择用户类型" v-model="userDetail.user.u_type">
                <el-option v-for="item in userTypeList" :key="item.u_type" :label="item.u_type_name"
                           :value="item.u_type">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属院系" prop="faculty">
              <el-select placeholder="请选择所属院系" v-model="userDetail.user.u_faculty" :disabled="facultyDisabled"
                         @change="facultyChanged">
                <el-option v-for="item in facultyList" :key="item.faculty_id" :label="item.faculty_name"
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
            <el-form-item label="操作学科" prop="user.operate_subject">
              <el-select placeholder="请选择操作学科" v-model="userDetail.user.operate_subject" :disabled="subjectDisabled">
                <el-option v-for="item in subjectList" :key="item.subject_id" :label="item.subject_name"
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
              <el-select placeholder="请选择用户状态" v-model="userDetail.user.u_state">
                <el-option label="正常" value="正常"></el-option>
                <el-option label="限制登录" value="限制登录"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer">
        <el-button type="primary" @click="saveUserDetail">保存</el-button>
        <el-button @click="userDetailDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 添加校级管理员的对话框 -->
    <el-dialog title="添加校级管理员" width="650px"
               :visible.sync="addUserDialogVisible" @close="addUserDialogClosed">
      <el-form size="mini" label-width="100px" ref="addUserFormRef" :model="addUserInfo" :rules="addUserFormRules">
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="用户姓名" prop="name">
              <el-input v-model="addUserInfo.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属学校" prop="u_school">
              <el-select placeholder="请选择所属学校" v-model="addUserInfo.u_school">
                <el-option v-for="item in schoolList" :key="item.school_id" :label="item.school_name"
                           :value="item.school_name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="身份证号" prop="id_number">
              <el-input v-model="addUserInfo.id_number"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职工号" prop="job_number">
              <el-input v-model="addUserInfo.job_number"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="绑定邮箱" prop="email">
              <el-input v-model="addUserInfo.email"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="绑定手机号" prop="telephone">
              <el-input v-model="addUserInfo.telephone"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer">
        <el-button type="primary" @click="addUser">确定</el-button>
        <el-button @click="addUserDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "user-list",
    data() {
      return {
        //学校列表
        schoolList: [],
        //用户类型列表
        userTypeList: [],
        //检索用户表单数据
        searchUserForm: {
          u_id: '',
          u_type: '',
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
          pageSize: 1
        },
        //用户列表数据总数
        total: 0,
        //控制用户详情对话框是否可见
        userDetailDialogVisible: false,
        //用户详情信息
        userDetail: {
          user: {},
          user_type: {}
        },
        //修改用户信息详情的验证规则
        userDetailRules: {
          user: {
            name: [
              {required: true, message: '请输入用户姓名', trigger: 'blur'}
            ],
            u_school: [
              {required: true, message: '请选择所属学校', trigger: 'blur'}
            ],
            u_type: [
              {required: true, message: '请选择用户类型', trigger: 'blur'}
            ],
            id_number: [
              {required: true, message: '请输入用户身份证号', trigger: 'blur'}
            ],
            email: [
              {required: true, message: '请输入用户绑定邮箱', trigger: 'blur'},
              {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
            ],
            job_number: [
              {required: true, message: '请输入用户职工号', trigger: 'blur'}
            ],
            telephone: [
              {required: true, message: '请输入用户绑定手机号', trigger: 'blur'}
            ],
            u_state: [
              {required: true, message: '请选择用户状态', trigger: 'blur'}
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
        addUserInfo: {
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
            {required: true, message: '请输入用户姓名', trigger: 'blur'}
          ],
          u_school: [
            {required: true, message: '请选择所属学校', trigger: 'blur'}
          ],
          id_number: [
            {required: true, message: '请输入用户身份证号', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入用户绑定邮箱', trigger: 'blur'},
            {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
          ],
          job_number: [
            {required: true, message: '请输入用户职工号', trigger: 'blur'}
          ],
          telephone: [
            {required: true, message: '请输入用户绑定手机号', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      //获取学校列表数据
      getSchoolList() {
        //模拟网络请求
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
            meta: {msg: "", status: 200}
          }
        };
        if (res.meta.status !== 200) {
          return this.$message.error('获取学校列表失败！');
        }
        console.log(res);//---------------------------------------------------------------------------------------------
        this.schoolList = res.data.schoolList;
      },
      //获取用户类型列表数据
      getUserTypeList() {
        //模拟网络请求
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
            meta: {msg: "", status: 200}
          }
        };
        if (res.meta.status !== 200) {
          return this.$message.error("获取用户类型列表失败！");
        }
        console.log(res);//---------------------------------------------------------------------------------------------
        this.userTypeList = res.data.userTypeList;
      },
      //获取用户列表
      getUserList() {
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
                  user_type: {
                    u_type: 1,
                    u_type_name: "超级管理员",
                    u_power: "123456789"
                  }
                },
                // {
                //   user: {
                //     u_id: 2,
                //     u_type: 2,
                //     u_school: "长江大学",
                //     u_faculty: "计算机科学学院",
                //     job_number: "222222222",
                //     name: "李二狗",
                //     id_number: "222222222222222222",
                //     email: "222222222@qq.com",
                //     telephone: "22222222222",
                //     operate_subject: 2,
                //     u_state: "正常"
                //   },
                //   user_type: {
                //     u_type: 2,
                //     u_type_name: "校级管理员",
                //     u_power: "1678"
                //   }
                // },
                // {
                //   user: {
                //     u_id: 3,
                //     u_type: 2,
                //     u_school: "长江大学",
                //     u_faculty: "计算机科学学院",
                //     job_number: "222222222",
                //     name: "李二狗",
                //     id_number: "222222222222222222",
                //     email: "222222222@qq.com",
                //     telephone: "22222222222",
                //     operate_subject: 2,
                //     u_state: "正常"
                //   },
                //   user_type: {
                //     u_type: 2,
                //     u_type_name: "校级管理员",
                //     u_power: "1678"
                //   }
                // },
                // {
                //   user: {
                //     u_id: 4,
                //     u_type: 2,
                //     u_school: "长江大学",
                //     u_faculty: "计算机科学学院",
                //     job_number: "222222222",
                //     name: "李二狗",
                //     id_number: "222222222222222222",
                //     email: "222222222@qq.com",
                //     telephone: "22222222222",
                //     operate_subject: 2,
                //     u_state: "正常"
                //   },
                //   user_type: {
                //     u_type: 2,
                //     u_type_name: "校级管理员",
                //     u_power: "1678"
                //   }
                // },
                // {
                //   user: {
                //     u_id: 5,
                //     u_type: 2,
                //     u_school: "长江大学",
                //     u_faculty: "计算机科学学院",
                //     job_number: "222222222",
                //     name: "李二狗",
                //     id_number: "222222222222222222",
                //     email: "222222222@qq.com",
                //     telephone: "22222222222",
                //     operate_subject: 2,
                //     u_state: "正常"
                //   },
                //   user_type: {
                //     u_type: 2,
                //     u_type_name: "校级管理员",
                //     u_power: "1678"
                //   }
                // },
                // {
                //   user: {
                //     u_id: 6,
                //     u_type: 2,
                //     u_school: "长江大学",
                //     u_faculty: "计算机科学学院",
                //     job_number: "222222222",
                //     name: "李二狗",
                //     id_number: "222222222222222222",
                //     email: "222222222@qq.com",
                //     telephone: "22222222222",
                //     operate_subject: 2,
                //     u_state: "正常"
                //   },
                //   user_type: {
                //     u_type: 2,
                //     u_type_name: "校级管理员",
                //     u_power: "1678"
                //   }
                // },
                {
                  user: {
                    u_id: 7,
                    u_type: 2,
                    u_school: "长江大学",
                    u_faculty: "计算机科学学院",
                    job_number: "222222222",
                    name: "李二狗",
                    id_number: "222222222222222222",
                    email: "222222222@qq.com",
                    telephone: "22222222222",
                    operate_subject: 2,
                    u_state: "正常"
                  },
                  user_type: {
                    u_type: 2,
                    u_type_name: "校级管理员",
                    u_power: "1678"
                  }
                }
              ]
            }, meta: {msg: "获取用户列表成功", status: 200}
          }
        };
        if (res.meta.status !== 200) return this.$message.error('获取用户列表失败！');
        console.log(res);//---------------------------------------------------------------------------------------------
        this.userList = res.data.userList;
        this.total = res.data.total;
      },
      //点击按钮发起检索请求
      searchUser() {
        if (this.searchUserForm.u_id.trim().length == 0 &&
            this.searchUserForm.u_type.trim().length == 0 &&
            this.searchUserForm.u_school.trim().length == 0 &&
            this.searchUserForm.job_number.trim().length == 0 &&
            this.searchUserForm.name.trim().length == 0 &&
            this.searchUserForm.u_state.trim().length == 0) {
          return this.$message.error('请至少填写一项查询条件');
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
      //所属学校改变
      schoolChanged() {
        if (this.userDetail.user.u_school) {
          this.facultyList = [];
          this.userDetail.user.u_faculty = "";
          this.facultyDisabled = true;
          this.getFacultyList(this.userDetail.user.u_school);
        }
      },
      //获取院系列表数据
      getFacultyList(school_id) {
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {
              data: {
                facultyList: [
                  {faculty_id: 1, faculty_name: "计算机科学与技术", school: "长江大学"},
                  {faculty_id: 2, faculty_name: "软件工程", school: "长江大学"},
                  {faculty_id: 3, faculty_name: "物联网工程", school: "长江大学"},
                  {faculty_id: 4, faculty_name: "网络工程", school: "长江大学"}
                ]
              },
              meta: {msg: "", status: 200}
            }
          };
          if (res.meta.status !== 200) {
            return this.$message.error('获取院系列表失败！');
          }
          console.log(res);//---------------------------------------------------------------------------------------------
          this.facultyList = res.data.facultyList;
          this.facultyDisabled = false;
        }, 1000);
      },
      //所属院系改变
      facultyChanged() {
        if (this.userDetail.user.u_faculty) {
          this.subjectList = [];
          this.userDetail.user.operate_subject = null;
          this.subjectDisabled = true;
          this.getSubjectList(this.userDetail.user.u_faculty);
        }
      },
      //获取学科列表数据
      getSubjectList(faculty_id) {
        //模拟网络请求
        setTimeout(() => {
          const {data: res} = {
            data: {
              data: {
                subjectList: [
                  {subject_id: 1, subject_name: "数据结构", category: "工学"},
                  {subject_id: 2, subject_name: "计算机网络", category: "工学"},
                  {subject_id: 3, subject_name: "计算机组成原理及应用", category: "工学"}
                ]
              },
              meta: {msg: "", status: 200}
            }
          };
          if (res.meta.status !== 200) {
            return this.$message.error('获取学科列表失败！');
          }
          console.log(res);//---------------------------------------------------------------------------------------------
          this.subjectList = res.data.subjectList;
          this.subjectDisabled = false;
        }, 1000);
      },
      //监听用户详情对话框关闭事件
      userDetailDialogClosed() {
        this.$refs.userDetailFormRef.resetFields();
      },
      //点击按钮发起更新用户信息请求
      saveUserDetail() {
        this.$refs.userDetailFormRef.validate(async (valid) => {
          if (!valid) return;
          //弹框询问用户是否保存修改
          const confirmResult = await this.$confirm('此操作将提交修改用户信息，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err);
          if (confirmResult !== 'confirm') {
            return this.$message.info('已取消修改');
          }
          const {data: res} = {
            data: {meta: {msg: "", status: 200}}
          };
          if (res.meta.status !== 200) {
            return this.$message.error('修改用户信息失败！');
          }
          console.log(res);//---------------------------------------------------------------------------------------------
          this.userDetailDialogVisible = false;
          this.getUserList();
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
          return this.$message.info('已取消删除');
        }
        const {data: res} = {
          data: {meta: {msg: "", status: 200}}
        };
        if (res.meta.status !== 200) {
          return this.$message.error('删除用户失败！');
        }
        console.log(res);//---------------------------------------------------------------------------------------------
        this.getUserList();
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
            return this.$message.info('已取消添加');
          }
          const {data: res} = {
            data: {meta: {msg: "", status: 200}}
          };
          if (res.meta.status !== 200) {
            return this.$message.error('添加用户失败！');
          }
          console.log(res);//---------------------------------------------------------------------------------------------
          this.addUserDialogVisible = false;
          this.getUserList();
        });
      },
      //监听添加用户对话框关闭事件
      addUserDialogClosed() {
        this.$refs.addUserFormRef.resetFields();
      }
    },
    created() {
      this.getSchoolList();
      this.getUserTypeList();
      this.getUserList();
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