const request = require('supertest');
const app = require('../../../src/app');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

describe('Root API - Nhân viên', () => {
    let accessToken;
    let refreshToken;
    let employeeId;
    let emailArray = ["user105", "user101", "user102", "user103", "user104"];

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

    it("Lây toàn bộ user: 200", async () => {
        const response = await request(app).get('/api/v1/root/employee').set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Get all employee info successfully');
        expect(response.body).toHaveProperty('data', expect.any(Object));
        expect(response.body.data).toHaveProperty('employees', expect.any(Array));
        employeeId = response.body.data.employees[0].userID;
    });

    it("Lấy thông tin nhân viên: 200", async () => {
        const response = await request(app).get(`/api/v1/root/employee/${employeeId}`).set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Get employee info successfully');
        expect(response.body).toHaveProperty('data', expect.any(Object));
        expect(response.body.data).toHaveProperty('userID', expect.any(String));
        expect(response.body.data).toHaveProperty('fullName', expect.any(String));
        expect(response.body.data).toHaveProperty('email', expect.any(String));
        expect(response.body.data).toHaveProperty('phone', expect.any(String));
        expect(response.body.data).toHaveProperty('role', expect.any(String));
        expect(response.body.data).toHaveProperty('avatarURL');
        expect(response.body.data.avatarURL === null || typeof response.body.data.avatarURL === 'string').toBe(true);
        expect(response.body.data).toHaveProperty('createdAt', expect.any(String));
        expect(response.body.data).toHaveProperty('updatedAt', expect.any(String));
        expect(response.body.data).toHaveProperty('departmentName');
        expect(response.body.data).toHaveProperty('departmentID');
    });

    it("Cập nhật thông tin nhân viên: 200", async () => {
        const response = await request(app).put(`/api/v1/root/employee/${employeeId}`)
            .set('Authorization', `Bearer ${accessToken}`).send({
                fullName: 'Nguyen Van Aaa',
                phone: '0909090909'
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Update employee info successfully');
    });

    it("Cập nhật ảnh đại diện nhân viên: 200", async () => {
        const tempImagePath = path.join(__dirname, 'temp-avatar.jpg');
        fs.writeFileSync(tempImagePath, Buffer.from([0xFF, 0xD8, 0xFF, 0xD9]));
        const response = await request(app).post(`/api/v1/root/employee/${employeeId}/avatar`)
            .set('Authorization', `Bearer ${accessToken}`)
            .attach('avatar', tempImagePath);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Update employee avatar successfully');
    });

    it("Reset mật khẩu nhân viên: 200", async () => {
        const response = await request(app).put(`/api/v1/root/employee/reset-password`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                employeeIDArray: emailArray
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Reset password successfully');
        expect(response.body).toHaveProperty('data', expect.any(Object));
        expect(response.body.data).toHaveProperty('message', expect.any(String));
        expect(response.body.data).toHaveProperty('emailArraySuccess', expect.any(Array));
        expect(response.body.data).toHaveProperty('idArrayFailed', expect.any(Array));

        expect(response.body.data.emailArraySuccess.length).toBe(emailArray.length);
        expect(response.body.data.idArrayFailed.length).toBe(0);
    });

    it("Đổi phòng ban nhân viên: 200", async () => {
        const response = await request(app).put(`/api/v1/root/employee/change-department`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                employeeID: 'user100',
                departmentID: '2'
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Change department successfully');
        expect(response.body).toHaveProperty('data', expect.any(Object));
        expect(response.body.data).toHaveProperty('userID', expect.any(String));
        expect(response.body.data).toHaveProperty('departmentID', '2');
    });

    it("Đổi vai trò nhân viên: 200", async () => {
        const response = await request(app).put(`/api/v1/root/employee/change-role`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                employeeID: 'user100',
                role: 'manager'
            });;
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('data', expect.any(Object));
        expect(response.body.data).toHaveProperty('userID', expect.any(String));
        expect(response.body.data).toHaveProperty('role', 'manager');
    });

    it("Xóa nhân viên: 200", async () => {
        const response = await request(app).delete(`/api/v1/root/employee/${employeeId}`)
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Delete employee successfully');
    });


})