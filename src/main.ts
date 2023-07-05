import dotenv from 'dotenv'
import http from 'http'
import { handleRequest } from './controls/controls.ts'
dotenv.config()

const server = http.createServer(handleRequest)
const port = Number(process.env.PORT)

export const app = server.listen(port, () => console.log( `server running on port ${port}`)).on('error', (err) => console.log(err))



