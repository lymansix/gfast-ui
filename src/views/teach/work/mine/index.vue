<template>
  <div class="app-container">
    <!-- 卡片网格 -->
    <el-row :gutter="30">
      <el-col :span="10" v-for="(item, index) in works" :key="index" :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-card :body-style="{ padding: '0px' }" class="work-card" shadow="hover">
          <!-- 封面图 -->
          <img :src="item.cover" class="cover" @click="handleEdit(item)" />

          <!-- 文字区 -->
          <div class="card-body">
            <h3 class="title">{{ item.title }}</h3>
            <el-tag v-for="tag in item.tags" :key="tag" size="mini" type="success" class="tag">{{ tag }}</el-tag>
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
  listTeachWork
} from "@/api/teach/work";
export default {
  name: 'TeachWorkMine',
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 30
      },
      works: [
        {
          title: 'Scratch3.0',
          cover: 'https://picsum.photos/300/200?random=1',
          tags: ['Scratch']
        },
        {
          title: '15-神笔马良',
          cover: 'https://picsum.photos/300/200?random=2',
          tags: ['Scratch', '动画']
        },
        {
          title: '老鹰抓小鸡11',
          cover: 'https://picsum.photos/300/200?random=3',
          tags: ['游戏']
        },
        {
          title: '15-猜猜-哪头大象重',
          cover: 'https://picsum.photos/300/200?random=4',
          tags: ['Scratch']
        },
        {
          title: '山地足球',
          cover: 'https://picsum.photos/300/200?random=5',
          tags: ['游戏']
        },
        {
          title: '14-多边形绘图',
          cover: 'https://picsum.photos/300/200?random=6',
          tags: ['Scratch', '绘图']
        },
        {
          title: '初级-16-听音识路',
          cover: 'https://picsum.photos/300/200?random=7',
          tags: ['Scratch', '音乐']
        }
      ]
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询作品列表 */
    getList() {
      this.loading = true;
      listTeachWork(this.queryParams).then(response => {
        this.works = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    openWork(item) {
      // 这里可跳转到作品详情页
      this.$message.success(`打开 ${item.title}`)
    },
    handleDelete(item) {
      this.$message.info(`查看 ${item.title}`)
    },
    handleEdit(item) {
      this.$message.info(`编辑 ${item.title}`)
    },
    handleShare(item) {
      this.$message.success(`已复制 ${item.title} 分享链接`)
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
  padding: 14px;
}

.title {
  margin: 0 0 8px;
  font-size: 16px;
  color: #303133;
}

.tag {
  margin-right: 6px;
}

/* 底部 3 按钮等宽 */
.card-footer {
  padding: 0 14px 14px;
  display: flex;
  gap: 6px;
  /* 按钮间距 */
}

.card-footer .el-button {
  flex: 1;
  /* 三等分 */
  min-width: 0;
}
</style>