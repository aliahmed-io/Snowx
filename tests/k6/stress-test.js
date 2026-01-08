
/* eslint-disable */
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '1m', target: 100 },
        { duration: '2m', target: 300 },
        { duration: '2m', target: 500 }, // Push beyond goal
        { duration: '1m', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<3000'],
    },
};

export default function () {
    const res = http.get('http://localhost:3000');
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
}
