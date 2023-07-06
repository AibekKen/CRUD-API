import request from 'supertest'
import { app } from '../main.ts';
import { Users } from '../db/users.ts';



describe('API tests', () => {

  afterAll((done) => {
    app?.close(done);
  });

  it('should return the list of data', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array)
  })

  it('should return status code 404 if endpoint not exist or incorrect', async () => {
    const response = await request(app).get('/incorrect');
    expect(response.status).toBe(404);
  })

  it('should create new user with status code 201', async () => {
    const newUser = {
      username: "test User",
      age: 20,
      hobbies: [
          "test"
      ]
  }
    const response = ((await request(app).post('/users').send(newUser)));
    expect(response.status).toBe(201);
    expect(response.body.username).toBe(newUser.username)
  })

  it('should create return status code 400 if new user don have required properties', async () => {
    const newUser = {
      username: "test User",
      age: 20
  }
    const response = ((await request(app).post('/users').send(newUser)));
    expect(response.status).toBe(400);
  })

    it('should return newly created user by id with status code 200', async () => {
    const newUser = {
      username: "test User2",
      age: 22,
      hobbies: [
        "test2"
    ]
  }
    const responsePost = ((await request(app).post('/users').send(newUser)));
    expect(responsePost.status).toBe(201);
    const userId = responsePost.body.id
    const responseGet = ((await request(app).get(`/users/${userId}`)));
    expect(responseGet.status).toBe(200)
    expect(responseGet.body.id).toBe(userId)
  })
})
