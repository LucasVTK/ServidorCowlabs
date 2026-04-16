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
      console.log(err);
      res.status(500).json({
        erro: "erro"
      });
    }
  },
  async getDemandasById(req, res) {
    const { id } = req.params;
    const demanda = await DemandasRepository.readById(id);
    if (!demanda) {
      res.status(404).json({
        message: "Demanda não encontrada!",
        erro: true,
      });
    } else {
      res.status(200).json(demanda);
    }
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
    const {
      data_curso,
      user_demanda,
      demanda_title,
      demanda_content,
      demanda_tag,
      file_location,
    } = req.body;

    const novaDemanda = await DemandasRepository.create({
      data_curso,
      user_demanda,
      demanda_title,
      demanda_content,
      demanda_tag,
      file_location,
    });

    res.status(200).json({
      itemAdicionado: novaDemanda
    });
  },
  async updateDemandas(req, res) {
    const { id } = req.params;
    const {
      data_curso,
      user_demanda,
      demanda_title,
      demanda_content,
      demanda_tag,
      file_location,
    } = req.body;

    const demandaAtualizada = await DemandasRepository.update(id, {
      data_curso,
      user_demanda,
      demanda_title,
      demanda_content,
      demanda_tag,
      file_location,
    });

    res.status(200).json(
    {
      itemUpdate:demandaAtualizada
    });
  },
  async deleteDemandas(req, res) {
  //ainda n criado
  },
};

export default CrudDemandaController;
