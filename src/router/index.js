import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'

/*路由懒加载*/
//登录页面
const Login = () => import("../views/Login")
//忘记密码页
const ForgetPassword = () => import("../views/ForgetPassword")
//Home页面
const Home = () => import("../views/Home")
//欢迎页
const Welcome = () => import("../views/Welcome")
//用户列表页
const UserList = () => import("../views/content/user/UserList")
//个人信息页
const Profile = () => import("../views/content/user/Profile")
//通知列表页
const NoticeList = () => import("../views/content/notice/NoticeList")
//学校列表页
const SchoolList = () => import("../views/content/school/SchoolList")
//用户类型管理页
const UserTypeManager = () => import("../views/content/user_type/UserTypeManager")
//院系列表页
const FacultyList = () => import("../views/content/faculty/FacultyList")
//专业列表页
const MajorList = () => import("../views/content/major/MajorList")
//学科列表页
const SubjectList = () => import("../views/content/major/SubjectList")
//学科详情页
const SubjectDetail = () => import("../views/content/major/SubjectDetail")
//待审试题页
const PendingQuestions = () => import("../views/content/question/PendingQuestions")
//试题详情页
const QuestionDetail = () => import("../views/content/question/QuestionDetail")
//题库页
const Questions = () => import("../views/content/question/Questions")
//我的选题页
const MyOptions = () => import("../views/content/question/MyOptions")
//我的试题页
const MyQuestions = () => import("../views/content/question/MyQuestions")
//上传试题页
const UploadQuestion = () => import("../views/content/question/UploadQuestion")
//组卷页
const MakeExamPaper = () => import("../views/content/exam_paper/MakeExamPaper")
//我的试卷页
const MyExamPaper = () => import("../views/content/exam_paper/MyExamPaper")
//试卷详情页
const ExamPaperDetail = () => import("../views/content/exam_paper/ExamPaperDetail")

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
    path: '/forget_password',
    name: 'forget-password',
    component: ForgetPassword
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
      {path: '/notice_manager', component: NoticeList},
      {path: '/notice', component: NoticeList},
      {path: '/faculty_list', component: FacultyList},
      {path: '/subject_list', component: SubjectList},
      {path: '/subject_detail', component: SubjectDetail},
      {path: '/major_list', component: MajorList},
      {path: '/pending_questions', component: PendingQuestions},
      {path: '/question_detail', component: QuestionDetail},
      {path: '/questions', component: Questions},
      {path: '/my_options', component: MyOptions},
      {path: '/make_exam_paper', component: MakeExamPaper},
      {path: '/my_exam_paper', component: MyExamPaper},
      {path: '/exam_paper_detail', component: ExamPaperDetail},
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
  if (to.path === '/login' || to.path === '/forget_password') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  if (to.path === '/home' || to.path === '/welcome') return next();
  for (let item of store.state.menu.menu) {
    if (to.path === item.path || to.path == item.childPath) return next();
  }
  next('/home');
})

export default router
