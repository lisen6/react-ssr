import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { matchRoutes } from 'react-router-config'

import Routes, { routes } from '../client/router'
import { getServerStore } from '../client/store'
import StyleContext from 'isomorphic-style-loader/StyleContext'

// 改造这里 服务端做数据预取
const loadBranchData = (pathname, store) => {
  const branch = matchRoutes(routes, pathname)

  // warning: 这里route.loadData 需要错误捕获
  const promises = branch.map(({ route, match }) => {
    return route.loadData
      ? route.loadData(store, match) // 把store 和 match 传入数据预取函数
      : Promise.resolve(null)
  })

  return Promise.all(promises)
}

export function render(req, res) {
  // 加载完数据后，再把组件生成字符串返回，现在返回的组件都是有数据的结果
  const store = getServerStore()

  loadBranchData(req.url, store)
    .then((data) => {
      // 到这里所有的数据预加载完毕
      // 数据加载完毕后再渲染组件
      const string = getRenderString(req, res)
      res.send(string)
    })
    .catch((err) => {
      console.log(err)
      res.send('loadBranchData_error')
    })

  function getRenderString(req, res) {
    const context = { css: [] }

    //构建服务端的路由
    const content = renderToString(
      // Warning 这里的 store 一定要和 loadBranchData 的store一致，因为预取的数据要在流到组件中，组件再被生成字符串返回
      // 如果这两个store不一致，将即使数据预取成功，也没有再次流到组件中
      <Provider store={store}>
        <StaticRouter location={req.url} context={context}>
          {Routes}
        </StaticRouter>
      </Provider>
    )

    // 服务端的 renderToString执行完后 context中已经被注入了数据
    const cssStr = context.css.length ? context.css.join('\n') : ''

    console.log(cssStr, 'cssStr')
    const hydrate = `
      window.initialState = ${JSON.stringify(store.getState())};
    `

    const html = `
        <html>
          <head></head>
          <style>${cssStr}</style>
          <body>
            <div id="root">${content}</div>
            <script>
              ${hydrate}
            </script>
            <script src="/bundle.js"></script>
          </body>
        </html>
      `
    return html
  }
}
