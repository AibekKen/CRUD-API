import { error } from 'console'
import dotenv from 'dotenv'
import http from 'http'
import { Users } from './db/users.js'
dotenv.config()

const server = http.createServer((req, res)=> {
  res.setHeader('Content-type', 'application/json')
  if(req.url === '/users' && req.method === 'GET') {
    req.url
    const users = Users.getUsers()
    res.statusCode = 200
    res.write(JSON.stringify(users))
    res.end()
  }
  })
const port = Number(process.env.PORT)
server.listen(port, () => `listen port ${port}`).on('error', (err) => console.log(err))

