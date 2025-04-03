<template>
  <div class="common-layout">
    <el-container>
      <!-- <el-aside width="200px">Aside</el-aside> -->
      <Aside />
      <el-container>
        <el-header> <Header /></el-header>
        <el-main> <RouterView /></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Aside from "../components/aside.vue";
import Header from "../components/navHeader.vue";
</script>

<style lang="less" scoped>
//清除默认内外边距，否则el-header本身设置有padding

* {
  padding: 0;
  margin: 0;
}
.common-layout {
  height: 100%;
  .el-container {
    height: 100%;
  }
}
</style>
