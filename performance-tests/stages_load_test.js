import http from 'k6/http';
import { sleep, check } from 'k6';

// --- 1. Configuração do Teste ---
export const options = {
  // Cenário de teste com "stages" para simular um aumento e diminuição de carga
  stages: [
    { duration: '10s', target: 50 },  // Aumenta de 0 para 50 usuários em 10 segundos
    { duration: '20s', target: 50 },  // Mantém 50 usuários por 20 segundos (carga sustentada)
    { duration: '5s', target: 0 },   // Diminui para 0 usuários em 5 segundos
  ],

  // Limites de aceitação para o teste
  thresholds: {
    // 95% das requisições devem responder em menos de 200ms
    http_req_duration: ['p(95)<200'], 
    // A taxa de erro deve ser menor que 1%
    http_req_failed: ['rate<0.01'], 
  },
};

const cropTypes = ['SOJA', 'MILHO', 'TRIGO'];

// --- 2. O Teste em Si (código que cada usuário virtual executa) ---
export default function () {
  const url = 'http://localhost:3000/api/v1/calculate-dosage';

  // --- GERAÇÃO DE DADOS ALEATÓRIOS ---
  // Gera uma área aleatória entre 1 e 1000
  const randomArea = Math.floor(Math.random() * 1000) + 1;
  // Escolhe uma cultura aleatória do nosso array
  const randomCrop = cropTypes[Math.floor(Math.random() * cropTypes.length)];
  // --- FIM DA GERAÇÃO DE DADOS ---

  const payload = JSON.stringify({
    area: randomArea,
    cropType: randomCrop,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Envia a requisição POST para a nossa API
  const res = http.post(url, payload, params);

  // --- 3. Verificações (Checks) ---
  check(res, {
    'status da requisição é 200': (r) => r.status === 200,
    'resposta contém a propriedade totalDosage': (r) => r.json('totalDosage') !== undefined,
  });

  // Pausa de 500ms para simular o "think time" do usuário antes da próxima ação
  sleep(0.5); 
}