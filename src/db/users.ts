import cluster from 'cluster';
import { validate } from 'uuid';
export class Users {
  constructor(
    public username: string, 
    public age: number, 
    public hobbies: string[],
    public id?: string,
  ){}

  private static _users: Users[] =  []
  static getUsers() {
    return this._users
  }

  static getUserById(id: string) {
    const isValidUuid = validate(id)
    if (isValidUuid) {
      const user = this._users.find(user => user.id === id)
      return user
    }
    return null
  }

  static createUser(user: Users) {
    this._users.push(user)
    if (cluster.isWorker) {
      process.send && process.send(this._users)
    }
  }

  static updateUser(id: string, updateUser: Partial<Users>) {
    const isValidUuid = validate(id)
    if (isValidUuid) {
      const index = this._users.findIndex(user => user.id === id)
      this._users[index] = {
        ...this._users[index],
        ...updateUser
      }
      if (cluster.isWorker) {
        process.send && process.send(this._users)
      }
      return this._users[index]
    }
    return null
  }

  static deleteUser(id: string) {
    const isValidUuid = validate(id)
    if (isValidUuid) {
      const user = this._users.find(user => user.id === id)
      this._users = this._users.filter((user) =>  user.id !== id)
      if (cluster.isWorker) {
        process.send && process.send(this._users)
      }
      return user
    }
    return null
  }

  static setUsers(user: Users[]) {
    this._users = user
  }
}