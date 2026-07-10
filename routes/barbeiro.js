const express = require('express');
const router = express.Router();
const barbeiroController = require('../controllers/barbeiroController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', barbeiroController.listar);
router.get('/:id', barbeiroController.buscar);
router.post('/', barbeiroController.criar);
router.put('/:id', barbeiroController.atualizar);
router.delete('/:id', barbeiroController.deletar);
router.post('/:id/login', barbeiroController.login);

module.exports = router;