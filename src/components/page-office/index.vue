<template>
    <div>
        <!-- <button @click="iframeClick1()">发送</button>
        <br>
        <button @click="iframeClick2()">接收</button> -->
        <!-- <iframe :src="officeurl" frameborder="0" class="iframe" ref="iframeId"></iframe> -->
        <iframe ref="iframe" :src="officeurl" class="iframe"></iframe>
        <!-- <iframe ref="iframe" src="http://192.168.5.106:8080/publishMessage/toSaveWord2" class="iframe"></iframe> -->
        <!-- <iframe ref="iframe" src="http://10.137.4.30:8888/basin/main/openProductFile.action?templateId=be42a586f9ea46daae073232908df04d" class="iframe"></iframe> -->
    </div>
</template>

<script>
export default {
    name: 'PageOffice',
    componentName: 'PageOffice',
    props: {
        url: String
    },
    data() {
        console.log(this.url)
        return {
            officeurl: this.url || '',
            iframeWin: {},
            isIframe:true,
            param:null,
        }
    },
    methods :{
        childClick(param){
            this.param = {...param}
            this.iframeClick1()
        },
        iframeClick1(data){
            let vm = this
              this.iframeWin.postMessage({
                // cmd: 'getFormJson',
                cmd: 'saveDoc',
                params: {}
            }, '*')
            window.addEventListener('message', this.handleMessage)
        },
        iframeClick2(data){
            this.iframeWin = this.$refs.iframe.contentWindow
            window.addEventListener('message', this.handleMessage)
        },
        handleMessage (event) {
            // 根据上面制定的结构来解析iframe内部发回来的数据
            const data = event.data
            switch (data.cmd) {
            case 'returnFormJson':
                // alert(JSON.stringify(data))
                // 业务逻辑
                break
            case 'returnHeight':
                // 业务逻辑
                if(!data.params.data){
                    this.$message({ message: '保存文件失败', type: 'warning'});
                    return
                }
                // this.param.item.filePath = data.params.data
                this.param.isDos = true
                this.param.filePath = data.params.data
                this.$emit(
                'childEvent',
                this.param
                )
                break
            }
        }
    },

    watch: {
        url(v, ov) {
            console.log(v, ov)
            this.officeurl = v
        }
    },
    mounted () {
        this.iframeWin = this.$refs.iframe.contentWindow
        // this.iframeClick2()
    },

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
