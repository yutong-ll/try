
<template>
  <el-row class="login-container" justify="center" :align="'middle'">
    <el-card style="max-width: 480px">
      <template #header>
        <div class="card-header">
          <img :src="imgUrl" alt="" />
        </div>
      </template>

      <div class="jump-link">
        <el-link type="primary" @click="handleChange">
          {{ formType ? "返回登录" : "注册账号" }}
        </el-link>
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        style="max-width: 600px"
        :rules="rules"
      >
        <el-form-item prop="userName">
          <el-input
            v-model="loginForm.userName"
            placeholder="手机号"
            prefix-icon="UserFilled"
          />
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input
            v-model="loginForm.passWord"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
          />
        </el-form-item>
        <el-form-item v-if="formType" prop="validCode">
          <el-input
            v-model="loginForm.validCode"
            placeholder="验证码"
            prefix-icon="UserFilled"
          >
            <template #append>
              <span @click="countChange">
                {{ count.validText }}
              </span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :style="{ width: '100%' }"
            @click="submitForm(loginFormRef)"
          >
            {{ formType ? "注册账号" : "登录" }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
</template>
<script setup>
import { reactive, ref, computed, toRaw } from "vue";
import { getCode, userAuthentication, login, menuPermission } from "../../api";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const router = useRouter();
const store = useStore();
const imgUrl = new URL("../../../public/login-head.png", import.meta.url).href;

//
const routerList = computed(() => store.state.menu.routerList);
//表单数据
const loginForm = reactive({
  userName: "",
  passWord: "",
  validCode: "",
});

//切换表单（0注册，1登录）
const formType = ref(0);
// 绑定事件，点击切换登录和注册
const handleChange = () => {
  formType.value = formType.value ? 0 : 1;
};

//发送短信
const count = reactive({
  validText: "获取验证码",
  time: 60,
});
//
let flag = false;
const countChange = () => {
  //以防重复点击，如果已发送短信，不处理
  if (flag) return;
  //判断手机号是否正确
  const phoneReg =
    /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
  if (!loginForm.userName || !phoneReg.test(loginForm.userName)) {
    return ElMessage({
      message: "请检查手机号是否正确",
      type: "warning",
    });
  }
  const time = setInterval(() => {
    if (count.time <= 0) {
      count.time = 60;
      count.validText = "获取验证码";
      flag = false;
      clearInterval(time);
    } else {
      count.time -= 1;
      count.validText = `剩余${count.time}s`;
    }
  }, 1000);
  flag = true;
  getCode({ tel: loginForm.userName }).then(({ data }) => {
    console.log(data, "data");
    if (data.code === 10000) {
      ElMessage({
        message: "发送成功",
        type: "success",
      });
    }
  });
};

//
const validateUser = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入账号"));
  } else {
    const phoneReg =
      /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
    phoneReg.test(value)
      ? callback()
      : callback(new Error("请检查手机号格式是否正确"));
  }
};
const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    const passReg = /^[a-zA-Z0-9_-]{4,16}$/;

    passReg.test(value)
      ? callback()
      : callback(new Error("请检查密码格式是否正确，需要4到16位字符"));
  }
};
const rules = reactive({
  userName: [{ validator: validateUser, trigger: "blur" }],
  passWord: [{ validator: validatePass, trigger: "blur" }],
});

const loginFormRef = ref();
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(loginForm, "submit!");
      if (formType.value) {
        console.log(formType.value);
        userAuthentication(loginForm).then(({ data }) => {
          if (data.code === 10000) {
            ElMessage.success("注册成功，请登录");
            formType.value = 0;
          }
        });
      } else {
        login(loginForm).then(({ data }) => {
          if (data.code === 10000) {
            ElMessage.success("登录成功");
            console.log(data);
            //将token和用户信息缓存到浏览器
            localStorage.setItem("pz_token", data.data.token);
            localStorage.setItem(
              "pz_userInfo",
              JSON.stringify(data.data.userInfo)
            );
            menuPermission().then(({ data }) => {
              store.commit("dynamicMenu", data.data);
              console.log(routerList);
              //toRaw把响应式数据转成原始数据
              toRaw(routerList.value).forEach((item) => {
                router.addRoute("main", item);
              });
            });
            router.push("/");
          }
        });
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>
<style lang="less" scoped>
:deep(.el-card__header) {
  padding: 0;
}
.login-container {
  height: 100%;
  .card-header {
    background-color: #899fe1;
    img {
      width: 430px;
    }
  }
  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
}
</style>

