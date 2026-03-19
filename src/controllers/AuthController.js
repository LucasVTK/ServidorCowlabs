import UserRepository from "../repositories/RegistroRepository.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const AuthController = {
    login: async (req, res) => {
        if (!req.body.user_email || !req.body.user_senha) {
            return res.status(400).json({
                ok: false,
                message: 'Corpo padrão ausente'
            })
        }

        const { user_email, user_senha } = req.body

        try {
            const user = await UserRepository.readUser(user_email)
            // console.log('Usuário encontrado:', user)

            if (!user) {
                return res.status(401).json({
                    ok: false,
                    message: 'Usuário e/ou senha errados.'
                })
            }

            const senhaCorreta = bcrypt.compareSync(user_senha, user.user_senha)
            console.log('Senha correta:', senhaCorreta)

            if (!senhaCorreta) {
                return res.status(401).json({
                    ok: false,
                    message: 'Usuário e/ou senha errados.'
                })
            }

            const payload = {
                id: user.user_id,
                email: user.user_email,
                tipo: user.user_tipo
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' })

            return res.status(200).json({
                ok: true,
                message: 'Usuário logado com sucesso!',
                user: payload,
                token: token
            })

        } catch (e) {
            return res.status(500).json({
                ok: false,
                message: 'Erro interno no servidor.'
            })
        }
    },

    crypt: (user_senha) => {
        return bcrypt.hashSync(user_senha, 10)
    },

    compare: (user_senha, hash) => {
        return bcrypt.compareSync(user_senha, hash)
    }
}

export default AuthController