import service from '@/utils/request'

export const useStudentApi = (id: number) => {
	return service.get('/edu/student/' + id)
}

export const useStudentSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/edu/student', dataForm)
	} else {
		return service.post('/edu/student', dataForm)
	}
}