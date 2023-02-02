import service from '@/utils/common/request'
import constant from '@/utils/common/constant'
import cache from '@/utils/cache'

export const useExamStudentApi = (id: number) => {
	return service.get('/edu/examStudent/' + id)
}

export const useExamStudentSubmitApi = (dataForm: any) => {
	// if (dataForm.id) {
	return service.put('/edu/examStudent', dataForm)
	// } else {
	// 	return service.post('/edu/score', dataForm)
	// }
}

// 模板导出
export const userScoreExcelTemplateExport = (dataForm: any) => {
	location.href =
		constant.apiUrl + '/edu/score/exportTemplate?examId=' + dataForm.examId + '&clazzId=' + dataForm.clazzId + '&access_token=' + cache.getToken()
}
