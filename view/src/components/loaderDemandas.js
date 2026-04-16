import { requireAuth } from "../services/auth.js";

// necessário para pegar usuário logado
export default async function loaderDemandas(page) {

  // pega o user logado
  const auth = requireAuth("../pages/login.html");
  if (!auth) return;

  // precisamos do id do usuário e token
  const { user, token } = auth;
  
  // se nenhuma página for informada, começa na página 1
  if (!page || page === "" || page === null) {
    page = 1;
  }

  const URL = `http://localhost:3000/demandas?page=${page}`;

  try {
    const resp = await fetch(URL);

    if (!resp.ok) {
      throw new Error(`Erro HTTP ${resp.status}`);
    }

    const response = await resp.json();
    const dados = response.dados;
    const cards = document.querySelector(".row_cards");

    if (!cards) return;

    // limpa os cards antes de renderizar a nova página
    cards.innerHTML = "";

    if (dados && dados.length > 0) {

      dados.forEach((d) => {

        //verifica se o user é o dono da demanda
        const ehDono =
          Number(d.tb_user_user_id) === Number(user.id);

        cards.innerHTML += `
          <div class="col-12" data-curso="${d.cursos || ""}">
            <div class="card mb-4">
              <div class="card-body">
                <div class="name_user">
                  <span>
                    <img 
                      class="imagem-user"
                      src="/view/src/img/ImagemUser.jpg"
                      class="rounded-circle"
                      alt=""
                    >
                    <span class="fs-5 fw-bold user_name">
                      ${d.user_name || "Usuário"}
                    </span>
                  </span>
                </div>
                <h4 class="titulo">
                  ${d.demanda_title || ""}
                </h4>

                <p class="card-text mb-0 descricao">
                  ${d.demanda_content || ""}
                </p>
                <span class="curso-tag d-none">
                  ${d.cursos || ""}
                </span>

              </div>
              <div class="row justify-content-end m-2">
                <div class="btn-group col-auto mt-auto">
                  <button 
                    type="button"
                    class="btn demanda_btn"
                  >
                    Ver demanda
                  </button>

                  ${ehDono
            ? `
                    <!--só aparece para o dono -->

                    <button 
                      class="btn btn-editar"
                      data-id="${d.demanda_id}"
                    >
                      Editar
                    </button>

                    <button 
                      class="btn btn-danger btn-excluir"
                      data-id="${d.demanda_id}"
                    >
                      Excluir
                    </button>
                  `
            : ""
          }
                </div>
              </div>
            </div>
          </div>
        `;
      });
    }

    else {

      cards.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;text-align:center;min-height:50vh">
          <p>Oops. Nenhuma demanda encontrada!</p>
          <img src="/view/src/img/sad_cow.gif" style="width:80px;height:auto;">
        </div>
      `;
    }
    // ativa evento de excluir e editar
    configurarEventosExcluir(token);
    configurarEventosEditar();

    //paginação
    const pagination = response.paginacao;
    const navpages = document.querySelector(".navpages");

    if (!navpages || !pagination) return;

    navpages.innerHTML = "";
    const currentPage = pagination.currentPage;

    if (currentPage > 1) {

      navpages.innerHTML += `
        <li class="page-item">
          <a class="page-link" href="#" data-page="${currentPage - 1}">
            Anterior
          </a>
        </li>`;
    }

    else {
      navpages.innerHTML += `
        <li class="page-item disabled">
          <a class="page-link">Anterior</a>
        </li>`;
    }

    for (let i = 1; i <= pagination.pages; i++) {

      navpages.innerHTML += `
        <li class="page-item ${i === currentPage ? "active" : ""}">
          <a class="page-link" href="#" data-page="${i}">
            ${i}
          </a>
        </li>`;
    }
    
    if (currentPage < pagination.pages) {

      navpages.innerHTML += `
        <li class="page-item">
          <a class="page-link" href="#" data-page="${currentPage + 1}">
            Próxima
          </a>
        </li>`;
    }
    else {
      navpages.innerHTML += `
        <li class="page-item disabled">
          <a class="page-link">Próxima</a>
        </li>`;
    }

    navpages
      .querySelectorAll(".page-link[data-page]")
      .forEach((link) => {

        link.addEventListener("click", (e) => {

          e.preventDefault();

          loaderDemandas(
            Number(e.target.dataset.page)
          );
        });
      });
  }
  catch (error) {
    console.error("Erro ao carregar demandas:", error);
    const cards = document.querySelector(".row_cards");

    if (cards) {
      cards.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;text-align:center;min-height:50vh">
          <p>Erro ao carregar demandas.</p>
        </div>
      `;
    }
  }
}

//funçao de excluir demanda
function configurarEventosExcluir(token) {
  document
    .querySelectorAll(".btn-excluir")
    .forEach((btn) => {
      btn.addEventListener("click", async () => {

        const id = btn.dataset.id;
        //confirmação antes de excluir
        const confirmar =
          confirm("Deseja excluir esta demanda?");

        if (!confirmar) return;
        
        //faz a requisiçao 
        try {
          const response = await fetch(
            `http://localhost:3000/demandas/delete/${id}`,
            {
               method: "delete",
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          if (!response.ok) {
            throw new Error("Erro ao excluir");
          }
          alert("Demanda excluída!");

          // recarrega lista
          loaderDemandas(1);
        }

        catch (error) {
          console.error(error);
          alert("Erro ao excluir");
        }
      });
    });
}

function configurarEventosEditar() {
  document.querySelectorAll(".btn-editar")
    .forEach(btn => {
      btn.addEventListener("click", () => {

        const id = btn.dataset.id;
        const card = btn.closest(".card");
        const titulo = card.querySelector(".titulo").textContent.trim();
        const descricao = card.querySelector(".descricao").textContent.trim();

        //info modal
        document.getElementById("novaDemanda").value = titulo;
        document.getElementById("textoDemanda").value = descricao;

        // edita modal
        document.getElementById("modalDemandaLabel").textContent = "Editar Demanda";
        document.getElementById("btn-publicar-demanda").textContent = "Salvar alterações";

        //global define ediçao
        window.definirDemandaEmEdicao(id);

        // abre modal
        const modal = new bootstrap.Modal(
          document.getElementById("modalDemanda")
        );
        modal.show();

      });

    });
}



