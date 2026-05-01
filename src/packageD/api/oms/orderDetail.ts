import request from '@/utils/request'

const OMSORDERDETAIL_BASE_URL = "/aioveu-tenant-oms/app-api/v1/order";

// 订单列表
export function getOmsOrderDetail(orderSn: String, channel: Number) {
  return request({
    url: `${OMSORDERDETAIL_BASE_URL}/detail/${orderSn}`,
    method: "GET",
    data: { orderSn , channel },
    header: {
      auth: true, // 需要认证
    },
  });
}
