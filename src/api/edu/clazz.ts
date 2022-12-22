import service from '@/utils/request'

export const useClazzApi = (id: number) => {
	return service.get('/edu/clazz/' + id)
}

export const useClazzSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/edu/clazz', dataForm)
	} else {
		return service.post('/edu/clazz', dataForm)
	}
}
