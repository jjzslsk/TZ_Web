<template>
<div class="main">
    <div class="infos">
        <div class="info">降水：{{data.precipitation|weatherVal('mm')}}</div>
        <div class="info">温度：{{data.temperature|weatherVal('℃')}}</div>
        <div class="info">气压：{{data.airPressure|weatherVal('Pa')}}</div>
        <div class="info">能见度：{{data.visibility|weatherVal('m')}}</div>
        <div class="info">相对湿度：{{data.relativeHumidity|weatherVal('%')}}</div>
        <div class="info">风速：{{data.windSpeed|weatherVal('m/s')}}</div>
        <div class="info">风向：{{data.windSpeed && data.windDirectionShow|weatherVal('')}}</div>

    </div>
</div>
</template>

<script>
export default {
    props: ['data']
}
</script>

<style>
</style>
