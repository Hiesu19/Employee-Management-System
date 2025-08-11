const request = require('supertest');
const app = require('../../../src/app');
const { execSync } = require('child_process');

describe('Root API - Request', () => {
    let accessToken;
    let refreshToken;
    let requestId1; 
    let requestId2;

    beforeAll(async () => {
        execSync('cross-env NODE_ENV=test sequelize-cli db:migrate:undo:all');
        execSync('npm run migrate:test');
        execSync('npm run seed:test');
    });

    it('Login thành công: 200', async () => {
        const response = await request(app).post('/api/v1/auth/login').send({
            email: 'root@example.com',
            password: '123456@'
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Login successfully');
        expect(response.body).toHaveProperty('data', {
            accessToken: expect.any(String),
            user: expect.any(Object)
        });
        accessToken = response.body.data.accessToken;
        refreshToken = response.headers['set-cookie'][0].split(';')[0].split('=')[1];
    });

    it("Lấy danh sách yêu cầu: 200", async () => {
        const response = await request(app).get('/api/v1/root/request')
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Get all request by root successfully');
        expect(response.body).toHaveProperty('data', expect.any(Object));
        expect(response.body.data).toHaveProperty('requests', expect.any(Array));
        expect(response.body.data).toHaveProperty('count', expect.any(Number));
        requestId1 = response.body.data.requests[0].id;
        requestId2 = response.body.data.requests[1].id;
    });

    it("Lấy tổng số yêu cầu: 200", async () => {
        const response = await request(app).get('/api/v1/root/request/total')
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).toBe(200);
    });

    it("Cập nhật trạng thái yêu cầu -Đồng ý: 200", async () => {
        const response = await request(app).put(`/api/v1/root/request/${requestId1}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                status: 'approved'
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Edit status request successfully');
    });

    it("Cập nhật trạng thái yêu cầu -Từ chối: 200", async () => {
        const response = await request(app).put(`/api/v1/root/request/${requestId2}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                status: 'rejected',
                reasonReject: "A không cho nghỉ đâu cu"
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Edit status request successfully');
    });
    
})