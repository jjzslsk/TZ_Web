<template>
<span class="iconfont font" :class="{[name]:true,reverse}" v-if="type=='font'"></span>
<svg class="iconfont svg" :class="{reverse}" :style="{transform:scale&&`scale(${scale})`}" aria-hidden="true" v-else>
  <use :xlink:href="`#${name}`"></use>
</svg>
</template>

<script>
export default {
  props: {
    name: {
      type: String
    },
    reverse: {
      type: Boolean,
      default: false
    },
    scale: {
      type: Number
    },
    type: {
      type: String
    }
  }
}
</script>

<style scoped>
.iconfont.svg {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  display: inline-block;
  font-size: inherit;
  line-height: inherit;
}

.iconfont {
  &.reverse {
    transform: rotate(180deg);
  }
}
</style>
