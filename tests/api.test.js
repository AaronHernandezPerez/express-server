const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app')
const User = require('../models/user');
const userData = { username: 'aaron', password: 'password', type: 'admin' };

let token;

describe('Simple test suite', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  });

  it('Testing the app is working', async () => {
    await request(app).get('/').expect(200);
  })

  it('Testing register', async () => {
    const res = await request(app)
      .post('/control/register')
      .send(userData)
    expect(res.statusCode).toEqual(200)
  });

  it('Testing login', async () => {
    const res = await request(app)
      .post('/control/login')
      .send(userData)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('token')
    token = res.body.token;
  });

  it('Testing weather without login', async () => {
    const res = await request(app)
      .get('/weather/login')
      .query({ search: 'Madrid' })
    expect(res.statusCode).toEqual(403);
  });

  it('Testing weather with login', async () => {
    const res = await request(app)
      .get('/weather')
      .query({ query: 'Madrid' })
      .set('Authorization', 'Bearer ' + token)
    expect(res.statusCode).toEqual(200);
  });

  it('Testing user CRUD', async () => {
    let newUser = { username: 'testing', password: 'passwordo!', type: "user" };
    const create = await request(app)
      .post('/control/register')
      .send(newUser)
    expect(create.body).toHaveProperty('username')
    expect(create.statusCode).toEqual(200);
    expect(create.body.username).toBe(newUser.username);

    let newUserObject = create.body;

    let get = await request(app)
      .get(`/admin/${newUserObject._id}`)
      .set('Authorization', 'Bearer ' + token);
    expect(get.statusCode).toEqual(200);

    let patch = await request(app)
      .patch(`/admin/${newUserObject._id}`)
      .send({ username: 'newUsername!' })
      .set('Authorization', 'Bearer ' + token);
    expect(patch.statusCode).toEqual(200);
    expect(patch.body.username).toBe('newUsername!');


    let del = await request(app)
      .delete(`/admin/${newUserObject._id}`)
      .set('Authorization', 'Bearer ' + token)
    expect(del.statusCode).toEqual(200)
    expect(del.body.deletedCount).toBe(1);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});