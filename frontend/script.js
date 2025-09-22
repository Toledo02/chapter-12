// Aguarda o conteúdo da página ser totalmente carregado
document.addEventListener('DOMContentLoaded', () => {
  // Pega as referências dos elementos do HTML
  const form = document.getElementById('dosage-form');
  const areaInput = document.getElementById('area-input');
  const cropSelect = document.getElementById('crop-select');
  const resultContainer = document.getElementById('result-container');

  // Adiciona um "escutador" para o evento de submit do formulário
  form.addEventListener('submit', async (event) => {
    // Previne o comportamento padrão do formulário (que é recarregar a página)
    event.preventDefault();

    // Pega os valores dos campos
    const area = parseFloat(areaInput.value);
    const cropType = cropSelect.value;

    // Monta o objeto que será enviado para o backend
    const requestBody = {
      area,
      cropType
    };

    try {
      // Faz a requisição para a API do backend usando fetch
      const response = await fetch('http://localhost:3000/api/v1/calculate-dosage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      // Converte a resposta em JSON
      const data = await response.json();

      if (response.ok) { // Verifica se a resposta foi um sucesso (status 2xx)
        console.log('Objeto recebido no frontend:', data);
        displaySuccess(data);
      } else { // Se não foi sucesso, trata como erro
        displayError(data.error);
      }
    } catch (error) {
      // Captura erros de rede (ex: backend fora do ar)
      displayError('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
    }
  });

  function displaySuccess(data) {
    resultContainer.className = 'success'; // Remove classes antigas e adiciona a de sucesso
    resultContainer.innerHTML = `
      <strong>Cálculo Realizado com Sucesso!</strong><br>
      Produto Recomendado: ${data.recommendedProduct}<br>
      Dosagem Total: ${data.totalDosage} litros
    `;
    resultContainer.classList.remove('hidden');
  }

  function displayError(message) {
    resultContainer.className = 'error'; // Remove classes antigas e adiciona a de erro
    resultContainer.innerHTML = `<strong>Erro:</strong> ${message}`;
    resultContainer.classList.remove('hidden');
  }
});