import request from '../utils/request';
import axios from 'axios'

export const fetchData = query => {
  return request({
    url: './table.json',
    method: 'get',
    params: query
  });
};

// 获取数据列表
export const fetchBook = queryBook => {
  return request({
    url: '/book/listBooks',
    method: 'get',
    params: queryBook
  })
};

//登录
export const login = loginParam => {
  return request({
    url: '/login/doLogin',
    method: 'POST',
    data: loginParam
  });
}

export const logout = logout => {
  return request({
    url: '/login/logout',
    method: 'post',
    data: logout
  })
}