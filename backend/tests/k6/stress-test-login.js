import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 500},  
    { duration: '10s', target: 10000},
    { duration: '10s', target: 10000},  
    { duration: '10s', target: 0 },  
  ],
};

export default function () {
  const url = 'http://host.docker.internal:8001/api/v1/auth/login';
  const payload = JSON.stringify({
    email: 'test@example.com',
    password: '123456',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'status is 400': (r) => r.status === 400,
    'response time < 100ms': (r) => r.timings.duration < 100,
  });

  sleep(1);
}
