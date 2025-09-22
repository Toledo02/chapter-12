import http from 'k6/http';
import { sleep, check } from 'k6';

// --- 1. Configuração do Teste Simples ---
export const options = {
  vus: 10,
  duration: '10s',
  thresholds: {
    http_req_duration: ['p(95)<200'],
    http_req_failed: ['rate<0.01'],
  },
};

const cropTypes = ['SOJA', 'MILHO', 'TRIGO'];

// --- 2. O Teste em Si ---
export default function () {
  const url = 'http://localhost:3000/api/v1/calculate-dosage';

  const randomArea = Math.floor(Math.random() * 1000) + 1;
  const randomCrop = cropTypes[Math.floor(Math.random() * cropTypes.length)];

  const payload = JSON.stringify({
    area: randomArea,
    cropType: randomCrop,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  // --- 3. Verificações (Checks) ---
  check(res, {
    'status da requisição é 200': (r) => r.status === 200,
    'resposta contém a propriedade totalDosage': (r) => r.json('totalDosage') !== undefined,
  });

  // Pausa de 1 segundo entre as requisições de um mesmo VU
  sleep(1);
}