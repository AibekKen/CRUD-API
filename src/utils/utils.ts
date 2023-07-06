import { Users } from '../db/users.ts'
const requiredProps = [
  ['username', 'string'], 
  ['age', 'number'], 
  ['hobbies', 'string']
]

export const checkValidUser = (user: any) => {
  if (user?.id) {
    return undefined;
  } 
  if(!checkOnlyRequiredProps(user)) {
    return null
  }   
  for (const [key, type] of requiredProps) {
    if(!!user?.[key]) {
      if(key === 'hobbies') {
        if(!(Array.isArray(user[key]) && (!user[key].length || user[key].every((value: unknown) => typeof value === type)))) {
          return null
        }
      } else if(typeof user[key] !== type) {
        return null
      }
    } else {
      return null
    }
  }
  
  return user as Users
}

export const checkOnlyRequiredProps = (updatedData: any) => {
  if (updatedData?.id) {
    return null;
  }
  const entries = Object.entries(updatedData);

  const result = entries.every(([key, value]) => {
    if (key === "hobbies") {
      return (Array.isArray(value) && !value.length) || (Array.isArray(value) && value.length && value.every((item: unknown) => typeof item === 'string'))
    }
    return requiredProps.some(([reqKey, reqType])=> {
      return reqKey === key && typeof value === reqType
    })
  });
  return result ? updatedData as Partial<Users> : null
};