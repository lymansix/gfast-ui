<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="所属部门" prop="deptId">
        <el-input v-model="queryParams.deptId" placeholder="请输入所属部门" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="课程ID" prop="courseId">
        <el-input v-model="queryParams.courseId" placeholder="请输入课程ID" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="作品名" prop="workName">
        <el-input v-model="queryParams.workName" placeholder="请输入作品名" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="作品类型" prop="workType">
        <el-select v-model="queryParams.workType" placeholder="请选择作品类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="作品状态" prop="workStatus">
        <el-select v-model="queryParams.workStatus" placeholder="请选择作品状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="作业ID" prop="additionalId">
        <el-input v-model="queryParams.additionalId" placeholder="请输入作业ID" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="来源场景" prop="workScene">
        <el-input v-model="queryParams.workScene" placeholder="请输入来源场景" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['teach/teachWork/edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['teach/teachWork/delete']">删除</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="teachWorkList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="所属部门" align="center" prop="deptId" />
      <el-table-column label="课程ID" align="center" prop="courseId" />
      <el-table-column label="作品名" align="center" prop="workName" />
      <el-table-column label="作品类型" align="center" prop="workType" />
      <el-table-column label="作品文件" align="center" prop="workFile" />
      <el-table-column label="作品封面" align="center" prop="workCover" />
      <el-table-column label="作品状态" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.workStatus" :active-value="1" :inactive-value="0"
            @change="workStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="点赞次数" align="center" prop="starNum" />
      <el-table-column label="收藏次数" align="center" prop="collectNum" />
      <el-table-column label="查看次数" align="center" prop="viewNum" />
      <el-table-column label="作业ID" align="center" prop="additionalId" />
      <el-table-column label="来源场景" align="center" prop="workScene" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['teach/teachWork/edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['teach/teachWork/delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <!-- 添加或修改编程作品对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  addTeachWork,
  changeTeachWorkWorkStatus,
  delTeachWork,
  getTeachWork,
  listTeachWork,
  updateTeachWork,
} from "@/api/teach/teachWork";
export default {
  components: {},
  name: "TeachWorkList",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 编程作品表格数据
      teachWorkList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptId: undefined,
        courseId: undefined,
        workName: undefined,
        workType: undefined,
        workStatus: undefined,
        additionalId: undefined,
        workScene: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        workName: [
          { required: true, message: "作品名不能为空", trigger: "blur" }
        ],
        workType: [
          { required: true, message: "作品类型不能为空", trigger: "blur" }
        ],
        workFile: [
          { required: true, message: "作品文件不能为空", trigger: "blur" }
        ],
        workStatus: [
          { required: true, message: "作品状态不能为空", trigger: "blur" }
        ],
        starNum: [
          { required: true, message: "点赞次数不能为空", trigger: "blur" }
        ],
        collectNum: [
          { required: true, message: "收藏次数不能为空", trigger: "blur" }
        ],
        viewNum: [
          { required: true, message: "查看次数不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 作品状态修改
    workStatusChange(row) {
      let text = row.workStatus === 1 ? "启用" : "停用";
      this.$confirm('确认要"' + text + '"：吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return changeTeachWorkWorkStatus(row.id, row.workStatus);
      }).then(() => {
        this.msgSuccess(text + "成功");
      }).catch(function () {
        row.userStatus = row.userStatus === 0 ? 1 : 0;
      });
    },
    /** 查询编程作品列表 */
    getList() {
      this.loading = true;
      listTeachWork(this.queryParams).then(response => {
        this.teachWorkList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        deptId: undefined,
        courseId: undefined,
        workName: undefined,
        workType: undefined,
        workFile: undefined,
        workCover: undefined,
        workStatus: "0",
        starNum: undefined,
        collectNum: undefined,
        viewNum: undefined,
        additionalId: undefined,
        workScene: undefined,
        createdBy: undefined,
        updatedBy: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        deletedAt: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加编程作品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTeachWork(id).then(response => {
        let data = response.data;
        data.workType = '' + data.workType
        data.workStatus = '' + data.workStatus
        this.form = data;
        this.open = true;
        this.title = "修改编程作品";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateTeachWork(this.form).then(response => {
              if (response.code === 0) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addTeachWork(this.form).then(response => {
              if (response.code === 0) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除编程作品编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delTeachWork(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    }
  }
};
</script>