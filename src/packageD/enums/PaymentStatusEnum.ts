/**
 * 支付状态枚举
 * ⚠️ 必须与后端 PaymentStatusEnum 保持一致
 *
 * 0-待支付 1-支付中 2-支付成功
 * 3-支付失败 4-已关闭 5-退款中
 * 6-已退款 7-未知
 */
export enum PaymentStatusEnum {
  /** 待支付 */
  UNPAID = 1,
  /** 支付中 */
  PAYING = 2,
  /** 支付成功 */
  PAID = 3,
  /** 支付失败 */
  FAILED = 4,
  /** 已关闭 */
  CLOSED = 5,
  /** 退款中 */
  REFUNDING = 6,
  /** 已退款 */
  REFUNDED = 7,
  /** 状态未知 */
  UNKNOWN = 8,
}

/**
 * 支付状态文案映射
 */
export const PaymentStatusLabel: Record<PaymentStatusEnum, string> = {
  [PaymentStatusEnum.UNPAID]: "待支付",
  [PaymentStatusEnum.PAYING]: "支付中",
  [PaymentStatusEnum.PAID]: "支付成功",
  [PaymentStatusEnum.FAILED]: "支付失败",
  [PaymentStatusEnum.CLOSED]: "已关闭",
  [PaymentStatusEnum.REFUNDING]: "退款中",
  [PaymentStatusEnum.REFUNDED]: "已退款",
  [PaymentStatusEnum.UNKNOWN]: "状态未知",
};
