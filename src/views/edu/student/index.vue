<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<fast-select
					v-model="state.queryForm.gradeId"
					dict-type="grade_dict"
					placeholder="年级"
					clearable
					style="width: 120px"
					@change="getClazz"
				></fast-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.clazzId" placeholder="班级" clearable @change="getDataList">
					<el-option v-for="data in dictList" :key="data.dictValue" :label="data.dictLabel" :value="data.dictValue"> {{ data.dictLabel }}</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'edu:student:save'" type="primary" @click="addOrUpdateHandle()"> 新增 </el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'edu:student:delete'" type="danger" @click="deleteBatchHandle()"> 删除 </el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="no" label="学号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="name" label="姓名" header-align="center" align="center"></el-table-column>
			<fast-table-column prop="gender" label="性别" dict-type="user_gender"></fast-table-column>
			<el-table-column prop="gradeName" label="年级" header-align="center" align="center"></el-table-column>
			<el-table-column prop="clazzName" label="班级" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'edu:student:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改 </el-button>
					<el-button v-auth="'edu:student:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除 </el-button>
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

<script setup lang="ts" name="EduStudentIndex">
import { useCrud } from '@/hooks/useCrud'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import FastTableColumn from '@/components/fast-table-column/src/fast-table-column.vue'
import AddOrUpdate from '@/views/edu/student/add-or-update.vue'
import FastSelect from '@/components/fast-select/src/fast-select.vue'
import service from '@/utils/common/request'

const state: IHooksOptions = reactive({
	dataListUrl: '/edu/student/page',
	deleteUrl: '/edu/student',
	queryForm: {
		gradeId: '',
		clazzId: ''
	},
	limit: 20
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

let dictList = ref<any[]>()

const getClazz = (val: string) => {
	state.queryForm.gradeId = val
	state.queryForm.clazzId = ''

	getDataList()

	// 获取班级字典
	if (val !== '') {
		getClazzDict(val)
	}
}

const getClazzDict = async (val: string) => {
	const { data } = await service.get('/edu/clazz/dict?gradeId=' + val)

	dictList.value = data.list || []
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
