import nav from "../components/nav.js";
import footer from "../components/footer.js";
import myModal from "../components/mymodal.js";
import { requireAuth } from "./auth.js";
import { API_URL } from "./api.js";

// ── Cloudinary ──────────────────────────────────────────────────────────────
// Para ativar o upload:
//  1. Crie uma conta em cloudinary.com
//  2. Crie um "Upload Preset" sem assinatura (unsigned) no painel do Cloudinary
//  3. Preencha as constantes abaixo com seu Cloud Name e o nome do preset
//  4. Salve a URL retornada em user_img via PUT /users/update/:id
const CLOUDINARY_CLOUD_NAME = "";
const CLOUDINARY_UPLOAD_PRESET = "";

let stars = [];
let currentRating = 0;

document.addEventListener("DOMContentLoaded", () => {
  nav();
  setupStars();

  const auth = requireAuth("../pages/login.html");
  if (!auth) return;

  const { user, token } = auth;

  setupUpload(user, token);
  loadProfilePage(user, token);

  footer();
});

// ── Carregamento sequencial ──────────────────────────────────────────────────

async function loadProfilePage(user, token) {
  try {
    await loadUserData(user.id, token);
    await loadUserRanking(user.id, token);
    await loadUserActivity(user.id, token);
    renderAccountInfo(user);
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
  }
}

// ── Dados do usuário ─────────────────────────────────────────────────────────

async function loadUserData(userId, token) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Erro ao buscar usuário");

  const users = await response.json();
  const user = users[0];

  const nameEl = document.getElementById("userName");
  if (nameEl) nameEl.textContent = user.user_real_name || user.user_name || "Usuário";

  const roleEl = document.getElementById("Role");
  if (roleEl) roleEl.textContent = user.user_tipo || "Sem tipo";

  const imgEl = document.getElementById("profile-image");
  if (imgEl) {
    // Prioridade: imagem do Cloudinary salva no perfil → avatar gerado pelo nome
    const savedImg = user.user_img || user.user_image || user.profile_img || user.foto;
    const nome = encodeURIComponent(user.user_real_name || user.user_name || "U");
    imgEl.src = savedImg || `https://ui-avatars.com/api/?name=${nome}&size=150&background=006eff&color=fff`;
    imgEl.alt = user.user_real_name || user.user_name || "Usuário";
  }
}

// ── Ranking / estrelas ───────────────────────────────────────────────────────

async function loadUserRanking(userId, token) {
  const response = await fetch(`${API_URL}/users/${userId}/ranking`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    console.warn("Ranking ainda não disponível");
    return;
  }

  const ranking = await response.json();
  const nota = Number(ranking.media || 0);

  const ratingValue = document.getElementById("rating-value");
  if (ratingValue) ratingValue.textContent = `${nota.toFixed(1)} / 5.0`;

  currentRating = Math.floor(nota);
  updateStars(currentRating);
}

// ── Atividade ────────────────────────────────────────────────────────────────

async function loadUserActivity(userId, token) {
  const response = await fetch(`${API_URL}/users/${userId}/activity`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    console.warn("Atividade ainda não disponível");
    return;
  }

  const activity = await response.json();

  const el = (id) => document.getElementById(id);
  if (el("projectsDone"))  el("projectsDone").textContent  = activity.projetos_realizados  ?? "—";
  if (el("workedHours"))   el("workedHours").textContent   = activity.horas_trabalhadas    ?? "—";
  if (el("clientRatings")) el("clientRatings").textContent = activity.classificacoes_clientes ?? "—";
}

// ── Info de conta ────────────────────────────────────────────────────────────

function renderAccountInfo(user) {
  const emailEl = document.getElementById("userEmail");
  if (emailEl) emailEl.textContent = user.user_email || "—";
}

// ── Upload de foto via Cloudinary ────────────────────────────────────────────

function setupUpload(user, token) {
  const trigger = document.getElementById("upload-trigger");
  const input   = document.getElementById("image-input");
  const imgEl   = document.getElementById("profile-image");

  if (!trigger || !input) return;

  trigger.addEventListener("click", () => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      myModal(
        "Upload de foto ainda não configurado.<br>Preencha CLOUDINARY_CLOUD_NAME e CLOUDINARY_UPLOAD_PRESET em profile.js.",
        { type: "info", title: "Configuração necessária" }
      );
      return;
    }
    input.click();
  });

  input.addEventListener("change", async () => {
    const file = input.files[0];
    if (!file) return;

    try {
      const url = await uploadToCloudinary(file);
      if (!url) return;

      // Atualiza a imagem na tela
      if (imgEl) imgEl.src = url;

      // Salva a URL no perfil via backend
      // TODO: O campo user_img deve ser aceito por PUT /users/update/:id
      // Por enquanto, apenas mostra sucesso visual
      myModal("Foto atualizada com sucesso!", { type: "success" });

    } catch (e) {
      console.error("Erro no upload:", e);
      myModal("Erro ao enviar a foto. Tente novamente.", { type: "danger" });
    }
  });
}

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) throw new Error(`Cloudinary HTTP ${res.status}`);

  const data = await res.json();
  return data.secure_url;
}

// ── Estrelas de rating ───────────────────────────────────────────────────────

function setupStars() {
  stars = document.querySelectorAll("#rating i");

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      currentRating = parseInt(star.getAttribute("data-value"), 10);
      const ratingValue = document.getElementById("rating-value");
      if (ratingValue) ratingValue.textContent = `${currentRating}.0 / 5.0`;
      updateStars(currentRating);
    });

    star.addEventListener("mouseover", () => {
      updateStars(parseInt(star.getAttribute("data-value"), 10));
    });

    star.addEventListener("mouseout", () => {
      updateStars(currentRating);
    });
  });
}

function updateStars(rating) {
  stars.forEach((star) => {
    const value = Number(star.getAttribute("data-value"));
    star.className = value <= rating ? "bi bi-star-fill text-warning" : "bi bi-star";
  });
}
