import request from '@/utils/request'

const OMSORDER_BASE_URL = "/aioveu-tenant-oms/app-api/v1/orders";

//url: `${OMSORDER_BASE_URL}`,

// 订单列表
export function listOrdersWithPage(params :any) {
	return request({
    url: `${OMSORDER_BASE_URL}`,
    method: "POST",
    data: params,
    header: {
      auth: true, // 需要认证
    },
  });
}

// 订单确认
export function confirm( skuId :any) {
	return request({
		url: `${OMSORDER_BASE_URL}/confirm`,
		method: "POST",
		data: {
			skuId: skuId
		},
		header: {
			'auth': true // 需要认证
		}
	})
}

// 订单提交
export function submit(data :any) {
	return request({
    url: `${OMSORDER_BASE_URL}/submit`,
		method: "POST",
		data: data,
		header: {
			'auth': true // 需要认证
		}
	})
}

// 订单支付
export function pay(data :any) {
	return request({
    url: `${OMSORDER_BASE_URL}/payment`,
		method: "POST",
		data:data,
		header: {
			'auth': true // 需要认证
		}
	})
}

// 取消订单
export function cancelOrder(orderId :any) {
	return request({
    url: `${OMSORDER_BASE_URL}/cancel`,
		method: "PUT",
		data: {
			id: orderId
		},
		header: {
			'auth': true // 需要认证
		}
	})
}

// 删除订单
export function deleteOrder(orderId :any) {
	return request({
    url: `${OMSORDER_BASE_URL}/${orderId}`,
		method: "DELETE",
		header: {
			'auth': true // 需要认证
		}
	})
}

// 申请退款
export function applyRefund (data :any) {
  return request({
    url: `${OMSORDER_BASE_URL}/apply-refund`,
    method: "POST",
    data,
    header: {
      'auth': true // 需要认证
    }
  })
}

// 获取退款详情
export function getRefundDetail (orderId :any) {
  return request({
    url: `${OMSORDER_BASE_URL}/refund-detail/${orderId}`,
    method: "GET",
    header: {
      'auth': true // 需要认证
    }
  })
}

// 取消退款
export function cancelRefund (refundId :any) {
  return request({
    url: `/aioveu-oms/app-api/v1/orders/cancel-refund/${refundId}`,
    method: "POST",
    header: {
      'auth': true // 需要认证
    }
  })
}
