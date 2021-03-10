<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 书籍管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量下架</el-button>
                <el-select v-model="query.type" placeholder="类型" class="handle-select mr10">
                    <el-option key="1" label="玄幻奇幻" value="1"></el-option>
                    <el-option key="2" label="武侠仙侠" value="2"></el-option>
                    <el-option key="3" label="女频言情" value="3"></el-option>
                    <el-option key="4" label="现代都市" value="4"></el-option>
                    <el-option key="5" label="历史军事" value="5"></el-option>
                    <el-option key="7" label="科幻灵异" value="7"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="书籍名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
                <el-table-column prop="bookName" label="书名"></el-table-column>
                <el-table-column prop="bookWriter" label="作者">
                    <!-- <template slot-scope="scope">￥{{scope.row.money}}</template> -->
                </el-table-column>
                <el-table-column label="封面(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.imgPath"
                            :preview-src-list="[scope.row.imgPath]"
                        ></el-image>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="address" label="地址"></el-table-column> -->
                <el-table-column label="上架状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.upStatus===0?'success':(scope.row.state===1?'danger':'')"
                        >{{scope.row.upStatus === 0 ? '上架' : '下架'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="连载状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.deleted===0?'success':(scope.row.state===1?'danger':'')"
                        >{{scope.row.deleted === 0 ? '连载' : '结束'}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="更新时间">
                    <template slot-scope="scope">{{formatTime(scope.row.bookUpdateTime)}}</template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-refresh"
                            @click="handleDelete(scope.$index, scope.row, 0)"
                        >上架</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row, 1)"
                        >下架</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="书名">
                    <el-input v-model="form.bookName"></el-input>
                </el-form-item>
                <el-form-item label="作者">
                    <el-input v-model="form.bookWriter"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData } from '../../api/index';
import { formatDate } from '../../utils/time';
import { unUpBook } from '../../api/index';
import { updateBook } from '../../api/index';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                type: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            fetchData(this.query).then(res => {
                let tmp = res.data;
                this.tableData = tmp.records;
                this.pageTotal = tmp.total;
            });
        },
        formatTime(value){
            var date = new Date(value);
            return formatDate(date,"yyyy-MM-dd hh:mm");
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row, type) {
            console.log(row.id)
            let query ={};
            let ids = [];
            ids.push(row.id);
            query.ids = ids;
            query.type = type;
            // 二次确认删除
            let warn = "";
            if(type == 0){
              warn = "确定要上架吗？"
            }else{
              warn = "确定要下架吗？"
            }
            this.$confirm(warn, '提示', {
                type: 'warning'
            })
                .then(() => {
                    unUpBook(query).then(res =>{
                        console.log(res)
                        if(res.code == 0){
                            if(type == 1){
                              this.$message.success('下架成功');
                            }else{
                              this.$message.success('上架成功');
                            }
                        }else{
                            if(type == 1){
                              this.$message.error('下架失败');
                            }else{
                              this.$message.error('上架失败');
                            }
                        }
                    })
                    this.getData();
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            console.log(this.multipleSelection)
            let delParam = {};
            let ids = [];
            for (let item of this.multipleSelection){
              ids.push(item.id);
            }
            delParam.ids = ids;
            delParam.type = 1;
            
            unUpBook(delParam).then(res => {
              if(res.code == 0){
                this.$message.success("下架成功");
              }else{
                this.$message.error("下价失败")
              }
            })
            this.getData();
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            updateBook(this.form).then(res => {
              if(res.code == 0){
                this.$message.success("编辑成功");
                this.$set(this.tableData, this.idx, this.form);
              }else{
                this.$message.error("编辑失败");
              }
            })
            this.editVisible = false;
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
