<template>
<!-- /static/images/alarm_icons/${imageType}-${imageColor}ico.png -->
<!-- <img src="/static/images/alarm_icons/0001-3ico.png" alt=""> -->
<img v-if="src" :src="src" :alt="`预警图片(${imageType}-${imageColor})`" class="img-alarm">
</template>

<script>
export default {
    props: ['info'],
    computed: {
        src() {
            const {
                imageType,
                imageColor
            } = this
            return imageType && imageColor && `/static/images/alarm_icons/${imageType}-${imageColor}ico.png`
        },
        imageType() {
            const {
                info: {
                    imageType,
                    imageTypeCn
                }
            } = this;
            return imageType || imageTypeCn
        },
        imageColor() {
            return this.info.imageColor
        }
    }
}
</script>

<style scoped>
</style>
