import UserRepository from "../repositories/RegistroRepository.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const AuthController = {
    login: async (req, res) =>{
        if(!req.body.user_email || !req.body.user_senha){
            res.status(400).json({
                ok:false,
                message:'Corpo padrão ausente'
            })
            return
        }
        const {user_email, user_senha} = req.body
        const user = await UserRepository.readUser(user_email, user_senha)
        if(user){
            const u = {
                id: user.user_id,
                email: user.user_email,
                tipo: user.user_tipo,
                name: user.user_name,
                realname: user.user_real_name
            }
            const token = jwt.sign(u,process.env.JWT_SECRET,{expiresIn:'8h'})

            res.status(200).json({
                ok:true,
                message:'Usuário logado com sucesso!',
                user: u,
                token: token
            })
        }else{
            res.status(401).json({
                ok:false,
                message:'Usuário e/ou senha errados.'
            })
        }
    },
    crypt:(user_senha) =>{
        const csenha = bcrypt.hashSync(user_senha,process.env.BCRYPT_SALT)
        return csenha
    },
    compare:(user_senha, hash) =>{
        const c = bcrypt.compareSync(user_senha, hash)
        return c
    }

}
export default AuthController