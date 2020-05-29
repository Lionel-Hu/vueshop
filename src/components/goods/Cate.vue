<template>
    <div>
        <!-- 商品分类组件 -->
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格区域 -->
            
            <tree-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index border>
                <!-- 是否有效列的数据模板，通过具名和作用域插槽来实现 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-circle-check" v-if="scope.row.cat_deleted='false'" style="color:lightgreen"></i>
                    <i class="el-icon-circle-close" v-else style="color:lightgreen"></i>
                </template>
                <!-- 排序列的数据模板，通过具名和作用域插槽来实现 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else-if="scope.row.cat_level===2">三级</el-tag>

                </template>
                <!-- 操作列的数据模板，通过具名和作用域插槽来实现 -->
                <template slot="opt">
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </tree-table>

            <!-- 页码区域 -->
             <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加分类的对话框 -->
    <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%" >

        <!-- 添加分类的表单 -->

        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef"   label-width="100px" >
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类" prop="cat_name">
                <!-- <el-input v-model="addCateForm.cat_name"></el-input> -->
                <!-- props用来指定配置对象 -->
                <!-- <el-cascader
                    expandTrigger="hover"
                    v-model="selectedKeys"
                    :options="parentCateList"
                    :props="cascaderProps"
                    @change="parentCateChanged">
                </el-cascader> -->

                <el-cascader expandTrigger='hover' v-model="selectedKeys" 
                :options="parentCateList"     :props="cascaderProps" @change="parentCateChange" clearable change-on-select>

                </el-cascader>
            </el-form-item>


            <!-- </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCateDialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>

    </div>
</template>
<script>
export default {
    data() {
        return {
            // 商品分类数据
            catelist:[],
            // 查询条件
            queryInfo:{
                type:3,
                // 默认页码
                pagenum:1,
                // 默认每页的数据条数
                pagesize:5
            },
            // 总数据条数
            total:0,
            // table指定列
            columns:[
                {
                    label:'分类名称',
                    prop:'cat_name'
                },
                {
                    label:'是否有效',
                    type:'template',
                    template:'isok'
                },
            {
                label:'排序',
                type:'template',
                template:'order'
            },
            {
                label:'操作',
                type:'template',
                template:'opt'
            }],
            // 控制对话框的显示与隐藏
            addCateDialogVisible:false,
            // 添加分类的表单数据对象
            addCateForm:{
                // 分类名称
                cat_name:'',
                // 添加分类的父级id，0则表示父级为0.添加一级分类
                cat_pid:0,
                // 添加分类的等级，0则表示添加一级分类
                cat_level:0
            },
            // 添加分类表单的验证规则
            addCateFormRules:{
                cat_name:[{
                    required: true, message:'请输入分类名称', trigger: 'blur',
                }]
            },
            // 父级分类的列表
            parentCateList:[],
            // 指定配置对象
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
                expandTrigger:'hover'
            },
            // 选中的父级分类的数组
            selectedKeys:[],
            
        }
    },
    created(){
        this.getCateList();
    },
    methods: {
        // 获取商品分类的数据函数
     async getCateList(){
          const {data:res}=await  this.$http.get('categories',{params:this.queryInfo});
          if(res.meta.status!==200){
            return  this.$message.error('获取商品分类列表失败');
          }
          this.catelist=res.data.result;
          this.total=res.data.total;
        },
        // 监听页码数据的变化
    handleSizeChange(newSize){
        this.queryInfo.pagesize=newSize;
        // 变化之后进行数据更新
        this.getCateList();
    },
    // 监听页码的变化
    handleCurrentChange(newPage){
        this.queryInfo.pagenum=newPage;
        this.getCateList();
    },
    showAddCateDialog(){
        // 点击添加分类按钮的同时，生成父级列表的数据
        this.getParenCateList();
        // 弹出对话框
        this.addCateDialogVisible=true;
    },
    // 获取父级分类的数据列表
   async getParenCateList(){
       const {data:res}=await this.$http.get('categories',{params:{
            type:2
        }});
        if(res.meta.status!==200){
            return this.$message.error('获取父级分类数据失败');
        }
        // console.log(res.data);
        
        this.parentCateList=res.data;
    },
    parentCateChange(){
        console.log(this.selectedKeys);
        
    }



    }
    
}
</script>
<style lang="less" scoped>
.treeTable{
    margin-top: 15px;
}
</style>