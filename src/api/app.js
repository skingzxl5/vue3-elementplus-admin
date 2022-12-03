import request from '@/utils/request'

export function uploadFile(data) {
    return request({
        method: "POST",
        url: '/api/authority/uploadFile',
        data,
    });
}