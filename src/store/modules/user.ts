import { defineStore } from "pinia";
import AuthAPI, { type LoginFormData } from "@/api/auth";
import UserAPI, { type UserInfo } from "@/api/system/user";
import {
  setToken,
  getToken,
  getUserInfo,
  setUserInfo,
  clearAll,
  setPermissions,
  getPermissions,

  setRefreshToken,
  getRefreshToken,
  getTokenExpiresAt,
  setTokenExpiresAt

} from "@/utils/cache";

export const useUserStore = defineStore("user", () => {
  // 状态
  const token = ref(getToken() || '');
  const refreshToken = ref(getRefreshToken() || '');
  const tokenExpiresAt = ref(getTokenExpiresAt() || 0);

  const userInfo = ref<UserInfo | undefined>(getUserInfo());
  const permissions = ref<string[]>(getPermissions() || []); // 权限列表
  const hasLogin = computed(() => !!token.value);

  const isRefreshing = ref(false); // 是否正在刷新令牌
  const refreshQueue: any[] = []; // 刷新队列

  // Getters
  const userId = computed(() => userInfo.value?.id || null);
  const nickName = computed(() => userInfo.value?.nickName || '');
  const username = computed(() => userInfo.value?.username || userInfo.value?.nickName || '');
  const avatar = computed(() => userInfo.value?.avatarUrl || '');

  // 用户资产
  const assets = ref({
    balance: 0,
    points: 0,
    couponCount: 0
  });


  // 检查token是否即将过期（提前5分钟）
  const isTokenExpiring = computed(() => {
    if (!tokenExpiresAt.value) return true;
    const now = Date.now();
    return tokenExpiresAt.value - now < 5 * 60 * 1000; // 5分钟
  });

  // 检查token是否已过期
  const isTokenExpired = computed(() => {
    if (!tokenExpiresAt.value) return true;
    return Date.now() > tokenExpiresAt.value;
  });


  // 保存令牌到状态和缓存，保存过期时间
  const saveTokens = (data: any) => {


    const accessToken = data.access_token || data.accessToken;
    const refreshTokenValue = data.refresh_token || data.refreshToken;
    const expiresIn = data.expires_in || 86400; // 默认24小时


    if (!accessToken) {
      console.error("登录返回中没有找到access_token字段");
      return;
    }

    if (accessToken) {
      token.value = accessToken;  //将token添加到状态
      setToken(accessToken);  //将token添加到缓存

      if (refreshTokenValue) {
        refreshToken.value = refreshTokenValue;
        setRefreshToken(refreshTokenValue);
      }

      // 计算过期时间
      const expiresAt = Date.now() + expiresIn * 1000;
      tokenExpiresAt.value = expiresAt;
      setTokenExpiresAt(expiresAt.toString());
    }
  };

  // 刷新令牌
  const refreshAccessToken = async (): Promise<string> => {
    const currentRefreshToken = refreshToken.value;

    if (!currentRefreshToken) {
      console.error("没有刷新令牌，需要重新登录");
      throw new Error("NO_REFRESH_TOKEN");
    }

    // 如果已经在刷新中，加入队列等待
    if (isRefreshing.value) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      });
    }

    isRefreshing.value = true;

    try {
      console.log("开始刷新访问令牌...");
      const response = await AuthAPI.refreshToken(currentRefreshToken);

      // 保存新的令牌
      saveTokens(response);
      console.log("令牌刷新成功");

      // 处理等待队列中的请求
      refreshQueue.forEach(item => item.resolve(response.access_token || response.accessToken));
      refreshQueue.length = 0; // 清空队列

      return response.access_token || response.accessToken;
    } catch (error: any) {
      console.error("刷新令牌失败:", error);

      // 刷新失败，需要重新登录
      if (error.response?.status === 401 ||
        error.code === 'INVALID_REFRESH_TOKEN' ||
        error.message?.includes('invalid_token')) {
        console.log("刷新令牌无效，清除登录状态");
        logout();
      }

      // 处理等待队列中的请求
      refreshQueue.forEach(item => item.reject(error));
      refreshQueue.length = 0;

      throw error;
    } finally {
      isRefreshing.value = false;
    }
  };

  // 获取有效的访问令牌（会自动刷新）
  const getValidToken = async (): Promise<string> => {
    // 如果没有token，需要登录
    if (!token.value) {
      throw new Error("NOT_LOGGED_IN");
    }

    // 检查token是否即将过期
    if (isTokenExpiring.value && refreshToken.value) {
      console.log("访问令牌即将过期，自动刷新...");
      return await refreshAccessToken();
    }

    // 检查token是否已过期
    if (isTokenExpired.value) {
      console.log("访问令牌已过期，尝试刷新...");
      return await refreshAccessToken();
    }

    // token有效，直接返回
    return token.value;
  };


  // 登录
  const login = (data: LoginFormData) => {
    return new Promise((resolve, reject) => {
      AuthAPI.login(data)
        .then((data) => {

          // 设置 token
          const accessToken = data.access_token || data.accessToken;
          if (!accessToken) {
            console.error("登录返回中没有找到access_token字段");
            console.error("返回数据字段:", Object.keys(data));
            reject(new Error("登录失败: 未找到访问令牌"));
            return;
          }

          token.value = accessToken; //将token添加到状态
          setToken(accessToken);  //将token添加到缓存
          resolve(data);
        })
        .catch((error) => {
          console.error("登录失败", error);
          reject(error);
        });
    });
  };

  // 微信登录 修改微信登录方法，添加自动注册功能
  const loginByWechat = (code: string) => {
    console.info("开始调用微信登录接口,这正是微信登录的标准姿势");
    console.info("开始调用微信登录接口");
    // 1. 先尝试正常登录
    return new Promise((resolve, reject) => {
      AuthAPI.wechatLogin(code)
        .then((data) => {
          console.log("微信登录返回数据:", data);

          /*
          *    TODO {
                      "access_token": "...",
                      "refresh_token": "...",
                      "expires_in": 86400,      // 24小时（访问令牌有效期）
                      "token_type": "Bearer"
                    }
          *
          * */

          // 保存令牌
          saveTokens(data);
          console.log("微信登录成功，保存令牌到状态和缓存，保存过期时间成功");

          resolve(data);
        })
        .catch((error) => {
          console.error("微信登录失败", error);
          reject(error);
        });
    });
  };

  // 微信登录 修改微信登录方法，添加自动注册功能
  const registerByWechat = (code: string) => {
    console.info("调用注册接口");

    // 1. 先尝试正常登录
    return new Promise((resolve, reject) => {
      AuthAPI.registerByWechat(code)
        .then((data) => {
          // console.log("微信登录返回数据:", data);


          // 保存令牌
          saveTokens(data);
          console.log("微信自动注册功能，保存令牌到状态和缓存，保存过期时间成功");

          resolve(data);
        })
        .catch((error) => {
          console.error("微信登录失败", error);
          reject(error);
        });
    });
  };

  // 手机验证码登录
  const loginBySms = (mobile: string , code: string) => {
    console.info("开始调用手机验证码登录登录接口");

    return new Promise((resolve, reject) => {
      AuthAPI.loginBySms(mobile,code)
        .then((data) => {
          // console.log("微信登录返回数据:", data);

          // 设置 token
          const accessToken = data.access_token || data.accessToken;
          if (!accessToken) {
            console.error("登录返回中没有找到access_token字段");
            console.error("返回数据字段:", Object.keys(data));
            reject(new Error("登录失败: 未找到访问令牌"));
            return;
          }

          token.value = accessToken; //将token添加到状态
          setToken(accessToken); //将token添加到缓存

          // 保存刷新令牌
          if (data.refresh_token) {
            uni.setStorageSync("refresh_token", data.refresh_token);
          }

          // 保存过期时间
          if (data.expires_in) {
            const expiresAt = Date.now() + data.expires_in * 1000;
            uni.setStorageSync("token_expires_at", expiresAt.toString());
          }

          console.log("手机验证码登录登录成功，token已保存");

          resolve(data);
        })
        .catch((error) => {
          console.error("手机验证码登录登录失败", error);
          reject(error);
        });
    });
  };


  // 获取用户信息
  const getInfo = () => {

    console.log("获取用户信息");

    return new Promise((resolve, reject) => {
      UserAPI.getUserInfo()
        .then((data) => {


          console.log("获取用户信息成功:", data);

          // 处理权限数据
          if (data.perms || data.perms) {
            const perms = data.perms || data.perms || [];
            permissions.value = perms;
            setPermissions(perms);
            console.log("权限数据已保存:", perms);
          }

          // 保存用户信息
          setUserInfo(data);
          userInfo.value = data;

          resolve(data);
        })
        .catch((error) => {
          console.error("获取用户信息失败", error);
          reject(error);
        });
    });
  };


  // 登出
  const logout = async () => {
    try {
      await AuthAPI.logout(); // 调用后台注销接口
    } catch (error) {
      console.error("登出失败", error);
    } finally {

      // 清除所有状态
      token.value = '';
      userInfo.value = undefined;
      permissions.value = [];

      // 清除缓存
      clearAll(); // 清除本地的 token 和用户信息缓存
      userInfo.value = undefined; // 清空用户信息

      console.log("用户已退出登录");
    }
  };

  // 判断用户信息是否完整
  const isUserInfoComplete = (): boolean => {
    if (!userInfo.value) return false;

    return !!(userInfo.value.nickName && userInfo.value.avatarUrl);
  };

  // 检查权限
  const hasPermission = (perm: string): boolean => {
    return permissions.value.includes(perm);
  };

  // 获取所有权限
  const getPermissionsList = (): string[] => {
    return permissions.value;
  };

  // 更新用户信息
  const updateUserInfo = (info: Partial<UserInfo>) => {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...info };
      setUserInfo(userInfo.value);
    }
  };

  return {
// 状态
    token,
    userInfo,
    permissions,
    hasLogin,
    refreshToken,

    // Getters
    userId,
    nickName,
    username,
    avatar,

    isTokenExpiring,
    refreshAccessToken,
    getValidToken,

    // Actions
    login,
    loginByWechat,
    loginBySms,
    logout,
    getInfo,
    isUserInfoComplete,
    hasPermission,
    getPermissionsList,
    updateUserInfo,
  };
});

//分析问题：
// 1.指令v-has-perm的实现依赖于从store中获取的用户权限列表。
// 2.在user store中，目前并没有存储权限列表，也没有在获取用户信息的同时获取权限。
// 3. 因此，我们需要在user store中添加权限状态，并在获取用户信息时同时获取权限列表。
//解决方案：
// 1.修改user store，添加permissions状态和加载权限的方法。
// 2.在getInfo方法中，除了获取用户信息，还要获取权限列表（或者单独提供一个加载权限的方法，并在适当的时候调用）。
// 3.确保在指令中能够访问到permissions状态。
//由于用户已经调用了getInfo，但指令仍然无法识别，可能是因为权限数据没有正确存储或指令没有正确实现。
