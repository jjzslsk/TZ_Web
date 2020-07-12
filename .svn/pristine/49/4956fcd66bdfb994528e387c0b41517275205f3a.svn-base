<template>
<div class="c-legend" v-if="title || (list&&list.length)">
    <div class="title">{{title}}</div>
    <div class="legends">
        <div class="item" v-for="(item,index) in list" :key="index" :style="{minWidth: (maxLengthTitle+2)+'ex'}">
            <div class="color" :style="{background:'rgba('+item.color.join(',')+')'}" @click.nactive="$emit('item-clicked',item)"></div>
            <div class="value" :style="{textAlign}">{{item|legendTitle}}</div>
        </div>
    </div>
</div>
</template>

<script>
import {
    legendTitle
} from '@/common/filter'
import {
    getDataOfKey
} from '@/common/legend/'
const dataInit = {
    title: null,
    textAlign: null,
    list: []
};
export default {
    name: 'CLegend',
    props: ['type', 'sub'],
    data() {
        return {
            ...dataInit
        }
    },
    watch: {
        'type': {
            handler: function(val) {
                if (val == 'code') {
                    Object.assign(this, {
                        ...dataInit
                    });
                } else {
                    getDataOfKey(val + (this.sub || "")).then(res => {
                        Object.assign(this, res);
                    })
                }
            },
            immediate: true
        }
    },
    computed: {
        maxLengthTitle: function() {
            return Math.max(...this.list.map(item => ("" + legendTitle(item)).length));
        }
    }
}
</script>

<style scoped>
.c-legend {
    position: absolute;
    left: 10px;
    bottom: 10px;
    z-index: 333;
    background: rgba(16, 1, 1, 0.4);
    color: #fff;
    padding: 12px 9px;
    display: flex;

    .title {
        line-height: 37px;
    }

    .legends {
        padding-left: 5px;
        display: flex;

        .item {
            .color {
                min-width: 35px;
                height: 16px;
                margin-bottom: 3px;
            }

            .value {
                text-align: left;
            }
        }
    }
}
</style>
