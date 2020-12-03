<template>
<div ref="wrapper" class="img-map-wrapper">
    <div ref="handler" class="handler">
        <img ref="pic" :src="value.pic" v-if="isInclude('pic')" alt="mapbg" usemap="#MapBg">
        <map name="MapBg" id="Map" class="" v-if="isInclude('static')">
            <!-- 线 -->
            <!-- <area shape="poly" coords="547,393,559,399,571,376"> -->
            <!-- 矩形 -->
            <!-- <area shape="rect" coords="669,337,732,379" target="_blank"> -->
            <area v-for="(area,index) in value.areas" :key="index" :shape="area.shape" :coords="area.coords" @click="$emit('area-clicked',{index,area})">
        </map>
        <svg v-if="isInclude('draw')&&pic" :width="pic.width" :height="pic.height" :viewBox="[0, 0, pic.width, pic.height].join(' ')" xmlns="http://www.w3.org/2000/svg">
            <rect v-if="isDrawRect" :x="drawReactInfo.x" :y="drawReactInfo.y" :width="drawReactInfo.width" :height="drawReactInfo.height" fill="rgba(245, 108, 108, 0.6)" />
            <polygon v-if="isDrawLine" xmlns="http://www.w3.org/2000/svg" fill="rgba(245, 108, 108, 0.6)" stroke="none" :points="drawLineInfo.points" />
            <polyline v-if="isDrawLine" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="rgba(245, 108, 108, 1)" stroke-width="5px" :points="drawLineInfo.points" />
            <template v-if="isTest" v-for="(area,index) in value.areas">
                <rect v-if="area.shape=='rect'" :key="index" :x="transformAreaToSvg(area).x" :y="transformAreaToSvg(area).y" :width="transformAreaToSvg(area).width" :height="transformAreaToSvg(area).height" fill="rgba(245, 108, 108, 0.6)" />
                <polygon v-if="area.shape=='poly'" :key="index" xmlns="http://www.w3.org/2000/svg" fill="rgba(245, 108, 108, 0.6)" stroke="none" :points="area.coords" />
            </template>
        </svg>
    </div>
</div>
</template>
<script>
import Hammer from 'hammerjs'
export default {
    props: ['type', 'value'],
    data() {
        return {
            start: {
                x: null,
                y: null
            },
            end: {
                x: null,
                y: null
            },
            pointer: {
                x: null,
                y: null
            },
            pic: null,
            step: "ready",
            pointsOfLine: []
        }
    },
    watch: {
        type: function(type) {
            this.reset();
        }
    },
    computed: {
        isDrawRect() {
            return this.type == 'drawReact';
        },
        isDrawLine() {
            return this.type == 'drawLine';
        },
        isTest() {
            return this.type == 'test';
        },
        coordsRect() {
            const vm = this;
            return [vm.start.x, vm.start.y, vm.end.x, vm.end.y].join(",")
        },
        drawReactInfo() {
            return {
                x: Math.min(this.start.x, this.end.x),
                y: Math.min(this.start.y, this.end.y),
                width: Math.abs(this.end.x - this.start.x),
                height: Math.abs(this.end.y - this.start.y)
            }
        },
        drawLineInfo() {
            // const pointInfos1 = [];
            // const pointInfos2 = [];
            // const start = this.pointsOfLine.map(e => `${e.x-5},${e.y-5}`).join(",");
            // const end = this.pointsOfLine.map(e => `${e.x+5},${e.y+5}`).reverse().join(",");
            // const arr = this.pointsOfLine;
            // let i = 0;
            // let dx;
            // let dy;
            // let dd;
            // for (; i < arr.length - 1; i++) {
            //     const start = arr[i];
            //     const end = arr[i + 1];
            //     dx = (end.x - start.x);
            //     dy = (end.y - start.y);
            //     dd = Math.sqrt(dx * dx + dy * dy);
            //     console.log('dx,dy,dd', dx, dy, dd);
            //     if (dd == 0) {
            //         continue;
            //     }
            //
            //
            //     const ox = (dy / dd * 5);
            //     const oy = (dx / dd * 5);
            //     console.log('ox,oy', ox, oy);
            //     const p1 = {
            //         x: start.x + ox,
            //         y: start.y + oy
            //     }
            //     const p2 = {
            //         x: start.x - ox,
            //         y: start.y - oy
            //     }
            //
            //     pointInfos1.push(p1);
            //     pointInfos2.push(p2);
            //
            //     const p1e = {
            //         x: end.x + ox,
            //         y: end.y + oy
            //     }
            //     const p2e = {
            //         x: end.x - ox,
            //         y: end.y - oy
            //     }
            //
            //     pointInfos1.push(p1e);
            //     pointInfos2.push(p2e);
            // }
            // const start = arr[i];
            // if (start) {
            //     const ox = (dy / dd * 5);
            //     const oy = (dx / dd * 5);
            //     const p1 = {
            //         x: start.x + ox,
            //         y: start.y + oy
            //     }
            //     const p2 = {
            //         x: start.x - ox,
            //         y: start.y - oy
            //     }
            //
            //     pointInfos1.push(p1);
            //     pointInfos2.push(p2);
            // }
            // const pointInfos = [...pointInfos1, ...pointInfos2.reverse()];
            // console.log('pointInfos', pointInfos);

            const pointsInfo = [...this.pointsOfLine]
            if (this.step != "done" && this.pointer.x) {
                pointsInfo.push(this.pointer);
            }
            const points = pointsInfo.length ? pointsInfo.map(e => `${e.x},${e.y}`).join(",") : null;
            return {
                // points: this.pointsOfLine.map(e => `${e.x},${e.y}`).join(",")
                points,
                // points: [start, end].join(",")
                // points: pointInfos.map(e => `${e.x},${e.y}`).join(",")
            }
        }
    },
    mounted() {
        const vm = this;
        const {
            wrapper: el,
            handler,
            pic
        } = this.$refs;
        pic.onload = vm.onloadPic;
        var mc = new Hammer.Manager(handler);

        mc.add(new Hammer.Pan({
            threshold: 0,
            pointers: 0
        }));
        mc.add(new Hammer.Tap({
            event: 'doubletap',
            taps: 2
        }));
        mc.add(new Hammer.Tap({
            interval: 300
        }));

        mc.on("panstart", onPanStart);
        mc.on("panmove", onPanMove);
        mc.on("panend", onPanEnd);
        mc.on("tap", onTap);
        mc.on("doubletap", onDoubletap);

        handler.addEventListener('pointermove', (event) => {
            if (vm.isDrawLine) {
                if (vm.step != "done") {
                    vm.pointer = getXY({
                        srcEvent: event
                    });
                }
            }
        });

        const getXY = ev => {
            if (ev.srcEvent.path.indexOf(handler) === -1) {
                return ({
                    x: 0,
                    y: 0
                })
            } else {
                return ({
                    x: ev.srcEvent.offsetX,
                    y: ev.srcEvent.offsetY
                })
            }
        }

        function onPanStart(ev) {
            ev.preventDefault()
            if (vm.isDrawRect) {
                vm.start = getXY(ev);
                vm.end = getXY(ev);
            }
        }

        function onPanMove(ev) {
            ev.preventDefault()
            if (vm.isDrawRect) {
                vm.end = getXY(ev);
            }
        }

        function onPanEnd(ev) {
            ev.preventDefault()
            if (vm.isDrawRect) {
                vm.end = getXY(ev);
                checkPanEnd();
            }
        }

        function onTap(ev) {
            ev.preventDefault()
            // console.log('onTap getXY(ev)', getXY(ev));
            if (vm.isDrawLine) {
                if (vm.step != "done") {
                    vm.step = "drawing";
                    vm.pointsOfLine.push(getXY(ev));
                }
            }
        }

        function onDoubletap(ev) {
            ev.preventDefault()
            // console.log('onDoubletap getXY(ev)', getXY(ev));
            if (vm.isDrawLine) {
                if (vm.step != "done") {
                    vm.step = "done";
                    // vm.pointsOfLine.pop();
                    // vm.$emit("draw-line", vm.drawLineInfo);
                    vm.areasPush({
                        shape: "poly",
                        coords: vm.drawLineInfo.points
                    });
                } else {
                    vm.reset();
                }
            }
        }

        function checkPanEnd() {
            vm.$nextTick(() => {
                if (vm.drawReactInfo.width * vm.drawReactInfo.height < 25) {
                    vm.reset();
                } else {
                    vm.areasPush({
                        shape: "rect",
                        coords: [vm.drawReactInfo.x, vm.drawReactInfo.y, vm.drawReactInfo.x + vm.drawReactInfo.width, vm.drawReactInfo.y + vm.drawReactInfo.height].join(',')
                    });
                }
            })
        }
    },
    methods: {
        reset() {
            Object.assign(this, {
                start: {
                    x: null,
                    y: null
                },
                end: {
                    x: null,
                    y: null
                },
                step: "ready",
                pointsOfLine: []
            });
        },
        onloadPic() {
            const vm = this;
            const pic = vm.$refs.pic
            // debugger
            vm.pic = {
                width: pic.width,
                height: pic.height
            };
        },
        isInclude(layer) {
            return this.value.include.indexOf(layer) != -1
        },
        areasPush(area) {
            this.value.areas.push(area);
            this.$emit('input', this.value);
        },
        transformAreaToSvg(area) {
            switch (area.shape) {
                case 'rect':
                    const [x, y, xm, ym] = area.coords.split(",");
                    return {
                        x,
                        y,
                        width: xm - x,
                            height: ym - y
                    }
                    break;
                default:
                    debugger
                    return null
            }
        }
    }
}
</script>

<style scoped>
.img-map-wrapper,
.handler,
img {
    touch-action: none;
    user-select: none;
    -webkit-user-drag: none;
}

.img-map-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    overflow: auto;
}

svg {
    position: absolute;
    top: 0;
    left: 0;
}
</style>
