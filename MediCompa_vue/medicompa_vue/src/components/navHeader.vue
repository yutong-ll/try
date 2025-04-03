<template>
  <div class="header-container">
    <div class="header-left flex-box">
      <el-icon class="icon" size="20" @click="store.commit('collapseMenu')"
        ><Fold
      /></el-icon>
      <ul class="flex-box">
        <li
          v-for="(item, index) in selectMenu"
          :key="item.path"
          :class="{ selected: route.path === item.path }"
          class="tab flex-box"
        >
          <el-icon size="12">
            <component :is="item.icon" />
          </el-icon>
          <router-link class="text flex-box" :to="{ path: item.path }">
            {{ item.name }}
          </router-link>
          <el-icon size="12">
            <Close class="close" @click="closeTab(item, index)" />
          </el-icon>
        </li>
      </ul>
    </div>

    <div class="header-right">
      <el-dropdown @command="handleClick">
        <!-- 不加flex-box不能在一行显示，adm -->
        <div class="el-dropdown-link flex-box">
          <el-avatar :src="userInfo.avatar" />
          <p class="username">{{ userInfo.name }}</p>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="cancel">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { computed } from "vue";

const route = useRoute();
//拿到store实例，创建store对象
const store = useStore();
const selectMenu = computed(() => store.state.menu.selectMenu);
const router = useRouter();
const closeTab = (item, index) => {
  store.commit("closeMenu", item);
  //删除非当前页
  if (route.path !== item.path) {
    return;
  }
  const selectMenuData = selectMenu.value;
  //删除的是最后一项
  if (index === selectMenuData.length) {
    if (!selectMenuData.length) {
      router.push("/");
    } else {
      router.push({ path: selectMenuData[index - 1].path });
    }
    //删除的是中间项
  } else {
    router.push({
      path: selectMenuData[index].path,
    });
  }
};

const handleClick = (command) => {
  //点击退出，清除token,登出
  if (command === "cancel") {
    localStorage.removeItem("pz_token");
    localStorage.removeItem("pz_userInfo");
    localStorage.removeItem("pz_v3pz");
    window.location.href = window.location.origin;
  }
};

const userInfo = JSON.parse(localStorage.getItem("pz_userInfo"));
console.log();
</script>
<style lang="less" scoped>
.flex-box {
  height: 100%;
  display: flex;
  align-items: center;
}
.header-container {
  // flex???
  display: flex;
  //左右靠边
  justify-content: space-between;
  //水平居中, 这个样式可以单独设置成.flex-box,后续直接添加样式
  align-items: center;
  height: 100%;
  background-color: #fff;
  padding-right: 25px;
  .header-left {
    height: 100%;
    .icon {
      width: 45px;
      height: 100%;
    }
    .icon:hover {
      background-color: #f5f5f5;
      //   小手
      cursor: pointer;
    }
    .tab {
      height: 100%;
      padding: 0 10px;
      margin: 0;
      .text {
        height: 100%;
        margin: 0 5px;
      }
      a {
        height: 100%;
        color: #333;
        font-size: 15px;
        text-decoration: none;
      }
      .close {
        visibility: hidden;
      }
      // & 同级
      &.selected {
        a {
          color: #409eff;
        }
        i {
          color: #409eff;
        }
        background-color: #f5f5f5;
      }
    }
    .tab:hover {
      background-color: #f5f5f5;
      cursor: pointer;
      .close {
        visibility: inherit;
      }
    }
  }
  .el-dropdown-link:hover {
    background-color: #f5f5f5;
    //   小手
    cursor: pointer;
  }
}
</style>