import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import homeReducer from './reducer'
import { clientAxiosInstance, serverAxiosInstance } from '../../utils/axios'

//合并项目组件中store的reducer
const reducer = combineReducers({
  home: homeReducer
})

export const getServerStore = () => {
  return createStore(
    reducer,
    applyMiddleware(thunk.withExtraArgument(serverAxiosInstance))
  )
}

export const getClientStore = () => {
  const initialState = window.initialState ? window.initialState : {}
  return createStore(
    reducer,
    initialState,
    applyMiddleware(thunk.withExtraArgument(clientAxiosInstance))
  )
}
