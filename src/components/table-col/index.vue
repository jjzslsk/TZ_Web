<template>
<el-table-column :label="label" :className="className + (propInfo.isNumber?' number':'')" :width="width">
    <template v-slot:default="{row}">
        <slot :row="row">
            <div v-if="props">
                <div v-if="edit">
                    <el-input size="mini" v-model="row[propInfo.start]"></el-input>-<el-input size="mini" v-model="row[propInfo.end]"></el-input>{{unit}}
                </div>
                <span v-else>{{row[propInfo.start]}} - {{row[propInfo.end]}}{{unit}}</span>
            </div>
            <div v-else>
                <div v-if="edit">
                    <el-select v-if="optionsEdit" class="" v-model="row[prop]" @change="$emit('selectValue',row)" size="mini" placeholder="">
                        <el-option v-for="(item,index) in optionsEdit" :key="index" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input v-else size="mini" v-model="row[prop]" @input="$emit('inputValue',row)"></el-input>
                </div>
                <span v-else>{{row[prop]}}</span>
            </div>
        </slot>
    </template>
</el-table-column>
</template>

<script>
export default {
    props: ['props', 'prop', 'className', 'label', 'width', 'edit', 'unit', 'options'],
    computed: {
        propInfo() {
            const {
                props,
                prop
            } = this;
            const res = {};
            if (props) {
                Object.assign(res, {
                    isNumber: props.length == 2,
                    start: props[0],
                    end: props[1]
                })
            } else {
                res.prop = prop
            }
            return res;
        },
        optionsEdit() {
            const {
                options
            } = this
            return options ? options.map(item => {
                if (item.label != null && item.value != null) {
                    return item
                } else {
                    return {
                        label: item,
                        value: item,
                    }
                }
            }) : options;
        }
    }
}
</script>

<style scoped>
</style>
