import request from '@/utils/request'


const PMSSPU_BASE_URL = "/aioveu/api/v8/app/pms";

/**
 * 获取商品分页列表
 * 
 * @param {Object} params
 */
export function listSpuPages(params:any) {

	return request({
    url: `${PMSSPU_BASE_URL}/spu/pages`,
    method: "GET",
    data: params,
    header: {
      skipAuth: true,
    },
  });
}

/**
 * 获取秒杀商品列表
 * 
 * @param {Object} params
 */
export function listSeckillingSpus() {

	return request({
    url: `${PMSSPU_BASE_URL}/spu/seckilling`,
    method: "GET",
    header: {
      skipAuth: true,
    },
  });
}

/**
 * 获取商品详情
 *
 * @param {Object} spuId
 */
export function getSpuDetail(spuId: number) {
  return request({
    url: `${PMSSPU_BASE_URL}/spu/spuDetail/${spuId}`,
    method: "GET",
    header: {
      skipAuth: true,
    },
  });
}

