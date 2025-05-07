const CEP = require('../models/cepModel');
const viaCepService = require('../services/viaCepService');

class CepController {
  // Buscar todos os CEPs
  async getAllCeps(req, res) {
    try {
      const { favorito } = req.query;
      let query = {};

      if (favorito === 'true') {
        query.favorito = true;
      } else if (favorito === 'false') {
        query.favorito = false;
      }

      const ceps = await CEP.find(query).sort({ createdAt: -1 });
      res.json(ceps);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Buscar um CEP específico
  async getCep(req, res) {
    try {
      const { cep } = req.params;
      const cepData = await CEP.findOne({ cep });

      if (!cepData) {
        return res.status(404).json({ message: 'CEP não encontrado' });
      }

      res.json(cepData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Atualizar logradouro e bairro de um CEP
  async updateCep(req, res) {
    try {
      const { cep } = req.params;
      const { logradouro, bairro } = req.body;

      const updatedCep = await CEP.findOneAndUpdate(
        { cep },
        { logradouro, bairro },
        { new: true }
      );

      if (!updatedCep) {
        return res.status(404).json({ message: 'CEP não encontrado' });
      }

      res.json(updatedCep);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Favoritar/Desfavoritar um CEP
  async toggleFavorito(req, res) {
    try {
      const { cep } = req.params;
      const cepData = await CEP.findOne({ cep });

      if (!cepData) {
        return res.status(404).json({ message: 'CEP não encontrado' });
      }

      cepData.favorito = !cepData.favorito;
      await cepData.save();

      res.json(cepData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async syncCeps(req, res) {
    try {
      const result = await viaCepService.sync();
      res.json({
        message: 'CEPs sincronizados com sucesso',
        count: result.length
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CepController();