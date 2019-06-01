//购物车数据
import axios from './../axios'
export default{
  list(){
    return axios.get('/cart/list')
  },
  insert(data){
    return axios.post('/cart/insert',data)
  },
  delete(id){
    return axios.post('/cart/delete',{ids:id})
  },
  update(data){
    return axios.post('/cart/update',data)
  }

}
