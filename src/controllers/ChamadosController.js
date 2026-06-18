import chamadosRepository from "../repositories/ChamadosRepository.js";
import mailer from "../utils/mailer.js";

const chamadosController = {
    async getAllChamados(req, res) {
    try {
        let { page } = req.query;
        let limit = 5;

        page = Number.parseInt(page);
        limit = Number.parseInt(limit);

        if (Number.isNaN(page) || Number.isNaN(limit) || page <= 0 || limit <= 0) {
        return res.status(400).json({
            erro: "parametro da paginação errado",
        });
        }
        const { dados, total } = await chamadosRepository.ReadAll(page, limit);

        const pages = Math.ceil(total / limit);
        const prev_page = page - 1 > 0 ? page - 1 : false;
        const next_page = page + 1 > pages ? false : page + 1;

        res.status(200).json({
        dados,
        paginacao: {
            total,
            limit,
            pages,
            currentPage: page,
            next_page,
            prev_page,
            prev_path: prev_page ? `/chamados?page=${prev_page}` : false,
            next_path: next_page ? `/chamados?page=${next_page}` : false,
        },
        });
    } catch (err) {
        console.error("Erro em getAllChamados:", err);
        res.status(500).json({
        erro: "erro ao listar chamados",
        detalhe: err.message,
        });
    }
    },
    async responderChamado(req, res) {
        try {
            const id = Number(req.params.id)
            const { chamado_resp } = req.body

            if (!chamado_resp?.trim()) {
                return res.status(400).json({ erro: 'Resposta obrigatória' })
            }

            const result = await chamadosRepository.updateResp(id, {
                chamado_resp: chamado_resp.trim(),
                chamado_status: 'resolvido',
            })

            if (result.rowsAffected[0] > 0) {
                return res.status(200).json({ ok: true, message: 'Chamado respondido com sucesso.' })
            }
            return res.status(404).json({ ok: false, message: 'Chamado não encontrado.' })
        } catch (e) {
            console.error('Erro em responderChamado:', e)
            res.status(500).json({ ok: false, message: 'Erro do servidor', detalhe: e.message })
        }
    },

    async createChamados(req,res){
        try{
            const {
                chamado_user_name,
                chamado_user_email,
                chamado_user_tel,
                chamado_content,
            } = req.body
            const agora = new Date()

            const novoChamado = await chamadosRepository.create({
                chamado_user_name,
                chamado_user_email,
                chamado_user_tel,
                chamado_content,
                tb_user_id : req.user.id,
                dataCriacao: agora
            })
            res.status(200).json({
                message: 'chamado criado com sucesso',
                data:novoChamado
            })
        }catch(e){
            console.error("Erro em creatDemandas:", e)
            res.status(500).json({
                message: 'erro ao enviar chamado ',
                detalhe: e.message
            })
        }
    },
    async EnviarEmail(req,res){
        try{

        //pega o id passado como parametro para fazer a pesquisa 
        const id = req.params.id

        //mensagem enviada pelo admin pelo body
        const {
            email_content
        } = req.body

        //busca pelo id o email do usuario pelo select feito ao banco
        const emailUsuario = await chamadosRepository.respChamado(id)

        //mailer espera 2 parametros, e email da pessoa e o texto, aqui estamos passando os 2
        await mailer(emailUsuario, email_content, id)

        res.status(200).json({
            ok:true,
            email:emailUsuario,
            id: id
        })
        }catch(e){
        console.log("Erro ao enviar email", e)
        res.status(500).json({
            message: "Erro ao responder chamado",
            detalhe: e.message
        })
        }
    }
};


export default chamadosController
