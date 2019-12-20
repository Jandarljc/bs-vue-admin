<template>
  <div class="dashboard-container">
    <el-row>
      <el-card class="box-card">
        <div>
          <img width="90px" height="90px" :src="avatar" class="index-container-avatar">
        </div>
        <div class="titleBox">
          <h3 class="kt-subheader-search__title">
            {{ new Date() | formatDate(false) }}好，{{ roles }}
          </h3>
          <span class="index-container-ii-title">今天是 {{ currentTime|formatDate(true) }}</span>
          <div style="margin-top:8px;color:#34D3D3;font-size:17px;">
            <span>{{ text }}</span>
          </div>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchRandomMottoData } from '@/api/user'
var moment = require('moment')
moment.locale('zh-cn')

export default {
  components: { },
  filters: {
    formatDate: function(time, bol) {
      if (time != null && time !== '') {
        var date = new Date(time)
        if (bol) {
          return moment(date).format('llll:ss')
        } else {
          return moment(date).format('a')
        }
      } else {
        return ''
      }
    }
  },
  data() {
    return {
      text: '',
      currentTime: new Date()
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'avatar'
    ])
  },
  created() {
    this.getTextValue()
  },
  mounted() {
    var _this = this
    this.timer = setInterval(function() {
      _this.currentTime = new Date()
    }, 1000)
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    async getTextValue() {
      const { data } = await fetchRandomMottoData()
      this.text = 0
      this.text = data.content
    }
  }

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.index-container-avatar{
  position: absolute;
  float:left;
  margin:0 12px 0;
  top: 25px;
}
.titleBox{
  margin-left: 130px;
}
.box-card{
  height: 10em;
}
</style>
