<template>
<div class="table-popup">
    <slot name="lead"></slot>
    <list-table class="table" size="mini" :rows="rows" :total="total" hide-on-single-page :span-method="spanMethod" :max-height="maxHeight" :cell-class-name="cellClassName">
        <slot></slot>
    </list-table>
    <slot name="follow"></slot>
</div>
</template>

<script>
export default {
    props: ['rows', 'total', 'spanMethod', 'maxHeight', 'cellClassName']
}
</script>

<style scoped>
.table-popup {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 100;
    background: #fff;
    box-shadow: 0px 1px 11px 0px rgba(14, 3, 7, 0.15);
    padding: 20px 0;
}
</style>
