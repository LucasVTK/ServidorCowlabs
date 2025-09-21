import Demandas from "../repositories/DemandasRepository.js";

const demandasController = {
    async readAll (req, res){
        const registros = await RegistroRepository.readAll()
        res.status(200).json(registros)
        console.log(registros)
    },


  async filterDemandas(req, res) {
    const { demanda_tag } = req.body

    let demandas;

    if (!demanda_tag) {
      demandas = await Demandas.readAll();
      return res.status(200).json({
        total: demandas.length,
        items: demandas,
      });
    } else {
      // se não mandar tag, retorna todas
      demandas = await Demandas.readByTag(demanda_tag);
      return res.status(200).json({
        total: demandas.length,
        items: demandas,
      });
    }
  },
};

export default demandasController;
