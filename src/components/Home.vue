<template>
<!-- element 布局容器 -->
    <el-container class="home-container">
        <!-- 头部布局部分 -->
        <el-header>
            <div>
                <img src="../assets/heima.png" alt="">
                <span>电商后台管理系统</span>
            </div>
        <el-button type="info" @click="logout">退出</el-button>

        </el-header>
        <el-container>
            <!-- 侧边栏布局 部分-->
            <el-aside :width="isCollapse?'64px':'200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏菜单区 -->
                <el-menu background-color="#333744" text-color="#fff"
                    active-text-color="#ffd04b" unique-opened :collapse='isCollapse' :collapse-transition='false' router   :default-active="activePath">
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id" >
                        <!-- 一级菜单模板区 -->
                        <template slot="title">
                            <!-- 图标 -->
                        <i :class="iconObject[item.id]"></i>
                        <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)" >
                            <template slot="title">
                            <!-- 图标 -->
                        <i class="el-icon-menu"></i>
                        <span>{{subItem.authName}}</span>
                        </template>
                        </el-menu-item>
                    </el-submenu>
                    
                </el-menu>

            </el-aside>
            <!-- 主体布局 部分-->
            <el-main>
                <!-- welcome路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>

</template>
<script>
export default {
    data() {
        return {
            // 左侧菜单数据
            menulist:[],
            iconObject:{
                '125':'iconfont icon-users',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao',
            },
            // 是否折叠菜单栏，false代表不折叠
            isCollapse:false,
            // 被激活的链接地址
            activePath:''
        }
    },
        created(){
            this.getMenuList();
            this.activePath=window.sessionStorage.getItem('activePath');
        },
    methods:{
        logout(){
            window.sessionStorage.clear();
            this.$router.push('/login');
        },
        // 获取菜单列表情况
        async getMenuList(){
          const{data:res}= await this.$http.get('menus');
          if(res.meta.status!==200)return this.$message.error(res.meta.msg);
          
          this.menulist=res.data;
          console.log(res);
          
        },
        // 点击按钮，菜单切换
        toggleCollapse(){
             this.isCollapse=!this.isCollapse;
        },
        // 保存链接的激活状态
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath);
            this.activePath=activePath;
        }
    }
}
</script>
<style lang="less" scoped>
// 容器样式
.home-container{
    height: 100%;
}
// header头部样式
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left:0;
    align-items: center;
    color: #ffffff;
    font-size: 20px;
    > div{
        display: flex;
        align-items: center;
        span{margin-left: 15px;}
    }
    
}
// 侧边栏aside样式
.el-aside{
    background-color: #333744;
    .el-menu{
        border-right: none;
    }
}
// 主体main样式
.el-main{
    background-color: #eaedf1;
}
// 图标间距
.iconfont{
    margin-right: 10px;
}
// 侧边菜单栏切换样式
.toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}

</style>