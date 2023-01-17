import service from '@/utils/common/request'

export const useCourseApi = (id: number) => {
	return service.get('/maku/course/' + id)
}

export const useCourseSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/maku/course', dataForm)
	} else {
		return service.post('/maku/course', dataForm)
	}
}
