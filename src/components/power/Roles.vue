<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 添加角色按钮 -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            
            <!-- 角色列表 -->
            
            <el-table :data="rolelist" border  stripe >
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom',i1===0?'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                        <!-- 渲染一级权限 -->
                            <el-col :span="5" >
                                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19" >
                                <el-row v-for="item2 in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">
                                            {{item2.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag  v-for="item3 in item2.children " :key="item3.id" type="warning" closable @close="removeRightById(scope.row,item3.id)">
                                            <!-- <el-tag type="warning"> -->
                                            {{item3.authName}}

                                            <!-- </el-tag> -->
                                        </el-tag>
                                        <!-- </el-row> -->
                                    </el-col>
                                </el-row>
                            </el-col>
                            
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 --> 
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column  label="角色名称" prop="roleName"></el-table-column>
                <el-table-column  label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column  label="操作" width="300px">
                    <!-- <template slot-scope="scope"> -->
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog">分配权限</el-button>
                    <!-- </template> -->
                </el-table-column>
            </el-table>
        </el-card>
        
        <!-- 分配权限的弹框 -->

        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%">
            <!-- <span>这是一段信息</span> -->
            <!-- 树形控件 -->
            <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
            <span slot="footer" class="dialog-footer" >
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRightDialogVisible=false">确 定</el-button>
            </span>
        </el-dialog>
        
        
    </div>
</template>
<script>
export default {
    data() {
        return {
            // 所有角色列表
            rolelist:[],
            // 控制分配权限对话框
            setRightDialogVisible:false,
            // 存取权限的数据
            rightslist:[],
            // 树形控件的属性绑定对象
            treeProps:{
                label:'authName',
                children:'children'
            },
            // 默认选中的节点id值数组
            defKeys:[]
        }
    },
    created(){
        this.getRoleList();
    },
    methods:{
        // 获取所有角色的列表
       async getRoleList(){
          const{data:res}=await this.$http.get('roles');
        //   console.log(res);
          if(res.meta.status!==200){
              return this.$message.error('获取角色列表失败');
          }
          this.rolelist=res.data
        },
        // 根据id删除对应的权限
       async removeRightById(role,rightId){
            const confirmResult=  await this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>{
            return err;
        });

        if(confirmResult!=='confirm'){
            return this.$message.error('已取消删除');
        }
       const {data:res}=await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
       if(res.meta.status!==200){
           return this.$message.error('删除失败');
       }
       this.$message.success('删除成功');
    //    删除之后重新刷新会导致页面数据没有停留在当前页面
    //    this.getRoleList();
    //  删除之后页面会停留在当前的页面
        role.children=res.data;
        },
        async showSetRightDialog(){
            // 在获取所有权限之前才能将权限框状态改变
            const {data:res}=await this.$http.get('rights/tree');
            if(res.meta.status!==200){
                return this.$message.error('获取分配权限失败');
            }
            this.rightslist=res.data;
            console.log(this.rightslist);
            
            this.setRightDialogVisible=true;
        }
    }
}
</script>
<style lang="less" scoped>
.el-tag{
    margin: 7px;
}
.bdtop{
    border-top: 1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
.vcenter{
    display: flex;
    align-items: center;
}

</style>