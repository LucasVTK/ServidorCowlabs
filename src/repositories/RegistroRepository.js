import { connect } from "../database/connectionSQL.js";
import AuthController from '../controllers/AuthController.js'
import sqltype from 'mssql'

const UserRepository = {
    async readAll(){
        const conn = await connect()
        const {recordset} = await conn.query('select user_id,user_name,user_real_name,user_email,user_tipo from dbo.tb_user')
        return recordset
    },
    async readById(user_id){
        const conn = await connect()
        const {recordset} = await conn
        .request()
        .input('user_id',sqltype.Int,user_id)
        .query('select user_id,user_name,user_real_name,user_email,user_tipo from dbo.tb_user where id=@id')
        return recordset
    },
    async readUser(user_email, user_senha){
        const sql = await connect()

        const {recordset} = await sql
        .request()
        .input('user_email', sqltype.VarChar(100), user_email)
        .query(`select * from dbo.tb_user where user_email=@user_email`)

        if(recordset.length > 0){
            const s = recordset[0].user_senha
            if(AuthController.compare(user_senha, s)){
                return recordset
            }
        }
        return null
    },
    async create(model){
        const conn = await connect()
        const sql = `insert into dbo.td_user (user_id,    user_name,    user_real_name,    user_cpf,    user_email,    user_senha,    user_tipo,    user_endereco,    user_num,    user_complemento,    user_bairro ,   user_cidade  ,  user_uf  ,  user_cep  ,  user_create_data) 
        
        values ( @user_id,    @user_name,    @user_real_name,    @user_cpf,    @user_email,    @user_senha,    @user_tipo,    @user_endereco,    @user_num,    @user_complemento,    @user_bairro ,   @user_cidade  ,  @user_uf  ,  @user_cep  ,  @user_create_data)`

        const respDB = await conn.request()
        .input('user_name',sqltype.VarChar(100),model.user_name)
        .input('user_real_name',sqltype.VarChar(250),model.user_real_name)
        .input('user_cpf',sqltype.VarChar(11),model.user_cpf)
        .input('user_email',sqltype.VarChar(100),model.user_email)
        .input('user_senha',sqltype.VarChar(45),model.user_senha)
        .input('user_tipo',sqltype.VarChar(10),model.user_tipo)
        .input('user_endereco',sqltype.VarChar(200),model.user_endereco)
        .input('user_num',sqltype.VarChar(5),model.user_num)
        .input('user_complemento',sqltype.VarChar(100),model.user_complemento)
        .input('user_bairro',sqltype.VarChar(45),model.user_bairro)
        .input('user_cidade',sqltype.VarChar(45),model.user_cidade)
        .input('user_uf',sqltype.VarChar(2),model.user_uf)
        .input('user_cep',sqltype.VarChar(8),model.user_cep)
        .input('user_uf',sqltype.VarChar(2),model.user_uf)
        .input('user_create_data',sqltype.DateTime,model.user_create_data)
        .query(sql)

        return respDB
    },
    async update(id,model){
         //encarando que ja foram validadas pelo middleware

        const conn = await connect()
        const sql = `update dbo.tb_user 
            set user_name = @user_name,   user_real_name= @user_real_name, user_email=@user_email,   user_senha= @user_senha,     user_endereco=@user_endereco,   user_num= @user_num,    user_complemento=@user_complemento,    user_bairro=@user_bairro ,   user_cidade=@user_cidade  ,  user_uf=@user_uf  ,  user_cep=@user_cep  ,  
            where user_id=@user_id`

        const respDB = await conn.request()
        .input('user_name',sqltype.VarChar(100),model.user_name)
        .input('user_real_name',sqltype.VarChar(250),model.user_real_name)
        .input('user_email',sqltype.VarChar(100),model.user_email)
        .input('user_senha',sqltype.VarChar(45),model.user_senha)
        .input('user_endereco',sqltype.VarChar(200),model.user_endereco)
        .input('user_num',sqltype.VarChar(5),model.user_num)
        .input('user_complemento',sqltype.VarChar(100),model.user_complemento)
        .input('user_bairro',sqltype.VarChar(45),model.user_bairro)
        .input('user_cidade',sqltype.VarChar(45),model.user_cidade)
        .input('user_uf',sqltype.VarChar(2),model.user_uf)
        .input('user_cep',sqltype.VarChar(8),model.user_cep)
        .input('user_uf',sqltype.VarChar(2),model.user_uf)

        .query(sql)

        return respDB
    },
    async updatePassword(user_id, user_senha){
        const conn = await connect()
        const sql = `update dbo.tb_user 
        set user_senha=@user_senha where user_id=@user_id`

        const respDB = await conn.request()
        .input('user_senha',sqltype.VarChar(45),user_senha)
        .input('user_id',sqltype.Int,user_id)
        .query(sql)

        return respDB
    },
}

export default UserRepository