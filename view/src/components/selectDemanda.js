export default function selectDemanda() {
  // vamos usar o queryselectorall para aplicar a função a todos os botões que já existem na página
  const botoes = document.querySelectorAll(".demanda_btn");

  console.log(botoes);
  // a query selector cria um vetor com cada um dos botões. Por isso, vamos usar um forEach para incluir um escutador de evento click nesses botões

  botoes.forEach((botao) => {
    botao.addEventListener("click", function () {
      // vamos usar o closest para buscar o elemento pai a que está vinculado o botão, assim poderemos pegar os dados dentro do card selecionado
      const card = botao.closest(".card");

      // Vamos capturar os dados que transportaremos para a página criada
      const nomeUsuario = card.querySelector(".user_name").innerHTML;
      const titulo = card.querySelector(".titulo").innerHTML;
      const descricao = card.querySelector(".descricao").innerHTML;

      // Para não perdermos a informação e podermos usá-la na próxima página vamos criar um objeto para gravar no localstorage
      const dadosDemanda = {
        usuario: nomeUsuario,
        titulo: titulo,
        descricao: descricao,
      };

      // Agora que o objeto foi criado, vamos salvá-lo no local storage
      localStorage.setItem("demandaSelecionada", JSON.stringify(dadosDemanda));

      // depois que o objeto foi gravado, podemos chamar a próxima página, que conterá uma função para carregar as informações já salvas no localstorage
      window.location.href = "/src/demanda_view/index.html";
    });
  });
}