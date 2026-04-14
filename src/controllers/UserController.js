import UserRepository from "../repositories/RegistroRepository.js";
import auth from "./AuthController.js";

const UserController = {
  async getAllUsers(req, res) {
    const users = await UserRepository.readAll();
    res.json(users);
  },

  async getUserById(req, res) {
    const id = req.params.id;
    const users = await UserRepository.readById(id);
    res.json(users);
  },

  async create(req, res) {
    try {
      const model = req.body;
      model.user_senha = auth.crypt(model.user_senha);
      const respDB = await UserRepository.create(model);
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
      // res.status(500).json({
      // ok: false,
      // message: "Erro do servidor",
      // error:e
      console.log("ERRO COMPLETO NO CREATE:");
      console.dir(e, { depth: null });
      res.status(500).json({
        ok: false,
        message: "Erro do servidor",
        error: e.message || e,
      });
    }
  },

  async Update(req, res) {
    try {
      const model = req.body;
      const id = req.params.id;

      model.user_senha = auth.crypt(model.user_senha);

      const respDB = await UserRepository.update(id, model);
      if (respDB.rowsAffected[0] > 0)
        if (respDB.rowsAffected[0] > 0) {
          res.status(200).json({
            ok: true,
            message: "Usuário alterado com sucesso!",
            email: model.user_email,
          });
          return;
        }
      res.status(500).json({
        ok: false,
        message: "Erro ao alterar usuário",
        email: model.user_email,
      });
    } catch (e) {
      res.status(500).json({
        ok: false,
        message: "Erro do servidor",
      });
    }
  },

  async updatePassword(req, res) {
    try {
      const model = req.body;
      const id = req.params.id;
      model.senha = auth.crypt(model.senha);

      const respDB = await UserRepository.updatePassword(id, model.user_senha);

      if (respDB.rowsAffected[0] > 0) {
        res.status(200).json({
          ok: true,
          message: "Senha alterada com sucesso!",
          email: model.user_email,
        });
        return;
      }
      res.status(500).json({
        ok: false,
        message: "Erro ao alterar senha",
        email: model.user_email,
      });
    } catch (e) {
      res.status(500).json({
        ok: false,
        message: "Erro do servidor",
      });
    }
  },

  async verificaLogin(req, res){
    try{
      const model = req.body
      const repsDB = await UserRepository.verificaLogin(model.user_email, model.user_name, model.user_cpf)
      if(repsDB.recordset.length === 0){
        res.status(200).json({
          ok:true,
          message: 'Usuario, Email e CPF Unico, Registro liberado',
          field: model.user_email
        })
        return
      }
      //verificacoes para retorno de mansagem ao front, com iteracao para retornar sempre todos os campos que existirem no banco, pois sem essa iteracao apenas o primeiro retorno do banco iria para o front end
      const field = []
      repsDB.recordset.forEach(registro => {
        if(registro.user_email === model.user_email){
          //cada push e uma mensagem adicionada ao field, caso o campo seja encontrado, montando assim um array
          field.push(`<br>email ja cadastrado`)
      }
      if(registro.user_cpf === model.user_cpf){
          field.push(`<br>cpf ja cadastrado`)
      }
      if(registro.user_name === model.user_name){
          field.push(`<br>usuário ja cadastrado`)
      }
      })
      //retorno final ao front, se utiliza tambem das mesmas mensagens vindas do backend, caso a variavel field esteja com algo dentro retorna oque ja existe
      if(field.length > 0){
        res.status(409).json({
          ok:false,
          message:"ja existe usuario registrados com email, usuario ou este cpf",
          field: field
        })
        return
      }
    }catch(e){
      //qualquer outro tipo de erro de execucao de codigo e retornado por aqui
      res.status(500).json({
        ok:false,
        message:"Erro do servidor",
        error: e.message
      })
    }
  },
  
   async getUserRanking(req, res) {
    try {
      const id = req.params.id;
      const ranking = await UserRepository.readRankingByUserId(id);

      res.status(200).json(ranking);
    } catch (e) {
      res.status(500).json({
        ok: false,
        message: "Erro ao buscar ranking do usuário",
        error: e.message,
      });
    }
  },

   async getUserActivity(req, res) {
    try {
      const id = req.params.id;
      const activity = await UserRepository.readActivityByUserId(id);

      res.status(200).json(activity);
    } catch (e) {
      res.status(500).json({
        ok: false,
        message: "Erro ao buscar atividade do usuário",
        error: e.message,
      });
    }
  }
};




export default UserController;
