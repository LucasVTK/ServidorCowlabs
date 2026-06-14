import nav from "../components/nav.js";
import footer from "../components/footer.js";
import myModal from "../components/mymodal.js";
import { requireAuth } from "./auth.js";
import { API_URL } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  nav();

  const auth = requireAuth("../pages/login.html");
  if (!auth) return;

  const { user, token } = auth;

  const tipo = (user.tipo || user.user_tipo || "").toLowerCase();
  if (!tipo.includes("prof") && !tipo.includes("admin")) {
    await myModal("Acesso restrito a professores.", { type: "danger", title: "Sem permissão" });
    window.location.href = "../pages/brickwall.html";
    return;
  }

  renderTeacherHeader(user);
  await carregarAtividade(user.id, token);
  bindBotoesEmProducao();

  footer();
});

function renderTeacherHeader(user) {
  const nomeEl = document.getElementById("teacher-nome");
  const roleEl = document.getElementById("teacher-role");
  if (nomeEl) nomeEl.textContent = user.user_real_name || user.user_name || user.email || "Professor";
  if (roleEl) roleEl.textContent = user.tipo || user.user_tipo || "Professor";
}

// ── Atividade / KPIs ─────────────────────────────────────────────────────────

async function carregarAtividade(userId, token) {
  try {
    // GET /users/:id/activity → { horas_trabalhadas, projetos_realizados, projetos_em_execucao, ... }
    const res = await fetch(`${API_URL}/users/${userId}/activity`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.warn("Atividade ainda não disponível");
      return;
    }

    const activity = await res.json();

    const horasEl = document.getElementById("teacher-horas");
    if (horasEl) horasEl.textContent = activity.horas_trabalhadas ?? "—";

    // TODO: Criar campos específicos de professor no retorno de /users/:id/activity:
    // { alunos_orientados: number, projetos_ativos: number, horas_trabalhadas: number }

  } catch (e) {
    console.warn("Erro ao carregar atividade do professor:", e.message);
  }
}

// ── Botões ainda sem backend ──────────────────────────────────────────────────

function bindBotoesEmProducao() {
  // "Sugerir Nova Demanda" — funcionalidade planejada para professores
  // TODO: Criar endpoint POST /demandas/sugerir que vincula a demanda a um professor orientador
  const btnSugerir = document.getElementById("btn-sugerir-demanda");
  if (btnSugerir) {
    btnSugerir.addEventListener("click", async () => {
      await myModal(
        "Sugestão de demandas por professores está sendo implementada.",
        { type: "info", title: "Em produção" }
      );
    });
  }

  // "Enviar incentivo" — aluno sem atividade (ZPD)
  // TODO: Criar endpoint POST /alunos/:id/incentivo → envia notificação para o aluno
  const btnIncentivo = document.getElementById("btn-incentivo");
  if (btnIncentivo) {
    btnIncentivo.addEventListener("click", async () => {
      await myModal(
        "Envio de incentivo para alunos está sendo implementado.",
        { type: "info", title: "Em produção" }
      );
    });
  }

  // Botões de visualizar projetos
  // TODO: Criar endpoint GET /professor/:id/projetos → lista projetos orientados com status
  document.querySelectorAll(".btn-ver-projeto").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await myModal(
        "Visualização de projetos orientados está sendo implementada.",
        { type: "info", title: "Em produção" }
      );
    });
  });

  // Filtro Ativos / Concluídos
  // TODO: Criar endpoint GET /professor/:id/projetos?status=ativo|concluido
  document.querySelectorAll(".btn-filtro-projeto").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await myModal(
        "Filtragem de projetos está sendo implementada.",
        { type: "info", title: "Em produção" }
      );
    });
  });
}
