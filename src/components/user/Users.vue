<template>
    <div>
        <!-- <h3>用户列表组件</h3> -->
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card >
            

            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable @clear="getUserList">
                    <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4" >
                    <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>

            <el-table :data="userlist" border stripe >
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column
                    prop="username"
                    label="姓名"
                    >
                </el-table-column>
                <el-table-column
                    prop="email"
                    label="邮箱"
                    >
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="电话"
                    >
                </el-table-column>
                <el-table-column
                    prop="role_name"
                    label="角色"
                    >
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <!-- {{scope.row}} -->
                        <!-- 作用域插槽 -->
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                        </el-switch>


                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!-- slot-scope="scope" -->
                        <!-- {{scope.row}} -->
                        <!-- 修改按钮 -->
                       <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                        <!-- 分配角色按钮 -->
                        

                        <el-tooltip  effect="dark" content="分配角色" placement="top">
                        <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>

                    </template>
                   

                </el-table-column>
            </el-table>

                <!-- 分页部分 -->
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryinfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryinfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>


            
        </el-card>

        <!-- 添加用户对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%" @close="addDialogClosed"
            >

            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" >
                <el-form-item label="用户名" prop="username">
                     <el-input v-model="addForm.username"></el-input>

                </el-form-item>
                
                <el-form-item label="密码" prop="password">
                     <el-input v-model="addForm.password"></el-input>
                     
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                     <el-input v-model="addForm.email"></el-input>
                     
                </el-form-item>

                <el-form-item label="手机" prop="mobile">
                     <el-input v-model="addForm.mobile"></el-input>
                     
                </el-form-item>
            </el-form>


            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户信息的对话框 -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" >
                <el-form-item label="用户名" >
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email" ></el-input>
                </el-form-item>

                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
export default {
    data() {
        // 自定义验证邮箱的规则
        var checkEmail=(rule,value,cb)=>{
            const regEmail = /^\w+@\w+(\.\w+)+$/
            if (regEmail.test(value)) {
            return cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }
         
        // 自定义验证手机号的规则
        var checkMobile=(rule,value,cb)=>{
             const regMobile = /^1[34578]\d{9}$/
            if (regMobile.test(value)) {
             return cb()
             }
             cb(new Error('请输入合法的手机号码'))
        }
        return {
            queryinfo:{
                query:'',
                // 当前页数
                pagenum:1,
                // 当前页面显示的数量
                pagesize:2
            },
            userlist:[],
            total:0,
            addDialogVisible:false,
            // 添加用户的表单数据
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            addFormRules:{
                username:[
                    {
                        required: true, message:'请输入名', trigger: 'blur'
                    },
                    {
                        require: true, min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'
                     }
                    
                    
                ],

                password:[
                    {
                        required: true, message:'请输入密码', trigger: 'blur'
                    },
                    {
                        require: true, min: 6, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'
                     }
                    
                    
                ],
                email:[
                    {
                        required: true, message:'请输入邮箱', trigger: 'blur'
                    },
                    {
                        validator:checkEmail,trigger:'blur'
                    }
                ],
                mobile:[
                    {
                        required: true, message:'请输入手机号码', trigger: 'blur'
                    },
                    {
                        validator:checkMobile,trigger:'blur'
                    }
                ]

            },
            // 控制修改用户对话框的显示与隐藏
            editDialogVisible:false,
            // 查询的用户信息
            editForm:{},
            editFormRules:{
                email:[{
                    required: true, message:'请输入邮箱', trigger: 'blur'
                },{
                   validator:checkEmail,trigger:'blur' 
                }],
                mobile:[{
                    required: true, message:'请输入手机', trigger: 'blur'},
                    {
                    validator:checkMobile,trigger:'blur'
                    }]
            }

        }
    },
    created(){
        this.getUserList();
    },
    methods:{
           async getUserList(){
             const{data:res} =await  this.$http.get('users',{params:this.queryinfo});
             
             if(res.meta.status!==200){
                 return this.$message.error('获取用户列表失败');
                }
                this.userlist=res.data.users;
                this.total=res.data.total;
                console.log(res);
            },
            // 监听切换显示数量改变的事件
            handleSizeChange(newSize){
                console.log(newSize);
                this.queryinfo.pagesize=newSize;
                this.getUserList();
            },
            // 页码切换
            handleCurrentChange(newPage){
                console.log(newPage);
                this.queryinfo.pagenum=newPage;
                this.getUserList();
            },
            // 监听状态切换的方法
           async userStateChanged(userinfo){
            console.log(userinfo);
           const {data:res}=await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`);
            if(res.meta.status!==200){
                userinfo.mg_state=!userinfo.mg_state;
                return this.$message.error('用户状态更新失败');
            }
            this.$message.success('用户状态更新成功');
            },
            // 用户点击关闭对话框，重新刷新对话框
            addDialogClosed(){
                this.$refs.addFormRef.resetFields();
            },
            // 点击按钮，添加新用户
        addUser(){
            this.$refs.addFormRef.validate(async(valid) => {
                // 验证不通过直接返回
                if (!valid) return;
                // 验证通过就继续发送请求到后台

              const {data:res}= await this.$http.post('users',this.addForm);
              if(res.meta.status!==201){
                  this.$message.error('添加用户失败');
              }
              this.$message.success('添加用户成功');
            //   隐藏添加对话框
            this.addDialogVisible=false;
            this.getUserList();
            })
        },
        // 实现编辑功能
       async showEditDialog(id){
        const {data:res}=await    this.$http.get('users/'+id);
        if (res.meta.status!==200) {
            return this.$message.error('查询用户信息失败');
        }
        this.editForm=res.data;


            this.editDialogVisible=true;
            // console.log(id);
            
        },
        // 修改用户对话框的关闭事件
        editDialogClosed(){
this.$refs.editFormRef.resetFields();
        },
        // 修改用户表单预验证
        editUserInfo(){
          this.$refs.editFormRef.validate(async valid=>{
            //   验证失败直接返回
            //   console.log(valid);
              if(!valid){
                  return;
                }
            // 验证成功
          const {data:res}=await  this.$http.put('users/'+this.editForm.id,{
                email:this.editForm.email,mobile:this.editForm.mobile
            });
            if (res.meta.status!==200) {
               return this.$message.error('更新用户信息失败');
               
            }
            // 关闭更改信息对话框
            this.editDialogVisible=false;
            // 更新数据信息
            this.getUserList();
            // 更新信息成功
            this.$message.success('更新用户信息成功');
          });  
        },
        // 用户删除事件
       async removeUserById(id){
            // 弹框是否确认删除
        const confirmResult=   await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>{
            return err;
        });
        if (confirmResult!=='confirm') {
            return this.$message.info('已取消删除');
        }
      const {data:res}=await  this.$http.delete('users/'+id);
        if (res.meta.status!==200) {
           return  this.$message.error('删除用户失败');
        }
        this.$message.success('删除用户成功');
        this.getUserList();


        }
           
    }
}
</script>
<style lang="less" scoped>

</style>