import mssql from 'mssql'

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



const sql = mssql;

//TODO: as o objeto sqlConfig é a configuração que fornece acesso ao sql
const sqlConfig = {
  user: 'sa',
  password: 'Pereira1nz!',
  database: 'cowlabs_db',
  server: "localhost",
  options: {
    encrypt: false, 
    trustServerCertificate: true,
  },
}

let pool; // essa variável armazena a conexao com o banco

let con = async function conectar() {
  try { // o try tenta estabelecer a conexao e se não der certo o catch retorna o erro
    pool = await sql.connect(sqlConfig);
    console.log("Tentando conectar ao banco...");
    return pool // o pool tem que ser retornado para que funcione lá no arquivo server, assim retornando a conexao
  } catch (err) {
    console.error("Erro ao conectar:", err.message);
  }
}

export default con; // exportando para ser utilizado no arquivo server