import jwt from 'jsonwebtoken'

const authMiddleware = {
    authenticate: async (req, res, next) => {
        const c = req.headers.authorization

        if (!c) {
            return res.status(401).json({
                ok: false,
                message: 'Não autorizado'
            })
        }

        const token = c.split(' ')[1] || c

        try {
            const user = jwt.verify(token, process.env.JWT_SECRET)
            req.user = user
            next()
        } catch (e) {
            return res.status(401).json({
                ok: false,
                message: 'Token inválido ou expirado'
            })
        }
    },

    authenticateAdmin: async (req, res, next) => {
        const c = req.headers.authorization

        if (!c) {
            return res.status(401).json({
                ok: false,
                message: 'Não autorizado'
            })
        }

        const token = c.split(' ')[1] || c

        try {
            const user = jwt.verify(token, process.env.JWT_SECRET)
            req.user = user

            if (user.tipo === 'admin') {
                next()
            } else {
                return res.status(403).json({
                    ok: false,
                    message: 'Acesso negado'
                })
            }
        } catch (e) {
            return res.status(401).json({
                ok: false,
                message: 'Token inválido ou expirado'
            })
        }
    }
}

export default authMiddleware