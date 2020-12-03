<template>
<file-upload ref="upload" v-model="files" @input-file="inputFile" @input-filter="inputFilter" :post-action="postAction">
    <slot></slot>
</file-upload>
</template>

<script>
export default {
    name: 'CUpload',
    props: {
        postAction: {
            type: String
        },
        extension: {
            type: String
        },
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 10 * 1024 * 1024
        }
    },
    data() {
        return {
            files: []
        }
    },
    components: {},
    methods: {
        inputFile(newFile, oldFile) {
            if (newFile && !oldFile) {
                // 添加文件
            }

            if (newFile && oldFile) {
                // 更新文件 开始上传
                if (newFile.active !== oldFile.active) {
                    console.log('Start upload', newFile.active, newFile)

                    // 限定最小字节
                    if (newFile.size >= 0 && newFile.size < this.min) {
                        newFile = this.$refs.upload.update(newFile, {
                            error: 'size'
                        })
                    }
                    // 限定最大字节
                    if (newFile.size > this.max) {
                        newFile = this.$refs.upload.update(newFile, {
                            error: 'size'
                        })
                    }
                }

                // 上传进度
                if (newFile.progress !== oldFile.progress) {
                    console.log('progress', newFile.progress, newFile)
                    this.$emit('progress', newFile.progress, newFile)
                }

                // 上传错误
                if (newFile.error !== oldFile.error) {
                    console.log('error', newFile.error, newFile)
                    this.$emit('error', newFile.error, newFile)
                }

                // 上传成功
                if (newFile.success !== oldFile.success) {
                    console.log('success', newFile.success, newFile)
                    this.$emit('success', newFile)
                }
            }

            if (!newFile && oldFile) {
                // 删除文件 自动删除 服务器上的文件
                if (oldFile.success && oldFile.response.id) {
                    // $.ajax({   type: 'DELETE',   url: '/file/delete?id=' + oldFile.response.id, });
                }
            }

            // 自动上传
            if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
                if (!this.$refs.upload.active) {
                    this.$refs.upload.active = true
                }
            }
        },
        inputFilter: function(newFile, oldFile, prevent) {
            if (newFile && !oldFile) {
                // 过滤后缀不在范围的文件
                if (this.extension) {
                    if (!new RegExp("\\.(" + this.extension + ")$", "i").test(newFile.name)) {
                        this.$emit('error', 'extension');
                        return prevent()
                    }
                }
            }

            // 创建 blob 字段 用于图片预览
            newFile.blob = ''
            let URL = window.URL || window.webkitURL
            if (URL && URL.createObjectURL) {
                newFile.blob = URL.createObjectURL(newFile.file)
            }
        }
    }
}
</script>
