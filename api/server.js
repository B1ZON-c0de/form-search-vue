const server = require('json-server')
const server = server.create()
const router = server.router('db.json')
const middlewares = server.defaults()

server.use(middlewares)
server.use('/api', router)

module.exports = server
