<template>
<div>
    <el-form-item label="菜单名称" label-width="120px">
        <el-input v-model="form.name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="上级菜单" label-width="120px">
        <!-- <el-input v-model="form.parentName" autocomplete="off"></el-input> -->
        <el-select v-model="form.parentId" placeholder="请选择">
            <el-option :label="item.name" :key="item.id" v-for="item in data"  :value="item.id"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="菜单级别" label-width="120px">
        <el-select v-model="form.menuLevel" placeholder="请选择">
            <el-option label="根级"   :value="0"></el-option>
            <el-option label="第一级" :value="1"></el-option>
            <el-option label="第二级" :value="2"></el-option>
            <el-option label="第三级" :value="3"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="是否市县共享" label-width="120px">
        <el-select v-model="form.type" placeholder="请选择">
            <el-option label="共享" :value="1"></el-option>
            <el-option label="不共享" :value="2"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="是否可用" label-width="120px">
        <el-select v-model="form.enabled" placeholder="请选择">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="排序" label-width="120px">
        <el-input v-model="form.showOrder" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="编码" label-width="120px">
        <el-input v-model="form.code" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="内部地址" label-width="120px">
        <el-input v-model="form.menuUrl" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="外部地址" label-width="120px">
        <el-input v-model="form.extUrl" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="图标地址" label-width="120px">
        <el-input v-model="form.imageUrl" autocomplete="off"></el-input>
    </el-form-item>
</div>
</template>
<script>
export default {
    props: ['form','data'],
}
</script>
