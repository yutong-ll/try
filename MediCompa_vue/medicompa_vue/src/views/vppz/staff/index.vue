<template>
  <pane-head :route="route" />
  <div class="btns">
    <el-button :icon="Plus" type="primary" @click="open(null)" size="small"
      >新增</el-button
    >
    <el-popconfirm
      width="220"
      :icon="InfoFilled"
      icon-color="#626AEF"
      title="是否确认删除"
      @confirm="confirmEvent"
      ><template #reference>
        <el-button :icon="Delete" type="danger" size="small">Delete</el-button>
      </template>
    </el-popconfirm>
  </div>
  <el-table
    :data="tableData.list"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column prop="id" label="id" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="avatar" label="头像">
      <template #default="scope">
        <el-image style="width: 50px; height: 50px" :src="scope.row.avatar" />
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
    title="添加陪护师"
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
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id" />
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-button v-if="!form.avatar" type="primary" @click="openImg(null)"
          >点击上传</el-button
        >
        <el-image
          v-else
          :src="form.avatar"
          style="width: 100px; height: 100px"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option lable="女" value="女" />
          <el-option lable="男" value="男" />
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="form.age" :min="18" :max="50" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="是否生效" prop="active">
        <el-radio-group v-model="form.active" placeholder="请填写权限名称">
          <el-radio :value="0">失效</el-radio>
          <el-radio :value="1">生效</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="dialogImgVisible"
    :before-close="beforeClose"
    title="选择图片"
    width="680"
    align-center
  >
    <div class="image-list">
      <div
        v-for="(item, index) in fileList"
        :key="item.name"
        class="img-box"
        @click="selectImgIndex = index"
      >
        <div v-if="selectImgIndex === index" class="select">
          <el-icon color="#fff"><Check /></el-icon>
        </div>
        <el-image style="width: 148px; height: 148px" :src="item.url" />
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogImgVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmImg">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import paneHead from "../../../components/panelHead.vue";
import { ref, reactive, onMounted, nextTick } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { Delete } from "@element-plus/icons-vue";
import { InfoFilled } from "@element-plus/icons-vue";
import {
  photoList,
  companion,
  companionList,
  companionDelete,
} from "../../../api";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import { useRoute } from "vue-router";

const route = useRoute();

//弹窗的显示隐藏
const centerDialogVisible = ref(false);
const open = (rowData = {}) => {
  centerDialogVisible.value = true;
  //弹窗打开，form生成是异步的
  nextTick(() => {
    if (rowData) {
      //浅拷贝
      Object.assign(form, {
        id: rowData.id,
        name: rowData.name,
        avatar: rowData.avatar,
        age: rowData.age,
        mobile: rowData.mobile,
        active: rowData.active,
        sex: rowData.sex,
      });
    }
  });
};
//关闭弹窗的回调
const beforeClose = () => {
  centerDialogVisible.value = false;
  //重置表单
  formRef.value.resetFields();
};

//表单提交
const confirm = async (formEl) => {
  if (!formEl) return;
  console.log(form);
  await formEl.validate((valid, fields) => {
    if (valid) {
      companion(form).then(({ data }) => {
        console.log(data);
        if (data.code === 10000) {
          ElMessage.success(data.message);
          beforeClose();
          getListData();
        } else {
          ElMessage.error(data.message);
        }
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};

//表单
const formRef = ref();
const form = reactive({
  id: "",
  mobile: "",
  active: 1,
  age: 28,
  avatar: "",
  name: "",
  sex: "",
});
const rules = reactive({
  name: [{ required: true, trigger: "blur", message: "请填写昵称" }],
  avatar: [{ required: true, message: "请选择头像" }],
  gender: [{ required: true, trigger: "change", message: "请选择性别" }],
  mobile: [{ required: true, trigger: "blur", message: "请填写手机号" }],
});

const dialogImgVisible = ref(false);
const openImg = (rowData = {}) => {
  dialogImgVisible.value = true;
};

//头像选择弹窗
const fileList = ref([]);
const selectImgIndex = ref(0);
onMounted(() => {
  photoList().then(({ data }) => {
    fileList.value = data.data;
  });
  getListData();
});
const confirmImg = () => {
  form.avatar = fileList.value[selectImgIndex.value].url;
  dialogImgVisible.value = false;
  console.log(form.avatar);
};

//table
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});

//列表数据
const tableData = reactive({
  list: [],
  total: 0,
});
//请求列表数据

const getListData = () => {
  companionList(paginationData).then(({ data }) => {
    const { list, total } = data.data;
    tableData.list = list;
    tableData.total = total;
    list.forEach((item) => {
      item.create_time = dayjs(item.create_time).format("YYYY-MM-DD");
    });
  });
};

//分页
const handleSizeChange = (val) => {
  paginationData.pageSize = val;
  getListData();
};
const handleCurrentChange = (val) => {
  paginationData.pageNum = val;
  getListData();
};
//批量选择
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
  multipleSelection.value = val.map((item) => ({ id: item.id }));
};

const confirmEvent = () => {
  if (!multipleSelection.value.length) {
    return ElMessage.warning("请选择至少一项");
  } else {
    companionDelete({ id: multipleSelection.value }).then(({ data }) => {
      if (data.code === 10000) {
        getListData();
      }
    });
  }
};
</script>
<style lang="less" scoped>
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>