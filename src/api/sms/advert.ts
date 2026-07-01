
import request from '@/utils/request'


const SMSADVERT_BASE_URL = "/aioveu/api/v8/app/sms/adverts";


export function getAdvertList() {

  return request({
    url: `${SMSADVERT_BASE_URL}/banners`,
    method: "GET",
    header: {
      skipAuth: true,
    },
  });
}
