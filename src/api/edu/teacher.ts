import service from '@/utils/common/request'

export const useTeacherApi = (id: number) => {
	return service.get('/edu/teacher/' + id)
}

export const useTeacherSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/edu/teacher', dataForm)
	} else {
		return service.post('/edu/teacher', dataForm)
	}
}
