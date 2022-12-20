import service from '@/utils/request'

export const useSemesterApi = (id: number) => {
	return service.get('/edu/semester/' + id)
}

export const useSemesterSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/edu/semester', dataForm)
	} else {
		return service.post('/edu/semester', dataForm)
	}
}
