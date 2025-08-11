const request = require('supertest');
const app = require('../../../src/app');
const { execSync } = require('child_process');

describe('Auth API', () => {
   let accessToken;
   let refreshToken;

   beforeAll(async () => {
      execSync('cross-env NODE_ENV=test sequelize-cli db:migrate:undo:all');
      execSync('npm run migrate:test');
      execSync('npm run seed:test');
      console.log('Database reset and seeded');
   });

   it('Login thành công acc root: 200', async () => {
      const response = await request(app)
         .post('/api/v1/auth/login')
         .send({
            email: 'root@example.com',
            password: '123456@'
         });

      accessToken = response.body.data.accessToken;
      refreshToken = response.headers['set-cookie'][0].split(';')[0].split('=')[1];
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login successfully');
      expect(response.body).toHaveProperty('data', {
         accessToken: expect.any(String),
         user: expect.any(Object)
      });
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('refreshToken');
   });

   it('Lỗi login: 400', async () => {
      const response = await request(app)
         .post('/api/v1/auth/login')
         .send({
            email: 'root@example.com',
            password: '123456Aa@'
         });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('status', "error");
   });

   it('Refresh token thành công: 200', async () => {
      const response = await request(app)
         .post('/api/v1/auth/refresh-token')
         .set('Cookie', `refreshToken=${refreshToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Refresh token successfully');
      expect(response.body).toHaveProperty('data', {
         accessToken: expect.any(String)
      });
   });

   it('Đổi mật khẩu thành công: 200', async () => {
      const response = await request(app)
         .post('/api/v1/auth/change-password')
         .set('Authorization', `Bearer ${accessToken}`)
         .send({
            currentPassword: '123456@',
            newPassword: '123456Aa@'
         });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Change password successfully');
   });

   it('Lỗi đổi mật khẩu: 400', async () => {
      const response = await request(app)
         .post('/api/v1/auth/change-password')
         .set('Authorization', `Bearer ${accessToken}`)
         .send({
            currentPassword: '123456@',
            newPassword: '123456@'
         });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('status', "error");
   });

   it('Logout thành công: 200', async () => {
      const response = await request(app)
         .post('/api/v1/auth/logout')
         .set('Cookie', `refreshToken=${refreshToken}`)
         .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Logout successfully');
   });

});
