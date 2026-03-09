import mssql from 'mssql'

// const configSql = {
//     user: 'sa',
//     password: 'Pereira1nz!',
//     database: 'cowlabs_db',
//     server: 'localhost',
//     options: {
//         encrypt: false, 
//         trustServerCertificate: true 
//         }
// }

// export async function connect () {
//     const conn = await mssql.connect(configSql)
//     return conn
// }


const sql = mssql;

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

let pool;

let con = async function conectar() {
  try {
    pool = await sql.connect(sqlConfig);
    console.log("Tentando conectar ao banco...");
    return pool
  } catch (err) {
    console.error("Erro ao conectar:", err.message);
  }
}

export default con;