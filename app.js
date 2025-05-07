require('dotenv').config();
const events = require('events');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cepRoutes = require('./src/routes/cepRoutes');
const viaCepService = require('./src/services/viaCepService');
const CEP = require('./src/models/cepModel');
const setupSwagger = require('./src/swagger');

events.EventEmitter.defaultMaxListeners = 15;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/ceps', cepRoutes);
setupSwagger(app);

async function syncCeps() {
  try {
    console.log('Iniciando sincronização com a API ViaCEP...');

    // 1. Limpar a coleção
    await CEP.deleteMany({});
    console.log('Coleção CEP limpa');

    // 2. Buscar dados da API
    const cepsFromApi = await viaCepService.sync();
    console.log(`Dados recebidos da API: ${cepsFromApi.length} CEPs`);

    // 3. Inserir no MongoDB
    await CEP.insertMany(cepsFromApi);
    console.log('Dados sincronizados com o MongoDB');

    // 4. Opcional: Agendar sincronização periódica (ex.: a cada 24h)
    // setInterval(syncCeps, 24 * 60 * 60 * 1000);
  } catch (error) {
    console.error('Erro durante a sincronização:', error);
  }
}

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
.then(async () => {
  console.log('Conectado ao MongoDB');
  await syncCeps();
  app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
  });
})
.catch(err => {
  console.error('Erro ao conectar ao MongoDB:', err);
  process.exit(1);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('Erro não tratado:', err);
});


module.exports = app;