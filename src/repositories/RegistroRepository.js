import con from "../database/connectionSQL.js";
import sqltype from "mssql";

import pkg from 'mssql';
const { VarChar } = pkg;

const UserRepository = {
  async readAll() {
    const conn = await con();
    const { recordset } = await conn.query(
      `select user_id, 
              user_name,
              user_real_name, 
              user_email, 
              user_tipo 
        from tb_user`,
    );
    return recordset;
  },

  async readById(id) {
    const conn = await con();
    const { recordset } = await conn
      .request()
      .input("user_id", sqltype.Int, id)
      .query(
        `select 
          user_id,
          user_name,
          user_real_name,
          user_email,
          user_tipo 
        from tb_user 
        where user_id=@user_id`,
      );
    return recordset;
  },

  async readUser(user_email) {
    const sql = await con();

    const { recordset } = await sql
      .request()
      .input("user_email", sqltype.VarChar(100), user_email)
      .query(`select * from tb_user where user_email=@user_email`);

          // console.log('Recordset:', recordset)
          // console.log('Email buscado:', user_email) 

    if (recordset.length > 0) {
        return recordset[0]
    }
    return null;
  },

  async create(model) {
    const conn = await con();
    console.log("Repository");
    const sql = `
        INSERT INTO tb_user (
            user_name, 
            user_real_name, 
            user_cpf, 
            user_email, 
            user_senha,
            user_tipo, 
            user_endereco, 
            user_num, 
            user_complemento,
            user_bairro, 
            user_cidade, 
            user_uf, 
            user_cep
            ) 
        VALUES(
            @user_name, 
            @user_real_name,
            @user_cpf,
            @user_email,
            @user_senha,
            @user_tipo,
            @user_endereco,
            @user_num,
            @user_complemento,
            @user_bairro,
            @user_cidade,
            @user_uf,
            @user_cep
            )
        `;

    const respDB = await conn
      .request()
      .input("user_name", sqltype.VarChar(100), model.user_name)
      .input("user_real_name", sqltype.VarChar(250), model.user_real_name)
      .input("user_cpf", sqltype.VarChar(11), model.user_cpf)
      .input("user_email", sqltype.VarChar(100), model.user_email)
      .input("user_senha", sqltype.VarChar(128), model.user_senha)
      .input("user_tipo", sqltype.VarChar(10), model.user_tipo)
      .input("user_endereco", sqltype.VarChar(200), model.user_endereco)
      .input("user_num", sqltype.VarChar(5), model.user_num)
      .input("user_complemento", sqltype.VarChar(100), model.user_complemento)
      .input("user_bairro", sqltype.VarChar(45), model.user_bairro)
      .input("user_cidade", sqltype.VarChar(45), model.user_cidade)
      .input("user_uf", sqltype.VarChar(2), model.user_uf)
      .input("user_cep", sqltype.VarChar(8), model.user_cep)
      .query(sql);

    return respDB;
  },

  async update(id, model) {
    //encarando que ja foram validadas pelo middleware

    const conn = await con();
    const sql = `
            update tb_user 
            set user_name = @user_name,
              user_real_name = @user_real_name,
              user_email=@user_email,
              user_senha= @user_senha,
              user_endereco=@user_endereco,
              user_num= @user_num,
              user_complemento=@user_complemento,
              user_bairro=@user_bairro,
              user_cidade=@user_cidade,
              user_uf=@user_uf,
              user_cep=@user_cep
            where user_id=@user_id
              `;

    console.log(model.user_senha);
    const respDB = await conn
      .request()
      .input("user_name", sqltype.VarChar(100), model.user_name)
      .input("user_real_name", sqltype.VarChar(250), model.user_real_name)
      .input("user_email", sqltype.VarChar(100), model.user_email)
      .input("user_senha", sqltype.VarChar(128), model.user_senha)
      .input("user_endereco", sqltype.VarChar(200), model.user_endereco)
      .input("user_num", sqltype.VarChar(5), model.user_num)
      .input("user_complemento", sqltype.VarChar(100), model.user_complemento)
      .input("user_bairro", sqltype.VarChar(45), model.user_bairro)
      .input("user_cidade", sqltype.VarChar(45), model.user_cidade)
      .input("user_uf", sqltype.VarChar(2), model.user_uf)
      .input("user_cep", sqltype.VarChar(8), model.user_cep)
      .input("user_uf", sqltype.VarChar(2), model.user_uf)

      .query(sql);

    return respDB;
  },
  async updatePassword(user_id, user_senha) {
    const conn = await con();
    const sql = `
          update tb_user 
          set user_senha=@user_senha 
          where user_id=@user_id`;

    const respDB = await conn
      .request()
      .input("user_senha", sqltype.VarChar(45), user_senha)
      .input("user_id", sqltype.Int, user_id)
      .query(sql);

    return respDB;
  },

  async verificaLogin(user_email, user_name, user_cpf){
    const conn = await con()

    const respDB = await conn.request()
    .input('user_email', VarChar(100), user_email)
    .input('user_name', VarChar(100), user_name)
    .input('user_cpf', VarChar(11), user_cpf)
    .query('select user_name, user_email, user_cpf from tb_user where user_email = @user_email OR user_name = @user_name OR user_cpf = @user_cpf')

    return respDB
  },

 // como ainda nao tem tabela de avaliaçao foi feito um mock
  //esta retornando uma media mokada baseada em quantidade
 async readRankingByUserId(id) {
  const conn = await con();
  const { recordset } = await conn
    .request()
    .input("user_id", sqltype.Int, id)
    //mock
    .query(`
      SELECT 
        CAST(3.0 AS DECIMAL(10,1)) AS media,
        CAST(9 AS INT) AS total_avaliacoes
    `);

  return recordset[0];
},

async readActivityByUserId(id) {
  const conn = await con();

  const { recordset } = await conn
    .request()
    .input("user_id", sqltype.Int, id)
    //mock
    .query(`
      SELECT
        COUNT(*) AS projetos_realizados,
        SUM(CASE WHEN demandas_status = 'aberta' THEN 1 ELSE 0 END) AS projetos_em_execucao,
        CAST(9 AS INT) AS classificacoes_clientes
      FROM tb_demandas
      WHERE tb_user_user_id = @user_id
    `);

  return recordset[0];
}
};

export default UserRepository;
