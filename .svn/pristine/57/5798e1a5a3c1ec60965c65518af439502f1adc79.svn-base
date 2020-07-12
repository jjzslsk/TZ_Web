<template>
<div class="selects">
    <!-- //yyyymmddhhmmss -->
    <el-date-picker class="date" v-model="dataDate" type="date" value-format="yyyyMMdd000000" size="mini" placeholder=""></el-date-picker>
    <el-select class="select-time" v-model="dataTime" size="mini" placeholder="">
        <el-option v-for="item in optionsTime" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
    </el-select>
    <el-select class="select-forecast" v-model="dataForecast" size="mini" placeholder="" v-if="!exclude||exclude.indexOf('forecast')==-1">
        <el-option v-for="item in optionsForecast" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
    </el-select>
</div>
</template>

<script>
import moment from 'moment'
import {
    leftPad
} from '@/common/filter'
export default {
    props: ['date', 'time', 'forecast', 'exclude', 'timeStep', 'timeStart', 'noDefault'],
    data() {
        return {
            optionsTime: [],
            optionsForecast: []
        }
    },
    mounted() {
        const vm = this;
        const {
            noDefault
        } = vm;
        // vm.dataDate = moment().format('YYYY-MM-DD');
        if (!noDefault) {
            vm.dataDate = moment().format('YYYYMMDD000000');
        }
        const optionsTime = [];
        const timeStart = this.timeStart == null ? 2 : this.timeStart;
        const timeStep = this.timeStep == null ? 3 : this.timeStep;
        for (var i = timeStart; i < 24; i += timeStep) {
            optionsTime.push({
                "label": i + ":00",
                "value": leftPad(i, 2)
            })
        }
        vm.optionsTime = optionsTime;
        // [{
        //     "label": "2:00",
        //     "value": 2
        // }, {
        //     "label": "5:00",
        //     "value": 5
        // }, {
        //     "label": "8:00",
        //     "value": 8
        // }, {
        //     "label": "11:00",
        //     "value": 11
        // }, {
        //     "label": "14:00",
        //     "value": 14
        // }, {
        //     "label": "17:00",
        //     "value": 17
        // }, {
        //     "label": "20:00",
        //     "value": 20
        // }, {
        //     "label": "23:00",
        //     "value": 23
        // }];
        const hourNow = moment().hour();
        // vm.dataTime = Math.ceil((hourNow - timeStart) / timeStep) * timeStep + timeStart;
        if (!noDefault) {
            const timeFloor = Math.floor((hourNow - timeStart) / timeStep) * timeStep + timeStart;
            vm.dataTime = leftPad(timeFloor, 2);
        }
        vm.optionsForecast = [{
            "label": "3个小时后数据",
            "value": 3
        }, {
            "label": "6个小时后数据",
            "value": 6
        }];
        vm.dataForecast = vm.optionsForecast[0].value;
    },
    computed: {
        dataDate: {
            set: function(val) {
                this.$emit('update:date', val);
            },
            get: function() {
                return this.date
            }
        },
        dataTime: {
            set: function(val) {
                this.$emit('update:time', val);
            },
            get: function() {
                return this.time
            }
        },
        dataForecast: {
            set: function(val) {
                this.$emit('update:forecast', val);
            },
            get: function() {
                return this.forecast
            }
        }
    }
}
</script>

<style lang="css" scoped>
</style>
