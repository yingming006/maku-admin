import service from '@/utils/request'

export const useGradeApi = (id: number) => {
	return service.get('/edu/grade/' + id)
}

export const useGradeSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/edu/grade', dataForm)
	} else {
		return service.post('/edu/grade', dataForm)
	}
}
