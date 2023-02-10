<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" width="20%">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item prop="no" label="工号">
				<el-input v-model="dataForm.no" placeholder="工号"></el-input>
			</el-form-item>
			<el-form-item prop="name" label="姓名">
				<el-input v-model="dataForm.name" placeholder="姓名"></el-input>
			</el-form-item>
			<el-form-item prop="gender" label="性别">
				<fast-select v-model="dataForm.gender" dict-type="user_gender" placeholder="性别" style="width: 100%"></fast-select>
			</el-form-item>
			<el-form-item prop="phone" label="联系方式">
				<el-input v-model="dataForm.phone" placeholder="联系方式"></el-input>
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
import { useTeacherApi, useTeacherSubmitApi } from '@/api/edu/teacher'
import FastSelect from '@/components/fast-select/src/fast-select.vue'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	no: '',
	name: '',
	gender: '',
	phone: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getTeacher(id)
	}
}

const getTeacher = (id: number) => {
	useTeacherApi(id).then(res => {
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

		useTeacherSubmitApi(dataForm).then(() => {
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
