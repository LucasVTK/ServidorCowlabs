import nav from "../components/nav.js";
import footer from "../components/footer.js";
import myModal, { myConfirm } from "../components/mymodal.js";
import { requireAuth } from "./auth.js";
import { API_URL } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  nav();

  const auth = requireAuth("../pages/login.html");
  if (!auth) return;

  const { user, token } = auth;
  _adminToken = token;

  // AuthController.login armazena "tipo" no payload JWT; fallback para "user_tipo"
  const tipo = (user.tipo || user.user_tipo || "").toLowerCase();
  if (!tipo.includes("admin")) {
    await myModal("Acesso restrito a administradores.", { type: "danger", title: "Sem permissão" });
    window.location.href = "../pages/brickwall.html";
    return;
  }

  renderAdminHeader(user);
  initChart();
  await Promise.all([
    carregarKPIs(token),
    carregarTabela(token),
  ]);
  bindResetBase();

  footer();
});

function renderAdminHeader(user) {
  const nomeEl = document.getElementById("admin-nome");
  if (nomeEl) nomeEl.textContent = user.user_real_name || user.user_name || user.email || "Admin";
}

// ── KPIs ─────────────────────────────────────────────────────────────────────

async function carregarKPIs(token) {
  try {
    // Total de usuários — GET /admin/users (retorna array de todos os usuários)
    const resUsers = await fetch(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (resUsers.ok) {
      const users = await resUsers.json();
      setKPI("kpi-users", users.length.toLocaleString("pt-BR"));
    }
  } catch (e) {
    console.warn("KPI usuários indisponível:", e.message);
  }

  try {
    // Total de demandas — GET /demandas?page=1 (usa paginacao.total se disponível)
    const resDemandas = await fetch(`${API_URL}/demandas?page=1`);
    if (resDemandas.ok) {
      const data = await resDemandas.json();
      const total = data.paginacao?.total ?? data.dados?.length ?? 0;
      setKPI("kpi-demandas", total.toLocaleString("pt-BR"));
    }
  } catch (e) {
    console.warn("KPI demandas indisponível:", e.message);
  }

  // TalkUs — endpoint ainda não implementado no backend.
  // TODO: Criar GET /admin/talkus → { total: number, urgentes: number }
  setKPI("kpi-talkus", "—");
  setKPI("kpi-talkus-sub", "Backend em produção");

  // Aprovações pendentes — endpoint ainda não implementado no backend.
  // TODO: Criar GET /admin/pendentes → { total: number }
  setKPI("kpi-pendentes", "—");
}

function setKPI(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// ── Gráfico de crescimento ────────────────────────────────────────────────────

function initChart() {
  const ctx = document.getElementById("growthChart");
  if (!ctx) return;

  // TODO: Criar GET /admin/stats/crescimento → { labels: string[], novosUsuarios: number[] }
  // Substitua os dados abaixo com a resposta do endpoint quando implementado.
  new Chart(ctx.getContext("2d"), {
    type: "line",
    data: {
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
      datasets: [{
        label: "Novos Usuários",
        data: [],
        borderColor: "#006eff",
        tension: 0.4,
        fill: true,
        backgroundColor: "rgba(0, 110, 255, 0.05)",
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
    },
  });
}

// ── Tabela de usuários ────────────────────────────────────────────────────────

async function carregarTabela(token) {
  const tbody = document.getElementById("users-tbody");
  if (!tbody) return;

  try {
    const res = await fetch(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const users = await res.json();

    if (!users || users.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">Nenhum usuário encontrado.</td></tr>`;
      return;
    }

    tbody.innerHTML = users.map((u) => {
      const initials = getInitials(u.user_real_name || u.user_name || "?");
      const nome     = u.user_real_name || u.user_name || "—";
      const tipo     = u.user_tipo   || "—";
      const email    = u.user_email  || "—";
      const status   = u.user_status || "ativo";
      const ativo    = status !== "inativo";
      const userId   = u.user_id || u.id;
      return `
        <tr>
          <td class="ps-4">
            <div class="d-flex align-items-center gap-3">
              <div class="avatar-sm">${initials}</div>
              <div>
                <span class="fw-600 d-block">${nome}</span>
                <small class="text-muted">${email}</small>
              </div>
            </div>
          </td>
          <td><span class="badge bg-secondary">${tipo}</span></td>
          <td>
            ${ativo
              ? `<span class="text-success"><i class="bi bi-circle-fill me-1 small"></i> Ativo</span>`
              : `<span class="text-danger"><i class="bi bi-circle-fill me-1 small"></i> Inativo</span>`}
          </td>
          <td><small class="text-muted">${u.user_create_data ? new Date(u.user_create_data).toLocaleDateString("pt-BR") : "—"}</small></td>
          <td class="text-end pe-4">
            <button class="btn btn-sm btn-light me-1"
              onclick="abrirModalEdicao(${userId}, '${tipo}', '${status}')"
              title="Editar">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-light text-danger"
              onclick="excluirUsuario(${userId}, '${nome}')"
              title="${ativo ? 'Desativar' : 'Já inativo'}">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>`;
    }).join("");

  } catch (e) {
    console.error("Erro ao carregar tabela de usuários:", e);
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger py-4">Erro ao carregar usuários.</td></tr>`;
  }
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ── Ações de usuário ─────────────────────────────────────────────────────────

// token acessível às funções globais (atribuído no DOMContentLoaded abaixo)
let _adminToken = null;

window.abrirModalEdicao = function (id, tipoAtual, statusAtual) {
  const modal = document.getElementById("modalEditarUsuario");
  if (!modal) return;

  modal.dataset.userId = id;

  const tipoSelect   = document.getElementById("edit-user-tipo");
  const statusSelect = document.getElementById("edit-user-status");

  // Força o valor atual do usuário; se não bater com nenhuma option cai no primeiro
  tipoSelect.value   = tipoAtual   || "Aluno";
  statusSelect.value = statusAtual || "ativo";

  if (!tipoSelect.value)   tipoSelect.selectedIndex   = 0;
  if (!statusSelect.value) statusSelect.selectedIndex = 0;

  new bootstrap.Modal(modal).show();
};

window.salvarEdicaoUsuario = async function () {
  const modal  = document.getElementById("modalEditarUsuario");
  const id     = modal?.dataset.userId;
  const tipo   = document.getElementById("edit-user-tipo")?.value;
  const status = document.getElementById("edit-user-status")?.value;

  if (!id || !_adminToken) return;

  try {
    const res = await fetch(`${API_URL}/admin/users/update/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${_adminToken}`,
      },
      body: JSON.stringify({ user_tipo: tipo, user_status: status }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erro ao atualizar");

    bootstrap.Modal.getInstance(modal)?.hide();
    myModal("Usuário atualizado com sucesso!", { type: "success" });
    await carregarTabela(_adminToken);
  } catch (e) {
    myModal(e.message, { type: "danger", title: "Erro ao atualizar" });
  }
};

window.excluirUsuario = async function (id, nome) {
  const ok = await myConfirm(
    `Desativar o usuário "${nome}"? O acesso será bloqueado imediatamente.`,
    { type: "warning", title: "Desativar usuário", okText: "Desativar" }
  );
  if (!ok || !_adminToken) return;

  try {
    const res = await fetch(`${API_URL}/admin/users/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${_adminToken}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erro ao desativar");

    myModal("Usuário desativado com sucesso.", { type: "success" });
    await carregarTabela(_adminToken);
  } catch (e) {
    myModal(e.message, { type: "danger", title: "Erro ao desativar" });
  }
};

// ── Resetar base ─────────────────────────────────────────────────────────────

function bindResetBase() {
  const btn = document.getElementById("btn-reset-base");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const ok = await myConfirm(
      "Esta ação irá apagar TODOS os dados da plataforma. Tem certeza?",
      { type: "danger", title: "Resetar Base de Dados", okText: "Sim, resetar" }
    );
    if (!ok) return;

    // TODO: Criar endpoint DELETE /admin/reset que limpa as tabelas (protegido por admin + senha).
    await myModal(
      "Reset de base de dados está sendo implementado. Em breve disponível.",
      { type: "info", title: "Em produção" }
    );
  });
}
