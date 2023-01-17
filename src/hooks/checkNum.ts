import { checkNum } from '@/utils/common/checkNum'

export const useInputNumber = () => {
	/*
	 * @name: validateNum 校验el-input仅填写数字、负数、小数
	 * @param: val表示当前输入的值
	 * @param: row表示表单当前行数据（根据自己实际情况修改）
	 * @param: field表示表单字段名
	 * @param: intNum表示整数位个数，默认0为不限制
	 * @param: decNum表示小数位个数，默认0为没小数
	 * @param: maxLength用于限制输入的数字位数，默认0（包含小数位）
	 * @param: max用于限制输入的数字最大值
	 * @param: min用于限制输入的数字最小值
	 */
	const validateNum = (val: any, row: any, field: string, intNum = 0, decNum = 0, maxLength = 0, max = 0, min = 0) => {
		row[field] = checkNum({ value: val }, intNum, decNum, maxLength, max, min) // 注意：这里的值可能是字符串也可能是数字
	}

	return [validateNum]
}
