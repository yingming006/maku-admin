import service from '@/utils/request'
import constant from '@/utils/constant'
import cache from '@/utils/cache'

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

// 模板导出
export const userScoreExcelTemplateExport = (examId: number) => {
	location.href = constant.apiUrl + '/edu/score/exportTemplate/' + examId + '?access_token=' + cache.getToken()
}
