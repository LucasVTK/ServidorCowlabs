// ============================================================
// CowLabs · components/mymodal.js
// Modal reutilizável — substitui alert() e confirm() nativos.
//
// É injetado dinamicamente na página na primeira chamada e
// reaproveitado nas seguintes. Visual baseado no default.css
// (classes .cl-modal*).
//
// ALERTA (um botão "OK"):
//   import myModal from "/view/src/components/mymodal.js";
//   myModal("Preencha todos os campos");
//   myModal("Demanda criada!", { type: "success" });
//   await myModal("Você será redirecionado");   // espera fechar
//
// CONFIRMAÇÃO (dois botões -> retorna boolean):
//   import { myConfirm } from "/view/src/components/mymodal.js";
//   const ok = await myConfirm("Deseja excluir esta demanda?", { type: "warning" });
//   if (!ok) return;
// ============================================================

// Ícone (bootstrap-icons) padrão para cada tipo.
const ICONS = {
  info:    "bi-info-circle-fill",
  success: "bi-check-circle-fill",
  danger:  "bi-exclamation-octagon-fill",
  warning: "bi-exclamation-triangle-fill",
};

let dialogEl = null;     // <dialog> único no DOM
let resolveFn = null;    // resolve da Promise da chamada atual
let pendingValue = false; // valor a resolver quando o modal fechar

// Cria o <dialog> uma única vez e o anexa ao body.
function ensureDialog() {
  if (dialogEl) return dialogEl;

  dialogEl = document.createElement("dialog");
  dialogEl.className = "cl-modal";
  dialogEl.id = "cl-modal";
  dialogEl.innerHTML = `
    <div class="cl-modal-card">
      <button type="button" class="cl-modal-close" aria-label="Fechar">&times;</button>
      <div class="cl-modal-icon"><i class="bi"></i></div>
      <p class="cl-modal-text"></p>
      <div class="cl-modal-actions">
        <button type="button" class="btn cl-modal-cancel" hidden></button>
        <button type="button" class="btn btn-send cl-modal-ok"></button>
      </div>
    </div>`;

  document.body.appendChild(dialogEl);

  // OK / confirmar -> resolve true
  dialogEl.querySelector(".cl-modal-ok").addEventListener("click", () => {
    pendingValue = true;
    close();
  });

  // Cancelar / x / clique fora -> resolve false (já é o padrão)
  dialogEl.querySelector(".cl-modal-cancel").addEventListener("click", close);
  dialogEl.querySelector(".cl-modal-close").addEventListener("click", close);
  dialogEl.addEventListener("click", (e) => {
    if (e.target === dialogEl) close();
  });

  // Qualquer fechamento (inclusive ESC) resolve a Promise.
  dialogEl.addEventListener("close", () => {
    if (resolveFn) { resolveFn(pendingValue); resolveFn = null; }
  });

  return dialogEl;
}

function close() {
  if (dialogEl && dialogEl.open) dialogEl.close();
}

// Núcleo: monta o conteúdo e abre o modal.
function open(message, options, isConfirm) {
  const {
    type = isConfirm ? "warning" : "info",
    title = "",
    okText = isConfirm ? "Confirmar" : "OK",
    cancelText = "Cancelar",
  } = options;

  const dialog = ensureDialog();
  const safeType = ICONS[type] ? type : "info";

  dialog.className = `cl-modal cl-modal--${safeType}`;
  dialog.querySelector(".cl-modal-icon i").className = `bi ${ICONS[safeType]}`;

  const textEl = dialog.querySelector(".cl-modal-text");
  textEl.innerHTML = title
    ? `<strong class="d-block fw-800 mb-1">${title}</strong>${message ?? ""}`
    : (message ?? "");

  // Botões
  const okBtn = dialog.querySelector(".cl-modal-ok");
  const cancelBtn = dialog.querySelector(".cl-modal-cancel");
  okBtn.textContent = okText;
  cancelBtn.textContent = cancelText;
  cancelBtn.hidden = !isConfirm;

  // valor padrão ao fechar sem clicar em OK
  pendingValue = false;

  return new Promise((resolve) => {
    resolveFn = resolve;
    dialog.showModal();
  });
}

/**
 * Modal de alerta (um botão). Resolve quando fechado.
 * @param {string} message
 * @param {{type?:"info"|"success"|"danger"|"warning", title?:string, okText?:string}} [options]
 * @returns {Promise<void>}
 */
export default function myModal(message, options = {}) {
  return open(message, options, false);
}

/**
 * Modal de confirmação (dois botões).
 * @param {string} message
 * @param {{type?:"info"|"success"|"danger"|"warning", title?:string, okText?:string, cancelText?:string}} [options]
 * @returns {Promise<boolean>} true se confirmado, false caso contrário.
 */
export function myConfirm(message, options = {}) {
  return open(message, options, true);
}
