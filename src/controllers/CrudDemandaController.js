import DemandasRepository from '../repositories/DemandasRepository.js';

const CrudDemandaController = {
  async getAllDemandas(req,res){
    const demandas = await DemandasRepository.readAll()
    res.status(200).json({
      total: demandas.length,
      items: demandas,
    });
  },
  async getDemandasById(req,res){
    const {id} = req.params
    const demanda = await DemandasRepository.readById(id)
    if(!demanda){
      res.status(404).json({
        message:'Demanda não encontrada!',
        erro:true
      })
    }else{
      res.status(200).json(demanda)
    }
  },
  async getDemandasByTag(req, res) {
    const { demanda_tag } = req.params; 
    const demanda = await DemandasRepository.readByTag(demanda_tag); 
    if(!demanda){
      res.status(404).json({
        message:'Demanda não encontrada!',
        erro:true
      })
    }else{
      res.status(200).json({
        total: demanda.length,
        items: demanda,
      })
    }
  },
  async creatDemandas(req, res) {
    const {
      data_curso,
      user_demanda,
      demanda_title,
      demanda_content,
      demanda_tag,
      file_location
    } = req.body;

    const novaDemanda = await DemandasRepository.create({
      data_curso,
      user_demanda,
      demanda_title,
      demanda_content,
      demanda_tag,
      file_location
    });

    res.status(200).json(novaDemanda);
  },
  async updateDemandas(req, res) {
    const { id } = req.params; 
    const {
      data_curso,
      user_demanda,
      demanda_title,
      demanda_content,
      demanda_tag,
      file_location
    } = req.body;

    const demandaAtualizada = await DemandasRepository.update(id, {
      data_curso,
      user_demanda,
      demanda_title,
      demanda_content,
      demanda_tag,
      file_location
    }); 

    res.status(200).json(demandaAtualizada);
  },
  async deleteDemandas(req,res){
    const {id} = req.params
    const demandaDeletada = await DemandasRepository.delete(id)
    res.status(200).json(demandaDeletada)
  }
}

export default CrudDemandaController;