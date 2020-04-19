import Vue from 'vue'
import {
  Message,
  MessageBox,
  Button,
  Form,
  FormItem,
  Select,
  Option,
  Input,
  Link,
  Container,
  Header,
  Aside,
  Main,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  MenuItem,
  Submenu,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Pagination,
  Dialog
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Select)
Vue.use(Option)
Vue.use(Input)
Vue.use(Link)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm