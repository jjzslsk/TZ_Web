<template>
<div class="common-button-wrapper">
    <el-popover v-if="popover" placement="top" width="160" v-model="visiblePopover">
        <p>确定吗？</p>
        <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visiblePopover = false">取消</el-button>
            <el-button type="danger" size="mini" @click="visiblePopover = false;$emit('click');">确定</el-button>
        </div>
        <el-button slot="reference" :class="className" :type="typeButton" :disabled="disabled" :size="sizeInner" :icon="icon" :round="round">
            <slot></slot>
        </el-button>
    </el-popover>
    <el-button v-else :class="className" :type="typeButton" :disabled="disabled" :size="sizeInner" :icon="icon" round @click="onClick()">
        <slot></slot>
    </el-button>
</div>
</template>

<script>
export default {
    name: 'CButton',
    props: ['type', 'disabled', 'size'],
    data() {
        return {
            visiblePopover: false
        }
    },
    computed: {
        className() {
            const {
                type
            } = this;
            const setText = new Set(['map', 'refresh', 'capture']);
            const setSelf = new Set(['search', 'small-o', 'del']);
            return {
                "common-button": true,
                "text": setText.has(type),
                [type]: setSelf.has(type)
                // "search": type == "search",
                // "small-o": type == "small-o"
            }
        },
        popover() {
            return this.type == 'del' ? true : false;
        },
        round() {
            return this.type != 'del' ? true : false;
        },
        typeButton() {
            const {
                type
            } = this;
            switch (type) {
                case "add":
                    return "success"
                    break;
                case "search":
                    return "primary"
                    break;

                case "map":
                case "refresh":
                case "capture":
                case "del":
                    return "text"
                    break;

                default:
                    return type;
            }
        },
        sizeInner() {
            const {
                size,
                type
            } = this;
            if (size) {
                return size
            }
            switch (type) {
                case "add":
                    return "mini"
                    break;

                case "del":
                    return "small"
                    break;

                default:
                    return 'mini';
            }
        },
        icon() {
            const more = ({
                // "add": "iconjia",
                // "search": "iconsousuo",
                "map": "iconditu3",
                "refresh": "iconshuaxin3",
                "capture": "iconjieping",
            })[this.type];
            return more ? `iconfont ${more}` : null
        }
    },
    methods: {
        onClick() {
            if (this.type === 'refresh') {
                window.location.reload();
            }
            this.$emit('click');
        }
    }
}
</script>

<style scoped>
.common-button {
    font-size: 15px;
    padding: 7px 15px;
    border-radius: 7px;

    &.text {
        color: #666;
        padding: 7px 0px;
    }

    &.small-o {
        height: 24px;
        line-height: 22px;
        padding: 0 5px;
        text-align: center;
        color: #0141AC;
        border: 1px solid #0141AC;
        border-radius: 3px;

        &[disabled] {
            color: #CCCCCC;
            border-color: #CCCCCC;
        }
    }

    &.del {
        font-size: 12px;
        padding: 0;
    }
}
</style>
