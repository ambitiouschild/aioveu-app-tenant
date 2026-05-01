// 复制文本
export const copyText = (text: any) => {
  uni.setClipboardData({
    data: text,
    success: () => {
      console.log("复制成功:", text);
    },
  });
};

// 定义允许的 icon 类型
type ToastIcon = "success" | "loading" | "error" | "none" | "fail" | "exception";

// 显示提示
export const showToast = (title: any, icon: ToastIcon = "none", duration = 1500) => {
  uni.showToast({
    title,
    icon,
    duration,
  });
};

// 显示确认框
export const showModal = (title: any, content: any) => {
  return new Promise((resolve) => {
    uni.showModal({
      title,
      content,
      success: (res) => {
        resolve(res);
      },
    });
  });
};
