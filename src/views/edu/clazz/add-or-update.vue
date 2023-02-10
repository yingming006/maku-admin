<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" width="400px">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="班级编号" prop="no">
				<el-input-number v-model="dataForm.no" placeholder="例如：202201" :controls="false" style="width: 100%"></el-input-number>
			</el-form-item>
			<el-form-item label="行政班级" prop="name">
				<el-input v-model="dataForm.name" placeholder="例如：一班、十一班"></el-input>
			</el-form-item>
			<el-form-item label="入学年份" prop="entranceYear">
				<el-date-picker v-model="dataForm.entranceYear" type="year" value-format="YYYY" placeholder="入学年份" style="width: 100%" />
			</el-form-item>
			<el-form-item prop="gradeId" label="年级">
				<fast-select v-model="dataForm.gradeId" dict-type="grade_dict" placeholder="年级" style="width: 100%"></fast-select>
			</el-form-item>
			<el-form-item prop="semesterId" label="学期">
				<fast-select v-model="dataForm.semesterId" dict-type="semester_dict" placeholder="学期" style="width: 100%"></fast-select>
			</el-form-item>
			<el-form-item prop="headmasterId" label="班主任">
				<fast-select v-model="dataForm.headmasterId" dict-type="teacher_dict" placeholder="班主任" style="width: 100%"></fast-select>
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
import { useClazzApi, useClazzSubmitApi } from '@/api/edu/clazz'
import FastSelect from '@/components/fast-select/src/fast-select.vue'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	no: null,
	name: '',
	entranceYear: '',
	gradeId: '',
	semesterId: '',
	headmasterId: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getClazz(id)
	}
}

const getClazz = (id: number) => {
	useClazzApi(id).then(res => {
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

<style scoped>
.el-input-number /deep/ .el-input__inner {
	text-align: left;
}
</style>
