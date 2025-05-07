const express = require('express');
const router = express.Router();
const cepController = require('../controllers/cepController');

/**
 * @swagger
 * tags:
 *   name: CEPs
 *   description: Gerenciamento de endereços por CEP
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CEP:
 *       type: object
 *       properties:
 *         cep:
 *           type: string
 *           example: "91420-270"
 *         logradouro:
 *           type: string
 *           example: "Rua São Domingos"
 *         complemento:
 *           type: string
 *           example: ""
 *         bairro:
 *           type: string
 *           example: "Bom Jesus"
 *         localidade:
 *           type: string
 *           example: "Porto Alegre"
 *         uf:
 *           type: string
 *           example: "RS"
 *         estado:
 *           type: string
 *           example: "Rio Grande do Sul"
 *         regiao:
 *           type: string
 *           example: "Sul"
 *         ibge:
 *           type: string
 *           example: "4314902"
 *         ddd:
 *           type: string
 *           example: "51"
 *         siafi:
 *           type: string
 *           example: "8801"
 *         favorito:
 *           type: boolean
 *           example: false
 */

/**
 * @swagger
 * /api/ceps:
 *   get:
 *     summary: Lista todos os CEPs
 *     tags: [CEPs]
 *     parameters:
 *       - in: query
 *         name: favorito
 *         schema:
 *           type: boolean
 *         description: Filtrar por favoritos (true/false)
 *     responses:
 *       200:
 *         description: Lista de CEPs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CEP'
 *       500:
 *         description: Erro no servidor
 */
router.get('/', cepController.getAllCeps);

/**
 * @swagger
 * /api/ceps/{cep}:
 *   get:
 *     summary: Busca um CEP específico
 *     tags: [CEPs]
 *     parameters:
 *       - in: path
 *         name: cep
 *         required: true
 *         schema:
 *           type: string
 *         description: CEP no formato 99999-999
 *     responses:
 *       200:
 *         description: Dados do CEP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CEP'
 *       404:
 *         description: CEP não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.get('/:cep', cepController.getCep);

/**
 * @swagger
 * /api/ceps/{cep}:
 *   put:
 *     summary: Atualiza logradouro e bairro de um CEP
 *     tags: [CEPs]
 *     parameters:
 *       - in: path
 *         name: cep
 *         required: true
 *         schema:
 *           type: string
 *         description: CEP no formato 99999-999
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               logradouro:
 *                 type: string
 *                 example: "Nova Rua São Domingos"
 *               bairro:
 *                 type: string
 *                 example: "Novo Bairro"
 *             required:
 *               - logradouro
 *               - bairro
 *     responses:
 *       200:
 *         description: CEP atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CEP'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: CEP não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.put('/:cep', cepController.updateCep);

/**
 * @swagger
 * /api/ceps/{cep}/favorito:
 *   patch:
 *     summary: Favorita/Desfavorita um CEP
 *     tags: [CEPs]
 *     parameters:
 *       - in: path
 *         name: cep
 *         required: true
 *         schema:
 *           type: string
 *         description: CEP no formato 99999-999
 *     responses:
 *       200:
 *         description: Status de favorito alterado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CEP'
 *       404:
 *         description: CEP não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.patch('/:cep/favorito', cepController.toggleFavorito);

/**
 * @swagger
 * /api/ceps/sync:
 *   post:
 *     summary: Sincroniza CEPs com a API ViaCEP (restaura dados originais)
 *     tags: [CEPs]
 *     responses:
 *       200:
 *         description: Sincronização concluída
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "CEPs sincronizados com sucesso"
 *                 count:
 *                   type: integer
 *                   example: 16
 *       500:
 *         description: Erro na sincronização
 */
router.post('/sync', cepController.syncCeps);

module.exports = router;