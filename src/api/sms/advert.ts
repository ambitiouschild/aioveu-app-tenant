
import request from '@/utils/request'


const SMSADVERT_BASE_URL = "/aioveu-tenant-sms/app-api/v1/adverts";

export function getAdvertList() {
  return request({
    url: `${SMSADVERT_BASE_URL}/banners`,
    method: "GET"
  })
}
