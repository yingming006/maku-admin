<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm">
			<el-form-item>
				<fast-select v-model="state.queryForm.examId" dict-type="exam_dict" placeholder="考试" clearable disabled style="width: 320px"></fast-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.clazzId" placeholder="班级" clearable @change="getDataList">
					<el-option v-for="data in clazzList" :key="data.dictValue" :label="data.dictLabel" :value="data.dictValue">{{ data.dictLabel }}</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">刷新</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'edu:examStudent:export'" type="primary" @click="importTemplateHandle(state.queryForm.examId, state.queryForm.clazzId)"
					>下载模板</el-button
				>
			</el-form-item>
			<el-form-item>
				<el-upload :action="uploadExcelUrl" :data="state.queryForm" :before-upload="beforeUpload" :on-success="handleSuccess" :show-file-list="false">
					<el-button v-auth="'edu:examStudent:import'" type="info">导入</el-button>
				</el-upload>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
			<el-table-column fixed sortable="custom" prop="studentNo" label="学生学号" header-align="center" align="center"></el-table-column>
			<el-table-column fixed prop="studentName" label="学生姓名" header-align="center" align="center"></el-table-column>
			<el-table-column
				v-for="(data, index) in courseList"
				:key="index"
				sortable
				:prop="'scoreList.course_' + data.dictValue"
				:label="data.dictLabel"
				header-align="center"
				align="center"
			>
			</el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'edu:examStudent:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改 </el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>
		<import-template ref="importTemplateRef" @refreshDataList="getDataList"></import-template>
	</el-card>
</template>

<script setup lang="ts" name="EduScoreIndex">
import { onMounted, reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import FastSelect from '@/components/fast-select/src/fast-select.vue'
import { getDictDataList } from '@/utils/common/tool'
import store from '@/store'
import { useExamApi } from '@/api/edu/exam'
import { useCrud } from '@/hooks/useCrud'
import { useRoute } from 'vue-router'
import { ElMessage, UploadProps } from 'element-plus'
import constant from '@/utils/common/constant'
import cache from '@/utils/cache'
import ImportTemplate from '@/views/edu/examStudent/importTemplate.vue'

const state: IHooksOptions = reactive({
	createdIsNeed: false,
	limit: 100000,
	dataListUrl: '/edu/examStudent/page',
	deleteUrl: '/edu/examStudent',
	queryForm: {
		examId: '',
		clazzId: ''
	}
})

const uploadExcelUrl = constant.apiUrl + '/edu/examStudent/import' + '?access_token=' + cache.getToken()

const route = useRoute()

onMounted(() => {
	getExamClazzAndScore(route.query.id + '')
})

const clazzListDict = getDictDataList(store.appStore.dictList, 'clazz_dict')
let clazzList = ref<any[]>([])

const courseListDict = getDictDataList(store.appStore.dictList, 'course_dict')
let courseList = ref<any[]>([])

const getExamClazzAndScore = (val: String) => {
	state.queryForm.examId = val
	if (!val) {
		clazzList.value = []
		courseList.value = []
		state.dataList = []
		return
	}

	useExamApi(Number(val)).then(res => {
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

	getDataList()
}

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id: number) => {
	addOrUpdateRef.value.init(id, courseList.value)
}

const importTemplateRef = ref()
const importTemplateHandle = (examId?: number, clazzId?: number) => {
	importTemplateRef.value.init(examId, clazzId)
}

const handleSuccess: UploadProps['onSuccess'] = (res, file) => {
	if (res.code !== 0) {
		ElMessage.error('上传失败：' + res.msg)
		return false
	}

	ElMessage.success({
		message: '上传成功',
		duration: 500,
		onClose: () => {
			getDataList()
		}
	})
}

const beforeUpload: UploadProps['beforeUpload'] = file => {
	if (file.size / 1024 / 1024 / 1024 / 1024 > 1) {
		ElMessage.error('文件大小不能超过100M')
		return false
	}
	return true
}

const { getDataList } = useCrud(state)
</script>
