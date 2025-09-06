<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="业务id" prop="businessId">
        <el-input v-model="queryParams.businessId" placeholder="请输入业务id" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="文件类型" prop="fileType">
        <el-select v-model="queryParams.fileType" placeholder="请选择文件类型" clearable size="small">
          <el-option v-for="dict in fileTypeOptions" :key="dict.key" :label="dict.value" :value="dict.key" />
        </el-select>
      </el-form-item>
      <el-form-item label="文件路径" prop="filePath">
        <el-input v-model="queryParams.filePath" placeholder="请输入文件路径" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="文件标签" prop="fileTag">
        <el-input v-model="queryParams.fileTag" placeholder="请输入文件标签" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system/sysFile/delete']">删除</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="sysFileList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="业务id" align="center" prop="businessId" />
      <el-table-column label="文件类型" align="center" prop="fileType" :formatter="fileTypeFormat" />
      <el-table-column label="文件路径" align="center" prop="filePath" />
      <el-table-column label="存储位置" align="center" prop="fileLocation" />
      <el-table-column label="文件标签" align="center" prop="fileTag" />
      <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system/sysFile/edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system/sysFile/delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <!-- 添加或修改系统文件对话框 -->
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
  addSysFile,
  delSysFile,
  getSysFile,
  listSysFile,
  updateSysFile,
} from "@/api/system/sysFile";
export default {
  components: {},
  name: "SysFile",
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
      // 系统文件表格数据
      sysFileList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // fileTypeOptions字典数据
      fileTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        businessId: undefined,
        fileType: undefined,
        filePath: undefined,
        fileTag: undefined,
        createdAt: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        filePath: [
          { required: true, message: "文件路径不能为空", trigger: "blur" }
        ],
        fileLocation: [
          { required: true, message: "存储位置不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getDicts("file_type").then(response => {
      this.fileTypeOptions = response.data.values || [];
    });
    this.getList();
  },
  methods: {
    /** 查询系统文件列表 */
    getList() {
      this.loading = true;
      listSysFile(this.queryParams).then(response => {
        this.sysFileList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 文件类型字典翻译
    fileTypeFormat(row, column) {
      return this.selectDictLabel(this.fileTypeOptions, row.fileType);
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
        businessId: undefined,
        fileType: undefined,
        filePath: undefined,
        fileLocation: undefined,
        fileTag: undefined,
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
      this.title = "添加系统文件";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSysFile(id).then(response => {
        let data = response.data;
        data.fileType = '' + data.fileType
        this.form = data;
        this.open = true;
        this.title = "修改系统文件";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateSysFile(this.form).then(response => {
              if (response.code === 0) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addSysFile(this.form).then(response => {
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
      this.$confirm('是否确认删除系统文件编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delSysFile(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    }
  }
};
</script>