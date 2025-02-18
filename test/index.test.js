const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const { app, server, users, goals, intervals } = require('../index');
const expect = chai.expect;
const port = 3001; // Uso un porta diversa per evitare conflitti

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

// Test dei metodi per l'inserimento, modifica e cancellazione di un intervallo di obiettivi

describe('Interval API Tests', () => {
  beforeEach(() => {
    users.length = 0;
    goals.length = 0;
    intervals.length = 0;
  });

  describe('POST /intervals', () => {
    it('should create a new interval', async () => {
      const userRes = await chai.request(app)
        .post('/users')
        .send({ email: 'test@test.com', name: 'Test', surname: 'User' });

      const res = await chai.request(app)
        .post('/intervals')
        .send({ startDate: '2023-01-01', endDate: '2023-01-31', userId: userRes.body.id });

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('id');
      expect(res.body.userId).to.equal(userRes.body.id);
    });

    it('should return 400 for missing required fields', async () => {
      const res = await chai.request(app)
        .post('/intervals')
        .send({ startDate: '2023-01-01' });

      expect(res).to.have.status(400);
    });

    it('should return 400 for non-existent user', async () => {
      const res = await chai.request(app)
        .post('/intervals')
        .send({ startDate: '2023-01-01', endDate: '2023-01-31', userId: 999 });

      expect(res).to.have.status(400);
    });
  });

  describe('PUT /intervals/:id', () => {
    it('should update interval details', async () => {
      const userRes = await chai.request(app)
        .post('/users')
        .send({ email: 'test@test.com', name: 'Test', surname: 'User' });

      const intervalRes = await chai.request(app)
        .post('/intervals')
        .send({ startDate: '2023-01-01', endDate: '2023-01-31', userId: userRes.body.id });

      const res = await chai.request(app)
        .put(`/intervals/${intervalRes.body.id}`)
        .send({ startDate: '2023-02-01' });

      expect(res).to.have.status(200);
      expect(res.body.startDate).to.equal('2023-02-01');
    });

    it('should return 400 for non-existent interval', async () => {
      const res = await chai.request(app)
        .put('/intervals/999')
        .send({ startDate: '2023-02-01' });

      expect(res).to.have.status(400);
    });
  });

  describe('DELETE /intervals/:id', () => {
    it('should delete an interval', async () => {
      const userRes = await chai.request(app)
        .post('/users')
        .send({ email: 'test@test.com', name: 'Test', surname: 'User' });

      const intervalRes = await chai.request(app)
        .post('/intervals')
        .send({ startDate: '2023-01-01', endDate: '2023-01-31', userId: userRes.body.id });

      const res = await chai.request(app)
        .delete(`/intervals/${intervalRes.body.id}`);

      expect(res).to.have.status(204);
    });

    it('should return 400 for non-existent interval', async () => {
      const res = await chai.request(app)
        .delete('/intervals/999');

      expect(res).to.have.status(400);
    });
  });
});

describe('Goal API Tests', () => {
  beforeEach(() => {
    users.length = 0;
    goals.length = 0;
    intervals.length = 0;
  });

  describe('POST /goals', () => {
    it('should create a new goal', async () => {
      const userRes = await chai.request(app)
        .post('/users')
        .send({ email: 'test@test.com', name: 'Test', surname: 'User' });

      const intervalRes = await chai.request(app)
        .post('/intervals')
        .send({ startDate: '2023-01-01', endDate: '2023-01-31', userId: userRes.body.id });

      const res = await chai.request(app)
        .post('/goals')
        .send({ goal: 'Learn Node.js', intervalId: intervalRes.body.id });

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('id');
      expect(res.body.goal).to.equal('Learn Node.js');
    });

    it('should return 400 for missing required fields', async () => {
      const res = await chai.request(app)
        .post('/goals')
        .send({ goal: 'Learn Node.js' });

      expect(res).to.have.status(400);
    });

    it('should return 400 for non-existent interval', async () => {
      const res = await chai.request(app)
        .post('/goals')
        .send({ goal: 'Learn Node.js', intervalId: 999 });

      expect(res).to.have.status(400);
    });
  });
});

describe('Interval Query Tests', () => {
  beforeEach(async () => {
    users.length = 0;
    goals.length = 0;
    intervals.length = 0;

    const userRes = await chai.request(app)
      .post('/users')
      .send({ email: 'test@test.com', name: 'Test', surname: 'User' });

    await chai.request(app)
      .post('/intervals')
      .send({ startDate: '2023-01-01', endDate: '2023-01-31', userId: userRes.body.id });

    await chai.request(app)
      .post('/intervals')
      .send({ startDate: '2023-02-01', endDate: '2023-02-28', userId: userRes.body.id });
  });

  describe('GET /intervals', () => {
    it('should return all intervals', async () => {
      const res = await chai.request(app)
        .get('/intervals');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(2);
    });
  });

  describe('GET /intervals/by-goal/:goal', () => {
    it('should return intervals with matching goals', async () => {
      const intervalRes = await chai.request(app)
        .get('/intervals');
      
      await chai.request(app)
        .post('/goals')
        .send({ goal: 'Learn Node.js', intervalId: intervalRes.body[0].id });

      const res = await chai.request(app)
        .get('/intervals/by-goal/Learn Node.js');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(1);
    });
  });

  describe('GET /intervals/by-date', () => {
    it('should return intervals within date range', async () => {
      const res = await chai.request(app)
        .get('/intervals/by-date')
        .query({ startDate: '2023-01-01', endDate: '2023-01-31' });

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(1);
    });

    it('should return 400 for missing date parameters', async () => {
      const res = await chai.request(app)
        .get('/intervals/by-date')
        .query({ startDate: '2023-01-01' });

      expect(res).to.have.status(400);
    });
  });
});

after(() => {
  server.close();
});