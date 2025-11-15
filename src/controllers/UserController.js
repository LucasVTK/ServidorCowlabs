import UserRepository from "../repositories/RegistroRepository.js";
import auth from "./AuthController.js";

const UserController = {
    async getAllUsers(req, res) {
    const users = await UserRepository.readAll();
    res.json(users);
    },
    async getUserById(req, res) {
    const id = req.params.user_id;
    const users = await UserRepository.readById(id);
    res.json(users);
    },
    async insert(req, res) {
    try {
        const model = req.body;
        model.user_senha = auth.crypt(model.user_senha);
        const respDB = await UserController.create(model);
        if (respDB.rowsAffected[0] > 0) {
        res.status(200).json({
            ok: true,
            message: "Usuário inserido com sucesso!",
            email: model.user_email,
        });
        return;
        }
        res.status(500).json({
        ok: false,
        message: "Erro ao inserir usuário",
        email: model.user_email,
        });
    } catch (e) {
        res.status(500).json({
        ok: false,
        message: "Erro do servidor",
        });
    }
    },
    async Update(req,res){
    try{
        const model = req.body
        const id = req.params.user_id

        model.user_senha = auth.crypt(model.user_senha)

        const respDB = await UserRepository.update(id, model)
        if(respDB.rowsAffected[0] > 0)
                        if (respDB.rowsAffected[0] > 0) {
                res.status(200).json({
                    ok: true,
                    message: 'Usuário alterado com sucesso!',
                    email: model.user_email
                })
                return
            }
            res.status(500).json({
                ok: false,
                message: 'Erro ao alterar usuário',
                email: model.user_email
            })
        } catch (e) {
            res.status(500).json({
                ok: false,
                message: 'Erro do servidor',
            })
        }
    },
        async updatePassword(req, res) {
        try {
            const model = req.body
            const id = req.params.id
            model.senha = auth.crypt(model.senha)

            const respDB = await UserRepository.updatePassword(id, model.user_senha)

            if (respDB.rowsAffected[0] > 0) {
                res.status(200).json({
                    ok: true,
                    message: 'Senha alterada com sucesso!',
                    email: model.user_email
                })
                return
            }
            res.status(500).json({
                ok: false,
                message: 'Erro ao alterar senha',
                email: model.user_email
            })
        } catch (e) {
            res.status(500).json({
                ok: false,
                message: 'Erro do servidor',
            })
        }
    },
}

export default UserController

