const http = require('http')
const { resolve } = require('path')
const express = require('express')

const PORT = process.env.PORT || '30001'
const app = express()
const server = http.Server(app)

require('./socketio')(server)

app.get('/', (req, res) => res.sendFile(resolve(__dirname, 'index.html')))
server.listen(PORT, () => console.log(`listening on ${PORT}`))
