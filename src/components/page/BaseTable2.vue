<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-user"></i> 用户管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
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
                <el-table-column prop="username" label="用户名" width="80"></el-table-column>
                <el-table-column prop="auth" label="身份" width="80">
                    <template slot-scope="scope">{{scope.row.auth === 0 ? '普通用户' : '管理员'}}</template>
                </el-table-column>
                <el-table-column prop="phone" label="手机号">
                    <!-- <template slot-scope="scope">￥{{scope.row.money}}</template> -->
                </el-table-column>
                <el-table-column prop="age" label="年龄"></el-table-column>
                <el-table-column label="密码" align="center">******</el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.deleted === 0 ? 'success' : scope.row.state === 1 ? 'danger' : ''">{{
                            scope.row.deleted === 0 ? '可用' : '不可用'
                        }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="注册时间">
                    <template slot-scope="scope">{{ formatTime(scope.row.createTime) }}</template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-refresh" @click="handleDelete(scope.$index, scope.row, 0)">激活</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row, 1)"
                            >注销</el-button
                        >
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
                <el-form-item label="用户名">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="选择器">
                        <el-select v-model="form.auth" placeholder="请选择">
                            <el-option :key="0" label="普通用户" :value="0"></el-option>
                            <el-option :key="1" label="管理员" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                <!-- <el-form-item label="身份">
                    <el-input v-model="form.auth"></el-input>
                </el-form-item> -->
                <el-form-item label="年龄">
                    <el-input v-model="form.age"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.password" show-password></el-input>
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
import { deleteUser, fetchUser, updateUser } from '../../api/index';
import { formatDate } from '../../utils/time';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            options: [
                {
                    value: '普通用户',
                    key: 0
                },
                {
                    value: '管理员',
                    key: 1
                }
            ],
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            introLimit: 10
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            fetchUser(this.query).then((res) => {
                console.log(res);
                let tmp = res.data;
                this.tableData = tmp.records;
                this.pageTotal = tmp.total;
            });
        },
        getIntro(value) {
            if (value.length > this.introLimit) {
                return value.substr(0, this.introLimit) + '...';
            } else {
                return value;
            }
        },
        formatTime(value) {
            var date = new Date(value);
            return formatDate(date, 'yyyy-MM-dd hh:mm');
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row, type) {
            console.log(row.id);
            let query = {};
            let ids = [];
            ids.push(row.id);
            query.ids = ids;
            query.type = type;
            // 二次确认删除
            let warn = '';
            if (type == 0) {
                warn = '确定要激活吗？';
            } else {
                warn = '确定要注销吗？';
            }
            this.$confirm(warn, '提示', {
                type: 'warning'
            })
                .then(() => {
                    deleteUser(query).then((res) => {
                        console.log(res);
                        if (res.code == 0) {
                            if (type == 1) {
                                this.$message.success('注销成功');
                            } else {
                                this.$message.success('激活成功');
                            }
                        } else {
                            if (type == 1) {
                                this.$message.error('注销失败');
                            } else {
                                this.$message.error('激活失败');
                            }
                        }
                        this.getData();
                    });
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            console.log(this.multipleSelection);
            let delParam = {};
            let ids = [];
            for (let item of this.multipleSelection) {
                ids.push(item.id);
            }
            delParam.ids = ids;
            delParam.type = 1;

            deleteUser(delParam).then((res) => {
                if (res.code == 0) {
                    this.$message.success('注销成功');
                } else {
                    this.$message.error('注销失败');
                }
            });
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
            updateUser(this.form).then((res) => {
                if (res.code == 0) {
                    this.$message.success('编辑成功');
                    this.$set(this.tableData, this.idx, this.form);
                } else {
                    this.$message.error('编辑失败');
                }
            });
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
