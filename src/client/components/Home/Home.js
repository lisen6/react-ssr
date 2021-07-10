import React, { useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { getHomeList } from '../../store/actions'
import withStyle from '../../hoc/withStyle'
import styles from './Home.css'

const Home = (props) => {
  useEffect(() => {
    // 服务端已经往store中注入数据，这里不需要重复请求
    if (!props.home.list.length) {
      props.getHomeList()
    }
  }, [])
  return (
    <div>
      <div className={styles.title}>This is home</div>
      <div>
        {!!props.home.list.length &&
          props.home.list.map((item) => <div key={item}>{item}</div>)}{' '}
      </div>
      <button onClick={() => props.getHomeList()}>click me</button>
    </div>
  )
}

Home.loadData = async (store, match) => {
  // 参数 match 是当前匹配路由的信息
  return store.dispatch(getHomeList())
}

const mapStateToProps = (state) => {
  return {
    home: state.home
  }
}
export default connect(mapStateToProps, { getHomeList })(
  withStyle(styles)(Home)
)
