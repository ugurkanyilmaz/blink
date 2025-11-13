import request from 'supertest';
import app from '../app';

const genPhone = () => {
  const suffix = Math.floor(100000000 + Math.random() * 900000000).toString();
  return `+90${'5'}${suffix}`;
};

describe('User Endpoints', () => {
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    // Register and login to get access token
    const phone = genPhone();
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        phone,
        password: 'userTest123',
      });

    accessToken = registerResponse.body.accessToken;
    userId = registerResponse.body.user.id;
    (global as any).USER_TEST_PHONE = phone;
  });

  describe('GET /api/users/me', () => {
    it('should return current user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', userId);
  expect(response.body).toHaveProperty('phone', (global as any).USER_TEST_PHONE);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 401 without authorization header', async () => {
      const response = await request(app).get('/api/users/me');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', 'Bearer invalid_token_here');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PATCH /api/users/me', () => {
    it('should update user profile with valid data', async () => {
      const response = await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          alias: 'TestUser',
          alias_tag: 'test001',
          location_lat: 41.0082,
          location_lon: 28.9784,
          is_active: true,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('alias', 'TestUser');
      expect(response.body).toHaveProperty('alias_tag', 'test001');
      expect(response.body.location_lat).toBeCloseTo(41.0082);
      expect(response.body.location_lon).toBeCloseTo(28.9784);
    });

    it('should return 401 without authorization', async () => {
      const response = await request(app)
        .patch('/api/users/me')
        .send({
          alias: 'UnauthorizedUser',
        });

      expect(response.status).toBe(401);
    });

    it('should partially update user profile', async () => {
      const response = await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          completed: true,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('completed', true);
    });
  });
});
