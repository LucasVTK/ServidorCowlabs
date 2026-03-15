import con from "../database/connectionSQL.js";
import AuthController from "../controllers/AuthController.js";
import sqltype from "mssql";

const DemandasRepository = {
  async readAll() {
    const conn = await con();
    const { recordset } = await conn.query(
      "select demanda_id,demanda_title,demanda_content,demanda_file,demanda_create_data,tb_user_user_id,demandas_status,demandas_status_date from tb_demandas"
    );
    return recordset; // retorna todas as demandas
  },
  async readById(demanda_id) {
    const conn = await con();
    const { recordset } = await conn
      .request()
      .input("demanda_id", sqltype.Int, demanda_id)
      .query(
        "select demanda_id,demanda_title,demanda_content,demanda_file,demanda_create_data,tb_user_user_id,demandas_status,demandas_status_date from tb_demandas where demanda_id=@demanda_id"
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
      .input("demandas_status_date", sqltype.DateTime, demandas_status_date);

    return respDB;

    // const novaDemanda = {
    //   demanda_id: Demandas.length + 1,
    //   data_curso,
    //   user_demanda,
    //   demanda_title,
    //   demanda_content,
    //   demanda_tag,
    //   file_location
    // } //Cria uma nova demanda

    // Demandas.push(novaDemanda) // Adiciona a nova demanda no final do array

    // fs.writeFileSync('./src/database/Demandas.json', JSON.stringify(Demandas),'utf-8') //Atualiza o arquivo JSON com a nova demanda

    // return {
    //   message: 'Demanda criada com sucesso!',
    //   data: Demandas,
    // } //Retorna uma mensagem de sucesso e os dados atualizados
  },
  async update(
    demanda_id,
    {
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
    }
  ) {
    const conn = await con();
    const sql = `update tb_demandas 
                set demanda_title = @demanda_title,   demanda_content= @demanda_content, demanda_file=@demanda_file,   demanda_create_data= @demanda_create_data,     demandas_status=@demandas_status,   demandas_status_date= @demandas_status_date  
                where demanda_id=@demanda_id`;

    const respDB = await conn
      .request()
      .input("demanda_title", sqltype.VarChar(250), demanda_title)
      .input("demanda_content", sqltype.VarChar(10000), demanda_content)
      .input("demanda_file", sqltype.Bit(48000000), demanda_file)
      .input("demanda_create_data", sqltype.DateTime, demanda_create_data)
      .input("demandas_status", sqltype.VarChar(10), demandas_status)
      .input("demandas_status_date", sqltype.DateTime, demandas_status_date)
      .query(sql);

    return respDB;
  }
};

export default DemandasRepository;