<template>
  <template v-for="item in props.menuData">
    <!-- 没有子菜单，p.s. key = ""不加会报错 -->
    <el-menu-item
      @click="handleClick(item, `${props.index}-${item.meta.id}`)"
      v-if="!item.children || item.children.length == 0"
      :index="`${props.index}-${item.meta.id}`"
      :key="`${props.index}-${item.meta.id}`"
    >
      <el-icon size="20">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.name }}</span>
    </el-menu-item>

    <el-sub-menu
      v-else
      :index="`${props.index}-${item.meta.id}`"
      :key="`${props.index}-${item.meta.id}+1`"
    >
      <template #title>
        <el-icon size="20">
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.name }}</span>
      </template>
      <tree-menu
        :index="`${props.index}-${item.meta.id}`"
        :menuData="item.children"
      />
    </el-sub-menu>
  </template>
</template>


<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const props = defineProps(["menuData", "index"]);
console.log(props.index, props.menuData, "111");
const router = useRouter();
const store = useStore();
const handleClick = (item, activeIndex) => {
  store.commit("addMenu", item.meta);
  store.commit("updateMenuActive", activeIndex);
  router.push(item.meta.path);
};
</script>

<style lang="less" scoped>
</style>
