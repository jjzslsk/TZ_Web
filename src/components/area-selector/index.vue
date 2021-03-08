<template>
<div class="">
    <el-cascader :key="key" v-model="valueCascader" :options="info.children" @expand-change="handleAreaChange" :props="propsCascader"></el-cascader>
</div>
</template>

<script>
import {
    requestExhibitionPoints,
    urlImageUploadPoint,
    requestAreas
} from '@/remote/'
export default {
    props: {
        "value": {
            type: Array
        },
        "options": {
            type: Array,
            default: function() {
                return [];
            }
        }
    },
    data() {
        return {
            key: 0,
            info: {
                children: [...this.options]
            },
            propsCascader: {
                lazy: true,
                lazyLoad(node, resolve) {
                    const {
                        level,
                        value: parentCode = 450000
                    } = node;
                    requestAreas({
                        parentCode,
                    }, {
                        target: this.pageLoadingInfo
                    }).then(res => {
                        resolve(res.data.list.map(item => ({
                            ...item,
                            leaf: level >= 1
                        })));
                    });
                }
            }
        }
    },
    computed: {
        valueCascader: {
            set: function(val) {
                this.$emit("input", val);
            },
            get: function() {
                return this.value;
            }
        }
    },
    watch: {
        value: {
            handler: function(val, old) {
                if (!val || !old || val.length != old.length) {
                    this.key++;
                }
                this.onValueChange(val);
            },
            immediate: true
        }
    },
    methods: {
        handleAreaChange(val) {
            // console.log('active item:', val);
            // this.onValueChange(val);
        },
        onValueChange(val) {
            // console.log('val', JSON.stringify({
            //     val
            // }));
        }
    }
}
</script>

<style scoped>
</style>
