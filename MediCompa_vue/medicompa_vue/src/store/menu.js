import { it } from "element-plus/es/locales.mjs"

const localData = localStorage.getItem('pz_v3pz')
const state = localData ? localData.menu : {
    isCollapse: false,
    selectMenu: [],
    routerList: [],
    menuActive: "1-1"
}

const mutations = {
    collapseMenu(state) {
        state.isCollapse = !state.isCollapse
    },
    addMenu(state, payload) {
        if (state.selectMenu.findIndex(item => item.path === payload.path) === -1) {
            state.selectMenu.push(payload)
        }
    },
    closeMenu(state, payload) {
        //找到点击数据的索引
        const index = state.selectMenu.findIndex(item => item.name === payload.name)
        //通过索引删除指定元素
        state.selectMenu.splice(index, 1)
        console.log(payload)
        console.log(state.selectMenu)
    },
    dynamicMenu(state, payload) {
        //通过glob导入文件
        const modules = import.meta.glob('../views/**/**/*.vue');
        routerSet(payload)
        function routerSet(router) {
            router.forEach(route => {
                //没有子菜单，拼接路由数据
                if (!route.children) {
                    const url = `../views${route.meta.path}/index.vue`
                    //url作为modules的key，拿到获取的vue组件
                    route.component = modules[url]
                }
                else//有子菜单 递归
                {
                    routerSet(route.children)
                }
            });
        }
        //拿到完整的路由数据,即更新后的payload
        state.routerList = payload
    },
    //
    updateMenuActive(state, payload) {
        state.menuActive = payload
    }
}

export default {
    state,
    mutations
}