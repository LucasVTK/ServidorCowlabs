const validarDemandas = {
  verificarCamposdaDemanda(req, res, next){
    const { data_curso, user_demanda, demanda_title, demanda_content, demanda_tag} = req.body;
    if (!data_curso || !user_demanda || !demanda_title || !demanda_content || !demanda_tag) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }
    next()
  },

}

export default validarDemandas;