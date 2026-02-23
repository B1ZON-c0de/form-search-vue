import jsonServer from 'json-server'
import fs from 'fs'

const server = jsonServer.create()

const data = JSON.parse(fs.readFileSync('db.json', 'utf-8'))
const router = jsonServer.router(data)

const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use('/api', router)

export default server
