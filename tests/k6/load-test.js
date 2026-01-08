
/* eslint-disable */
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 50 },  // Ramp up to 50 users
        { duration: '1m', target: 300 },  // Ramp up to 300 users (Goal)
        { duration: '3m', target: 300 },  // Stay at 300 users
        { duration: '1m', target: 0 },    // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2s
        http_req_failed: ['rate<0.01'],    // http errors should be less than 1%
    },
};

export default function () {
    const res = http.get('http://localhost:3000');
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
}
