import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1000,
    duration: '10s',
};

export default function () {
    const payload = JSON.stringify({
        email: 'root@example.com',
        password: '123456@S'
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const res = http.post('http://host.docker.internal:8001/api/v1/auth/login', payload, params);
    check(res, {
        'status is 200': (r) => r.status === 200,
        'status is 400': (r) => r.status === 400,
        'response time is less than 200ms': (r) => r.timings.duration < 200,
    });

    sleep(1);
}