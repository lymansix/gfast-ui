<template>
  <div class="app-container">
    <!-- 卡片网格 -->
    <el-row :gutter="30">
      <el-col :span="10" v-for="(item, index) in works" :key="index" :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-card :body-style="{ padding: '0px' }" class="work-card" shadow="hover">
          <div class="img-wrap">
            <!-- 封面图 -->
            <img :src="item.workCoverUrl" referrerpolicy="origin" class="cover" @click="handleEdit(item)" />
            <h3 class="img-title">{{ item.workName }}</h3>
            <el-tag v-for="tag in item.tags" :key="tag" size="mini" type="success" class="corner-tag">{{ tag }}</el-tag>
          </div>
          <!-- 底部 3 个按钮 -->
          <div class="card-footer">
            <el-button type="warning" size="mini" plain icon="el-icon-delete" @click="handleDelete(item)">删除</el-button>
            <el-button type="success" size="mini" plain icon="el-icon-edit" @click="handleEdit(item)">编辑</el-button>
            <el-button type="warning" size="mini" plain icon="el-icon-share" @click="handleShare(item)">分享</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  listTeachWorkMine
} from "@/api/teach/work";
export default {
  name: 'TeachWorkMine',
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 30
      },
      works: []
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询作品列表 */
    getList() {
      this.loading = true;
      listTeachWorkMine(this.queryParams).then(response => {
        this.works = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    openWork(item) {
      // 这里可跳转到作品详情页
      this.$message.success(`打开 ${item.workName}`)
    },
    handleDelete(item) {
      this.$message.info(`查看 ${item.workName}`)
    },
    handleEdit(item) {
      switch (item.workType) {
        case '1':
          return window.open('/scratch3/index.html?workId=' + item.id)
        case '2':
          return window.open('/scratch3/index.html?workId=' + item.id)
        case '3':
          return window.open('/scratchjr/editor.html?mode=edit&workFile=' + item.workFileUrl)
        case '4':
          return window.open('/python/index.html?workId=' + item.id)
        case '10':
          return window.open('/blockly/index.html?lang=zh-hans&workId=' + item.id)
        default:
          return window.open(record.workFileUrl)
      }
    },
    handleShare(item) {
      this.$message.success(`已复制 ${item.workName} 分享链接`)
    }
  }
}
</script>

<style scoped>
.work-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.work-card:hover {
  transform: translateY(-4px);
}

/* 正方形封面 */
.cover {
  width: 100%;
  aspect-ratio: 1 / 1;
  /* 1:1 正方形 */
  object-fit: cover;
  border-radius: 4px 4px 0 0;
}

.card-body {
  padding: 10px;
}

/* 图片容器 - 相对定位基准 */
.img-wrap {
  position: relative;
  line-height: 0;
  /* 去掉 inline 空隙 */
}

/* 标题 - 满层居中 */
.img-title {
  position: absolute;
  inset: 0;
  /* 上右下左全 0，撑满 */
  margin: 0;
  display: flex;
  /* 弹性布局 */
  align-items: center;
  /* 垂直居中 */
  justify-content: center;
  /* 水平居中 */
  padding: 0 10px;
  font-size: 16px;
  color: #fff;
  background: rgba(0, 0, 0, .45);
  /* 半透明背景 */
  backdrop-filter: blur(2px);
  /* 毛玻璃（可选） */
  border-radius: 0 0 4px 4px;
  overflow: hidden;
  text-align: center;
  /* 文字居中（多行时） */
  /* 单行省略号 */
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 角标 - 左上角 */
.corner-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
  /* 盖住图片 */
  border-radius: 4px;
  padding: 2px 6px;
  /* 再小一点 */
  font-size: 12px;
  background: rgba(103, 194, 58, .9);
  /* 半透明 success 色 */
  border: 0;
  /* 去掉边框更干净 */
}

/* 底部按钮容器：无内边距、无圆角、无间隙 */
.card-footer {
  padding: 0;
  display: flex;
  gap: 0;
  /* 1. 去掉 gap */
}

/* 单个按钮：占满 1/3，去掉左右圆角，边框重叠处理 */
.card-footer .el-button {
  flex: 1 1 0;
  /* 2. 三等分 */
  min-width: 0;
  margin: 0;
  /* 3. 覆盖 Element 默认 margin */
  border-radius: 0;
  /* 4. 无圆角 */
  border-right-width: 0;
  /* 5. 中间按钮去掉右侧边框，防止重叠加粗 */
}

.card-footer .el-button:last-child {
  border-right-width: 1px;
  /* 6. 最右侧按钮恢复右边框 */
}
</style>