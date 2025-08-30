<template>
  <div class="dashboard-editor-container">
    <p>WELCOME</p>
  </div>
</template>

<script>

export default {
  name: 'Index',
  components: {
  },
  data() {
    return {
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-promote .el-row {
  margin-bottom: 20px;
  font-size: 14px;
}

.dashboard-promote .el-row .jz {
  height: 500px;
}

.dashboard-promote .el-row .kj {
  height: 300px;
}

.dashboard-promote .el-row .xx {
  height: 200px;
}

.git-res {
  margin-top: 20px;
}

.git-res .el-link {
  margin-right: 30px;
}

ul,
li {
  padding: 0;
  margin: 0;
  list-style: none
}

.product li {
  margin-bottom: 20px;
  float: left;
  width: 150px;
}

.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
