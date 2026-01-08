
/* eslint-disable */
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '10s', target: 20 },
        { duration: '30s', target: 300 }, // Spike to 300 fast
        { duration: '1m', target: 300 },
        { duration: '10s', target: 0 },
    ],
};

export default function () {
    const res = http.get('http://localhost:3000');
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
}
