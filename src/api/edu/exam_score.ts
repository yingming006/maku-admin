import service from '@/utils/common/request'
import constant from '@/utils/common/constant'
import cache from '@/utils/cache'

export const useExamScoreApi = (examId?: number, studentId?: number) => {
	return service.get('/edu/examScore/' + examId + '/' + studentId)
}

export const useExamScoreSubmitApi = (dataForm: any) => {
	// if (dataForm.id) {
	return service.put('/edu/examScore', dataForm)
	// } else {
	// 	return service.post('/edu/score', dataForm)
	// }
}

// 模板导出
export const userScoreExcelTemplateExport = (dataForm: any) => {
	location.href =
		constant.apiUrl + '/edu/score/exportTemplate?examId=' + dataForm.examId + '&clazzId=' + dataForm.clazzId + '&access_token=' + cache.getToken()
}
