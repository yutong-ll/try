
<template>
  <pane-head :route="route" />
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="id" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="permissions_id" label="所属组别">
      <template #default="scope">
        <!-- scope.row拿到当前行 -->
        {{ permissionName(scope.row.permissions_id) }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号" />
    <el-table-column prop="active" label="状态">
      <template #default="scope">
        <el-tag type="scope.row.active ? 'success' : 'danger'">
          {{ scope.row.active ? "正常" : "失效" }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="创建时间">
      <template #default="scope">
        <div class="flex-box">
          <!-- scope.row拿到当前行 -->
          <el-icon><Clock /></el-icon>
          <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <!-- scope.row拿到当前行 -->
        <el-button type="primary" @click="open(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-info">
    <el-pagination
      v-model:current-page="paginationData.pageNum"
      :page-size="paginationData.pageSize"
      :size="small"
      :background="false"
      layout="total, prev, pager, next"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <el-dialog
    v-model="centerDialogVisible"
    :before-close="beforeClose"
    title="添加权限"
    width="500"
    align-center
  >
    <el-form
      ref="formRef"
      label-width="100px"
      label-position="left"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" disabled />
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="菜单权限" prop="permission_id">
        <el-select
          v-model="form.permissions_id"
          placeholder="请选择菜单权限"
          style="width: 240px"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { authAdmin, menuSelectList, upDataUser } from "../../../api";
import paneHead from "../../../components/panelHead.vue";
import { onMounted, reactive, ref } from "vue";
import dayjs from "dayjs";
import { useRoute } from "vue-router";
// import { Clock } from "@element-plus/icons-vue/dist/types";
const route = useRoute();
//列表数据
const tableData = reactive({
  list: [],
  total: 0,
});
//表单数据
const form = reactive({
  name: "",
  permissions_id: "",
});

const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});
const handleSizeChange = (val) => {
  paginationData.pageSize = val;
  getListData();
};
const handleCurrentChange = (val) => {
  paginationData.pageNum = val;
  getListData();
};

const rules = reactive({
  name: [{ required: true, trigger: "blur", message: "请填写昵称" }],
  permissions_id: [
    { required: true, trigger: "blur", message: "请选择菜单权限" },
  ],
});
onMounted(() => {
  getListData();
  menuSelectList().then((data) => {
    options.value = data.data.data;
    console.log(options.value);
  });
});
const getListData = () => {
  authAdmin(paginationData).then((data) => {
    console.log(data, "authAdmin");
    const { list, total } = data.data.data;
    console.log(total);
    list.forEach((item) => {
      item.create_time = dayjs(item.create_time).format("YYYY-MM-DD");
    });
    tableData.list = list;
    tableData.total = total;
  });
};

const options = ref([]);
//根据id匹配权限名称,把对应的那一条返回 {id: 5975, name: "12"}
const permissionName = (id) => {
  console.log("options", options);
  const data = options.value.find((el) => el.id === id);
  return data ? data.name : "超级管理员";
};
//弹窗的显示隐藏
const centerDialogVisible = ref(false);
const open = (rowData = {}) => {
  centerDialogVisible.value = true;
  //弹窗打开，form生成是异步的,没有复用表单，可以不异步，与group对比

  Object.assign(form, {
    mobile: rowData.mobile,
    name: rowData.name,
    permissions_id: rowData.permissions_id,
  });
};
const formRef = ref();
//表单提交
const confirm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const { name, permissions_id } = form;
      upDataUser({ name, permissions_id }).then(({ data }) => {
        if (data.code === 10000) {
          centerDialogVisible.value = false;
          getListData();
        }
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>
<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;
}
</style>

