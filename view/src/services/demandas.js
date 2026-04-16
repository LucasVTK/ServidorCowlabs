import footer from "../components/footer.js";
import loaderDemandas from "../components/loaderDemandas.js";
import { requireAuth } from "../services/auth.js";
import { renderUserMenu } from "../components/userMenu.js";

const API_URL = "http://localhost:3000";

// controla se o modal está criando ou editando
let demandaEmEdicaoId = null;

// verifica a autenticaçao
document.addEventListener("DOMContentLoaded", async () => {
  const auth = requireAuth("../pages/login.html");
  if (!auth) return;

  const { user, token } = auth;

  console.log("DOMContentLoaded rodou");
  console.log("form-demanda encontrado?", document.getElementById("form-demanda"));

  // monta o menu
  renderUserMenu(user, {
    demandasPath: "../pages/demandas.html",
    profilePath: "../pages/profile.html",
    adminPath: "../pages/profile.html",
    rolePath: "../pages/profile.html",
    imageBasePath: "../img/profile_img/",
  });

  //registra os eventos da páginao
  configurarSubmitDemanda();
  configurarFiltros();
  footer();
  // carrega a pagina de demanda
  await loaderDemandas(1);
});

// procura o formulario pelo id e regitra o evento so nele (submit que envia o formulario)
function configurarSubmitDemanda() {
  const formDemanda = document.getElementById("form-demanda");

  console.log("configurarSubmitDemanda foi chamada");
  console.log("formDemanda:", formDemanda);

  if (!formDemanda) return;

  formDemanda.addEventListener("submit", async (e) => {
    e.preventDefault();
    await publicarDemanda();
  });
}

async function publicarDemanda() {
  const formDemanda = document.getElementById("form-demanda");
  const auth = requireAuth("../pages/login.html");
  if (!auth) return;

  const { user, token } = auth;

  const tituloDemanda = document.getElementById("novaDemanda").value.trim();
  const textoDemanda = document.getElementById("textoDemanda").value.trim();

  if (!tituloDemanda || !textoDemanda) {
    alert("Preencha todos os campos.");
    return;
  }
//estou dizendo oque pegar
  // pacode de dados para enviar para api, dados esse que sao obrigatorios no middleware
const payload = {
  user_demanda: user.email || "",
  data_curso: "Administração",
  demanda_title: tituloDemanda,
  demanda_content: textoDemanda,
  demanda_tag: "Administração",
  tb_user_user_id: user.id || "",
};
console.log("user completo:", user);
console.log("payload final:", payload);

//verificaçoes da informaçoes
if (
  !payload.user_demanda ||
  !payload.data_curso ||
  !payload.demanda_title ||
  !payload.demanda_content ||
  !payload.demanda_tag ||
  !payload.tb_user_user_id
) {
  console.error("Payload inválido:", payload);
  alert("Os dados do usuário logado estão incompletos. Veja o console.");
  return;
}

 // manda requisição create ou update
try {
  let response;

  //se tiver editando faz isso
  if (demandaEmEdicaoId) {
    response = await fetch(
      `${API_URL}/demandas/${demandaEmEdicaoId}`,
      { method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          demanda_title: payload.demanda_title,
          demanda_content: payload.demanda_content,
        }),
      });
    }
  // se nao faz isso
  else {
    response = await fetch(
      `${API_URL}/demandas/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );
  }

  const data = await response.json();
  console.log("status:", response.status);
  console.log("resposta:", data);

  if (!response.ok) {
    throw new Error(
      data.message ||
      data.erro ||
      data.error ||
      "Erro ao salvar demanda"
    );
  }

  
  const modalEl = document.getElementById("modalDemanda");
  const modal = bootstrap.Modal.getInstance(modalEl);
    // fecha modal
  if (modal) {
    modal.hide();
  }

  alert(
    demandaEmEdicaoId
      ? "Demanda atualizada com sucesso!"
      : "Demanda criada com sucesso!"
  );

  // limpar form
  if (formDemanda) {
    formDemanda.reset();
  }
  //retorn a para mode de criaçao
  demandaEmEdicaoId = null;

  // recarregar lista
  await loaderDemandas(1);
} catch (error) {
  console.error("Erro ao salvar demanda:", error);
  alert(error.message);
}
}

function configurarFiltros() {
  const formSidebar = document.getElementById("form_filter_sidebar");
  const formDropdown = document.getElementById("form_filter_dropdown");
  const clearFilter = document.getElementById("clear_filter");
  const clearFilterSm = document.getElementById("filter_btn_sm");

  if (formSidebar) {
    formSidebar.addEventListener("change", () => {
      filtrarCardsJaRenderizados("form_filter_sidebar");
    });
  }

  if (formDropdown) {
    formDropdown.addEventListener("change", () => {
      filtrarCardsJaRenderizados("form_filter_dropdown");
    });
  }

  if (clearFilter) {
    clearFilter.addEventListener("click", () => {
      formSidebar.reset();
      loaderDemandas(1);
    });
  }

  if (clearFilterSm) {
    clearFilterSm.addEventListener("click", () => {
      formDropdown.reset();
      loaderDemandas(1);
    });
  }
}
 // filtra os cards da tela
function filtrarCardsJaRenderizados(formID) {
  const form = document.getElementById(formID);
  const cards = document.querySelectorAll(".row_cards > .col-12");

  if (!form) {
    console.log("Form não encontrado:", formID);
    return;
  }

  if (!cards.length) {
    console.log("Nenhum card encontrado para filtrar.");
    return;
  }

  const cursosSelecionados = Array.from(
    form.querySelectorAll('input[type="checkbox"]:checked')
  ).map((checkbox) => normalizarTexto(checkbox.value));

  cards.forEach((card) => {
    const cursoBruto = card.dataset.curso || "";
    const cursosDoCard = cursoBruto
      .split(",")
      .map((curso) => normalizarTexto(curso))
      .filter(Boolean);

    const deveMostrar =
      cursosSelecionados.length === 0 ||
      cursosDoCard.some((curso) => cursosSelecionados.includes(curso));

    if (deveMostrar) {
      card.classList.remove("d-none");
    } else {
      card.classList.add("d-none");
    }
  });
}

function normalizarTexto(texto) {
  return (texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}
//guarda o id da demanda
window.definirDemandaEmEdicao = function (id) {
  demandaEmEdicaoId = Number(id);
};
// expõe a função para o botão onclick do HTML
window.publicarDemanda = publicarDemanda;


window.logout = function () {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("LogedUser");
    window.location.href = "../pages/login.html";
}