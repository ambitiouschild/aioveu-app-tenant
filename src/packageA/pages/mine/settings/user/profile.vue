<template>
  <view class="container">
    <view class="form-section">
      <!-- 头像 -->
      <view class="form-item" @click="chooseAvatar">
        <text class="label">头像</text>
        <view class="right-content">
          <image class="avatar" :src="form.avatar || 'https://cdn.aioveu.com/aioveu/aioveu-server/pages/user/missing-face.png'"></image>
          <text class="yticon icon-you"></text>
        </view>
      </view>

      <!-- 昵称 -->
      <view class="form-item" @click="editField('nickname')">
        <text class="label">昵称</text>
        <view class="right-content">
          <text class="value">{{ form.nickname || '未设置' }}</text>
          <text class="yticon icon-you"></text>
        </view>
      </view>

      <!-- 性别 -->
      <view class="form-item" @click="showGenderPicker = true">
        <text class="label">性别</text>
        <view class="right-content">
          <text class="value">{{ genderText }}</text>
          <text class="yticon icon-you"></text>
        </view>
      </view>

      <!-- 生日 -->
      <view class="form-item" @click="showDatePicker = true">
        <text class="label">生日</text>
        <view class="right-content">
          <text class="value">{{ form.birthday || '未设置' }}</text>
          <text class="yticon icon-you"></text>
        </view>
      </view>

      <!-- 个性签名 -->
      <view class="form-item" @click="editField('signature')">
        <text class="label">个性签名</text>
        <view class="right-content">
          <text class="value">{{ form.signature || '未设置' }}</text>
          <text class="yticon icon-you"></text>
        </view>
      </view>
    </view>

    <!-- 保存按钮 -->
    <view class="btn-wrapper">
      <button class="save-btn" @click="saveProfile" :disabled="saving">
        {{ saving ? '保存中...' : '保存修改' }}
      </button>
    </view>

    <!-- 性别选择器 -->
    <uni-popup ref="genderPopup" type="bottom">
      <view class="popup-content">
        <view class="popup-title">选择性别</view>
        <view class="popup-item" @click="selectGender(1)">
          <text>男</text>
          <text class="yticon icon-xuanzhong" v-if="form.gender === 1"></text>
        </view>
        <view class="popup-item" @click="selectGender(2)">
          <text>女</text>
          <text class="yticon icon-xuanzhong" v-if="form.gender === 2"></text>
        </view>
        <view class="popup-item" @click="selectGender(0)">
          <text>保密</text>
          <text class="yticon icon-xuanzhong" v-if="form.gender === 0"></text>
        </view>
        <view class="popup-cancel" @click="showGenderPicker = false">取消</view>
      </view>
    </uni-popup>

    <!-- 日期选择器 -->
    <uni-datetime-picker
      v-if="showDatePicker"
      type="date"
      :value="form.birthday"
      @maskClick="showDatePicker = false"
      @change="onDateChange"
    />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from "@/store";

const userStore = useUserStore()
const showGenderPicker = ref(false)
const showDatePicker = ref(false)
const saving = ref(false)

// 表单数据
const form = ref({
  avatar: '',
  nickname: '',
  gender: 0,
  birthday: '',
  signature: ''
})

// 性别文本
const genderText = computed(() => {
  const genderMap = { 1: '男', 2: '女', 0: '保密' }
  return genderMap[form.value.gender]
})

onMounted(() => {
  loadUserInfo()
})

// 加载用户信息
const loadUserInfo = () => {
  const user = userStore.userInfo
  if (user) {
    form.value = {
      avatar: user.avatarUrl || '',
      nickname: user.nickName || '',
      gender: user.gender || 0,
      birthday: user.birthday || '',
      signature: user.signature || ''
    }
  }
}

// 选择头像
const chooseAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]
      // 这里应该上传到服务器
      form.value.avatar = tempFilePath
      uni.showToast({ title: '头像已选择', icon: 'success' })
    }
  })
}

// 编辑字段
const editField = (field) => {
  const titleMap = {
    nickname: '修改昵称',
    signature: '修改个性签名'
  }

  uni.showModal({
    title: titleMap[field],
    editable: true,
    placeholderText: `请输入${titleMap[field]}`,
    success: (res) => {
      if (res.confirm && res.content) {
        form.value[field] = res.content
      }
    }
  })
}

// 选择性别
const selectGender = (gender) => {
  form.value.gender = gender
  showGenderPicker.value = false
}

// 日期变化
const onDateChange = (e) => {
  form.value.birthday = e
  showDatePicker.value = false
}

// 保存资料
const saveProfile = async () => {
  if (saving.value) return

  saving.value = true
  try {
    // 调用更新接口
    await userStore.updateProfile(form.value)
    uni.showToast({
      title: '保存成功',
      icon: 'success'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    uni.showToast({
      title: '保存失败',
      icon: 'error'
    })
  } finally {
    saving.value = false
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
}

.form-section {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .label {
    font-size: 30rpx;
    color: #333;
  }

  .right-content {
    display: flex;
    align-items: center;

    .avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }

    .value {
      font-size: 28rpx;
      color: #666;
      margin-right: 20rpx;
      max-width: 400rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .icon-you {
      font-size: 30rpx;
      color: #999;
    }
  }
}

.btn-wrapper {
  padding: 50rpx 30rpx;

  .save-btn {
    background: $uni-color-primary;
    color: #fff;
    height: 90rpx;
    line-height: 90rpx;
    border-radius: 45rpx;
    font-size: 32rpx;

    &[disabled] {
      background: #ccc;
    }
  }
}

/* 弹出层样式 */
.popup-content {
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  padding-bottom: env(safe-area-inset-bottom);

  .popup-title {
    text-align: center;
    padding: 30rpx;
    font-size: 32rpx;
    color: #333;
    border-bottom: 1rpx solid #f5f5f5;
  }

  .popup-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #f5f5f5;
    font-size: 30rpx;
    color: #333;

    .icon-xuanzhong {
      color: $uni-color-primary;
      font-size: 36rpx;
    }
  }

  .popup-cancel {
    text-align: center;
    padding: 30rpx;
    font-size: 32rpx;
    color: #666;
    border-top: 10rpx solid #f5f5f5;
  }
}
</style>
