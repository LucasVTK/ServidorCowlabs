import DemandasRepository from "../repositories/CrudDemandaRepository.js";

const validarDemandas = {

//verifica se is camos existem
  verificarCamposdaDemanda(req, res, next) {
    const {
      data_curso,
      user_demanda,
      demanda_title,
      demanda_content,
      demanda_tag,
    } = req.body;

    // verifica se algum campo está vazio
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

      return res.status(400).json({
        error: "O título deve ter entre 5 e 20 caracteres."
      });

    }

    if (demanda_content.length < 10 || demanda_content.length > 300) {
      return res.status(400).json({
        error: "O conteúdo deve ter entre 10 e 300 caracteres."
      });
    }

    next();

  },

// verifica id valido
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

    }
    else if (!/^[A-Za-z_]+$/.test(demanda_tag)) {
      return res.status(400).json({
        error: "A tag deve conter apenas letras e underscores.",
      });

    }

    next();

  },

  async verificarDonoDaDemanda(req, res, next) {
    try {
      // pega id da URL
      const demanda_id = Number(req.params.id);

      // valida id
      if (!demanda_id) {

        return res.status(400).json({
          error: "ID inválido"
        });

      }

      // busca demanda no banco
      const demanda = await DemandasRepository.readById(demanda_id);

      // se não existir
      if (!demanda || demanda.length === 0) {
        return res.status(404).json({
          error: "Demanda não encontrada"
        });

      }
      const demandaEncontrada = demanda[0];

      // verifica se usuário logado é dono
      if (demandaEncontrada.tb_user_user_id !== req.user.id) {
        return res.status(403).json({
          error: "Você não tem permissão para alterar esta demanda."
        });
      }
      next();

    }
    catch (error) {
      console.error("Erro ao verificar dono da demanda:", error);
      return res.status(500).json({
        error: "Erro interno ao verificar permissões."
      });
    }
  },
};

export default validarDemandas;