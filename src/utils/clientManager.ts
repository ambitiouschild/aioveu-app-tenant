const CLIENT_KEY = "app-clientId";

// import {
//  CLIENT_CONFIG,
//   setClientId,
//   getClientId,
//   clearClientId,
//   detectClientId,
// } from "@/utils/clientManager";


/**
 * 方案1：创建配置常量（推荐）
 * 客户端配置常量
 */
export const CLIENT_CONFIG = {
  // 客户端ID
  // CLIENT_ID: 'xindong-app',
  CLIENT_ID: 'xinhuan-app',
  // CLIENT_ID: 'xinteng-app',

  // 客户端密钥
  CLIENT_SECRET: '123456',

  // Base64编码的Authorization头
  getBASIC_AUTH():any {
    const authString = `${this.CLIENT_ID}:${this.CLIENT_SECRET}`;

    console.log("原始认证字符串:", authString);

    try{

      // 1. 尝试浏览器 btoa
      if (typeof btoa !== 'undefined') {

        const basicAuth =  'Basic ' + btoa(authString);
        console.log("尝试浏览器 btoa ,动态生成的认证头:", basicAuth);
        return basicAuth;

        // return 'Basic ' + btoa(authString);   // ❌ 错误：小程序没有 btoa
        //这是一个在小程序环境中遇到的错误。错误信息显示 btoa is not defined，这是因为 btoa是浏览器环境中的 API，但在小程序环境中不可用。
      }

      // 2. 尝试 uni.base64 (通过 any 类型绕过检查)
      const uniAny = uni as any;
      if (uniAny && uniAny.base64 && typeof uniAny.base64.encode === 'function') {

        const basicAuth =  'Basic ' + uniAny.base64.encode(authString);
        console.log("尝试 uni.base64,动态生成的认证头:", basicAuth);
        return basicAuth;
      }

      // 3. 尝试微信小程序
      // if (wx && (wx as any).base64 && typeof (wx as any).base64.encode === 'function') {
      //
      //
      //   return 'Basic ' + (wx as any).base64.encode(authString);
      // }

      // 4. 手动实现  // 直接返回计算好的值
      // 直接使用计算好的值
      // 计算过程：
      // 1. 字符串: "mall-app:123456"
      // 2. Base64: "bWFsbC1hcHA6MTIzNDU2"
      // 3. 加 Basic: "Basic bWFsbC1hcHA6MTIzNDU2"
      const base64AuthString = base64Encode(authString);
      console.log("尝试手动生成的认证头:", base64AuthString);

      const basicAuth = 'Basic ' + base64AuthString;


      // 示例3: 验证认证
      const result = validateClientAuth(
        basicAuth,
        this.CLIENT_ID,
        this.CLIENT_SECRET
      );
      console.log('验证结果:', result); // { valid: true, clientId: 'mall-app' }
      // 验证格式
      if (result) {
        console.log("验证客户端认证:手动生成的认证头：正确!");
        return basicAuth;
      }

      // return basicAuth;

    }catch(e){
      console.warn('base64 编码失败，使用手动实现', e);
    }





  }




};

/**
 * Base64 编码（手动实现） - 箭头函数版本
 */
export const base64Encode = (str:any) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  let i = 0;

  // 处理中文字符
  str = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {

    // 将16进制字符串转换为数字
    const charCode = parseInt(p1, 16);

    return String.fromCharCode(charCode);
  });

  while (i < str.length) {
    const a = str.charCodeAt(i++);
    const b = str.charCodeAt(i++) || 0;
    const c = str.charCodeAt(i++) || 0;

    const index1 = a >> 2;
    const index2 = ((a & 3) << 4) | (b >> 4);
    const index3 = isNaN(b) ? 64 : ((b & 15) << 2) | (c >> 6);
    const index4 = isNaN(c) ? 64 : c & 63;

    output += chars.charAt(index1) + chars.charAt(index2) +
      chars.charAt(index3) + chars.charAt(index4);
  }

  return output;
};

/**
 * Base64 解码（手动实现）
 */
export const base64Decode = (base64:any) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  let i = 0;

  // 移除可能的前缀
  base64 = base64.replace(/[^A-Za-z0-9\+\/\=]/g, '');

  while (i < base64.length) {
    const index1 = chars.indexOf(base64.charAt(i++));
    const index2 = chars.indexOf(base64.charAt(i++));
    const index3 = chars.indexOf(base64.charAt(i++));
    const index4 = chars.indexOf(base64.charAt(i++));

    const a = (index1 << 2) | (index2 >> 4);
    const b = ((index2 & 15) << 4) | (index3 >> 2);
    const c = ((index3 & 3) << 6) | index4;

    output += String.fromCharCode(a);
    if (index3 !== 64) output += String.fromCharCode(b);
    if (index4 !== 64) output += String.fromCharCode(c);
  }

  // 解码中文字符
  return decodeURIComponent(output);
};




/**
 * 验证 Basic Auth 格式
 */
export const  isValidBasicAuth =(auth :any) => {
  return auth && auth.startsWith('Basic ') && auth.length > 6;
}

/**
 * 从 Basic Auth 中提取用户名和密码
 */
export const parseBasicAuth = (auth:any) => {
  if (!isValidBasicAuth(auth)) {
    return null;
  }

  const base64 = auth.substring(6); // 移除 "Basic "
  // const decoded = atob ? atob(base64) : base64Decode(base64);

  // 正确的方式：使用 typeof 检查函数是否存在
  const decoded = typeof atob !== 'undefined'
    ? atob(base64)
    : base64Decode(base64);

  // 方案3：完全移除 atob 依赖（最安全）
  // 在小程序中，直接使用我们自己的实现
  // const decoded = base64Decode(base64);

  const [username, password] = decoded.split(':');

  return { username, password };
};

// 示例2: 解析 Basic Auth
const parsed = parseBasicAuth('Basic bWFsbC1hcHA6MTIzNDU2');
console.log('解析结果:', parsed); // { username: 'mall-app', password: '123456' }

/**
 * 验证客户端认证
 */
export const validateClientAuth = (auth:any, expectedClientId:any, expectedClientSecret:any) => {
  if (!isValidBasicAuth(auth)) {
    return { valid: false, error: '格式错误' };
  }

  const parsed = parseBasicAuth(auth);
  if (!parsed) {
    return { valid: false, error: '解析失败' };
  }

  const { username, password } = parsed;

  if (username !== expectedClientId) {
    return {
      valid: false,
      error: '客户端ID不匹配',
      expected: expectedClientId,
      actual: username
    };
  }

  if (password !== expectedClientSecret) {
    return {
      valid: false,
      error: '客户端密钥不匹配',
      expected: expectedClientSecret.substring(0, 3) + '***',
      actual: password.substring(0, 3) + '***'
    };
  }

  return { valid: true, clientId: username };
};


// 示例3: 验证认证
const result = validateClientAuth(
  'Basic bWFsbC1hcHA6MTIzNDU2',
  'mall-app',
  '123456'
);
console.log('验证结果:', result); // { valid: true, clientId: 'mall-app' }

/**
 * 客户端ID管理器
 * 用于管理不同租户的客户端ID
 */
// 设置客户端ID
export function setClientId(clientId: string) {
  // 存储到本地存储
  uni.setStorageSync(CLIENT_KEY, clientId);
}

// 获取客户端ID
export function getClientId(): string {
  // 从本地存储获取
  return uni.getStorageSync(CLIENT_KEY) || "";
}

// 清除 客户端ID
export function clearClientId() {
  uni.removeStorageSync(CLIENT_KEY);
}

// 自动检测客户端ID
export function detectClientId() {
  // 根据当前环境自动设置
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    if (hostname.includes('mall.')) {
      return 'mall-app';
    } else if (hostname.includes('admin.')) {
      return 'aioveu-admin';
    } else if (hostname.includes('test.')) {
      return 'test-app';
    }
  }

  // 默认客户端ID
  return 'default-app';
}

// 从URL参数获取clientId
export function getClientIdFromUrl(): any {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('clientId');
  }
  return null;
}

// 初始化客户端ID
export function init() {
  // 1. 尝试从URL参数获取
  const urlClientId = getClientIdFromUrl();
  if (urlClientId) {
    setClientId(urlClientId);
    return;
  }

  // 2. 获取已有的或默认的
  getClientId();
}





