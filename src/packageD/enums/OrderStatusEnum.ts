/**
 * 订单状态枚举
 * ⚠️ 必须与后端 OrderStatusEnum 完全一致
 */
export enum OrderStatusEnum {
  /** 待付款 */
  UNPAID = 0,
  /** 已付款（待发货） */
  PAID = 1,
  /** 已发货 */
  SHIPPED = 2,
  /** 已完成 */
  COMPLETE = 3,
  /** 已取消 */
  CANCELED = 4,
  /** 已关闭 */
  CLOSED = 5,
  /** 售后中 */
  SERVICING = 6,
}

/**
 * 订单状态文案
 */
export const OrderStatusLabel: Record<OrderStatusEnum, string> = {
  [OrderStatusEnum.UNPAID]: "待付款",
  [OrderStatusEnum.PAID]: "已付款（待发货）",
  [OrderStatusEnum.SHIPPED]: "已发货",
  [OrderStatusEnum.COMPLETE]: "已完成",
  [OrderStatusEnum.CANCELED]: "已取消",
  [OrderStatusEnum.CLOSED]: "已关闭",
  [OrderStatusEnum.SERVICING]: "售后中",
};

/**
 * 订单状态 → CSS 类名
 */
export const OrderStatusClass: Record<OrderStatusEnum, string> = {
  [OrderStatusEnum.UNPAID]: "unpaid",
  [OrderStatusEnum.PAID]: "paid",
  [OrderStatusEnum.SHIPPED]: "shipped",
  [OrderStatusEnum.COMPLETE]: "completed",
  [OrderStatusEnum.CANCELED]: "cancelled",
  [OrderStatusEnum.CLOSED]: "closed",
  [OrderStatusEnum.SERVICING]: "servicing",
};
