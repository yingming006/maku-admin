import service from '@/utils/request'

export const useScoreApi = (id: number) => {
	return service.get('/edu/score/' + id)
}

export const useScoreSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/edu/score', dataForm)
	} else {
		return service.post('/edu/score', dataForm)
	}
}

// export const useExamScoreApi = ()
