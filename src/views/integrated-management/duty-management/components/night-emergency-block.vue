<template>
<div v-if="form.type == 'lead'">
    <div class="dialog-table-title">台州市本级机关工作人员夜餐费报销审批单</div>
    <table class="dialog-table-main">
        <tr>
            <td>合计： 2120元</td>
            <td>大写：贰仟壹佰贰拾元整</td>
        </tr>
        <tr>
            <td>单位：台州市气象局</td>
            <td>处事(部门)：气象台</td>
        </tr>
        <tr>
            <td colspan="2">
                <dl>
                    <dd>加班时间：</dd>
                    <dt>许茂利：7月4日（4日18时-5日8时）、8月9日（9日18时-10日8时）、8月10日（08时-17时）、8月11日（08时-17时）、9月5日（5日18时-6日8时）、9月29日（29日18时-30日8时）、9月30日（30日18时-10月1日8时）、10月1日（08时-17时）；陈莲：7月4日（18时-22时）、8月8日（8日18时-9日08时）、8月9日（9日18时-10日8时）、8月10日（08时-17时）</dt>
                </dl>
            </td>
        </tr>
        <tr>
            <td colspan="2">加班人员： 许茂利、陈莲、翁之梅、颜琼丹、杨万裕、裘杭培 </td>
        </tr>
        <tr>
            <td colspan="2"> 加班事由：应急响应加班</td>
        </tr>
        <tr>
            <td colspan="2">申请金额：许茂利440元、陈莲560元、翁之梅360元、颜琼丹200元、杨万裕440元、裘杭培120元</td>
        </tr>
        <tr>
            <td colspan="2">
                备注：
                <dl>
                    <dd>1、</dd>
                    <dt>
                        工作日晚上连续加班4小时及以上的，每人每次可开支夜餐费补助40元。
                        休息日（含国家法定节假日）加班的，连续加班满4小时不到8小时的，可参照夜餐费补助标准开支1次
                        伙食补助；连续加班满8小时及以上的，可参照夜餐费补助标准开支2次伙食补助。
                    </dt>
                </dl>
                <dl>
                    <dd>2、</dd>
                    <dt>
                        该表单一式两份，一份用于报销审批，一份存档装订备查。
                    </dt>
                </dl>
            </td>
        </tr>
    </table>
</div>
<div v-else>
    <div class="dialog-table-title">台州市本级机关工作人员夜餐费报销审批单</div>
    <table class="dialog-table-main">
        <tr>
            <td>合计： 800元</td>
            <td>大写：捌佰元整</td>
        </tr>
        <tr>
            <td>单位：台州市气象局</td>
            <td>处事(部门)：气象台</td>
        </tr>
        <tr>
            <td colspan="2">
                <dl>
                    <dd>加班时间：</dd>
                    <dt>许茂利：7月4日（4日18时-5日8时）、8月9日（9日18时-10日8时）、8月10日（08时-17时）、8月11日（08时-17时）、9月5日（5日18时-6日8时）、9月29日（29日18时-30日8时）、9月30日（30日18时-10月1日8时）、10月1日（08时-17时）；陈莲：7月4日（18时-22时）、8月8日（8日18时-9日08时）、8月9日（9日18时-10日8时）、8月10日（08时-17时）</dt>
                </dl>
            </td>
        </tr>
        <tr>
            <td colspan="2">加班人员： 许茂利、陈莲、翁之梅、颜琼丹、杨万裕、裘杭培 </td>
        </tr>
        <tr>
            <td colspan="2"> 加班事由：应急响应加班</td>
        </tr>
        <tr>
            <td colspan="2">申请金额：许茂利440元、陈莲560元、翁之梅360元、颜琼丹200元、杨万裕440元、裘杭培120元</td>
        </tr>
        <tr>
            <td colspan="2">
                备注：
                <dl>
                    <dd>1、</dd>
                    <dt>
                        工作日晚上连续加班4小时及以上的，每人每次可开支夜餐费补助40元。
                        休息日（含国家法定节假日）加班的，连续加班满4小时不到8小时的，可参照夜餐费补助标准开支1次
                        伙食补助；连续加班满8小时及以上的，可参照夜餐费补助标准开支2次伙食补助。
                    </dt>
                </dl>
                <dl>
                    <dd>2、</dd>
                    <dt>
                        该表单一式两份，一份用于报销审批，一份存档装订备查。
                    </dt>
                </dl>
            </td>
        </tr>
    </table>
</div>
</template>

<script>
export default {
    props: ['form'],
    methods: {
        formatPayload() {
            return this.form;
        }
    }
}
</script>

<style scoped>
.dialog-table-main {
    border: 1px solid #ddd;
    border-collapse: collapse;

    td {
        border: 1px solid #ddd;
        line-height: 28px;
        padding: 15px 0;
        padding-left: 20px;
    }

    dt {
        flex: 1;
    }

    dd {
        margin: 0;
    }

    dl {
        display: flex;
    }
}
</style>
