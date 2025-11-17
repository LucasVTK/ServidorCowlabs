import registroRepJson from "../repositories/registroRepJson.js";
import jwt from 'jsonwebtoken';

const controllerJson = {
    loginJson: async (req, res) => {

        if (!req.body.email || !req.body.senha) {
            return res.status(400).json({
                ok: false,
                message: 'Corpo padrão ausente'
            });
        }

        const { email, senha } = req.body;
        const user = await registroRepJson.readUser(email, senha);

        if (!user) {
            return res.status(401).json({
                ok: false,
                message: 'Usuário ou senha inválidos'
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                user_tipo: user.user_tipo
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.json({
            ok: true,
            token
        });
    }
};

export default controllerJson;
