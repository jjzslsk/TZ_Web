<template>
<div v-if="data">
    <div class="title">{{data.title}}</div>
    <div class="info">
        <span class="label">温度：</span>
        <span class="value temperature">{{data.temperature}}</span>
        <span class="label">湿度：</span>
        <span class="value">{{data.relativeHumidity}}</span>
        <span class="label">降水：</span>
        <span class="value rainfall">{{data.precipitation}}</span>
        <span class="label">风向：</span>
        <span class="value">{{data.windDirection}}</span>
        <span class="label">风速：</span>
        <span class="value">{{data.windSpeed}}</span>
        <span class="label">能见度：</span>
        <span class="value">{{data.visibility}}</span>
    </div>
</div>
<div v-else style="margin-bottom:1em;"></div>
</template>

<script>
export default {
    props: ['data']
}
</script>

<style>
</style>
