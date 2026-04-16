import DemandasRepository from "../repositories/CrudDemandaRepository.js";

const CrudDemandaController = {
  async getAllDemandas(req, res) {
    try {
      let { page } = req.query;
      let limit = 10;
    
      page = parseInt(page);
      limit = parseInt(limit);
    
      if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
        return res.status(400).json({
          erro: "parametro da paginação errado"
        });
      }
      const { dados, total } = await DemandasRepository.readAll(page, limit);
    
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
          prev_path: prev_page ? `/demandas?page=${prev_page}` : false,
          next_path: next_page ? `/demandas?page=${next_page}` : false
        }
      });
    
    } catch (err) {
  console.error("Erro em getAllDemandas:", err);
  res.status(500).json({
    erro: "erro ao listar demandas",
    detalhe: err.message
  });
}
  },
 async getDemandasById(req, res) {
  const { id } = req.params;
  const demanda = await DemandasRepository.readById(id);

  if (!demanda || demanda.length === 0) {
    return res.status(404).json({
      message: "Demanda não encontrada!",
      erro: true,
    });
  }

  return res.status(200).json(demanda[0]);
},
  async getDemandasByTag(req, res) {
    const { demanda_tag } = req.params;
    const demanda = await DemandasRepository.readByTag(demanda_tag);
    if (!demanda) {
      res.status(404).json({
        message: "Demanda não encontrada!",
        erro: true,
      });
    } else {
      res.status(200).json({
        total: demanda.length,
        items: demanda,
      });
    }
  },

 async creatDemandas(req, res) {
  try {
    const {
      data_curso,
      user_demanda,
      demanda_title,
      demanda_content,
      demanda_tag
    } = req.body;

    const agora = new Date();

    const novaDemanda = await DemandasRepository.create({
      data_curso,
      user_demanda,
      demanda_title,
      demanda_content,
      demanda_tag,
      demanda_file: null,
      demanda_create_data: agora,
      tb_user_user_id: req.user?.id || req.body.tb_user_user_id || null,
      demandas_status: "aberta",
      demandas_status_date: null
    });

    res.status(200).json({
      message: "Demanda criada com sucesso",
      data: novaDemanda
    });
  } catch (err) {
    console.error("Erro em creatDemandas:", err);
    res.status(500).json({
      erro: "erro ao criar demanda",
      detalhe: err.message
    });
  }
},
  async updateDemanda(req, res) {
  try {
    const demanda_id = Number(req.params.id);

    const {
      demanda_title,
      demanda_content
    } = req.body;

    const demandaAtualizada = await DemandasRepository.update(demanda_id, {
      demanda_title,
      demanda_content
    });

    return res.status(200).json({
      message: "Demanda atualizada com sucesso.",
      data: demandaAtualizada
    });
  } catch (error) {
    console.error("Erro ao atualizar demanda:", error);
    return res.status(500).json({
      error: "Erro ao atualizar demanda."
    });
  }
},
 async deleteDemanda(req, res) {
  try {
    const demanda_id = Number(req.params.id);
    console.log("DELETE demanda_id:", demanda_id);
    console.log("DELETE req.user:", req.user);

    const result = await DemandasRepository.delete(demanda_id);

    return res.status(200).json({
      message: "Demanda excluída com sucesso."
    });
  } catch (error) {
    console.error("Erro ao excluir demanda:", error);
    return res.status(500).json({
      error: "Erro ao excluir demanda.",
      detalhe: error.message
    });
  }
}
}

export default CrudDemandaController;
