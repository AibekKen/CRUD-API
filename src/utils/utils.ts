import { Users } from '../db/users.js'

export const checkValidUser = (user: any) => {
  const requiredProps = [
    ['username', 'string'], 
    ['age', 'number'], 
    ['hobbies', 'string']
  ]
    
  for (const [key, type] of requiredProps) {
    if(!!user?.[key]) {
      if(key === 'hobbies') {
        if(!(Array.isArray(user[key]) && (!user[key].length || user[key].every((value: unknown) => typeof value === type)))) {
          return null
        }
      } else if(typeof user[key] !== type) {
        return null
      }
      console.log('type ok', key)
    } else {
      return null
    }
  }
  
  return user as Users
}