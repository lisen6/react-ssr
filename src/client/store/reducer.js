import { CHANGE_LIST } from '../constants/index'

const initState = {
  name: '卢本伟',
  list: []
}
export default function (state = initState, action = {}) {
  switch (action.type) {
    case CHANGE_LIST:
      return {
        ...state,
        list: action.payload
      }
    default:
      return state
  }
}
