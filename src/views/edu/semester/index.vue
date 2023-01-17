<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'edu:semester:save'" type="primary" @click="addOrUpdateHandle()"> 新增 </el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'edu:semester:delete'" type="danger" @click="deleteBatchHandle()"> 删除 </el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="name" label="标题" header-align="center" align="center"></el-table-column>
			<el-table-column prop="year" label="学年" header-align="center" align="center"></el-table-column>
			<fast-table-column prop="semester" label="学期" dict-type="semester_num"></fast-table-column>
			<el-table-column prop="startDate" label="开始时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="endDate" label="结束时间" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'edu:semester:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改 </el-button>
					<el-button v-auth="'edu:semester:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除 </el-button>
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
	</el-card>
</template>

<script setup lang="ts" name="EduSemesterIndex">
import { useCrud } from '@/hooks/useCrud'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from '@/views/edu/semester/add-or-update.vue'
import FastTableColumn from '@/components/fast-table-column/src/fast-table-column.vue'

const state: IHooksOptions = reactive({
	dataListUrl: '/edu/semester/page',
	deleteUrl: '/edu/semester',
	queryForm: {}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
