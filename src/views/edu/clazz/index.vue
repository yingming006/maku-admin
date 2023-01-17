<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'edu:clazz:save'" type="primary" @click="addOrUpdateHandle()"> 新增 </el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'edu:clazz:delete'" type="danger" @click="deleteBatchHandle()"> 删除 </el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="name" label="行政班级" header-align="center" align="center"></el-table-column>
			<el-table-column prop="entranceYear" label="入学年份" header-align="center" align="center"></el-table-column>
			<fast-table-column prop="gradeId" label="年级" dict-type="grade_dict"></fast-table-column>
			<fast-table-column prop="semesterId" label="学期" dict-type="semester_dict"></fast-table-column>
			<fast-table-column prop="headmasterId" label="班主任" dict-type="teacher_dict"></fast-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="250">
				<template #default="scope">
					<el-button v-auth="'edu:clazz:update'" type="primary" link @click="setCourseHandle(scope.row.id)">开设课程 </el-button>
					<el-button v-auth="'edu:clazz:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改 </el-button>
					<el-button v-auth="'edu:clazz:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除 </el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			:current-page="state.page"
			:page-sizes="state.pageSizes"
			:page-size="state.limit"
			:total="state.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>
		<!-- 弹窗， 开设课程-->
		<edit-course ref="setCourseRef"></edit-course>
	</el-card>
</template>

<script setup lang="ts" name="EduClazzIndex">
import { useCrud } from '@/hooks/useCrud'
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import FastTableColumn from '@/components/fast-table-column/src/fast-table-column.vue'
import EditCourse from '@/views/edu/clazz/edit-course.vue'

const state: IHooksOptions = reactive({
	dataListUrl: '/edu/clazz/page',
	deleteUrl: '/edu/clazz',
	queryForm: {}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const setCourseRef = ref()
const setCourseHandle = (id?: number) => {
	setCourseRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
