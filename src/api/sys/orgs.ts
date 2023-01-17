import service from '@/utils/common/request'

export const useOrgListApi = () => {
	return service.get('/sys/org/list')
}

export const useOrgApi = (id: Number) => {
	return service.get('/sys/org/' + id)
}

export const useOrgSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/sys/org', dataForm)
	} else {
		return service.post('/sys/org', dataForm)
	}
}
