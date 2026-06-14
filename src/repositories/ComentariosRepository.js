import con from "../database/connectionSQL.js";
import sqltype from "mssql";

// Nota: tb_coment não possui coluna de data de criação.
// Para adicionar, execute no banco:
//   ALTER TABLE tb_coment ADD coment_data DATETIME DEFAULT GETDATE();
// Após isso, inclua coment_data nas queries abaixo.

const ComentariosRepository = {

  async getByDemandaId(demanda_id) {
    const conn = await con();

    const { recordset } = await conn
      .request()
      .input("demanda_id", sqltype.Int, demanda_id)
      .query(`
        SELECT
          c.coment_id,
          c.coment_content,
          u.user_name,
          u.user_real_name
        FROM tb_coment c
        LEFT JOIN tb_user u ON u.user_id = c.user_id
        WHERE c.demanda_id = @demanda_id
        ORDER BY c.coment_id ASC
      `);

    return recordset;
  },

  async create({ demanda_id, user_id, coment_content }) {
    const conn = await con();

    const result = await conn
      .request()
      .input("demanda_id",     sqltype.Int,          demanda_id)
      .input("user_id",        sqltype.Int,          user_id)
      .input("coment_content", sqltype.VarChar(sqltype.MAX), coment_content)
      .query(`
        INSERT INTO tb_coment (demanda_id, user_id, coment_content)
        OUTPUT INSERTED.coment_id
        VALUES (@demanda_id, @user_id, @coment_content)
      `);

    return result.recordset[0];
  },
};

export default ComentariosRepository;
