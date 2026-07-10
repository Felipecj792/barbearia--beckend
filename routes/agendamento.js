const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');
const auth = require('../middleware/auth');

router.get('/disponibilidade', agendamentoController.getDisponibilidade);

router.use(auth);
router.get('/', agendamentoController.listar);
router.get('/:id', agendamentoController.buscar);
router.post('/', agendamentoController.criar);
router.put('/:id', agendamentoController.atualizar);
router.patch('/:id/status', agendamentoController.atualizarStatus);
router.delete('/:id', agendamentoController.deletar);

module.exports = router;