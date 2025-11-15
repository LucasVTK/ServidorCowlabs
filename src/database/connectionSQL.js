import mssql from 'mssql'

const configSql = {
    user: 'sa',
    password: 'unifoa',
    database: 'BDJOGOS',
    server: 'TPCP04LAB1000\\SQLEXPRESS',
    options: {
        encrypt: false, 
        trustServerCertificate: false 
        }
}

export async function connect () {
    const conn = await mssql.connect(configSql)
    return conn
}