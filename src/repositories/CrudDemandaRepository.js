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
  d.demanda_title,
  d.demanda_content, 
  d.demanda_file, 
  d.demanda_create_data, 
  d.demandas_status

ORDER BY d.demanda_create_data DESC, d.demanda_id DESC
OFFSET @offset ROWS
FETCH NEXT @limit ROWS ONLY`);

    const contar = await conn
      .request()
      .query(
        `SELECT COUNT(*) AS total FROM tb_user JOIN tb_demandas ON tb_demandas.tb_user_user_id = tb_user.user_id`,
      );

    return {
      dados: recordset,
      total: contar.recordset[0].total,
    };
  },
  async readById(demanda_id) {
    const conn = await con();
    const { recordset } = await conn
      .request()
      .input("demanda_id", sqltype.Int, demanda_id)
      .query(
        "select demanda_id,demanda_title,demanda_content,demanda_file,demanda_create_data,tb_user_user_id,demandas_status,demandas_status_date from tb_demandas where demanda_id=@demanda_id",
      );
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
    demanda_title,
    demanda_content,
    demanda_file,
    demanda_create_data,
    tb_user_user_id,
    demandas_status,
    demandas_status_date,
  }) {
    const conn = await con();
    const sql = `
        INSERT INTO tb_demandas (
            demanda_title, demanda_content, demanda_file, demanda_create_data, tb_user_user_id,
            demandas_status, demandas_status_date

        ) VALUES (
            @demanda_title, @demanda_content, @demanda_file, @demanda_create_data, @tb_user_user_id,
            @demandas_status, @demandas_status_date
        )
        `;

    const respDB = await conn
      .request()
      .input("demanda_title", sqltype.VarChar(250), demanda_title)
      .input("demanda_content", sqltype.VarChar(10000), demanda_content)
      .input("demanda_file", sqltype.Bit(48000000), demanda_file)
      .input("demanda_create_data", sqltype.DateTime, demanda_create_data)
      .input("tb_user_user_id", sqltype.Int, tb_user_user_id)
      .input("demandas_status", sqltype.VarChar(10), demandas_status)
      .input("demandas_status_date", sqltype.DateTime, demandas_status_date)
      .query(sql);

    return respDB;
  },
  async update(
    demanda_id,
    {
      demanda_title,
      demanda_content,
      demanda_file,
      demanda_create_data,
      demandas_status,
      demandas_status_date,
    },
  ) {
    const conn = await con();

    const { recordset } = await conn
      .request()
      .input("demanda_id", sqltype.Int, demanda_id)
      .input("demanda_title", sqltype.VarChar(250), demanda_title)
      .input("demanda_content", sqltype.VarChar(10000), demanda_content)
      .input("demanda_file", sqltype.Bit, demanda_file)
      .input("demanda_create_data", sqltype.DateTime, demanda_create_data)
      .input("demandas_status", sqltype.VarChar(10), demandas_status)
      .input("demandas_status_date", sqltype.DateTime, demandas_status_date)
      .query(`
      update tb_demandas 
      set 
        demanda_title = @demanda_title,
        demanda_content = @demanda_content,
        demanda_file = @demanda_file,
        demanda_create_data = @demanda_create_data,
        demandas_status = @demandas_status,
        demandas_status_date = @demandas_status_date
      where demanda_id = @demanda_id
    `);

    return recordset;
  },
  async deleteDemanda(){
    //ainda n criado
  }
};

export default DemandasRepository;
