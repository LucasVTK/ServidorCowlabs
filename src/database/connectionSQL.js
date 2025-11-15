import mssql from 'mssql'

const configSql = {
    user: 'sa',
    password: 'unifoa',
    database: 'cowlabs',
    server: 'LAPTOP-KQGD4KF5\\SQLEXPRESS',
    options: {
        encrypt: false, 
        trustServerCertificate: false 
        }
}

export async function connect () {
    const conn = await mssql.connect(configSql)
    return conn
}