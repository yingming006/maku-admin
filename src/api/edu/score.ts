import service from '@/utils/request'

export const useScoreApi = (examId?: number, studentId?: number) => {
	return service.get('/edu/score/' + examId + '/' + studentId)
}

export const useScoreSubmitApi = (dataForm: any) => {
	// if (dataForm.id) {
	return service.put('/edu/score', dataForm)
	// } else {
	// 	return service.post('/edu/score', dataForm)
	// }
}
