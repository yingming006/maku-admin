import service from '@/utils/common/request'

export const useCacheInfoApi = () => {
	return service.get('/monitor/cache/info')
}
