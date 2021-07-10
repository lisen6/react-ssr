import express from 'express'
const { render } = require('../utils')

const app = express()

// 静态服务
app.use(express.static('public'))

app.get('/api/list', function (req, res, next) {
  res.json({
    data: [11, 22, 33]
  })
})

app.get('*', (req, res) => {
  if (req.url === '/favicon.ico') return res.end()
  render(req, res)
})

app.listen(3000, () => {
  console.log('listening on port 3000')
})
