// 1. Importar os módulos necessários
const express = require('express');
const cors = require('cors');

// 2. Inicializar a aplicação Express
const app = express();
const PORT = 3000; // Porta em que o backend vai rodar

// 3. Configurar os Middlewares
app.use(cors()); // Habilita o CORS para todas as requisições
app.use(express.json()); // Habilita o parser de JSON para ler o corpo das requisições

// 4. Definir a rota principal da nossa API
app.post('/api/v1/calculate-dosage', (req, res) => {
  // Extrai os dados do corpo da requisição
  const { area, cropType } = req.body;

  // --- INÍCIO DAS REGRAS DE NEGÓCIO ---

  // Validação da área (valor limite)
  if (typeof area !== 'number' || area < 1 || area > 1000) {
    return res.status(400).json({ error: 'A área deve ser um número entre 1 e 1000 hectares.' });
  }

  // Validação do tipo de cultura (partição por equivalência)
  if (!cropType || typeof cropType !== 'string') {
    return res.status(400).json({ error: 'O tipo de cultura é obrigatório.' });
  }

  let dosagePerHectare;
  let recommendedProduct;
  const normalizedCropType = cropType.toUpperCase(); // Normaliza para maiúsculas

  switch (normalizedCropType) {
    case 'SOJA':
      recommendedProduct = 'Fertilizante Alpha';
      dosagePerHectare = 10;
      break;
    case 'MILHO':
      recommendedProduct = 'Fertilizante Beta';
      dosagePerHectare = 12.5;
      break;
    case 'TRIGO':
      recommendedProduct = 'Fertilizante Gamma';
      dosagePerHectare = 9;
      break;
    default:
      // Caso a cultura não seja uma das válidas
      return res.status(400).json({ error: `Cultura '${cropType}' não suportada.` });
  }

  // Cálculo final
  const totalDosage = area * dosagePerHectare;

  // --- FIM DAS REGRAS DE NEGÓCIO ---

  // Monta o objeto de resposta de sucesso
  const response = {
    recommendedProduct: recommendedProduct,
    dosagePerHectare: dosagePerHectare,
    totalDosage: totalDosage,
  };

  // Envia a resposta de sucesso
  return res.status(200).json(response);
});

// 5. Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});