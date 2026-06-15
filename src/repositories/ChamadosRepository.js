import con from "../database/connectionSQL.js";
import sqltype from "mssql";

const chamadosRepository = {
    async ReadAll(page = 1, limit = 5){
        const conn = await con()

        const offset = (page - 1) * limit
        const {recordset} = await conn
        .request()
        .input("offset", sqltype.Int, offset)
        .input("limit",  sqltype.Int, limit)
        .query(`SELECT * FROM tb_chamados
            ORDER BY chamado_id DESC
            OFFSET @offset ROWS
            FETCH NEXT @limit ROWS ONLY`)

        const contar = await conn
            .request()
            .query(`SELECT COUNT(*) AS total FROM tb_chamados`)

        return {
            dados: recordset,
            total: contar.recordset[0].total
        }
    },

    async updateResp(id, { chamado_resp, chamado_status,  }) {
        const conn = await con()
        const respDB = await conn
            .request()
            .input('id',     sqltype.Int,         id)
            .input('resp',   sqltype.VarChar(500), chamado_resp)
            .input('status', sqltype.VarChar(20),  chamado_status)
            .query(`UPDATE tb_chamados
                    SET chamado_resp   = @resp,
                        chamado_status = @status
                    WHERE chamado_id = @id`)
                    
        return respDB
    },

    async create(cham){
        const conn = await con()
        const transaction = new sqltype.Transaction(conn)

        try{
            await transaction.begin()
            const request = new sqltype.Request(transaction)
            
            //inserindo no banco oque o usuario enviou
            const sql = ` insert into tb_chamados (chamado_user_name, chamado_user_email, chamado_user_tel, chamado_content, chamado_status, tb_user_id ) VALUES (@ChamUser, @ChamEmail, @ChamTel, @ChamContent, @ChamStatus, @ChamUserID)`
            const resChamado = await request
            .input('ChamUser', sqltype.VarChar(50), cham.chamado_user_name)
            .input('ChamEmail', sqltype.VarChar(70), cham.chamado_user_email)
            .input('ChamTel', sqltype.VarChar(20), cham.chamado_user_tel)
            .input('ChamContent', sqltype.VarChar(250), cham.chamado_content)
            .input('ChamStatus', sqltype.VarChar(20), 'Aberto')
            .input('ChamUserID', sqltype.Int, cham.tb_user_id)
            .query(sql)

            //consultando o ID do novo chamado para retornar 
            const sql2 = `select IDENT_CURRENT('tb_chamados') as newId`
            const newId = ((await request.query(sql2)).recordset[0].newId)

            await transaction.commit()

            return{
                ok:true,
                message: 'Chamado enviado com sucesso',
                id_chamado: newId,
                data:cham
            }
        }catch(e){
            await transaction.rollback()
            return e
        }
    },

    async respChamado(id){
        //conexao com banco
        const conn = await con()
        
        //select para pegar o email do usuario via ID do chamado
        const sql =  `select chamado_user_email from tb_chamados where chamado_id = @Cham_id`
        const {recordset} = await conn
        .request()
        .input('Cham_id', sqltype.Int, id)
        .query(sql)

        //retorna o email de indice 0 (o primeiro email com aquele ID)
        return recordset[0].chamado_user_email
    }
}


export default chamadosRepository