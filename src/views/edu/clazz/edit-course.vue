<template>
	<el-dialog v-model="visible" :title="title" :close-on-click-modal="false" width="600px">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-row>
				<el-col v-for="item in courseList" :span="8" style="text-align: -webkit-center">
					<el-switch v-model="item.value" name="course" inline-prompt :active-text="item.dictLabel" :inactive-text="item.dictLabel" size="large" />
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useClazzApi, useClazzSubmitApi } from '@/api/edu/clazz'
import { getDictDataList } from '@/utils/tool'
import store from '@/store'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	name: '',
	gradeName: '',
	courseList: ''
})

const title = ref('开设课程')

const courseList = getDictDataList(store.appStore.dictList, 'course_dict')

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		console.log(1)
		dataFormRef.value.resetFields()
		title.value = '开设课程'
		dataForm.courseList = ''
	}

	if (id) {
		getClazz(id)
	}
}

const getClazz = (id: number) => {
	useClazzApi(id).then(res => {
		Object.assign(dataForm, res.data)
		title.value = dataForm.gradeName + dataForm.name + title.value
		// 已经开设的课程
		for (let element of courseList) {
			if (dataForm.courseList != null) {
				element.value = dataForm.courseList.indexOf(element.dictLabel) >= 0
			} else {
				element.value = false
			}
		}
	})
}

const dataRules = ref({})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		dataForm.courseList = ''
		for (let element of courseList) {
			if (element.value) {
				dataForm.courseList += element.dictLabel + ','
			}
		}

		useClazzSubmitApi(dataForm).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
					emit('refreshDataList')
				}
			})
		})
	})
}

defineExpose({
	init
})
</script>
