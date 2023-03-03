<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="考试名称" prop="name">
				<el-input v-model="dataForm.name" placeholder="考试名称"></el-input>
			</el-form-item>
			<el-form-item prop="type" label="考试类型">
				<fast-select v-model="dataForm.type" dict-type="exam_type" placeholder="考试类型" style="width: 100%"></fast-select>
			</el-form-item>
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
			<el-form-item prop="clazzList" label="考试班级">
				<el-transfer
					v-model="dataForm.clazzList"
					:titles="['未选择', '已选择']"
					:button-texts="['移除', '添加']"
					filterable
					:filter-method="filterMethod"
					filter-placeholder="输入关键字过滤"
					:data="clazzDictList"
					:props="{
						key: 'dictValue',
						label: 'dictLabel'
					}"
				/>
			</el-form-item>
			<el-form-item prop="courseList" label="考试科目">
				<el-col v-for="(item, index) in courseList" :key="index" :span="8">
					<el-switch
						v-model="item.value"
						:name="'course' + index"
						inline-prompt
						:active-text="item.dictLabel"
						:inactive-text="item.dictLabel"
						@change="
							val => {
								changeCourseHandle(val, item)
							}
						"
					/>
					<el-input v-if="item.value" v-model="item.fullScore" style="width: 130px; margin-left: 10px" @input="checkNumHandle(item)">
						<template #prepend>满分</template>
					</el-input>
				</el-col>
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
import { useExamApi, useExamSubmitApi } from '@/api/edu/exam'
import FastSelect from '@/components/fast-select/src/fast-select.vue'
import { dayjs } from 'element-plus'
import { getDictDataList } from '@/utils/common/tool'
import store from '@/store'
import { checkNum } from '@/utils/common/checkNum'

const emit = defineEmits(['refreshDataList'])

interface Option {
	key: number
	label: string
	disabled: boolean
}

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	name: '',
	type: '',
	clazzList: [],
	dateRange: ref<[dayjs.ConfigType, dayjs.ConfigType]>(),
	startDate: '',
	endDate: '',
	courseList: [] as any[]
})

const clazzDictList = ref<Option[]>(getDictDataList(store.appStore.dictList, 'clazz_dict'))

const courseList = getDictDataList(store.appStore.dictList, 'course_dict')

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
		dataForm.courseList = []
	}

	if (id) {
		getExam(id)
	} else {
		for (let element of courseList) {
			element.value = false
		}
	}
}

const getExam = (id: number) => {
	useExamApi(id).then(res => {
		Object.assign(dataForm, res.data)

		dataForm.dateRange = [dayjs(res.data.startDate), dayjs(res.data.endDate)]

		console.log(dataForm.courseList)

		// 已经开设的课程
		for (let element of courseList) {
			if (Array.isArray(dataForm.courseList) && dataForm.courseList.length > 0) {
				element.value = dataForm.courseList.some((course: any) => course.id === element.dictValue)
				element.fullScore = dataForm.courseList.find((course: any) => course.id === element.dictValue).fullScore
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

		dataForm.courseList = []
		for (let element of courseList) {
			if (element.value) {
				dataForm.courseList.push({ id: element.dictValue, fullScore: element.fullScore })
			}
		}

		useExamSubmitApi(dataForm).then(() => {
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
}

const changeCourseHandle = (val: any, item: any) => {
	item.fullScore = val ? 100 : 0
}

const filterMethod = (query: String, item: any) => {
	return item.dictLabel.includes(query)
}

const checkNumHandle = (item: any) => {
	item.fullScore = checkNum({ value: item.fullScore }, 0, 0, 0, 10000, 0)
}

defineExpose({
	init
})
</script>
