import mssql from 'mssql'
import dotenv from 'dotenv'

const sql = mssql;
dotenv.config();

//TODO: as o objeto sqlConfig é a configuração que fornece acesso ao sql
const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  server: process.env.DB_SERVER,
  options: {
    encrypt: true, 
    trustServerCertificate: false,
  },
}

let pool; // essa variável global armazena a conexao com o banco

// Função para conectar ao banco
async function conectar() {
  try {

    //evita criar várias conexões
    if (pool) {
      return pool;
    }
    console.log("BD conectando...");
   
    pool = await mssql.connect(sqlConfig); // cria conexão
    console.log("BD conectado ");

    return pool;

  } catch (err) {
    console.error("Erro ao conectar:", err.message);
    throw err; //faz o erro subir pro server.js

  }
}

export default conectar;


// let con = async function conectar() {
//   try { // o try tenta estabelecer a conexao e se não der certo o catch retorna o erro
//     pool = await sql.connect(sqlConfig);
//     console.log("Tentando conectar ao banco...");
//     return pool // o pool tem que ser retornado para que funcione lá no arquivo server, assim retornando a conexao
//   } catch (err) {
//     console.error("Erro ao conectar:", err.message);
//   }
// }

// export default con; // exportando para ser utilizado no arquivo server







//! functions abaixo era o modo antigo de acessar o banco
//! const configSql = {
//!     user: 'sa',
//!     password: 'Pereira1nz!',
//!     database: 'cowlabs_db',
//!     server: 'localhost',
//!     options: {
//!         encrypt: false, 
//!         trustServerCertificate: true 
//!         }
//! }
//! 
//! export async function connect () {
//!     const conn = await mssql.connect(configSql)
//!     return conn
//! }