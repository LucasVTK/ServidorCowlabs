import RegistroRepository from '../repositories/RegistroRepository.js'

//regex para validar email


const RegistroController = {

    async MostraTodosOsRegistros(req, res){
        const registros = await RegistroRepository.readAll()
        res.status(200).json(registros)
        console.log(registros)
    },

    async registro(req, res){
        const { nome, email, senha, curso, tipo } = req.body 
        if(!nome || !email || !senha || !curso) {
            return res.status(400).json({
                error: 'Campos obrigatórios: nome, email, senha e curso, preencha o faltante.'
            })
    }
    // if(emailRx.test(email)){
    //     return res.status(400).json({
    //         error: 'Email inválido, insira um email válido.'
    //     })
    // }
    const existeEmail = await RegistroRepository.readByEmail(email)
    if(existeEmail){
        res.status(409).json({
            error: 'Email já cadastrado, insira outro email.'
        })
    }
    if(senha.length < 6){
        return res.status(400).json({
            error: 'Senha muito curta, insira uma senha com no mínimo 6 caracteres.'
        })
    }
    else{
    const novoUsuario = RegistroRepository.create({nome, email, senha, curso, tipo})
    return res.status(201).json(novoUsuario)
    }
}
}

export default RegistroController