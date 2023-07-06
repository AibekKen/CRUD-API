# CRUD-API

## Requirements

* Node.js
* Git
* Contentful CLI (only for write access)


## Common setup

Clone the repo

```bash
git clone https://github.com/AibekKen/CRUD-API.git
cd CRUD-API
```

change branch to CRUD-API

```bash
git checkout CRUD-API
```

Install the dependencies.

```bash
npm install
```


## Steps for read-only access
create you own .env with PORT as in example 

To start the development mode

```bash
npm run start:dev
```

To start the prod mode

```bash
npm run start:prod
```

To start the load balancer mode

```bash
npm run start:multi

To start tests

```bash
npm run test
```

## Available API
GET api/users is used to get all persons
GET api/users/{userId} is to get user by id
POST api/users is used to create record about new user and store it in database
PUT api/users/{userId} is used to update existing user
PUT api/users/{userId} is used to update existing user
# Required props for create and updated user 
type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};