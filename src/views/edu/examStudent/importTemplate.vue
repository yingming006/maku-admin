<template>
	<el-dialog v-model="visible" title="导入模板" :close-on-click-modal="false">
		<el-card>
			<el-form :inline="true" :model="state.queryForm">
				<el-form-item>
					<fast-select
						v-model="state.queryForm.examId"
						dict-type="exam_dict"
						placeholder="考试"
						clearable
						disabled
						style="width: 320px"
					></fast-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="state.queryForm.clazzId" placeholder="班级" clearable @change="changeClazzHandle">
						<el-option v-for="data in clazzList" :key="data.dictValue" :label="data.dictLabel" :value="data.dictValue">{{
							data.dictLabel
						}}</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button v-auth="'edu:examStudent:export'" type="primary" @click="importTemplateHandle()">下载模板</el-button>
				</el-form-item>
			</el-form>
			<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
				<el-table-column fixed prop="studentNo" label="学生学号" header-align="center" align="center"></el-table-column>
				<el-table-column fixed prop="studentName" label="学生姓名" header-align="center" align="center"></el-table-column>
				<el-table-column
					v-for="(data, index) in courseList"
					:key="index"
					:prop="'scoreList.course_' + data.dictValue"
					:label="data.dictLabel"
					header-align="center"
					align="center"
				>
				</el-table-column>
			</el-table>
		</el-card>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import FastSelect from '@/components/fast-select/src/fast-select.vue'
import { getDictDataList } from '@/utils/common/tool'
import store from '@/store'
import { IHooksOptions } from '@/hooks/interface'
import { useExamApi } from '@/api/edu/exam'
import { useCrud } from '@/hooks/useCrud'
import { userScoreExcelTemplateExport } from '@/api/edu/exam_student'

const visible = ref(false)

const state: IHooksOptions = reactive({
	createdIsNeed: false,
	limit: 100000,
	dataListUrl: '/edu/examStudent/pageWithoutScore',
	deleteUrl: '/edu/examStudent',
	queryForm: {
		examId: '',
		clazzId: ''
	}
})

const init = (examId?: number, clazzId?: number) => {
	visible.value = true
	state.queryForm.examId = examId
	state.queryForm.clazzId = clazzId
	clazzList.value = []
	courseList.value = []
	state.dataList = []
	getExamAndClazz()

	if (state.queryForm.clazzId != '') {
		getDataList()
	}
}

const clazzListDict = getDictDataList(store.appStore.dictList, 'clazz_dict')
let clazzList = ref<any[]>([])

const courseListDict = getDictDataList(store.appStore.dictList, 'course_dict')
let courseList = ref<any[]>([])

const getExamAndClazz = () => {
	let examId = state.queryForm.examId

	if (!examId) {
		clazzList.value = []
		courseList.value = []
		state.dataList = []
		return
	}

	useExamApi(Number(examId)).then(res => {
		for (let element of clazzListDict) {
			if (res.data.clazzList.includes(element.dictValue)) {
				clazzList.value.push(element)
			}
		}

		for (let element of courseListDict) {
			if (res.data.courseList.includes(element.dictValue)) {
				courseList.value.push(element)
			}
		}
	})
}

const importTemplateHandle = () => {
	userScoreExcelTemplateExport(state.queryForm)
	return
}

const changeClazzHandle = (val: string) => {
	if (val == '') {
		state.dataList = []
	} else {
		getDataList()
	}
}

defineExpose({
	init
})

const { getDataList } = useCrud(state)
</script>
