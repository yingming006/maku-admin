<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'edu:teacher:save'" type="primary" @click="addOrUpdateHandle()"> 新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'edu:teacher:delete'" type="danger" @click="deleteBatchHandle()"> 删除</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="no" label="工号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="name" label="姓名" header-align="center" align="center"></el-table-column>
			<fast-table-column prop="gender" label="性别" dict-type="user_gender"></fast-table-column>
			<el-table-column prop="phone" label="联系方式" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'edu:teacher:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改 </el-button>
					<el-button v-auth="'edu:teacher:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除 </el-button>
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

<script setup lang="ts" name="EduTeacherIndex">
import { useCrud } from '@/hooks/useCrud'
import { onMounted, reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from '@/views/edu/teacher/add-or-update.vue'
import FastTableColumn from '@/components/fast-table-column/src/fast-table-column.vue'

const state: IHooksOptions = reactive({
	dataListUrl: '/edu/teacher/page',
	deleteUrl: '/edu/teacher',
	queryForm: {}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
