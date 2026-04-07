

//在 UniApp 中，manifest.json中的 name字段是应用的名称，要实现全局修改名称

// import { APP_CONFIG } from '@/common/config';
// APP_CONFIG.getFullTitle('首页')
// APP_CONFIG.APP_NAME

// <template>
//   <view>
//     <!-- 使用应用名称 -->
// <view class="welcome">欢迎来到{{ APP_CONFIG.APP_NAME }}</view>
// <view class="company">{{ APP_CONFIG.COMPANY }} 版权所有</view>
// </view>
// </template>

// 应用配置
export const APP_CONFIG = {
  // 应用名称 - 与 manifest.json 保持一致
  APP_NAME: '可我不敌心欢',

  // 版本号
  VERSION: '5.2.0',

  // 公司名称
  COMPANY: '可我不敌心动',

  // 客服电话
  SERVICE_PHONE: '400-123-4567',

  // 其他配置...
  API_BASE_URL: 'https://api.example.com',

  // 获取完整应用标题
  getFullTitle(subTitle = '') {
    return subTitle ? `${this.APP_NAME} - ${subTitle}` : this.APP_NAME;
  }
};
