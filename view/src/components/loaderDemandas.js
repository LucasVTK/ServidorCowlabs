import { requireAuth } from "../services/auth.js";
import myModal, { myConfirm } from "./mymodal.js";
import { API_URL } from "../services/api.js";

// cursos: string CSV e.g. "Medicina,Direito" — null/undefined = sem filtro
export default async function loaderDemandas(page, cursos) {

  const auth = requireAuth("../pages/login.html");
  if (!auth) return;

  const { user, token } = auth;

  if (!page || page === "" || page === null) {
    page = 1;
  }

  const cursosQuery = cursos && cursos.trim()
    ? `&cursos=${encodeURIComponent(cursos.trim())}`
    : "";

  const URL = `${API_URL}/demandas?page=${page}${cursosQuery}`;

  try {
    const resp = await fetch(URL);

    if (!resp.ok) {
      throw new Error(`Erro HTTP ${resp.status}`);
    }

    const response = await resp.json();
    const dados = response.dados;
    const cards = document.querySelector(".row_cards");

    if (!cards) return;

    cards.innerHTML = "";

    if (dados && dados.length > 0) {

      dados.forEach((d) => {

        const ehDono = Number(d.tb_user_user_id) === Number(user.id);

        // Nome e avatar do autor
        const nomeAutor  = d.user_name || "Usuário";
        const avatarSrc  = `https://ui-avatars.com/api/?name=${encodeURIComponent(nomeAutor)}&background=006eff&color=fff&size=30`;

        // Curso — pega apenas o primeiro se vier concatenado
        const cursoLabel = (d.cursos || "").split(",")[0].trim() || "Geral";

        // Tempo relativo de publicação
        const tempo = tempoRelativo(d.demanda_create_data);

        // Botões de dono (editar / excluir) posicionados no cabeçalho do card
        const ownerButtons = ehDono ? `
          <div class="d-flex gap-1">
            <button class="btn btn-sm btn-light rounded-circle btn-editar p-1 lh-1" data-id="${d.demanda_id}" title="Editar">
              <i class="bi bi-pencil" style="font-size:.75rem;pointer-events:none"></i>
            </button>
            <button class="btn btn-sm btn-light text-danger rounded-circle btn-excluir p-1 lh-1" data-id="${d.demanda_id}" title="Excluir">
              <i class="bi bi-trash" style="font-size:.75rem;pointer-events:none"></i>
            </button>
          </div>` : `<small class="text-muted">${tempo}</small>`;

        cards.innerHTML += `
          <div class="col-12 col-md-6 col-lg-4" data-curso="${d.cursos || ""}">
            <div class="card-premium">

              <div class="p-4 flex-grow-1">

                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="badge-tag">${cursoLabel}</span>
                  ${ownerButtons}
                </div>

                <h4 class="card-title-premium titulo mb-2">
                  ${d.demanda_title || ""}
                </h4>

                <p class="card-text-premium descricao">
                  ${d.demanda_content || ""}
                </p>

                <div class="mt-4 d-flex align-items-center gap-2">
                  <img src="${avatarSrc}" class="rounded-2" width="28" alt="${nomeAutor}">
                  <span class="small fw-bold user_name">${nomeAutor}</span>
                  ${ehDono ? "" : `<small class="text-muted ms-auto">${tempo}</small>`}
                </div>

              </div>

              <button
                type="button"
                class="btn-card-footer demanda_btn"
                data-id="${d.demanda_id}"
              >
                Ver detalhes
              </button>

            </div>
          </div>`;
      });
    }

    else {
      cards.innerHTML = `
        <div class="col-12 d-flex flex-column align-items-center text-center py-5">
          <img src="/view/src/img/sad_cow.gif" style="width:80px;height:auto;" class="mb-3" alt="">
          <p class="text-muted">Nenhuma demanda encontrada!</p>
        </div>`;
    }

    configurarEventosExcluir(token);
    configurarEventosEditar();

    // ── Paginação ──────────────────────────────────────────────────────────

    const pagination = response.paginacao;
    const navpages   = document.querySelector(".navpages");

    if (!navpages || !pagination) return;

    navpages.innerHTML = "";
    const currentPage  = pagination.currentPage;

    navpages.innerHTML += currentPage > 1
      ? `<li class="page-item"><a class="page-link" href="#" data-page="${currentPage - 1}">
           <i class="bi bi-chevron-left"></i>
         </a></li>`
      : `<li class="page-item disabled"><a class="page-link"><i class="bi bi-chevron-left"></i></a></li>`;

    for (let i = 1; i <= pagination.pages; i++) {
      navpages.innerHTML += `
        <li class="page-item ${i === currentPage ? "active" : ""}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>`;
    }

    navpages.innerHTML += currentPage < pagination.pages
      ? `<li class="page-item"><a class="page-link" href="#" data-page="${currentPage + 1}">
           <i class="bi bi-chevron-right"></i>
         </a></li>`
      : `<li class="page-item disabled"><a class="page-link"><i class="bi bi-chevron-right"></i></a></li>`;

    // preserva o filtro de cursos ativo ao trocar de página
    const cursosAtivos = pagination.cursos || null;

    navpages.querySelectorAll(".page-link[data-page]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        loaderDemandas(Number(e.target.closest("[data-page]").dataset.page), cursosAtivos);
      });
    });

  } catch (error) {
    console.error("Erro ao carregar demandas:", error);
    const cards = document.querySelector(".row_cards");
    if (cards) {
      cards.innerHTML = `
        <div class="col-12 text-center text-danger py-5">
          <i class="bi bi-exclamation-circle fs-3 d-block mb-2"></i>
          Erro ao carregar demandas. Tente novamente.
        </div>`;
    }
  }
}

// ── Excluir ──────────────────────────────────────────────────────────────────

function configurarEventosExcluir(token) {
  document.querySelectorAll(".btn-excluir").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation(); // evita disparar o "Ver detalhes"

      const id = btn.dataset.id;
      const confirmar = await myConfirm(
        "Deseja excluir esta demanda?",
        { type: "warning", title: "Excluir demanda", okText: "Excluir" }
      );

      if (!confirmar) return;

      try {
        const response = await fetch(`${API_URL}/demandas/delete/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Erro ao excluir");

        myModal("Demanda excluída!", { type: "success" });
        loaderDemandas(1);
      } catch (error) {
        console.error(error);
        myModal("Erro ao excluir demanda.", { type: "danger" });
      }
    });
  });
}

// ── Editar ───────────────────────────────────────────────────────────────────

function configurarEventosEditar() {
  document.querySelectorAll(".btn-editar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // evita disparar o "Ver detalhes"

      const id      = btn.dataset.id;
      const card    = btn.closest(".card-premium");
      const titulo  = card.querySelector(".titulo").textContent.trim();
      const descricao = card.querySelector(".descricao").textContent.trim();

      document.getElementById("novaDemanda").value   = titulo;
      document.getElementById("textoDemanda").value  = descricao;
      document.getElementById("modalDemandaLabel").textContent     = "Editar Demanda";
      document.getElementById("btn-publicar-demanda").textContent  = "Salvar alterações";

      window.definirDemandaEmEdicao(id);

      new bootstrap.Modal(document.getElementById("modalDemanda")).show();
    });
  });
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function tempoRelativo(dataStr) {
  if (!dataStr) return "";
  const diff = Date.now() - new Date(dataStr).getTime();
  const min  = Math.floor(diff / 60000);
  if (min < 1)   return "Agora";
  if (min < 60)  return `Há ${min}m`;
  const h = Math.floor(min / 60);
  if (h < 24)    return `Há ${h}h`;
  const d = Math.floor(h / 24);
  if (d === 1)   return "Ontem";
  return `Há ${d} dias`;
}
