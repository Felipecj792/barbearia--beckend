const jwt = require('jsonwebtoken');
const Barbeiro = require('../models/Barbeiro');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    const barbeiro = await Barbeiro.findByPk(decoded.id);

    if (!barbeiro) {
      throw new Error();
    }

    req.barbeiro = barbeiro;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Não autorizado' });
  }
};

module.exports = auth;
