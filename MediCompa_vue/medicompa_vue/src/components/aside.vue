<template>
  <el-menu
    :style="{ width: !isCollapse ? '230px' : '64px' }"
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="aside-container"
    text-color="#fff"
    @open="handleOpen"
    @close="handleClose"
    :collapse="isCollapse"
    :default-active="active"
  >
    <p class="aside-title">{{ !isCollapse ? "DD-陪诊" : "DD" }}</p>
    <treeMenu :menuData="menuData" :index="1" />
  </el-menu>
</template>

<script setup>
import treeMenu from "./treeMenu.vue";
import { useRouter } from "vue-router";
import { reactive, computed } from "vue";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();
//const menuData = reactive(router.options.routes[0].children);
//通过计算属性拿到menuData，随权限变化
const menuData = computed(() => store.state.menu.routerList);
const isCollapse = computed(() => store.state.menu.isCollapse);
const active = computed(() => store.state.menu.menuActive);

const handleOpen = () => {};
const handleClose = () => {};
</script>

<style lang="less" scoped>
.aside-container {
  height: 100%;
  .aside-title {
    font-size: 20px;
    text-align: center;
    color: #fff;
  }
}
</style>
