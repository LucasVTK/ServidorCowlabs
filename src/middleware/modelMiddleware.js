const ModelMiddleware = {
    modelValidade: async (req, res, next) =>{
        const message = []
        const model = req.body
        if(!model.user_name || model.user_name == ""){
            message.push('insira o nome') 
        }
        if(!model.user_real_name || model.user_real_name == ""){
            message.push('insira o nome completo') 
        }
        if(!model.user_cpf || model.user_cpf == ""){
            message.push('insira o seu cpf')
        }
        if(!model.user_email || model.user_email == ""){
            message.push('insira o email')
        }
        if(!model.user_endereco || model.user_endereco == ""){
            message.push('insira o seu endereço')
        }
        if(!model.user_num || model.user_num == ""){
            message.push('insira o numero da casa')
        }
        if(!model.user_bairro || model.user_bairro == ""){
            message.push('insira seu bairro') 
        }
        if(!model.user_cidade || model.user_cidade == ""){
            message.push('insira sua cidade')
        }
        if(!model.user_uf || model.user_uf == ""){
            message.push('insira seu estado') 
        }
        if(!model.user_cep || model.user_cep == ""){
            message.push('insira seu CEP')
        }

        if(message.length > 0){
            res.status(400).json({
            erro: true,
            message: message
        })
        return
    }
    next()
    },
    modelUpdateSenha: async (req, res, next) =>{
        const message = []
        const model = req.body

        if(!model.user_senha || model.senha == ""){
            message.push('preencha os espaços de senha') 
        }
        if(message.length > 0 ){
            res.status(400).json({
            erro:true,
            messsage:message
        })
        return
    }
    next()
    }
}

export default ModelMiddleware