import request from '@/utils/request'


const PMSSPU_BASE_URL = "/aioveu-tenant-pms/app-api/v1/spu";

/**
 * 获取商品分页列表
 * 
 * @param {Object} params
 */
export function listSpuPages(params:any) {
	return request({
    url: `${PMSSPU_BASE_URL}/pages`,
		method: "GET",
    data: params,
	})
}

/**
 * 获取秒杀商品列表
 * 
 * @param {Object} params
 */
export function listSeckillingSpus() {
	return request({
    url: `${PMSSPU_BASE_URL}/seckilling`,
		method: "GET",
	})
}

/**
 * 获取商品详情
 *
 * @param {Object} spuId
 */
export function getSpuDetail(spuId: number) {
	return request({
    url: `${PMSSPU_BASE_URL}/${spuId}`,
		method: "GET"
	})
}

