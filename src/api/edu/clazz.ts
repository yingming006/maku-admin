import service from '@/utils/common/request'

export const useClazzApi = (id: number) => {
	return service.get('/edu/clazz/' + id)
}

export const useClazzSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/edu/clazz', dataForm)
	} else {
		return service.post('/edu/clazz', dataForm)
	}
}

export const clazzDetailApi = (id: number) => {
	return service.get('/edu/clazz/' + id + '/detail')
}

export const updateClazzCourseTeacherApi = (dataForm: any) => {
	return service.put('/edu/clazz/updateCourseTeacher', dataForm)
}
