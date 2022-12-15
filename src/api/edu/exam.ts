import service from '@/utils/request'

export const useExamApi = (id: number) => {
	return service.get('/edu/exam/' + id)
}

export const useExamSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/edu/exam', dataForm)
	} else {
		return service.post('/edu/exam', dataForm)
	}
}