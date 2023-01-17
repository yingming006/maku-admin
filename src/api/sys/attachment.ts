import service from '@/utils/common/request'

export const useAttachmentSubmitApi = (dataForm: any) => {
	return service.post('/sys/attachment', dataForm)
}
