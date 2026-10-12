import express from 'express'
import database from './database.js'

const app = express();

app.use(express.json());

// CREATE - Adicionar candidato
app.post('/criarCandidato/', (req, res) => {
  const { nome, email, telefone, endereco, formacao, experiencia, area } = req.body;

  if (!nome || !email || !telefone || !endereco || !formacao || !experiencia || !area) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }5

  const sqlVerificar = `
    SELECT id_candidato 
    FROM candidatos 
    WHERE email_candidato = ? OR telefone_candidato = ?
  `;

  database.query(sqlVerificar, [email, telefone], (erro, resultado) => {
    if (erro) {
      console.error('Erro ao verificar candidato:', erro.message);
      return res.status(500).json({ error: 'Erro interno ao verificar candidato' });
    }

    if (resultado.length > 0) {
      return res.status(400).json({ error: 'Telefone ou email já cadastrado' });
    }

    const sql = `
      INSERT INTO candidatos 
      (nome_candidato, email_candidato, telefone_candidato, endereco_candidato, formacao_candidato, experiencia_candidato, area_candidato) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    database.query(sql, [nome, email, telefone, endereco, formacao, experiencia, area], (erro, result) => {
      if (erro) {
        console.error('Erro ao inserir candidato:', erro.message);
        return res.status(500).json({ error: 'Erro interno ao cadastrar candidato' });
      }

      return res.status(201).json({
        message: 'Candidato criado com sucesso',
        id: result.insertId
      });
    });
  });
});

// READ - Listar todos candidato
app.get('/listarCandidato/', (req, res) => {
  database.query('SELECT * FROM candidatos', (erro, results) => {
    if (erro) {
      console.error('Erro ao buscar candidato:', erro.message);
      return res.status(500).json({ error: 'Erro interno'});
    }
    res.json(results);
  });
});

// READ - Buscar usuário por ID
app.get('/candidatos/:id_candidato', (req, res) => {
  const { id_candidato } = req.params;
  database.query('SELECT * FROM candidatos WHERE id_candidato = ?', [id_candidato], (erro, results) => {
    if (erro) {
      console.error('Erro ao buscar Candidato:', erro.message);
      return res.status(500).json({ error: 'Erro interno' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Candidato não encontrado'});
    }
    res.json(results[0]);
  });
});

// Read - Pesquisa por nome
app.get('/buscarNome/:nome_candidato', (req, res) => {
  const { nome_candidato } = req.params;

  const termoBusca = `%${nome_candidato}%`;

  database.query('SELECT * FROM candidatos WHERE nome_candidato LIKE ?', [termoBusca], (erro, results) => {
    if (erro) {
      console.error('Erro ao buscar Candidato:', erro.message);
      return res.status(500).json({ error: 'Erro interno' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Candidato não encontrado'});
    }
    
    res.json(results);
  });
});

//Read - Pesquisa por área
app.get('/buscaArea/:area_candidato', (req, res) => {
  const { area_candidato } = req.params;

  const termoBusca = `%${area_candidato}%`;

  database.query('SELECT * FROM candidatos WHERE area_candidato LIKE ?', [termoBusca], (erro, results) => {
    if (erro) {
      console.error('Erro ao buscar Candidato:', erro.message);
      return res.status(500).json({ error: 'Erro interno' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Candidato não encontrado'});
    }
    
    res.json(results);
  });
});

// UPDATE - Atualizar candidato
app.put('/atualizarCandidato/:id_candidato', (req, res) => {
  const { id_candidato } = req.params;
  const { email, endereco } = req.body;
 
  if ( !email || !endereco) {
    return res.status(400).json({ error: 'Nome, email e endereço são obrigatórios' , erro });
  }

  const sql = 'UPDATE candidatos SET email_candidato = ?, endereco_candidato = ? WHERE id_candidato = ?';
  database.query(sql, [ email, endereco, id_candidato], (erro, result) => {

    if (erro) {
      console.error('Erro ao atualizar Candidato:', erro.message);
      return res.status(500).json({ error: 'Erro interno', erro});
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Candidato não encontrado'});
    }
    res.json({ message: 'Candidato atualizado' });
  });
});

// DELETE - Remover candidato
app.delete('/deletarCandidato/:id_candidato', (req, res) => {
  const { id_candidato } = req.params;
  database.query('DELETE FROM candidatos WHERE id_candidato = ?', [id_candidato], (erro, result) => {
    if (erro) {
      console.error('Erro ao deletar Candidato:', erro.message);
      return res.status(500).json({ error: 'Erro interno'});
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Candidato não encontrado'});
    }
    res.json({ message: 'Candidato deletado' });
  });
});

// Inicia servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});