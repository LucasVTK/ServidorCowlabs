export default async function loaderDemandas(page) {
  if (!page || page == "" || page == null) {
    page = 1;
  }

  const URL = `http://localhost:3000/demandas?page=${page}`;
  const resp = await fetch(URL);
  const response = await resp.json();

  const dados = response.dados;

  const cards = document.querySelector(".row_cards");

  if (dados) {
    cards.innerHTML = "";
    console.log(dados);

    dados.forEach((d) => {
      cards.innerHTML += `
        <div class="col-12" data-curso="${``}">
        <div class="card mb-4">
          <div class="card-body">
            <div class="name_user">
              <span>
                <img  class="imagem-user"  src="/view/src/img/ImagemUser.jpg"" class="rounded-circle" alt="">
                <span class="fs-5 fw-bold user_name">${d.user_name}</span>
              </span>
            </div>
            <h4 class="titulo">${d.demanda_title}</h4>
            <p class="card-text mb-0 descricao">${d.demanda_content}</p>
            <span class="curso-tag d-none">${``}</span>
          </div>
          <div class="row justify-content-end m-2">
            <div class="btn-group col-auto mt-auto">
              <button type="button" class="btn demanda_btn">Ver demanda</button>
            </div>
          </div>
        </div>
      </div>
      `;
    });
  }

  const pagination = response.paginacao;
  // console.log(pagination)

  const navpages = document.querySelector(".navpages");
  // console.log(navpages)

  if (pagination) {
    navpages.innerHTML = "";
    const currentPage = pagination.currentPage;

    if (currentPage > 1) {
      navpages.innerHTML += `
        <li class="page-item">
          <a class="page-link" href="#" data-page="${currentPage - 1}">Anterior</a>
        </li>`;
    } else {
      navpages.innerHTML += `
        <li class="page-item disabled">
          <a class="page-link">Anterior</a>
        </li>`;
    }

    for (let i = 1; i <= pagination.pages; i++) {
      navpages.innerHTML += `
        <li class="page-item ${i === currentPage ? "active" : ""}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>`;
    }

    if (currentPage < pagination.pages) {
      navpages.innerHTML += `
        <li class="page-item">
          <a class="page-link" href="#" data-page="${currentPage + 1}">Próxima</a>
        </li>`;
    } else {
      navpages.innerHTML += `
        <li class="page-item disabled">
          <a class="page-link">Próxima</a>
        </li>`;
    }

    navpages.querySelectorAll(".page-link[data-page]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault(); // <- impede o reload
        loaderDemandas(Number(e.target.dataset.page));
      });
    });
  }
}
