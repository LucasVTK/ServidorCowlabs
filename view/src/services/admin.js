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
    carregarChamados(token),
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

  // TalkUs — carregado por carregarChamados(); KPI atualizado lá.

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

// token e mapa de chamados acessíveis às funções globais
let _adminToken  = null;
let _chamadoAtual = null;
const _chamadosMap = new Map();

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

// ── TalkUs / Chamados ────────────────────────────────────────────────────────

function statusBadge(status) {
  const s = (status || "").toLowerCase();
  if (s === "resolvido")   return `<span class="badge bg-success">Resolvido</span>`;
  if (s === "em análise" || s === "em analise") return `<span class="badge bg-info text-dark">Em análise</span>`;
  if (s === "aberto")      return `<span class="badge bg-warning text-dark">Aberto</span>`;
  return `<span class="badge bg-secondary">Sem status</span>`;
}

async function carregarChamados(token) {
  const list = document.getElementById("talkus-list");
  if (!list) return;

  try {
    const res = await fetch(`${API_URL}/admin/chamados?page=1`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const { dados, paginacao } = await res.json();

    // Atualiza KPI
    const total  = paginacao?.total ?? dados?.length ?? 0;
    const abertos = (dados || []).filter(c => (c.chamado_status || "").toLowerCase() === "aberto").length;
    setKPI("kpi-talkus", total.toLocaleString("pt-BR"));
    setKPI("kpi-talkus-sub", `${abertos} aberto${abertos !== 1 ? "s" : ""} agora`);

    const badge = document.getElementById("kpi-talkus-badge");
    if (badge) badge.textContent = abertos > 0 ? abertos : "";

    if (!dados || dados.length === 0) {
      list.innerHTML = `<div class="text-center text-muted py-4 small">Nenhum chamado registrado.</div>`;
      return;
    }

    _chamadosMap.clear();
    dados.forEach(c => _chamadosMap.set(c.chamado_id, c));

    list.innerHTML = dados.map((c) => {
      const initials = getInitials(c.chamado_user_name || "?");
      const conteudo = c.chamado_content
        ? c.chamado_content.length > 60
          ? c.chamado_content.slice(0, 60) + "…"
          : c.chamado_content
        : "<span class='text-muted fst-italic'>Sem conteúdo</span>";

      return `
        <div class="chamado-item d-flex align-items-start gap-3"
             role="button" style="cursor:pointer" onclick="abrirChamado(${c.chamado_id})">
          <div class="avatar-sm flex-shrink-0">${initials}</div>
          <div class="flex-grow-1 overflow-hidden">
            <div class="d-flex justify-content-between align-items-start gap-2">
              <span class="fw-600 text-truncate">${c.chamado_user_name || "—"}</span>
              ${statusBadge(c.chamado_status)}
            </div>
            <small class="text-muted d-block">${c.chamado_user_email || "—"}</small>
            <small class="mt-1 d-block">${conteudo}</small>
          </div>
        </div>`;
    }).join("");

  } catch (e) {
    console.error("Erro ao carregar chamados:", e);
    list.innerHTML = `<div class="text-center text-danger py-4 small">Erro ao carregar chamados.</div>`;
  }
}

window.abrirChamado = function (id) {
  const c = _chamadosMap.get(id);
  if (!c) return;
  _chamadoAtual = c;

  document.getElementById("chamado-id").textContent      = c.chamado_id;
  document.getElementById("chamado-nome").textContent    = c.chamado_user_name  || "—";
  document.getElementById("chamado-email").textContent   = c.chamado_user_email || "—";
  document.getElementById("chamado-tel").textContent     = c.chamado_user_tel   || "—";
  document.getElementById("chamado-content").textContent = c.chamado_content    || "Sem conteúdo";
  document.getElementById("chamado-status-badge").innerHTML = statusBadge(c.chamado_status);

  const respBox   = document.getElementById("chamado-resp-existente");
  const respTexto = document.getElementById("chamado-resp-texto");
  if (c.chamado_resp) {
    respBox.classList.remove("d-none");
    respTexto.textContent = c.chamado_resp;
  } else {
    respBox.classList.add("d-none");
  }

  document.getElementById("chamado-resp-input").value = "";
  new bootstrap.Modal(document.getElementById("modalChamado")).show();
};

window.responderChamado = async function () {
  if (!_chamadoAtual || !_adminToken) return;

  const resp = document.getElementById("chamado-resp-input")?.value.trim();
  if (!resp) {
    myModal("Digite uma resposta antes de salvar.", { type: "warning" });
    return;
  }

  try {
    const res = await fetch(`${API_URL}/admin/chamados/${_chamadoAtual.chamado_id}/responder`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${_adminToken}`,
      },
      body: JSON.stringify({ chamado_resp: resp }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.erro || "Erro ao responder");

    bootstrap.Modal.getInstance(document.getElementById("modalChamado"))?.hide();
    myModal("Resposta salva com sucesso!", { type: "success" });
    await carregarChamados(_adminToken);
  } catch (e) {
    myModal(e.message, { type: "danger", title: "Erro ao responder" });
  }
};

// ── Resetar base ─────────────────────────────────────────────────────────────

function bindResetBase() {
  const btn = document.getElementById("btn-reset-base");
  if (!btn) return;

  btn.addEventListener("click", async (e) => {
    e.stopPropagation();
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
