const mongoose = require('mongoose');

const cepSchema = new mongoose.Schema({
  cep: { type: String, required: true, unique: true },
  logradouro: { type: String, required: true },
  complemento: String,
  unidade: String,
  bairro: { type: String, required: true },
  localidade: { type: String, required: true },
  uf: { type: String, required: true },
  estado: { type: String, required: true },
  regiao: { type: String, required: true },
  ibge: { type: String, required: true },
  gia: String,
  ddd: { type: String, required: true },
  siafi: { type: String, required: true },
  favorito: { type: Boolean, default: false },
}, {
  timestamps: true
});

module.exports = mongoose.model('CEP', cepSchema);