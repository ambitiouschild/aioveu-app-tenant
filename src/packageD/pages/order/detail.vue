<template>
  <view class="order-detail-page">
    <!-- 顶部状态栏 -->
    <view class="status-section" :class="orderDetail.status">
      <view class="status-icon">
        <view v-if="orderDetail.status === 'pending'" class="icon pending">⏳</view>
        <view v-if="orderDetail.status === 'paid'" class="icon paid">✅</view>
        <view v-if="orderDetail.status === 'shipped'" class="icon shipped">🚚</view>
        <view v-if="orderDetail.status === 'completed'" class="icon completed">🎉</view>
        <view v-if="orderDetail.status === 'cancelled'" class="icon cancelled">❌</view>
        <view v-if="orderDetail.status === 'refunded'" class="icon refunded">↩️</view>
      </view>
      <view class="status-text">{{ statusTextMap[orderDetail.status] }}</view>
      <view v-if="orderDetail.statusDesc" class="status-desc">{{ orderDetail.statusDesc }}</view>

      <!-- 待付款倒计时 -->
      <view v-if="orderDetail.status === 'pending' && orderDetail.expireTime" class="countdown">
        剩余支付时间: {{ formatCountdown(orderDetail.expireTime) }}
      </view>
    </view>

    <!-- 订单信息卡片 -->
    <view class="order-card">
      <!-- 收货地址（实物商品） -->
      <view v-if="orderDetail.address" class="address-section" @click="editAddress">
        <view class="address-icon">📍</view>
        <view class="address-info">
          <view class="receiver">
            <text>{{ orderDetail.address.receiver }}</text>
            <text class="phone">{{ orderDetail.address.phone }}</text>
          </view>
          <view class="detail-address">{{ orderDetail.address.detail }}</view>
        </view>
        <view class="arrow">›</view>
      </view>

      <!-- 商品列表 -->
      <view class="goods-section">
        <view class="section-title">商品信息</view>
        <view v-for="(item, index) in orderDetail.goodsList" :key="index" class="goods-item">
          <image class="goods-img" :src="item.image" mode="aspectFill" />
          <view class="goods-info">
            <view class="goods-title">{{ item.title }}</view>
            <view v-if="item.spec" class="goods-spec">{{ item.spec }}</view>
            <view class="goods-price-row">
              <view class="price">¥{{ item.price }}</view>
              <view class="quantity">×{{ item.quantity }}</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 订单详情 -->
      <view class="info-section">
        <view class="info-item" v-for="(item, idx) in orderDetail.infoList" :key="idx">
          <view class="info-label">{{ item.label }}</view>
          <view class="info-value">{{ item.value }}</view>
        </view>
      </view>

      <!-- 合计金额 -->
      <view class="total-section">
        <view class="total-row">
          <text>商品总额</text>
          <text>¥{{ orderDetail.goodsAmount }}</text>
        </view>
        <view v-if="orderDetail.discount != null" class="total-row">
          <text>优惠金额</text>
          <text class="discount">-¥{{ orderDetail.discount }}</text>
        </view>
        <view v-if="orderDetail.shippingFee != null" class="total-row">
          <text>运费</text>
          <text>¥{{ orderDetail.shippingFee }}</text>
        </view>
        <view class="total-row total">
          <text>实付款</text>
          <text class="total-price">¥{{ orderDetail.totalAmount }}</text>
        </view>
      </view>
    </view>

    <!-- 物流信息（已发货） -->
    <view v-if="orderDetail.logistics" class="logistics-card">
      <view class="section-title">物流信息</view>
      <view class="logistics-info">
        <view class="company">快递公司：{{ orderDetail.logistics.company }}</view>
        <view class="number">运单号：{{ orderDetail.logistics.number }}</view>
        <view class="action" @click="copyLogistics(orderDetail.logistics.number)">复制</view>
      </view>

      <!-- 物流轨迹 -->
      <view
        v-if="orderDetail.logistics.traces && orderDetail.logistics.traces.length"
        class="logistics-trace"
      >
        <view
          v-for="(trace, idx) in orderDetail.logistics.traces.slice(0, 3)"
          :key="idx"
          class="trace-item"
        >
          <view class="trace-time">{{ formatTime(trace.time) }}</view>
          <view class="trace-desc">{{ trace.desc }}</view>
        </view>
        <view
          v-if="orderDetail.logistics.traces.length > 3"
          class="view-more"
          @click="viewAllLogistics"
        >
          查看全部物流信息
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <view v-if="showActionButtons" class="button-group">
        <!-- 待付款 -->
        <template v-if="orderDetail.status === 'pending'">
          <button class="btn secondary" @click="cancelOrder">取消订单</button>
          <button class="btn primary" @click="goToPay">立即支付</button>
        </template>

        <!-- 已付款/已发货 -->
        <template v-if="['paid', 'shipped'].includes(orderDetail.status)">
          <button v-if="orderDetail.canRefund" class="btn secondary" @click="applyRefund">
            申请退款
          </button>
          <button
            v-if="orderDetail.status === 'shipped'"
            class="btn primary"
            @click="confirmReceipt"
          >
            确认收货
          </button>
        </template>

        <!-- 已完成 -->
        <template v-if="orderDetail.status === 'completed'">
          <button v-if="!orderDetail.isCommented" class="btn secondary" @click="goToComment">
            评价商品
          </button>
          <button v-if="orderDetail.canRefund" class="btn secondary" @click="applyRefund">
            申请退款/售后
          </button>
          <button v-if="orderDetail.canRebuy" class="btn primary" @click="buyAgain">
            再次购买
          </button>
        </template>

        <!-- 已取消/已退款 -->
        <template v-if="['cancelled', 'refunded'].includes(orderDetail.status)">
          <button class="btn primary" @click="deleteOrder">删除订单</button>
          <button class="btn primary" @click="buyAgain">重新购买</button>
        </template>
      </view>
    </view>

    <!-- 底部操作栏（固定） -->
    <view class="bottom-bar">
      <view class="bottom-actions">
        <button v-if="orderDetail.status === 'pending'" class="btn bottom-pay" @click="goToPay">
          立即支付 ¥{{ orderDetail.totalAmount }}
        </button>
        <view v-else class="contact-section">
          <button class="btn contact" @click="contactCustomer">联系客服</button>
          <button class="btn share" @click="shareOrder">分享订单</button>
        </view>
      </view>
    </view>

    <!-- 加载中 -->
    <view v-if="loading" class="loading-mask">
      <view class="loading-content">
        <view class="loading-spinner"></view>
        <text>加载中...</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { onLoad, onShow, onHide } from "@dcloudio/uni-app";
import { formatTime, formatCountdown } from "@/utils/time";
import { copyText, showToast, showModal } from "@/utils/common";
import { getOmsOrderDetail } from "@/packageD/api/oms/orderDetail";
import { listOrdersWithPage } from "@/packageD/api/oms/order";

// 响应式数据
const loading = ref(false);
const orderDetail = ref({
  id: "",
  orderSn: "",
  status: "pending", // pending, paid, shipped, completed, cancelled, refunded
  statusDesc: "",
  createTime: "",
  payTime: "",
  goodsList: [],
  infoList: [],
  goodsAmount: 0,
  discount: 0,
  shippingFee: 0,
  totalAmount: 0,
  address: null,
  logistics: null,
  canRefund: false,
  canRebuy: true,
  isCommented: false,
  expireTime: null,
});

// 状态文本映射
const statusTextMap = {
  pending: "待付款",
  paid: "已付款",
  shipped: "已发货",
  completed: "已完成",
  cancelled: "已取消",
  refunded: "已退款",
};

// 状态文本映射
const statusEnumMap = {
  0: "pending",
  1: "paid",
  2: "shipped",
  3: "completed",
  4: "cancelled",
  5: "refunded",
};

// 计算属性
const showActionButtons = computed(() => {
  return ["pending", "paid", "shipped", "completed", "cancelled", "refunded"].includes(
    orderDetail.value.status
  );
});

// // 页面参数
const orderSn = ref(""); // 订单编号
const channel = ref(1); // 渠道标识

// 生命周期
onLoad((options) => {
  console.log("订单详情页接收参数:", options);
  orderSn.value = options.orderSn || "";
  channel.value = options.channel || 1;

  if (!orderSn) {
    showToast("订单号不能为空");
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
    return;
  }

  loadOrderDetail();
});

onShow(() => {
  // 页面显示时刷新数据
  if (orderSn.value) {
    refreshOrderDetail();
  }
});

onHide(() => {
  // 页面隐藏时清理
});

// 方法
const loadOrderDetail = async () => {
  loading.value = true;
  try {
    // 调用API获取订单详情
    const res = await getOmsOrderDetail(orderSn.value, channel.value);
    console.log("获取订单详情响应:", res);

    if (res) {
      const data = res;

      // 转换数据格式，适配前端页面
      orderDetail.value = {
        id: data.id,
        orderSn: data.orderSn,
        status: statusEnumMap[data.status],
        statusText: data.statusText,
        statusDesc: data.statusDesc,
        createTime: data.createTime,
        payTime: data.paymentTime,
        deliveryTime: data.deliveryTime,
        completeTime: data.receiveTime,
        goodsList: data.orderItems
          ? data.orderItems.map((item) => ({
              id: item.skuId,
              title: item.spuName,
              image: item.picUrl,
              spec: item.skuName,
              price: item.price / 100, // 分转元
              quantity: item.quantity,
            }))
          : [],
        goodsAmount: data.totalAmount / 100, // 分转元
        discount: (data.couponAmount || 0) / 100, // 分转元
        shippingFee: (data.freightAmount || 0) / 100, // 分转元
        totalAmount: data.paymentAmount / 100, // 分转元
        address: data.receiverName
          ? {
              receiver: data.receiverName,
              phone: data.receiverPhone,
              detail: data.receiverFullAddress,
            }
          : null,
        logistics: data.deliveryCompany
          ? {
              company: data.deliveryCompany,
              number: data.deliverySn,
              status: data.deliveryStatus,
              statusText: data.deliveryStatusText,
            }
          : null,
        payMethod: data.paymentMethodText,
        remark: data.remark,
        canRefund: data.canRefund,
        canReturn: data.canReturn,
        canRebuy: data.canRebuy,
        isCommented: data.isCommented,
      };

      // 构建信息列表
      buildInfoList();
    } else {
      showToast(res.data.msg || "获取订单详情失败");
    }
  } catch (error) {
    console.error("加载订单详情失败:", error);
    showToast("网络异常，请稍后重试");
  } finally {
    loading.value = false;
  }
};

const refreshOrderDetail = () => {
  // 短时间内的刷新
  loadOrderDetail();
};

const buildInfoList = () => {
  const info = [];

  info.push({ label: "订单编号", value: orderDetail.value.orderSn });
  info.push({ label: "下单时间", value: formatTime(orderDetail.value.createTime) });

  if (orderDetail.value.payTime) {
    info.push({ label: "支付时间", value: formatTime(orderDetail.value.payTime) });
  }

  if (orderDetail.value.payMethod) {
    info.push({ label: "支付方式", value: orderDetail.value.payMethod });
  }

  if (orderDetail.value.invoiceTitle) {
    info.push({ label: "发票抬头", value: orderDetail.value.invoiceTitle });
  }

  if (orderDetail.value.remark) {
    info.push({ label: "买家留言", value: orderDetail.value.remark });
  }

  orderDetail.value.infoList = info;
};

// 操作按钮方法
const goToPay = () => {
  uni.navigateTo({
    url: `/packageD/pages/payment/index?orderNo=${orderDetail.value.orderNo}&amount=${orderDetail.value.totalAmount}`,
  });
};

const cancelOrder = async () => {
  const res = await showModal("确认取消订单？", "取消后不可恢复");
  if (res.confirm) {
    try {
      const result = await uni.request({
        url: `/api/order/cancel/${orderDetail.value.id}`,
        method: "POST",
      });

      if (result.data.code === 0) {
        showToast("订单已取消");
        setTimeout(() => {
          loadOrderDetail();
        }, 1500);
      } else {
        showToast(result.data.msg || "取消失败");
      }
    } catch (error) {
      showToast("网络异常");
    }
  }
};

const confirmReceipt = async () => {
  const res = await showModal("确认收货？", "请确认已收到商品");
  if (res.confirm) {
    try {
      const result = await uni.request({
        url: `/api/order/confirm/${orderDetail.value.id}`,
        method: "POST",
      });

      if (result.data.code === 0) {
        showToast("收货成功");
        setTimeout(() => {
          loadOrderDetail();
        }, 1500);
      } else {
        showToast(result.data.msg || "操作失败");
      }
    } catch (error) {
      showToast("网络异常");
    }
  }
};

const applyRefund = () => {
  uni.navigateTo({
    url: `/packageD/pages/refund/apply?id=${orderDetail.value.id}`,
  });
};

const goToComment = () => {
  uni.navigateTo({
    url: `/packageD/pages/comment/add?orderId=${orderDetail.value.id}`,
  });
};

const buyAgain = () => {
  // 重新购买逻辑
  const goodsIds = orderDetail.value.goodsList.map((item) => item.id);
  uni.navigateTo({
    url: `/packageA/pages/cart/add?goodsIds=${goodsIds.join(",")}`,
  });
};

const deleteOrder = async () => {
  const res = await showModal("确认删除订单？", "删除后不可恢复");
  if (res.confirm) {
    try {
      const result = await uni.request({
        url: `/api/order/delete/${orderDetail.value.id}`,
        method: "POST",
      });

      if (result.data.code === 0) {
        showToast("删除成功");
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      } else {
        showToast(result.data.msg || "删除失败");
      }
    } catch (error) {
      showToast("网络异常");
    }
  }
};

const editAddress = () => {
  if (orderDetail.value.address) {
    uni.navigateTo({
      url: `/packageD/pages/address/edit?id=${orderDetail.value.address.id}`,
    });
  }
};

const copyLogistics = (number) => {
  copyText(number);
  showToast("运单号已复制");
};

const viewAllLogistics = () => {
  uni.navigateTo({
    url: `/packageD/pages/logistics/detail?number=${orderDetail.value.logistics.number}&company=${orderDetail.value.logistics.company}`,
  });
};

const contactCustomer = () => {
  uni.makePhoneCall({
    phoneNumber: "400-123-4567",
  });
};

const shareOrder = () => {
  uni.showShareMenu({
    withShareTicket: true,
  });
};
</script>

<style lang="scss" scoped>
.order-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;

  .status-section {
    padding: 40rpx 30rpx;
    text-align: center;
    color: #fff;

    &.pending {
      background: linear-gradient(135deg, #ff9a00, #ff5e00);
    }
    &.paid {
      background: linear-gradient(135deg, #4cd964, #5ac8fa);
    }
    &.shipped {
      background: linear-gradient(135deg, #007aff, #5856d6);
    }
    &.completed {
      background: linear-gradient(135deg, #8e44ad, #9b59b6);
    }
    &.cancelled {
      background: linear-gradient(135deg, #e74c3c, #c0392b);
    }
    &.refunded {
      background: linear-gradient(135deg, #95a5a6, #7f8c8d);
    }

    .status-icon {
      font-size: 60rpx;
      margin-bottom: 20rpx;
    }

    .status-text {
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }

    .status-desc {
      font-size: 24rpx;
      opacity: 0.9;
    }

    .countdown {
      margin-top: 20rpx;
      font-size: 28rpx;
      background: rgba(255, 255, 255, 0.2);
      padding: 10rpx 20rpx;
      border-radius: 30rpx;
      display: inline-block;
    }
  }

  .order-card {
    margin: 20rpx;
    border-radius: 16rpx;
    background: #fff;
    overflow: hidden;

    .address-section {
      display: flex;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1rpx solid #eee;

      .address-icon {
        font-size: 40rpx;
        margin-right: 20rpx;
      }

      .address-info {
        flex: 1;

        .receiver {
          font-size: 32rpx;
          font-weight: bold;
          margin-bottom: 10rpx;

          .phone {
            margin-left: 20rpx;
            font-weight: normal;
            color: #666;
          }
        }

        .detail-address {
          font-size: 28rpx;
          color: #666;
        }
      }

      .arrow {
        font-size: 40rpx;
        color: #999;
      }
    }

    .section-title {
      padding: 30rpx 30rpx 20rpx;
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }

    .goods-section {
      .goods-item {
        display: flex;
        padding: 30rpx;
        border-bottom: 1rpx solid #f5f5f5;

        &:last-child {
          border-bottom: none;
        }

        .goods-img {
          width: 160rpx;
          height: 160rpx;
          border-radius: 8rpx;
          margin-right: 20rpx;
        }

        .goods-info {
          flex: 1;

          .goods-title {
            font-size: 28rpx;
            color: #333;
            margin-bottom: 10rpx;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }

          .goods-spec {
            font-size: 24rpx;
            color: #999;
            margin-bottom: 20rpx;
          }

          .goods-price-row {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .price {
              font-size: 32rpx;
              color: #e93323;
              font-weight: bold;
            }

            .quantity {
              font-size: 28rpx;
              color: #999;
            }
          }
        }
      }
    }

    .info-section {
      padding: 30rpx;
      border-top: 1rpx solid #f5f5f5;

      .info-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20rpx;

        &:last-child {
          margin-bottom: 0;
        }

        .info-label {
          font-size: 28rpx;
          color: #666;
        }

        .info-value {
          font-size: 28rpx;
          color: #333;
          text-align: right;
          max-width: 60%;
        }
      }
    }

    .total-section {
      padding: 30rpx;
      border-top: 1rpx solid #f5f5f5;

      .total-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20rpx;
        font-size: 28rpx;
        color: #666;

        &.total {
          margin-top: 20rpx;
          padding-top: 20rpx;
          border-top: 1rpx dashed #eee;
          font-size: 32rpx;
          color: #333;
          font-weight: bold;

          .total-price {
            color: #e93323;
            font-size: 36rpx;
          }
        }

        .discount {
          color: #4cd964;
        }
      }
    }
  }

  .logistics-card {
    margin: 20rpx;
    border-radius: 16rpx;
    background: #fff;
    padding: 30rpx;

    .logistics-info {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;

      .company,
      .number {
        flex: 1;
        font-size: 28rpx;
        color: #333;
      }

      .action {
        color: #007aff;
        font-size: 24rpx;
        padding: 8rpx 20rpx;
        border: 1rpx solid #007aff;
        border-radius: 20rpx;
      }
    }

    .logistics-trace {
      .trace-item {
        padding: 20rpx 0;
        border-left: 4rpx solid #4cd964;
        padding-left: 30rpx;
        position: relative;

        &::before {
          content: "";
          position: absolute;
          left: -8rpx;
          top: 30rpx;
          width: 12rpx;
          height: 12rpx;
          background: #4cd964;
          border-radius: 50%;
        }

        .trace-time {
          font-size: 24rpx;
          color: #999;
          margin-bottom: 10rpx;
        }

        .trace-desc {
          font-size: 28rpx;
          color: #333;
        }
      }

      .view-more {
        text-align: center;
        color: #007aff;
        font-size: 28rpx;
        padding: 20rpx;
        border-top: 1rpx solid #eee;
        margin-top: 20rpx;
      }
    }
  }

  .action-buttons {
    margin: 20rpx;
    border-radius: 16rpx;
    background: #fff;
    padding: 30rpx;

    .button-group {
      display: flex;
      justify-content: flex-end;
      gap: 20rpx;

      .btn {
        padding: 0 40rpx;
        height: 64rpx;
        line-height: 64rpx;
        border-radius: 32rpx;
        font-size: 28rpx;
        border: none;

        &.secondary {
          background: #f5f5f5;
          color: #333;
        }

        &.primary {
          background: linear-gradient(135deg, #ff9a00, #ff5e00);
          color: #fff;
        }
      }
    }
  }

  .bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    padding: 20rpx 30rpx;
    box-shadow: 0 -2rpx 20rpx rgba(0, 0, 0, 0.1);

    .bottom-actions {
      .btn {
        height: 80rpx;
        line-height: 80rpx;
        border-radius: 40rpx;
        font-size: 32rpx;
        border: none;

        &.bottom-pay {
          width: 100%;
          background: linear-gradient(135deg, #ff9a00, #ff5e00);
          color: #fff;
        }
      }

      .contact-section {
        display: flex;
        gap: 20rpx;

        .btn {
          flex: 1;

          &.contact {
            background: #f5f5f5;
            color: #333;
          }

          &.share {
            background: #007aff;
            color: #fff;
          }
        }
      }
    }
  }

  .loading-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;

    .loading-content {
      text-align: center;

      .loading-spinner {
        width: 60rpx;
        height: 60rpx;
        border: 8rpx solid #f3f3f3;
        border-top: 8rpx solid #007aff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 20rpx;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    }
  }
}
</style>
