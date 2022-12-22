<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="学号" prop="no">
				<el-input v-model="dataForm.no" placeholder="学号"></el-input>
			</el-form-item>
			<el-form-item label="姓名" prop="name">
				<el-input v-model="dataForm.name" placeholder="姓名"></el-input>
			</el-form-item>
			<el-form-item prop="gender" label="性别">
				<fast-select v-model="dataForm.gender" dict-type="user_gender" placeholder="性别" style="width: 100%"></fast-select>
			</el-form-item>
			<el-form-item prop="clazzId" label="班级">
				<fast-select v-model="dataForm.clazzId" dict-type="clazz_dict" placeholder="班级" style="width: 100%"></fast-select>
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
import { useStudentApi, useStudentSubmitApi } from '@/api/edu/student'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	no: '',
	name: '',
	gender: '',
	gradeId: '',
	clazzId: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

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
