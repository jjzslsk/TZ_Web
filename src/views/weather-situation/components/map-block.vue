<template lang="html">
    <div class="map-wrapper">
        <ol-map v-model="mapMain" @ready="onMapReady"></ol-map>
    </div>
</template>

<script>
import {
    taizhou
} from '../../mixins';
export default {
    mixins: [taizhou],
    props: ['mapMain'],
    methods: {
        onMapReadyQuery(info) {
            this.fetchBlankBase();
            this.$emit('ready', info)
        }
    }
}
</script>
