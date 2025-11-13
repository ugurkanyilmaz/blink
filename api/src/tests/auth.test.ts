import request from 'supertest';
import app from '../app';

// Generate a random Turkish mobile phone number to avoid duplicate collisions in DB
const genPhone = () => {
  // +90 5XXXXXXXXX (total 12 chars including +90)
  const suffix = Math.floor(100000000 + Math.random() * 900000000).toString();
  return `+90${'5'}${suffix}`;
};

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user with phone and password', async () => {
      const phone = genPhone();
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phone,
          password: 'testPassword123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.phone).toBe(phone);
    });

    it('should return 400 if phone already exists', async () => {
      // First registration with a fixed phone for duplicate test
      const phone = genPhone();
      await request(app).post('/api/auth/register').send({
        phone,
        password: 'password123',
      });

      // Duplicate registration
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phone,
          password: 'password456',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      // Create a test user
      const phone = genPhone();
      (global as any).TEST_USER_PHONE = phone; // expose for later tests in this file
      await request(app).post('/api/auth/register').send({
        phone,
        password: 'loginTest123',
      });
    });

    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          phone: (global as any).TEST_USER_PHONE,
          password: 'loginTest123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should return 401 with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          phone: (global as any).TEST_USER_PHONE,
          password: 'wrongPassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 if user does not exist', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          phone: genPhone(),
          password: 'anyPassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/refresh', () => {
    let refreshToken: string;

    beforeAll(async () => {
      const phone = genPhone();
      const response = await request(app).post('/api/auth/register').send({
        phone,
        password: 'refreshTest123',
      });
      refreshToken = response.body.refreshToken;
    });

    it('should return new access token with valid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
    });

    it('should return 401 with invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid_token_12345' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/logout', () => {
    let refreshToken: string;

    beforeAll(async () => {
      const phone = genPhone();
      const response = await request(app).post('/api/auth/register').send({
        phone,
        password: 'logoutTest123',
      });
      refreshToken = response.body.refreshToken;
    });

    it('should logout and invalidate refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');

      // Try to use the same token after logout
      const refreshResponse = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(refreshResponse.status).toBe(401);
    });
  });
});
