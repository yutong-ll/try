import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import store from './store'
import { tr } from 'element-plus/es/locales.mjs'
import PanelHead from './components/panelHead.vue'

//刷新后动态路由添加
const localData = localStorage.getItem('pz_v3pz')
if (localData) {
    store.commit('dynamicMenu', JSON.parse(localData).menu.routerList)
    store.state.menu.routerList.forEach(item => {
        router.addRoute('main', item)
    })
}



//前置导航守卫，在页面跳转之前判断
router.beforeEach((to, from) => {
    const token = localStorage.getItem('pz_token')
    //非登录页面token不存在,跳转到/login
    //登录页面token不存在,维持当前页面
    if (!token && to.path !== '/login') {
        return '/login'
    }
    // else if (token && to.path === '/login') {
    //     return '/'
    // } else {
    //     // return true
    // }
})

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.component('PanelHead', PanelHead)
//路由挂载
app.use(router)
//store挂载
app.use(store)
app.mount('#app')
