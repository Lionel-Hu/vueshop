import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
Vue.use(VueRouter)
const router = new VueRouter({
    routes: [{
            path: '/',
            redirect: '/login'
        },
        { path: '/login', component: Login },
        {
            path: '/Home',
            component: Home,
            redirect: '/welcome',
            children: [
                { path: '/welcome', component: Welcome },
                { path: '/users', component: Users },
                { path: '/rights', component: Rights },
                { path: '/roles', component: Roles }
            ]
        }
    ]
})

// 添加路由导航守卫
router.beforeEach((to, from, next) => {
    // to表示将要访问的路径
    // from 代表从哪个路径跳转而来
    // next 是一个函数,表示放行
    // next()直接放行, next('/路径')强制跳转到特定的路径
    if (to.path === '/login')
        return next();
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('/login');
    next();

});
export default router;