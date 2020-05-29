<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 第二步 -->
            <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
        <div id="main" style="width: 750px;height:400px;"></div>
        </el-card>
    </div>
</template>
<script>
// 完成图表功能第一步：引入echarts包
import echarts from 'echarts';
// import _ from 'loadash'
export default {
    
    data() {
        // 需要合并的对象
        return {
            options: {
            title: {
                 text: '用户来源'
            },
            tooltip: {
                trigger: 'axis',
            axisPointer: {
                type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
        }
    },
    created(){},
   async mounted(){
        // 第三步
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        const {data:res}=await this.$http.get('reports/type/1');

        if(res.meta.status!==200){
            return this.$message.error('获取折线图数据失败');
        }

        // 第四步
          // 指定图表的配置项和数据
        // var option = {
        //     title: {
        //         text: 'ECharts 入门示例'
        //     },
        //     tooltip: {},
        //     legend: {
        //         data:['销量']
        //     },
        //     xAxis: {
        //         data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        //     },
        //     yAxis: {},
        //     series: [{
        //         name: '销量',
        //         type: 'bar',
        //         data: [5, 20, 36, 10, 10, 20]
        //     }]
        // };
        // const result=_.merge(res.data,this.options)
         // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(res.data);
    },
    methods:{}
}
</script>
<style lang="less" scoped>

</style>