import con from "../database/connectionSQL.js";
import sqltype from "mssql";

import pkg from 'mssql';
const { VarChar } = pkg;

const UserRepository = {
  async readAll() {
    const conn = await con();
    const { recordset } = await conn.query(
      `SELECT user_id,
              user_name,
              user_real_name,
              user_email,
              user_tipo,
              user_status,
              user_create_data
         FROM tb_user`,
    );
    return recordset;
  },
  async readById(id) {
    const conn = await con();
    const { recordset } = await conn
      .request()
      .input("user_id", sqltype.Int, id)
      .query(
        `SELECT  u.user_id,
            u.user_name,
            u.user_real_name,
            u.user_email,
            u.user_tipo,
            u.user_status,
            u.user_img,
            c.curso_name AS user_curso
        FROM tb_user u
        LEFT JOIN tb_user_curso uc ON uc.tb_user_user_id = u.user_id
        LEFT JOIN tb_curso c ON c.curso_id = uc.tb_curso_curso_id
          WHERE u.user_id = @user_id`,
      );
    return recordset;
  },

  async readStatusById(id) {
    const conn = await con();
    const { recordset } = await conn
      .request()
      .input("user_id", sqltype.Int, id)
      .query(`SELECT user_status FROM tb_user WHERE user_id = @user_id`);
    return recordset[0] || null;
  },

  async readUser(user_email) {
    const sql = await con();

    const { recordset } = await sql
      .request()
      .input("user_email", sqltype.VarChar(100), user_email)
      .query(`select u.user_id, u.user_name, u.user_real_name, u.user_email,
         u.user_senha, u.user_tipo, u.user_status, u.user_img,
         c.curso_name AS user_curso
    FROM tb_user u
    LEFT JOIN tb_user_curso uc ON uc.tb_user_user_id = u.user_id
    LEFT JOIN tb_curso c ON c.curso_id = uc.tb_curso_curso_id
   WHERE u.user_email = @user_email
`);

          // console.log('Recordset:', recordset)
          // console.log('Email buscado:', user_email) 

    if (recordset.length > 0) {
        return recordset[0]
    }
    return null;
  },

  async create(model) {
    const conn = await con();
    const transaction = new sqltype.Transaction(conn);
    console.log("Repository");
    try{ 
      await transaction.begin(sqltype.ISOLATION_LEVEL.READ_COMMITTED);
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
        OUTPUT INSERTED.user_id
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

    const respDB = await new sqltype.Request(transaction)
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

      // Pega o ID direto do INSERT usando OUTPUT
    const newUserId = respDB.recordset[0].user_id;

    // Busca o curso_id pelo nome
    const cursoResult = await new sqltype.Request(transaction)
      .input("curso_name", sqltype.VarChar(100), model.user_curso)
      .query(`SELECT curso_id FROM tb_curso WHERE curso_name = @curso_name`);

    if (cursoResult.recordset.length > 0) {
      const cursoId = cursoResult.recordset[0].curso_id;
      await new sqltype.Request(transaction)
        .input("user_id",  sqltype.Int, newUserId)
        .input("curso_id", sqltype.Int, cursoId)
        .query(`INSERT INTO tb_user_curso (tb_user_user_id, tb_curso_curso_id) VALUES (@user_id, @curso_id)`);
    }

    await transaction.commit();
    return respDB;

  } catch (err) {
    await transaction.rollback();
    throw err;
  }
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
},

  // Soft delete — marca o usuário como inativo sem apagar do banco
  async updateStatus(id, status) {
    const conn = await con();
    const respDB = await conn
      .request()
      .input("user_id",     sqltype.Int,        id)
      .input("user_status", sqltype.VarChar(20), status)
      .query(`UPDATE tb_user SET user_status = @user_status WHERE user_id = @user_id`);
    return respDB;
  },

  async updateImg(id, url) {
    const conn = await con();
    const respDB = await conn
      .request()
      .input("user_id",  sqltype.Int,         id)
      .input("user_img", sqltype.VarChar(500), url)
      .query(`UPDATE tb_user SET user_img = @user_img WHERE user_id = @user_id`);
    return respDB;
  },

  // Atualização parcial pelo admin (tipo e/ou status)
  async updateAdmin(id, { user_tipo, user_status }) {
    const conn = await con();
    const respDB = await conn
      .request()
      .input("user_id",     sqltype.Int,        id)
      .input("user_tipo",   sqltype.VarChar(20), user_tipo   ?? null)
      .input("user_status", sqltype.VarChar(20), user_status ?? null)
      .query(`
        UPDATE tb_user
           SET user_tipo   = ISNULL(NULLIF(@user_tipo,   ''), user_tipo),
               user_status = ISNULL(NULLIF(@user_status, ''), user_status)
         WHERE user_id = @user_id
      `);
    return respDB;
  },
};

export default UserRepository;
