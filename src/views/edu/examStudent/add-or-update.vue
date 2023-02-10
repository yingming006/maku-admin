<template>
	<el-drawer v-model="visible" title="修改成绩">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item prop="gradeId" label="考试">
				<fast-select v-model="dataForm.examId" dict-type="exam_dict" disabled style="width: 100%"></fast-select>
			</el-form-item>
			<el-form-item label="姓名" prop="studentName">
				<el-input v-model="dataForm.studentName" placeholder="姓名" disabled></el-input>
			</el-form-item>
			<el-form-item label="学号" prop="studentName">
				<el-input v-model="dataForm.studentNo" placeholder="学号" disabled></el-input>
			</el-form-item>
			<el-form-item
				v-for="(item, index) in dataForm.scoreDetailList"
				:key="index"
				:label="item.courseName"
				:prop="'course_' + item.courseId"
				@change="scoreHandle"
			>
				<el-input-number v-model="item.score" :step="0.01" :controls="false"></el-input-number>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-drawer>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import FastSelect from '@/components/fast-select/src/fast-select.vue'
import { getDictLabel } from '@/utils/common/tool'
import store from '@/store'
import { useExamStudentApi, examStudentUpdateScoreApi } from '@/api/edu/exam_student'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: 0,
	examId: 0,
	studentId: 0,
	studentNo: '',
	studentName: '',
	scoreList: [],
	scoreDetailList: [{ courseId: '', courseName: '', score: 0 }]
})

let courseList = [] as any[]

const init = (id: number, examCourseList: any[]) => {
	visible.value = true
	dataForm.id = id
	courseList = examCourseList

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	getScore(id)
}

const getScore = (id: number) => {
	useExamStudentApi(id).then(res => {
		Object.assign(dataForm, res.data)

		dataForm.scoreDetailList = []
		let keys = Object.keys(res.data.scoreList)
		if (keys.length > 0) {
			keys.forEach(key => {
				let courseId = key.split('_')[1]
				let courseName = getDictLabel(store.appStore.dictList, 'course_dict', courseId)
				let score = res.data.scoreList[key]
				dataForm.scoreDetailList.push({ courseId: courseId, courseName: courseName, score: score })
			})
		} else {
			courseList.forEach(item => {
				let courseId = item.dictValue
				let courseName = item.dictLabel
				let score = 0
				dataForm.scoreDetailList.push({ courseId: courseId, courseName: courseName, score: score })
			})
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

		if (!changed.value) {
			visible.value = false
			return false
		}

		examStudentUpdateScoreApi(dataForm).then(() => {
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

const changed = ref(false)

const scoreHandle = () => {
	changed.value = true
}

defineExpose({
	init
})
</script>
