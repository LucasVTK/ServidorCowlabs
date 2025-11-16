const validarDemandas = {
  verificarCamposdaDemanda(req, res, next) {
    const {
      data_curso,
      user_demanda,
      demanda_title,
      demanda_content,
      demanda_tag,
    } = req.body;
    if (
      !data_curso ||
      !user_demanda ||
      !demanda_title ||
      !demanda_content ||
      !demanda_tag
    ) {
      return res.status(400).json({
        error: "Todos os campos são obrigatórios.",
      });
    }
    next();
  },

  verificarTiposDeDados(req, res, next) {
    const {
      data_curso,
      user_demanda,
      demanda_title,
      demanda_content,
      demanda_tag,
    } = req.body;
    if (
      typeof data_curso !== "string" ||
      typeof user_demanda !== "string" ||
      typeof demanda_title !== "string" ||
      typeof demanda_content !== "string" ||
      typeof demanda_tag !== "string"
    ) {
      return res.status(400).json({
        error: "Todos os campos devem ser do tipo string.",
      });
    }
    next();
  },

  verificarComprimento(req, res, next) {
    const { demanda_title, demanda_content } = req.body;
    if (demanda_title.length < 5 || demanda_title.length > 20) {
      return res
        .status(400)
        .json({ error: "O título deve ter entre 5 e 20 caracteres." });
    }
    if (demanda_content.length < 10 || demanda_content.length > 300) {
      return res.status(400).json({
        error: "O conteúdo deve ter entre 10 e 300 caracteres.",
      });
    }
    next();
  },

  verificarIdValido(req, res, next) {
    const { id } = req.params;
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        error: "ID inválido. Deve ser um número inteiro.",
      });
    }
    next();
  },

  verificarTagValida(req, res, next) {
    const { demanda_tag } = req.params;
    if (
      !demanda_tag ||
      typeof demanda_tag !== "string" ||
      demanda_tag.trim() === ""
    ) {
      return res.status(400).json({
        error: "Tag inválida. Deve ser uma string não vazia.",
      });
    } else if (!/^[A-Za-z_]+$/.test(demanda_tag)) {
      return res.status(400).json({
        error: "A tag deve conter apenas letras e underscores (sem números).",
      });
    }
    next();
  },

  verificarPermissoes(req, res, next) {
    //fazer verificação jwt
    next();
  },
};

export default validarDemandas;
