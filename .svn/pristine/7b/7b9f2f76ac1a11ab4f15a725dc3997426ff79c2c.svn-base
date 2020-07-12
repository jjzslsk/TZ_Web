<template>
<div class="track-cards">
    <el-card v-for="(card,i) in cards" :key="i" class="item pointer" :class="{selected:card==selected}" @click.native="$emit('card-clicked',card)">
        <div class="inner">
            <div class="title" v-if="card.title.length>4">
                <div>{{card.title|top}}</div>
                <div>{{card.title|bottom}}</div>
            </div>
            <div class="title single-line" v-else>
                <div>{{card.title}}</div>
            </div>
            <div class="info">
                <div class="sub-title">
                    <div>{{card.subTitle}}</div>
                </div>
                <div class="time">时间： {{card.duration}}</div>
            </div>
        </div>
        <div class="check-selected"></div>
    </el-card>
</div>
</template>

<script>
export default {
    name: "TrackCards",
    props: ["cards", "selected"],
    filters: {
        top: function(val) {
            return val == null ? val : val.substr(0, Math.min(Math.floor(val.length / 2), 4))
        },
        bottom: function(val) {
            return val == null ? val : val.substr(Math.min(Math.floor(val.length / 2), 4), 4)
        }
    }
}
</script>

<style scoped>
.track-cards {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    padding: 0.5em;
    max-height: 80%;
    overflow: auto;

    .item {
        margin-bottom: 0.5em;
        position: relative;

        &.selected {
            border: 1px solid #1A54B4;

            .check-selected {
                display: block;
            }
        }

        &:nth-child(3n+1) {
            .title {
                background: #FA6343;
            }
        }

        &:nth-child(3n+2) {
            .title {
                background: #AEC688;
            }
        }

        &:nth-child(3n+3) {
            .title {
                background: #85AFC7;
            }
        }

        .inner {
            display: flex;

            .title {
                flex: auto;
                width: 76px;
                border-radius: 3px;
                color: #fff;
                padding: 4px;
                text-align: center;
                font-size: 16px;
                font-weight: 400;
                line-height: 18px;

                &.single-line {
                    line-height: 36px;
                }
            }

            .info {
                flex: auto;
                padding-left: 9px;
                font-weight: 400;

                .sub-title {
                    font-size: 16px;
                    color: #555555;
                    margin-bottom: 10px;
                }

                .time {
                    font-size: 14px;
                    color: #999999;
                }
            }
        }

        .check-selected {
            width: 14px;
            height: 14px;
            background: #0141AC;
            position: absolute;
            top: 0;
            right: 0;
            display: none;

            &::after {
                border-bottom: 2px solid #fff;
                border-left: 2px solid #fff;
                content: "";
                height: 3px;
                position: absolute;
                right: 3px;
                top: 3px;
                transform: rotate(-45deg);
                width: 6px;
            }
        }
    }
}
</style>
