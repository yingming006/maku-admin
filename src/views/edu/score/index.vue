<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<fast-select v-model="state.queryForm.examId" dict-type="exam_dict" placeholder="考试" clearable @change="getExamClazzAndScore"></fast-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.clazzId" placeholder="班级" clearable @change="getClazzScore">
					<el-option v-for="data in clazzList" :key="data.dictValue" :label="data.dictLabel" :value="data.dictValue">{{ data.dictLabel }}</el-option>
				</el-select>
			</el-form-item>

			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'edu:score:save'" type="primary" @click="addOrUpdateHandle()"> 新增 </el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'edu:score:delete'" type="danger" @click="deleteBatchHandle()"> 删除 </el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="studentNo" label="学生学号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="studentName" label="学生姓名" header-align="center" align="center"></el-table-column>
			<el-table-column
				v-for="data in courseList"
				:prop="'scoreList.course_' + data.dictValue"
				:label="data.dictLabel"
				header-align="center"
				align="center"
			></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'edu:score:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改 </el-button>
					<el-button v-auth="'edu:score:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除 </el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--		<el-pagination-->
		<!--			:current-page="state.page"-->
		<!--			:page-sizes="state.pageSizes"-->
		<!--			:page-size="state.limit"-->
		<!--			:total="state.total"-->
		<!--			layout="total, sizes, prev, pager, next, jumper"-->
		<!--			@size-change="sizeChangeHandle"-->
		<!--			@current-change="currentChangeHandle"-->
		<!--		>-->
		<!--		</el-pagination>-->

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="EduScoreIndex">
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import FastSelect from '@/components/fast-select/src/fast-select.vue'
import { getDictDataList } from '@/utils/tool'
import store from '@/store'
import { useExamApi } from '@/api/edu/exam'
import { useCrud } from '@/hooks'

const state: IHooksOptions = reactive({
	createdIsNeed: false,
	dataListUrl: '/edu/score/page',
	deleteUrl: '/edu/score',
	queryForm: {
		examId: '',
		clazzId: ''
	}
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
			if (res.data.clazzList.find((item: String) => item == element.dictValue)) {
				clazzList.value.push(element)
			}
		}

		let courseStr = res.data.courseList
		if (courseStr && courseStr.length > 0) {
			courseStr = courseStr.substring(0, courseStr.length - 1)
			let courseStrList = courseStr.split(',')
			for (let element of courseListDict) {
				if (courseStrList.find((item: String) => item == element.dictValue)) {
					courseList.value.push(element)
				}
			}
		}
	})

	getDataList()
}

const getClazzScore = (val: String) => {
	state.queryForm.clazzId = val

	getDataList()
}

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
