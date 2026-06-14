import nav from "../components/nav.js";
import footer from "../components/footer.js";
import myModal from "../components/mymodal.js";
import { API_URL } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  nav();

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
    // POST /talkus — endpoint em implementação no backend.
    // TODO: Criar rota POST /talkus → salva { nome, email, telefone, mensagem } na tabela tb_talkus
    const res = await fetch(`${API_URL}/talkus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, telefone, mensagem }),
    });

    if (!res.ok) {
      if (res.status === 404) {
        // Backend ainda não tem a rota — avisa com modal
        await myModal(
          "Formulário de contato em implementação. Por enquanto, envie um e-mail para <strong>suporte@cowlabs.com.br</strong>.",
          { type: "info", title: "Em produção" }
        );
        return;
      }
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || `Erro HTTP ${res.status}`);
    }

    document.getElementById("contactForm")?.reset();
    await myModal("Mensagem enviada! Em breve entraremos em contato.", { type: "success", title: "Obrigado!" });

  } catch (e) {
    console.error("Erro ao enviar TalkUs:", e);
    myModal(e.message || "Erro ao enviar. Tente novamente.", { type: "danger", title: "Erro" });
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = 'Enviar Mensagem <i class="bi bi-send ms-2"></i>'; }
  }
}
