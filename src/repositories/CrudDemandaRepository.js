import con from "../database/connectionSQL.js";
import AuthController from "../controllers/AuthController.js";
import sqltype from "mssql";

const DemandasRepository = {
  async readAll(page = 1, limit = 10) {
    const conn = await con();

    const offset = (page - 1) * limit;
    const { recordset } = await conn
      .request()
      .input("offset", offset)
      .input("limit", limit).query(`SELECT 
  u.user_name, 
  u.user_tipo, 
  d.demanda_id,
  d.tb_user_user_id,
  d.demanda_title,
  STRING_AGG(c.curso_name, ', ') AS cursos,
  d.demanda_content, 
  d.demanda_file, 
  d.demanda_create_data, 
  d.demandas_status
FROM tb_user u
JOIN tb_demandas d
  ON d.tb_user_user_id = u.user_id
JOIN tb_demandas_curso dc
  ON dc.tb_demandas_demanda_id = d.demanda_id
JOIN tb_curso c 
  ON c.curso_id = dc.tb_curso_curso_id

GROUP BY 
  u.user_name, 
  u.user_tipo, 
  d.demanda_id,
  d.tb_user_user_id,
  d.demanda_title,
  d.demanda_content, 
  d.demanda_file, 
  d.demanda_create_data, 
  d.demandas_status

ORDER BY d.demanda_create_data DESC, d.demanda_id DESC
OFFSET @offset ROWS
FETCH NEXT @limit ROWS ONLY`);

    const contar = await conn.request()
      .query(`SELECT COUNT(*) AS total FROM tb_user JOIN tb_demandas ON tb_demandas.tb_user_user_id = tb_user.user_id`);

    return {
      dados: recordset,
      total: contar.recordset[0].total
    }
  },
  async readById(demanda_id) {
  const conn = await con();

  const { recordset } = await conn
    .request()
    .input("demanda_id", sqltype.Int, demanda_id)
    .query(`
      SELECT
        demanda_id,
        demanda_title,
        demanda_content,
        demanda_file,
        demanda_create_data,
        tb_user_user_id,
        demandas_status,
        demandas_status_date
      FROM tb_demandas
      WHERE demanda_id = @demanda_id
    `);

  return recordset;
},

  async readByTag(demanda_tag) {
    const sql = await con();
    const { recordset } = await sql
      .request()
      .input("demanda_tag", sqltype.VarChar(100), demanda_tag)
      .query(`select * from tb_demanda where demanda_tag=@demanda_tag`);

    return recordset;

    // const padronizarTag = demanda_tag.toLowerCase()// padroniza a tag para minúsculo deixando a busca mais funcional
    // const BususcarTag = Demandas.filter(d => d.demanda_tag.toLocaleLowerCase().includes(padronizarTag)) // busca a demanda pela tag
    // return BususcarTag; // retorna a demanda encrontrada
  },


  async create({
    data_curso,
    user_demanda,
    demanda_title,
    demanda_content,
    demanda_tag,
    demanda_file,
    demanda_create_data,
    tb_user_user_id,
    demandas_status,
    demandas_status_date,
  }) {
    const conn = await con();
    const transaction = new sqltype.Transaction(conn);

    try {
      await transaction.begin();

      // 1. buscar o curso_id pelo nome do curso
      const cursoResult = await new sqltype.Request(transaction)
        .input("curso_name", sqltype.VarChar(150), data_curso)
        .query(`
        SELECT curso_id
        FROM tb_curso
        WHERE curso_name = @curso_name
      `);

      if (!cursoResult.recordset.length) {
        throw new Error(`Curso não encontrado: ${data_curso}`);
      }

      const curso_id = cursoResult.recordset[0].curso_id;

      // 2. inserir na tabela principal tb_demandas
      const insertDemanda = await new sqltype.Request(transaction)
        .input("demanda_title", sqltype.VarChar(250), demanda_title)
        .input("demanda_content", sqltype.VarChar(10000), demanda_content)
        .input("demanda_file", sqltype.VarBinary(sqltype.MAX), demanda_file)
        .input("demanda_create_data", sqltype.DateTime, demanda_create_data)
        .input("tb_user_user_id", sqltype.Int, tb_user_user_id)
        .input("demandas_status", sqltype.VarChar(20), demandas_status)
        .input("demandas_status_date", sqltype.DateTime, demandas_status_date)
        .query(`
        INSERT INTO tb_demandas (
          demanda_title,
          demanda_content,
          demanda_file,
          demanda_create_data,
          tb_user_user_id,
          demandas_status,
          demandas_status_date
        )
        OUTPUT INSERTED.demanda_id
        VALUES (
          @demanda_title,
          @demanda_content,
          @demanda_file,
          @demanda_create_data,
          @tb_user_user_id,
          @demandas_status,
          @demandas_status_date
        )
      `);

      const demanda_id = insertDemanda.recordset[0].demanda_id;

      // 3. inserir vínculo com curso
      await new sqltype.Request(transaction)
        .input("tb_demandas_demanda_id", sqltype.Int, demanda_id)
        .input("tb_curso_curso_id", sqltype.Int, curso_id)
        .query(`
        INSERT INTO tb_demandas_curso (
          tb_demandas_demanda_id,
          tb_curso_curso_id
        )
        VALUES (
          @tb_demandas_demanda_id,
          @tb_curso_curso_id
        )
      `);

      await transaction.commit();

      return {
        demanda_id,
        demanda_title,
        demanda_content,
        data_curso,
        tb_user_user_id,
        demandas_status
      };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

 async update(demanda_id, { demanda_title, demanda_content }) {
  const conn = await con();

  const result = await conn
    .request()
    .input("demanda_id", sqltype.Int, demanda_id)
    .input("demanda_title", sqltype.VarChar(250), demanda_title)
    .input("demanda_content", sqltype.VarChar(10000), demanda_content)
    .query(`
      UPDATE tb_demandas
      SET
        demanda_title = @demanda_title,
        demanda_content = @demanda_content
      WHERE demanda_id = @demanda_id
    `);

  return result;
},

   async delete(demanda_id) {
  const conn = await con();
  const transaction = new sqltype.Transaction(conn);

  try {
    await transaction.begin();

    // apaga vínculos com curso primeiro
    await new sqltype.Request(transaction)
      .input("demanda_id", sqltype.Int, demanda_id)
      .query(`
        DELETE FROM tb_demandas_curso
        WHERE tb_demandas_demanda_id = @demanda_id
      `);

    // se você tiver comentários/respostas ligados à demanda,
    // precisa apagar aqui antes da tabela principal também

    // apaga demanda principal
    await new sqltype.Request(transaction)
      .input("demanda_id", sqltype.Int, demanda_id)
      .query(`
        DELETE FROM tb_demandas
        WHERE demanda_id = @demanda_id
      `);

    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
};



export default DemandasRepository;
