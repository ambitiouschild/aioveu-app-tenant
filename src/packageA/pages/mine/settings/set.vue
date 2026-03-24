<template>
  <view class="container">

    <!-- 个人信息区 -->
    <view class="user-section">
      <image class="bg" src="https://cdn.aioveu.com/aioveu/aioveu-server/pages/user/user-bg2.png"></image>
      <view class="user-info-box" @click="navTo('/packageA/pages/mine/settings/user/profile')">
        <view class="portrait-box">
          <image class="portrait" :src="avatarUrl"></image>
        </view>
        <view class="info-box">
          <text class="username" >{{ userInfo.nickname || '点击设置昵称' }}</text>
          <text class="phone">{{ userInfo.phone || '未绑定手机' }}</text>
        </view>
        <text class="yticon icon-you"  ></text>
      </view>
    </view>

    <!-- 设置列表 -->
    <view class="list-section">

<!--      <view-->
<!--        class="list-cell b-b m-t"-->
<!--        @click="navTo('个人资料')"-->
<!--        hover-class="cell-hover"-->
<!--        :hover-stay-time="50"-->
<!--      >-->
<!--        <text class="cell-tit">个人资料</text>-->
<!--        <text class="cell-more yticon icon-you"></text>-->
<!--      </view>-->

      <view
        class="list-cell b-b"
        @click="navTo('/packageD/pages/address/address')"
        hover-class="cell-hover"
        :hover-stay-time="50"
      >
        <text class="cell-tit">收货地址</text>
        <text class="cell-more yticon icon-you"></text>
      </view>

      <view
        class="list-cell"
        @click="navTo('/pages/user/realname')"
        hover-class="cell-hover"
        :hover-stay-time="50"
      >
        <text class="cell-tit">实名认证</text>
        <text class="cell-more yticon icon-you"></text>
      </view>

      <view
        class="list-cell b-b"
        @click="navTo('/pages/user/security')"
        hover-class="cell-hover"
        :hover-stay-time="50"
      >
        <text class="cell-tit">账户安全</text>
        <text class="cell-more yticon icon-you"></text>
      </view>


      <view class="list-cell m-t">
        <text class="cell-tit">消息推送</text>
        <switch checked color="#fa436a" @change="switchChange" />
      </view>

      <view
        class="list-cell m-t b-b"
        @click="navTo('clearCache')"
        hover-class="cell-hover"
        :hover-stay-time="50"
      >
        <text class="cell-tit">清除缓存</text>
        <text class="cell-tip">{{ cacheSize }}</text>
        <text class="cell-more yticon icon-you"></text>
      </view>


      <view
        class="list-cell b-b"
        @click="navTo('/pages/about/index')"
        hover-class="cell-hover"
        :hover-stay-time="50"
      >
        <text class="cell-tit">关于可我不敌心动 </text>
        <text class="cell-more yticon icon-you"></text>
      </view>


      <view class="list-cell">
        <text class="cell-tit">检查更新</text>
        <text class="cell-tip">当前版本 {{ version }}</text>
        <text class="cell-more yticon icon-you"></text>
      </view>

      <view class="list-cell log-out-btn" @click="toLogout">
        <text class="cell-tit">退出登录</text>
      </view>

    </view>
  </view>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import { useUserStore } from "@/store";
import { onShow } from '@dcloudio/uni-app'


const userStore = useUserStore();
const pushEnabled = ref(true)
const cacheSize = ref('0KB')
const version = ref('1.0.3')

// 用户信息
const userInfo = ref({
  avatar: '',
  nickname: '',
  phone: ''
})

// 页面显示时加载数据
onShow(() => {
  loadUserInfo()
  getCacheSize()
})


const avatarUrl = computed(() => {
  if (!userStore.userInfo) {
    return "https://cdn.aioveu.com/aioveu/aioveu-server/pages/user/missing-face.png";
  }

  let avatar = userStore.userInfo.avatarUrl || "";
  if (avatar && !avatar.startsWith("http") && !avatar.startsWith("https")) {
    // 如果是相对路径，添加基础URL
    avatar = "https://你的图片服务器地址" + avatar;
  }
  return avatar || "https://cdn.aioveu.com/aioveu/aioveu-server/pages/user/missing-face.png";
});

// 加载用户信息
const loadUserInfo = () => {
  const user = userStore.getUserInfo
  if (user) {
    userInfo.value = {
      avatar: user.avatar,
      nickname: user.nickname || user.username,
      phone: user.phone
    }
  }
}

// 导航
const navTo = (url) => {
  uni.navigateTo({
    url
  })
}

// 退出登录
const toLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await userStore.logout()
          uni.showToast({
            title: '退出成功',
            icon: 'success'
          })
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/index/index'
            })
          }, 1500)
        } catch (error) {
          uni.showToast({
            title: '退出失败',
            icon: 'error'
          })
        }
      }
    }
  })
}

// 清除缓存
const clearCache = () => {
  uni.showModal({
    title: '提示',
    content: '确定要清除缓存吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showLoading({ title: '清理中...' })

        // 清理缓存
        uni.clearStorage({
          success: () => {
            uni.hideLoading()
            cacheSize.value = '0KB'
            uni.showToast({
              title: '清理完成',
              icon: 'success'
            })
          },
          fail: () => {
            uni.hideLoading()
            uni.showToast({
              title: '清理失败',
              icon: 'error'
            })
          }
        })
      }
    }
  })
}

// 获取缓存大小
const getCacheSize = () => {
  uni.getStorageInfo({
    success: (res) => {
      const size = (res.currentSize / 1024).toFixed(2)
      cacheSize.value = `${size}KB`
    }
  })
}
// 消息推送开关
const switchChange = (e) => {
  pushEnabled.value = e.detail.value
  uni.showToast({
    title: e.detail.value ? '已开启消息推送' : '已关闭消息推送',
    icon: 'none'
  })
}

// 检查更新
const checkUpdate = () => {
  uni.showLoading({ title: '检查中...' })

  // 这里调用您的版本检查接口
  setTimeout(() => {
    uni.hideLoading()
    uni.showModal({
      title: '提示',
      content: '当前已是最新版本',
      showCancel: false
    })
  }, 1000)
}

</script>

<style lang="scss" scoped>
.container {
  background: $page-color-base;
  min-height: 100vh;
}

/* 用户信息区域 */
.user-section {
  height: 320rpx;
  padding: 50rpx 30rpx 0;
  position: relative;

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    filter: blur(1px);
    opacity: 0.7;
  }

  .user-info-box {
    height: 180rpx;
    display: flex;
    align-items: center;
    position: relative;
    z-index: 1;

    .portrait-box {
      width: 130rpx;
      height: 130rpx;
      border-radius: 50%;
      border: 5rpx solid #fff;
      background: #fff;

      .portrait {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .info-box {
      flex: 1;
      margin-left: 20rpx;
      display: flex;
      flex-direction: column;

      .username {
        font-size: 36rpx;
        color: #333;
        font-weight: bold;
        margin-bottom: 10rpx;
      }

      .phone {
        font-size: 24rpx;
        color: #666;
      }
    }

    .icon-you {
      font-size: 36rpx;
      color: #999;
    }
  }
}

/* 列表区域 */
.list-section {
  margin-top: 20rpx;
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  padding: 0 30rpx;
}

.list-cell {
  display: flex;
  align-items: center;
  padding: 30rpx 0;
  line-height: 60rpx;
  position: relative;
  background: #fff;
  justify-content: space-between;

  &.log-out-btn {
    margin-top: 40rpx;
    margin-bottom: 40rpx;
    justify-content: center;
    border-radius: 10rpx;
    background: #fff5f5;

    .cell-tit {
      color: $uni-color-primary;
      text-align: center;
      margin-right: 0;
      font-weight: bold;
    }
  }

  &.cell-hover {
    background: #fafafa;
  }

  &.b-b:after {
    content: '';
    position: absolute;
    left: 30rpx;
    right: 30rpx;
    bottom: 0;
    height: 1px;
    background: #f5f5f5;
  }

  &.m-t {
    margin-top: 16rpx;
  }

  .cell-more {
    font-size: 32rpx;
    color: $font-color-light;
  }

  .cell-tit {
    flex: 1;
    font-size: 30rpx;
    color: $font-color-dark;
  }

  .cell-tip {
    font-size: 28rpx;
    color: $font-color-light;
    margin-right: 20rpx;
  }

  switch {
    transform: scale(0.9);
  }
}
</style>
