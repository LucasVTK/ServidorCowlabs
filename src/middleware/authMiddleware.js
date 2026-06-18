import jwt from 'jsonwebtoken'
import UserRepository from '../repositories/RegistroRepository.js'

const authMiddleware = {
    authenticate: async (req, res, next) => {
        const c = req.headers.authorization

        if (!c) {
            return res.status(401).json({ ok: false, message: 'Não autorizado' })
        }

        const token = c.split(' ')[1] || c

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET)

            const registro = await UserRepository.readStatusById(payload.id)
            if (!registro || registro.user_status === 'inativo') {
                console.error(e);
                return res.status(403).json({ ok: false, message: 'Usuário inativo.' })
            }

            req.user = payload
            next()
        } catch (e) {
            console.error(e);
            return res.status(401).json({ ok: false, message: 'Token inválido ou expirado' })
        }
    },

    authenticateAdmin: async (req, res, next) => {
        const c = req.headers.authorization

        if (!c) {
            return res.status(401).json({ ok: false, message: 'Não autorizado' })
        }

        const token = c.split(' ')[1] || c

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET)

            const registro = await UserRepository.readStatusById(payload.id)
            if (!registro || registro.user_status === 'inativo') {
                return res.status(403).json({ ok: false, message: 'Usuário inativo.' })
            }

            req.user = payload

            if (payload.tipo?.toLowerCase() === 'admin') {
                next()
            } else {
                return res.status(403).json({ ok: false, message: 'Acesso negado' })
            }
        } catch (e) {
            console.error(e);
            return res.status(401).json({ ok: false, message: 'Token inválido ou expirado' })
        }
    }
}

export default authMiddleware