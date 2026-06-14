export default function selectDemanda() {
  const botoes = document.querySelectorAll(".demanda_btn");

  botoes.forEach((botao) => {
    botao.addEventListener("click", function () {
      const card = botao.closest(".card-premium");

      const nomeUsuario = card.querySelector(".user_name").innerHTML;
      const titulo = card.querySelector(".titulo").innerHTML;
      const descricao = card.querySelector(".descricao").innerHTML;

      // data-id é atribuído pelo loaderDemandas no botão "Ver demanda"
      const demandaId = botao.dataset.id || null;

      const dadosDemanda = {
        id: demandaId,
        usuario: nomeUsuario,
        titulo: titulo,
        descricao: descricao,
      };

      localStorage.setItem("demandaSelecionada", JSON.stringify(dadosDemanda));

      window.location.href = "/view/src/pages/demanda_view.html";
    });
  });
}
