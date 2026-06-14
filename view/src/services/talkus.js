import nav from "../components/nav.js";
import footer from "../components/footer.js";
import myModal from "../components/mymodal.js";
import { requireAuth } from "./auth.js";
import { API_URL } from "./api.js";

let _token = null;

document.addEventListener("DOMContentLoaded", () => {
  nav();

  const auth = requireAuth("../pages/login.html");
  if (!auth) return;

  const { user, token } = auth;
  _token = token;

  // Pré-preenche nome e e-mail com os dados do usuário logado
  const nomeEl  = document.getElementById("nome");
  const emailEl = document.getElementById("email");
  if (nomeEl)  nomeEl.value  = user.user_name  || user.user_real_name || "";
  if (emailEl) emailEl.value = user.email || "";

  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await enviarMensagem();
    });
  }

  footer();
});

async function enviarMensagem() {
  const nome      = document.getElementById("nome")?.value.trim();
  const email     = document.getElementById("email")?.value.trim();
  const telefone  = document.getElementById("telefone")?.value.trim();
  const mensagem  = document.getElementById("mensagem")?.value.trim();

  if (!nome || !email || !mensagem) {
    myModal("Preencha nome, e-mail e mensagem.", { type: "warning" });
    return;
  }

  const btn = document.querySelector("#contactForm button[type='submit']");
  if (btn) { btn.disabled = true; btn.textContent = "Enviando..."; }

  try {
    const res = await fetch(`${API_URL}/chamados/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${_token}`,
      },
      body: JSON.stringify({
        chamado_user_name:  nome,
        chamado_user_email: email,
        chamado_user_tel:   telefone,
        chamado_content:    mensagem,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.erro || data.message || `Erro HTTP ${res.status}`);
    }

    document.getElementById("contactForm")?.reset();
    await myModal("Mensagem enviada! Em breve entraremos em contato.", { type: "success", title: "Obrigado!" });

  } catch (e) {
    console.error("Erro ao enviar chamado:", e);
    myModal(e.message || "Erro ao enviar. Tente novamente.", { type: "danger", title: "Erro" });
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = 'Enviar Mensagem <i class="bi bi-send ms-2"></i>'; }
  }
}
