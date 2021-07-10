import { CHANGE_LIST } from '../constants'

//普通action
const changeList = (list) => ({
  type: CHANGE_LIST,
  payload: list
})

export const getHomeList = () => {
  return (dispatch, getState, axiosInstance) => {
    return axiosInstance
      .get('/api/list')
      .then((res) => {
        const list = res.data
        return dispatch(changeList(list.data))
      })
      .catch(() => {})
  }
}
