import mysql from 'mysql2';
import 'dotenv/config';

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

connection.connect((erro) => {
  if (erro) {
    console.error('Erro ao conectar com DB:', erro.message);
    return;
  }
  console.log("📦 Conectado ao MySQL com sucesso!");
});

export default connection;