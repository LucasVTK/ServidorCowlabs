import registroRepJson from "../repositories/registroRepJson.js";

const controllerJson = {
    loginJson: async (req, res) => {
        if (!req.body.email || !req.body.senha) {
            res.status(400).json({
                ok: false,
                message: 'Corpo padrão ausente'
            })
            return
        }

        const { email, senha } = req.body;
        const user = await registroRepJson.readUser(email, senha)

        if (!user) {
            return res.status(401).json({
                ok: false,
                message: 'Usuário ou senha inválidos'
            })
        }

        const logou = {
            id: user.id,
            email: user.email
        }

        return res.status(200).json({
            ok: true,
            message: "Login realizado com sucesso",
            user: logou
        })
    }
}

export default controllerJson
