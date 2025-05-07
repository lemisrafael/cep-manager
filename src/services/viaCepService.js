const axios = require('axios');

class ViaCepService {
  constructor() {
    this.baseUrl = 'https://viacep.com.br/ws';
    this.axiosInstance = axios.create({ timeout: 5000 });
  }

  async sync() {
    try {
      const response = await axios.get(`${this.baseUrl}/RS/Porto%20Alegre/Domingos/json/`);

      // Mapear os dados para o nosso formato
      return response.data.map(cep => ({
        cep: cep.cep,
        logradouro: cep.logradouro,
        complemento: cep.complemento,
        bairro: cep.bairro,
        localidade: cep.localidade,
        uf: cep.uf,
        estado: cep.estado,
        regiao: cep.regiao,
        ibge: cep.ibge,
        gia: cep.gia || '',
        ddd: cep.ddd,
        siafi: cep.siafi,
        favorito: false
      }));
    } catch (error) {
      console.error('Erro ao buscar CEPs:', error);
      throw error;
    }
  }
}

module.exports = new ViaCepService();