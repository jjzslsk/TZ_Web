<template>
    <div>
        <button @click="iframeClick()">iframeId</button>
        <!-- <iframe :src="officeurl" frameborder="0" class="iframe" ref="iframeId"></iframe> -->
        <iframe ref="iframe" :src="officeurl" class="iframe"></iframe>
    </div>
</template>

<script>
export default {
    name: 'PageOffice',
    componentName: 'PageOffice',
    props: {
        url: String
    },
    methods :{
        iframeClick(){
            let vm = this
            console.log(vm.$refs.iframe)
            vm.$refs.iframe.contentWindow.saveProductPdf()
            // this.$refs.iframeId.contentWindow.saveProductPdf()
            // vm.$refs.iframeId.contentWindow.saveProductPdf()
            // console.log(vm.$refs.iframeId)
                // var map_iframe  = document.getElementById("iframeId"); //获取iframe标签
                // var iwindow = iframe.contentWindow; //获取iframe的window对象
                // var saveTemplateWord = iwindow.saveTemplateWord();
                // alert(iwindow.saveTemplateWord);
            //    var test = map_iframe.contentWindow.saveProductPdf();

            // var map_iframe = document.frames("iframeId");
            //    var map_iframe = document.getElementById("iframeId");
                // map_iframe.onload = function() {    
                // map_iframe.contentWindow.saveProductPdf();
            // };
        }
    },
    data() {
        console.log(this.url)
        return {
            officeurl: this.url || ''
        }
    },
    watch: {
        url(v, ov) {
            console.log(v, ov)
            this.officeurl = v
        }
    }
}
</script>

<style scoped>
button {
    position: absolute;
    z-index: 99;
}
.iframe {
  position: absolute;
  background: #fff;
  top: 0px;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
</style>
