import { v4 as uuidv4, validate } from 'uuid';

export class Users {

  constructor(
    public username: string, 
    public age: number, 
    public hobbies: string[],
    public id?: string,
  ){}

  private static _users: Users[] = [
    {
      id: uuidv4(),
      username: 'Gabe',
      age: 12,
      hobbies: ['basketball']
    },
    {
      id: uuidv4(),
      username: 'Make',
      age: 18,
      hobbies: ['hiking']
    },
    {
      id: uuidv4(),
      username: 'Edward',
      age: 30,
      hobbies: ['cars', 'football']
    },
    {
      id: uuidv4(),
      username: 'Gabriel',
      age: 13,
      hobbies: ['anime']
    }
  ]


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
  }

  static updateUser(id: string, updateUser: Partial<Users>) {
    const isValidUuid = validate(id)
    if (isValidUuid) {
      const index = this._users.findIndex(user => user.id === id)
      this._users[index] = {
        ...this._users[index],
        ...updateUser
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
      return user
    }
    return null
  }
}