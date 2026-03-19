import request from '@/utils/request'


const UMSMEMBERADDRESS_BASE_URL = "/aioveu-tenant-ums/app-api/v1/addresses";


export function list(memberId : number) {
	return request({
    url: `${UMSMEMBERADDRESS_BASE_URL}`,
		method: "GET",
		data: {
			memberId: memberId
		},
		header: {
			'auth': true // 需要认证
		}
	})
}


export function add(data:Object) {
	return request({
    url: `${UMSMEMBERADDRESS_BASE_URL}`,
    method: "POST",
    data: data,
    header: {
      auth: true, // 需要认证
    },
  });
}


export function update(id :Number, data:Object) {
	return request({

    //前端接口URL写错了！ 你使用了单引号而不是反引号（模板字符串）
    //方案1：使用模板字符串（正确的方式）  url: `/aioveu-ums/app-api/v1/addresses/${id}`,

    //方案2：使用字符串拼接  url: '/aioveu-ums/app-api/v1/addresses/' + id,  // 字符串拼接
    url: `${UMSMEMBERADDRESS_BASE_URL}/${id}`,
		method: "PUT",
		data: data,
		header: {
			'auth': true // 需要认证
		}
	})
}
