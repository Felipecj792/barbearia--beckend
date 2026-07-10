const Barbeiro = require('../models/Barbeiro');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.listar = async (req, res) => {
  try {
    const barbeiros = await Barbeiro.findAll({
      where: { ativo: true }
    });
    res.json(barbeiros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.buscar = async (req, res) => {
  try {
    const { id } = req.params;
    const barbeiro = await Barbeiro.findByPk(id);
    
    if (!barbeiro) {
      return res.status(404).json({ error: 'Barbeiro não encontrado' });
    }
    
    res.json(barbeiro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const { nome, email, telefone, especialidade, horario_inicio, horario_fim, comissao_percentual, senha } = req.body;
    
    const senhaHash = await bcrypt.hash(senha, 10);
    
    const barbeiro = await Barbeiro.create({
      nome,
      email,
      telefone,
      especialidade,
      horario_inicio,
      horario_fim,
      comissao_percentual,
      senha: senhaHash
    });

    res.status(201).json(barbeiro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, especialidade, horario_inicio, horario_fim, comissao_percentual, ativo } = req.body;

    const barbeiro = await Barbeiro.findByPk(id);
    if (!barbeiro) {
      return res.status(404).json({ error: 'Barbeiro não encontrado' });
    }

    await barbeiro.update({
      nome,
      email,
      telefone,
      especialidade,
      horario_inicio,
      horario_fim,
      comissao_percentual,
      ativo
    });

    res.json(barbeiro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;
    const barbeiro = await Barbeiro.findByPk(id);
    
    if (!barbeiro) {
      return res.status(404).json({ error: 'Barbeiro não encontrado' });
    }

    barbeiro.ativo = false;
    await barbeiro.save();
    res.json({ message: 'Barbeiro desativado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    const barbeiro = await Barbeiro.findOne({ where: { email } });
    if (!barbeiro) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(senha, barbeiro.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: barbeiro.id, email: barbeiro.email },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '7d' }
    );

    res.json({ token, barbeiro: { id: barbeiro.id, nome: barbeiro.nome, email: barbeiro.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};