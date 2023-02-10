import service from '@/utils/common/request'

export type StudentVO = {
	id?: number
	no?: number
	name?: string
	gender?: string
	gradeId?: string
	gradeName?: string
	clazzId?: string
	clazzName?: string
	isEnabled?: number
}

export const useStudentApi = (id: number) => {
	return service.get('/edu/student/' + id)
}

export const useStudentSubmitApi = (dataForm: StudentVO) => {
	if (dataForm.id) {
		return service.put('/edu/student', dataForm)
	} else {
		return service.post('/edu/student', dataForm)
	}
}
