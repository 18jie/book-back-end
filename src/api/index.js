import request from '../utils/request';
import axios from 'axios'

export const fetchData = query => {
  return request({
    url: './table.json',
    method: 'get',
    params: query
  });
};

export const fetchBook = queryBook => {
  return request({
    url: '/book/listBooks',
    method: 'get',
    params: queryBook
  })
}