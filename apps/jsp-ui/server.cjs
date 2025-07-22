// Simple Express server for /api/log endpoint
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const PORT = 3001

app.use(cors())
app.use(bodyParser.json())

app.post('/api/log', (req, res) => {
  console.log('前端传来的数据:', JSON.stringify(req.body, null, 2))
  res.sendStatus(200)
})

app.listen(PORT, () => {
  console.log(`Log server running at http://localhost:${PORT}`)
})
