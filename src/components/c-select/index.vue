<template>
<div class="common-select-wrapper">
    <el-select class v-model="innerValue" placeholder="请选择">
        <el-option v-for="(item,index) in innerOptions" :key="index" :label="item.label" :value="item.value"></el-option>
    </el-select>
</div>
</template>

<script>
import * as remote from '@/remote/'
import {
    mapFrontOptions
} from "@/common/options";
import {
    mapFrontMapper
} from "@/common/mapper";
export default {
    name: 'CSelect',
    props: ['value', 'remote', 'options', 'mapper', 'allText'],
    data() {
        return {
            innerOptions: null
        }
    },
    computed: {
        innerValue: {
            set(val) {
                this.$emit('input', val);
                if (this.innerOptions) {
                    const itemSelectd = this.innerOptions.find(e => e.value == val);
                    const itemLabel = itemSelectd && itemSelectd.label;
                    this.$emit('label-selected', itemLabel);
                }
            },
            get() {
                return this.value;
            }
        }
    },
    async mounted() {
        const {
            allText,
            options,
            mapper
        } = this;
        let list
        if (this.remote) {
            this.innerOptions = null;
            const res = await remote[this.remote]();
            list = this.innerOptions = res.data && res.data.list;
        } else if (options) {
            if (typeof options == 'string') {
                const optionsRoot = mapFrontOptions([options], {
                    afterFix: ''
                })
                list = this.innerOptions = optionsRoot[options]()
            } else {
                list = this.innerOptions = options
            }
        } else if (mapper) {
            const optionsRoot = mapFrontMapper([mapper], {
                afterFix: ''
            })
            const mapperObj = optionsRoot[mapper]();
            list = this.innerOptions = Object.entries(mapperObj).map(e => ({
                value: e[0],
                label: e[1]
            }))
        }
        if (list && allText) {
            list.unshift({
                "value": undefined,
                "label": this.allText
            });
        }
    }
}
</script>

<style scoped>
.common-select-wrapper {
    display: inline;
}
</style>
