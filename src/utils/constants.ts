


/**
 * 方案1：创建配置常量（推荐）
 * 客户端配置常量
 */
export const CLIENT_CONFIG = {
  // 客户端ID
  CLIENT_ID: 'mall-app',

  // 客户端密钥
  CLIENT_SECRET: '123456',

  // Base64编码的Authorization头
  get BASIC_AUTH() {
    const authString = `${this.CLIENT_ID}:${this.CLIENT_SECRET}`;
    return 'Basic ' + btoa(authString);
  }
};
