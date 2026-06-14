const middlewareChamados = {

    async validaCampos(req, res, next) {
        const { chamado_user_name, chamado_user_email, chamado_content } = req.body

        if (!chamado_user_name || !chamado_user_email || !chamado_content) {
            return res.status(400).json({
                erro: 'Campos obrigatórios devem ser preenchidos'
            })
        }
        next()
    }
}

export default middlewareChamados