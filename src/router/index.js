import Vue from 'vue'
import VueRouter from 'vue-router'

/*路由懒加载*/
//登录页面
const Login = () => import("../views/Login")
//Home页面
const Home = () => import("../views/Home")
//欢迎页
const Welcome = () => import("../views/Welcome")
//用户列表页
const UserList = () => import("../views/content/user/UserList")
//学校列表页
const SchoolList = () => import("../views/content/school/SchoolList")
//用户类型管理页
const UserTypeManager = () => import("../views/content/user_type/UserTypeManager")
//个人信息页
const Profile = () => import("../views/content/user/Profile")
//通知管理页
const NoticeManager = () => import("../views/content/notice/NoticeManager")
//通知页
const Notice = () => import("../views/content/notice/Notice")
//院系列表页
const FacultyList = () => import("../views/content/faculty/FacultyList")
//学科列表页
const SubjectList = () => import("../views/content/major/SubjectList")
//专业列表页
const MajorList = () => import("../views/content/major/MajorList")
//待审试题页
const PendingQuestions = () => import("../views/content/question/PendingQuestions")
//题库页
const Questions = () => import("../views/content/question/Questions")
//我的选题页
const MyOptions = () => import("../views/content/question/MyOptions")
//组卷页
const MakeExamPaper = () => import("../views/content/exam_paper/MakeExamPaper")
//我的试卷页
const MyExamPaper = () => import("../views/content/exam_paper/MyExamPaper")
//上传试题页
const UploadQuestion = () => import("../views/content/question/UploadQuestion")
//我的试题页
const MyQuestions = () => import("../views/content/question/MyQuestions")

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children: [
      {path: '/welcome', component: Welcome},
      {path: '/user_list', component: UserList},
      {path: '/school_list', component: SchoolList},
      {path: '/user_type_manager', component: UserTypeManager},
      {path: '/profile', component: Profile},
      {path: '/notice_manager', component: NoticeManager},
      {path: '/notice', component: Notice},
      {path: '/faculty_list', component: FacultyList},
      {path: '/subject_list', component: SubjectList},
      {path: '/major_list', component: MajorList},
      {path: '/pending_questions', component: PendingQuestions},
      {path: '/questions', component: Questions},
      {path: '/my_options', component: MyOptions},
      {path: '/make_exam_paper', component: MakeExamPaper},
      {path: '/my_exam_paper', component: MyExamPaper},
      {path: '/upload_question', component: UploadQuestion},
      {path: '/my_questions', component: MyQuestions}
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next();
})

export default router
