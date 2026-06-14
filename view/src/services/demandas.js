import nav from "../components/nav.js";
import footer from "../components/footer.js";
import loaderDemandas from "../components/loaderDemandas.js";
import selectDemanda from "../components/selectDemanda.js";
import { requireAuth } from "./auth.js";
import myModal from "../components/mymodal.js";
import { API_URL } from "./api.js";

let demandaEmEdicaoId = null;

document.addEventListener("DOMContentLoaded", async () => {
  nav();

  const auth = requireAuth("../pages/login.html");
  if (!auth) return;

  const { user, token } = auth;

  // Exibe o botão de publicar demanda apenas para usuários logados
  const btnAbrir = document.getElementById("btn-abrir-modal");
  if (btnAbrir) btnAbrir.classList.remove("d-none");

  configurarSubmitDemanda(user, token);
  configurarFiltros();

  footer();

  await loaderDemandas(1);

  // Seleciona demanda após renderização dos cards
  selectDemanda();
});

// ── Criar / Editar demanda ───────────────────────────────────────────────────

function configurarSubmitDemanda(user, token) {
  const formDemanda = document.getElementById("form-demanda");
  if (!formDemanda) return;

  // Reseta para modo criação quando o modal for aberto
  const modalEl = document.getElementById("modalDemanda");
  if (modalEl) {
    modalEl.addEventListener("show.bs.modal", () => {
      if (!demandaEmEdicaoId) resetModalParaCriacao();
    });
  }

  formDemanda.addEventListener("submit", async (e) => {
    e.preventDefault();
    await publicarDemanda(user, token);
  });
}

async function publicarDemanda(user, token) {
  const tituloDemanda = document.getElementById("novaDemanda")?.value.trim();
  const textoDemanda  = document.getElementById("textoDemanda")?.value.trim();
  const cursoSelect   = document.getElementById("cursoDemanda");
  const cursoDemanda  = cursoSelect?.value.trim();

  if (!tituloDemanda || !textoDemanda || !cursoDemanda) {
    myModal("Preencha todos os campos.", { type: "warning" });
    return;
  }

  const payload = {
    user_demanda:    user.email || user.user_email || "",
    data_curso:      cursoDemanda,
    demanda_title:   tituloDemanda,
    demanda_content: textoDemanda,
    demanda_tag:     cursoDemanda,
    tb_user_user_id: user.id || "",
  };

  if (!payload.user_demanda || !payload.tb_user_user_id) {
    myModal("Dados do usuário incompletos. Faça login novamente.", { type: "danger" });
    return;
  }

  try {
    let response;

    if (demandaEmEdicaoId) {
      response = await fetch(`${API_URL}/demandas/update/${demandaEmEdicaoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          demanda_title:   payload.demanda_title,
          demanda_content: payload.demanda_content,
        }),
      });
    } else {
      response = await fetch(`${API_URL}/demandas/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.erro || data.error || "Erro ao salvar demanda");
    }

    // Fecha o modal Bootstrap
    const bsModal = bootstrap.Modal.getInstance(document.getElementById("modalDemanda"));
    if (bsModal) bsModal.hide();

    myModal(
      demandaEmEdicaoId ? "Demanda atualizada com sucesso!" : "Demanda criada com sucesso!",
      { type: "success" }
    );

    resetModalParaCriacao();
    demandaEmEdicaoId = null;

    await loaderDemandas(1);
    selectDemanda();

  } catch (error) {
    console.error("Erro ao salvar demanda:", error);
    myModal(error.message, { type: "danger", title: "Erro ao salvar demanda" });
  }
}

function resetModalParaCriacao() {
  const form = document.getElementById("form-demanda");
  if (form) form.reset();
  const label = document.getElementById("modalDemandaLabel");
  if (label) label.textContent = "Publicar Demanda";
  const btn = document.getElementById("btn-publicar-demanda");
  if (btn) btn.textContent = "Publicar";
}

// ── Filtros ──────────────────────────────────────────────────────────────────

function configurarFiltros() {
  const formDropdown = document.getElementById("form_filter_dropdown");
  const clearFilterSm = document.getElementById("filter_btn_sm");

  if (formDropdown) {
    formDropdown.addEventListener("change", () => {
      filtrarCardsJaRenderizados("form_filter_dropdown");
    });
  }

  if (clearFilterSm) {
    clearFilterSm.addEventListener("click", () => {
      if (formDropdown) formDropdown.reset();
      loaderDemandas(1).then(() => selectDemanda());
    });
  }
}

function filtrarCardsJaRenderizados(formID) {
  const form = document.getElementById(formID);
  const cards = document.querySelectorAll(".row_cards > .col-12");

  if (!form || !cards.length) return;

  const cursosSelecionados = Array.from(
    form.querySelectorAll('input[type="checkbox"]:checked')
  ).map((cb) => normalizarTexto(cb.value));

  cards.forEach((card) => {
    const cursoBruto = card.dataset.curso || "";
    const cursosDoCard = cursoBruto
      .split(",")
      .map(normalizarTexto)
      .filter(Boolean);

    const deveMostrar =
      cursosSelecionados.length === 0 ||
      cursosDoCard.some((c) => cursosSelecionados.includes(c));

    card.classList.toggle("d-none", !deveMostrar);
  });
}

function normalizarTexto(texto) {
  return (texto || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();
}

// ── Expostos globalmente para loaderDemandas.js ───────────────────────────────

window.definirDemandaEmEdicao = function (id) {
  demandaEmEdicaoId = Number(id);
  // Atualiza labels do modal para modo edição
  const label = document.getElementById("modalDemandaLabel");
  if (label) label.textContent = "Editar Demanda";
  const btn = document.getElementById("btn-publicar-demanda");
  if (btn) btn.textContent = "Salvar alterações";
};
