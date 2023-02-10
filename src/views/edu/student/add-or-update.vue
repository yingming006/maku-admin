<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" width="16%">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="50px" @keyup.enter="submitHandle()">
			<el-form-item label="学号" prop="no">
				<el-input v-model="dataForm.no" placeholder="学号"></el-input>
			</el-form-item>
			<el-form-item label="姓名" prop="name">
				<el-input v-model="dataForm.name" placeholder="姓名"></el-input>
			</el-form-item>
			<el-form-item prop="gender" label="性别">
				<fast-select v-model="dataForm.gender" dict-type="user_gender" placeholder="性别" style="width: 100%"></fast-select>
			</el-form-item>
			<el-form-item prop="gradeId" label="年级">
				<fast-select
					v-model="dataForm.gradeId"
					dict-type="grade_dict"
					placeholder="年级"
					clearable
					style="width: 100%"
					@change="changeGrade"
				></fast-select>
			</el-form-item>
			<el-form-item prop="clazzId" label="班级">
				<el-select v-model="dataForm.clazzId" placeholder="班级" clearable style="width: 100%">
					<el-option v-for="(data, index) in formDictList" :key="index" :label="data.dictLabel" :value="data.dictValue">
						{{ data.dictLabel }}
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { StudentVO, useStudentApi, useStudentSubmitApi } from '@/api/edu/student'
import service from '@/utils/common/request'
import FastSelect from '@/components/fast-select/src/fast-select.vue'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive<StudentVO>({})

const init = (id?: number) => {
	visible.value = true

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getStudent(id)
	}
}

const getStudent = (id: number) => {
	useStudentApi(id).then(res => {
		Object.assign(dataForm, res.data)
		getClazzDict(res.data.gradeId)
	})
}

const changeGrade = (val: string) => {
	dataForm.clazzId = ''

	getClazzDict(val)
}

let formDictList = ref<any[]>()

const getClazzDict = (val: string) => {
	service.get('/edu/clazz/dict?gradeId=' + val).then(res => {
		formDictList.value = res.data.list || []
	})
}

const dataRules = ref({})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useStudentSubmitApi(dataForm).then(() => {
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
