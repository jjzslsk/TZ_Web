<template>
<div :class="['no-data',type]">
    <slot>
        暂无数据
    </slot>
</div>
</template>

<script>
export default {
    props: ['type']
}
</script>

<style scoped>
.no-data {
    text-align: center;

    &.big {
        font-size: 2em;
        padding: 3em;
    }

    &.small {
        font-size: 1em;
        padding: 1em;
    }
}
</style>
