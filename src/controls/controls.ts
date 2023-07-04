import { RequestListener } from 'http'
import { Users } from '../db/users.js'
import { HttpMethod } from '../constants/http-method.enum.js'
import { ErrorMessages } from '../constants/error-messages.enum.js'
import { v4 as uuidv4 } from 'uuid';
import { checkValidUser } from '../utils/utils.js';

export const handleRequest: RequestListener = (req, res)=> {
  const { url, method } = req
  res.setHeader('Content-type', 'application/json')
  const urlParts = url?.split('/')
  if(url?.startsWith('/users') && !urlParts?.[2] && method === HttpMethod.GET) {
    const users = Users.getUsers()
    res.statusCode = 200
    res.write(JSON.stringify(users))
    res.end()
  } else if(url?.startsWith('/users/') &&  method === HttpMethod.GET) {
    const userId = url.split('/')[2]
    const user = Users.getUserById(userId)
    switch (user) {
      case undefined:
        res.statusCode = 404
        res.end(JSON.stringify({message: ErrorMessages.NOT_FOUND}))
        break;
      case null:
        res.statusCode = 400
        res.end(JSON.stringify({message: ErrorMessages.INVALID_ID}))
        break
      default:
        res.statusCode = 200
        res.end(JSON.stringify(user))
        break;
    } 
  } else if(url?.startsWith('/users') &&  method === HttpMethod.POST) {
    let body = '';
    let newUser: any;

    req.on('data', chunk => {
      body += chunk.toString() 
    })

    req.on('end', () => {
      try {
      newUser = JSON.parse(body);
      const user = checkValidUser(newUser)
      if (!user) {
        res.statusCode = 400
        res.end(JSON.stringify({message: ErrorMessages.BODY_REQ_FIELDS}))
      } else {
        user.id = uuidv4()
        Users.createUser(user)
        res.statusCode = 201
        res.end(JSON.stringify(user))
      }
      } catch {
        res.statusCode = 400
        res.end(JSON.stringify({message: ErrorMessages.BODY_INCORRECT}))
      }
    });
  } else if(url?.startsWith('/users/') &&  method === HttpMethod.PUT) {
    const userId = url.split('/')[2]
    let body = '';
    let updatedData: any;

    req.on('data', chunk => {
      body += chunk.toString() 
    })

    req.on('end', () => {
      try {
        updatedData = JSON.parse(body);
        const user = Users.getUserById(userId)
        switch (user) {
          case undefined:
            res.statusCode = 404
            res.end(JSON.stringify({message: ErrorMessages.NOT_FOUND}))
            break;
          case null:
            res.statusCode = 400
            res.end(JSON.stringify({message: ErrorMessages.INVALID_ID}))
            break
          default:
            res.statusCode = 200
            const updatedUser = Users.updateUser(userId, updatedData)
            res.end(JSON.stringify(updatedUser))
            break;
        } 
      } catch {
        res.statusCode = 400
        res.end(JSON.stringify({message: ErrorMessages.BODY_INCORRECT}))
      }
    });

  } else if(url?.startsWith('/users/') &&  method === HttpMethod.DELETE) {
    const userId = url.split('/')[2]
    const user = Users.deleteUser(userId)
    switch (user) {
      case undefined:
        res.statusCode = 404
        res.end(JSON.stringify({message: ErrorMessages.NOT_FOUND}))
        break;
      case null:
        res.statusCode = 400
        res.end(JSON.stringify({message: ErrorMessages.INVALID_ID}))
        break
      default:
        res.statusCode = 204
        res.end()
        break;
    } 
  }
}

