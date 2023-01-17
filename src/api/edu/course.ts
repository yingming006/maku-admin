import service from '@/utils/common/request'

export const useCourseApi = (id: number) => {
	return service.get('/edu/course/' + id)
}

export const useCourseSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/edu/course', dataForm)
	} else {
		return service.post('/edu/course', dataForm)
	}
}
