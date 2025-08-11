const request = require('supertest');
const app = require('../../../src/app');
const { execSync } = require('child_process');

describe('Root API - Department', () => {
    let accessToken;
    let refreshToken;
    let departmentId = "1";

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

    it("Tạo phòng ban: 200", async () => {
        const response = await request(app).post('/api/v1/departments/add-department')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                "departmentName": "DE",
                "description": "To và dep"
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Create department successfully');
        expect(response.body).toHaveProperty('data', expect.any(Object));
        expect(response.body.data).toHaveProperty('departmentID', expect.any(String));
        expect(response.body.data).toHaveProperty('departmentName', 'DE');
        expect(response.body.data).toHaveProperty('description', 'To và dep');
    });

    it("Lấy danh sách phòng ban: 200", async () => {
        const response = await request(app).get('/api/v1/departments?all=true')
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Get departments successfully');
        expect(response.body).toHaveProperty('data', expect.any(Array));
        departmentId = response.body.data[0].departmentID;
    });

    it("Lấy chi tiết phòng ban: 200", async () => {
        const response = await request(app).get(`/api/v1/departments/${departmentId}`)
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Get department details successfully');
        expect(response.body).toHaveProperty('data', expect.any(Object));
        expect(response.body.data).toHaveProperty('departmentID', departmentId);
        expect(response.body.data).toHaveProperty('departmentName');
        expect(response.body.data).toHaveProperty('description');
        expect(response.body.data).toHaveProperty('countEmployees');
        expect(response.body.data).toHaveProperty('managers', expect.any(Array));
        expect(response.body.data).toHaveProperty('employees', expect.any(Array));
    });

    it("Xóa phòng ban: 200", async () => {
        const response = await request(app).delete(`/api/v1/departments/${departmentId}`)
            .set('Authorization', `Bearer ${accessToken}`)
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Delete department successfully');
        expect(response.body).toHaveProperty('data', expect.any(Object));
    });
})