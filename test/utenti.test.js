const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const { app, server, users, goals, intervals } = require('../index');
const expect = chai.expect;
const port = 3001; // Uso una porta diversa per evitare conflitti

chai.use(chaiHttp);

before(() => {
  process.env.PORT = port;
});

describe('User API Tests', () => {
  beforeEach(() => {
    // Reset prima di ogni test
    users.length = 0;
    goals.length = 0;
    intervals.length = 0;
  });

  // Test metodi per l'inserimento, modifica e cancellazione di un utente: email, nome e cognome

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const res = await chai.request(app)
        .post('/users')
        .send({ email: 'test@test.com', name: 'Test', surname: 'User' });

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('id');
      expect(res.body.email).to.equal('test@test.com');
    });

    it('should return 400 for missing required fields', async () => {
      const res = await chai.request(app)
        .post('/users')
        .send({ name: 'Test' });

      expect(res).to.have.status(400);
    });

    it('should return 400 for duplicate email', async () => {
      await chai.request(app)
        .post('/users')
        .send({ email: 'test@test.com', name: 'Test', surname: 'User' });

      const res = await chai.request(app)
        .post('/users')
        .send({ email: 'test@test.com', name: 'Test', surname: 'User' });

      expect(res).to.have.status(400);
    });
  });

  describe('PUT /users/:id', () => {
    it('should update user details', async () => {
      const createRes = await chai.request(app)
        .post('/users')
        .send({ email: 'test@test.com', name: 'Test', surname: 'User' });

      const userId = createRes.body.id;
      const res = await chai.request(app)
        .put(`/users/${userId}`)
        .send({ name: 'Updated' });

      expect(res).to.have.status(200);
    });

    it('should return 400 for non-existent user', async () => {
      const res = await chai.request(app)
        .put('/users/999')
        .send({ name: 'Updated' });

      expect(res).to.have.status(400);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user', async () => {
      const createRes = await chai.request(app)
        .post('/users')
        .send({ email: 'test@test.com', name: 'Test', surname: 'User' });

      const userId = createRes.body.id;
      const res = await chai.request(app)
        .delete(`/users/${userId}`);

      expect(res).to.have.status(204);
    });

    it('should return 400 for non-existent user', async () => {
      const res = await chai.request(app)
        .delete('/users/999');

      expect(res).to.have.status(400);
    });
  });
});

after(() => {
  server.close();
});

