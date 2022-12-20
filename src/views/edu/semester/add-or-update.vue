<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item prop="dateRange" label="起始日期">
				<el-date-picker
					v-model="dataForm.dateRange"
					type="daterange"
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
					unlink-panels
					value-format="YYYY-MM-DD"
					@change="handleChangeDate"
				/>
			</el-form-item>
			<el-form-item prop="name" label="标题">
				<el-input v-model="dataForm.name" placeholder="例：2022-2023学年度第一学期"></el-input>
			</el-form-item>
			<el-form-item prop="semester" label="学期">
				<fast-select v-model="dataForm.semester" dict-type="semester_num" placeholder="学期" style="width: 100%"></fast-select>
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
import { dayjs, ElMessage } from 'element-plus/es'
import { useSemesterApi, useSemesterSubmitApi } from '@/api/edu/semester'
import FastSelect from '@/components/fast-select/src/fast-select.vue'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	dateRange: ref<[dayjs.ConfigType, dayjs.ConfigType]>(),
	name: '',
	year: '',
	semester: '',
	startDate: '',
	endDate: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getSemester(id)
	}
}

const getSemester = (id: number) => {
	useSemesterApi(id).then(res => {
		Object.assign(dataForm, res.data)
		dataForm.dateRange = [dayjs(res.data.startDate), dayjs(res.data.endDate)]
	})
}

const dataRules = ref({})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useSemesterSubmitApi(dataForm).then(() => {
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

const handleChangeDate = (val: any) => {
	dataForm.startDate = val[0]
	dataForm.endDate = val[1]

	if (dayjs(val[0]).year() == dayjs(val[1]).year()) {
		dataForm.name = dayjs(val[0]).subtract(1, 'year').year() + '-' + dayjs(val[1]).year() + '学年度第二学期'
		dataForm.year = dayjs(val[0]).subtract(1, 'year').year() + '学年度'
		dataForm.semester = '2'
	} else {
		dataForm.name = dayjs(val[0]).year() + '-' + dayjs(val[1]).year() + '学年度第一学期'
		dataForm.year = dayjs(val[0]).year() + '学年度'
		dataForm.semester = '1'
	}
}

defineExpose({
	init,
	handleChangeDate
})
</script>
