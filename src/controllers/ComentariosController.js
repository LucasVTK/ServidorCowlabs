import ComentariosRepository from "../repositories/ComentariosRepository.js";

const ComentariosController = {

  async getByDemandaId(req, res) {
    try {
      const demanda_id = Number(req.params.id);

      if (!demanda_id || Number.isNaN(demanda_id)) {
        return res.status(400).json({ error: "ID de demanda inválido." });
      }

      const comentarios = await ComentariosRepository.getByDemandaId(demanda_id);

      return res.status(200).json(comentarios);
    } catch (e) {
      console.error("Erro ao buscar comentários:", e);
      return res.status(500).json({ error: "Erro ao buscar comentários.", detalhe: e.message });
    }
  },

  async create(req, res) {
    try {
      const demanda_id = Number(req.params.id);
      const user_id    = req.user.id;
      const { conteudo } = req.body;

      if (!demanda_id || Number.isNaN(demanda_id)) {
        return res.status(400).json({ error: "ID de demanda inválido." });
      }

      if (!conteudo || conteudo.trim() === "") {
        return res.status(400).json({ error: "O comentário não pode estar vazio." });
      }

      const novo = await ComentariosRepository.create({
        demanda_id,
        user_id,
        coment_content: conteudo.trim(),
      });

      return res.status(201).json({
        ok: true,
        coment_id: novo.coment_id,
        message: "Comentário criado com sucesso.",
      });
    } catch (e) {
      console.error("Erro ao criar comentário:", e);
      return res.status(500).json({ error: "Erro ao criar comentário.", detalhe: e.message });
    }
  },
};

export default ComentariosController;
