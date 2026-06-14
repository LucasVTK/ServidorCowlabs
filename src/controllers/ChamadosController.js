import chamadosRepository from "../repositories/ChamadosRepository.js";

const chamadosController = {
    async getAllChamados(req, res) {
    try {
        let { page } = req.query;
        let limit = 5;

        page = parseInt(page);
        limit = parseInt(limit);

        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
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
    }
};


export default chamadosController
