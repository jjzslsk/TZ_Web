<template>
<div class="alarm">
    <img-alarm class="pic" :info="{imageType:item.imageType,imageColor:item.imageColor}"></img-alarm>
    <div class="info">
        <div class="content">{{item.content}}</div>
        <div class="time">{{item.time}}</div>
    </div>
    <div class="clearfix"></div>
</div>
</template>
<script>
export default {
    props: ['item']
}
</script>
