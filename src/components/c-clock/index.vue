<template>
<div class="clock">
    <p class="clock-time">{{time}}</p>
    <p class="clock-day">{{day}}</p>
</div>
</template>
<script>
export default {
    name: 'c-clock',
    data() {
        return {
            day: '',
            time: '',
            timer: null
        }
    },
    methods: {
        setTime() {
            let vm = this
            let d = new Date()
            let weekdayCN = ['日', '一', '二', '三', '四', '五', '六']
            let dayStr = `${d.getMonth() + 1}月${d.getDate()}日 星期${weekdayCN[d.getDay()]}`
            let hour = d.getHours()
            hour = hour >= 10 ? hour : '0' + hour
            let minute = d.getMinutes()
            minute = minute >= 10 ? minute : '0' + minute
            let second = d.getSeconds()
            second = second >= 10 ? second : '0' + second
            let timeStr = `${hour}:${minute}:${second}`
            vm.day = dayStr
            vm.time = timeStr
            d = null
        },
        clearTimer() {
            let vm = this
            if (vm.timer) {
                clearInterval(vm.timer)
                vm.timer = null
            }
        }
    },
    mounted() {
        let vm = this
        vm.timer = setInterval(vm.setTime, 1000)
    },
    beforeDestroy() {
        this.clearTimer()
    }
}
</script>
<style lang="postcss" scoped>
.clock-day {
  margin: 0px 5px 5px 5px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}
.clock-time {
  margin: 5px 5px 0px 5px;
  font-size: 17px;
  line-height: 30px;
  font-weight: 600;
  color: #fff;
}
p {
  text-align: center;
}
</style>
