import footer from "../components/footer.js";
import { requireAuth } from "./auth.js";
import { renderUserMenu, getUserImageByType } from "../components/userMenu.js";

const API_URL = "http://localhost:3000";

// armazena as estrelas
let stars = [];
//guarda a nota atual
let currentRating = 0;

document.addEventListener("DOMContentLoaded", () => {
  setupStars();

  //chama a autenticaçao
  const auth = requireAuth("../pages/login.html");
  if (!auth) return;

  // monta menu e tem os caminhos do menu
  renderUserMenu(auth.user, {
    demandasPath: "../pages/demandas.html",
    profilePath: "../pages/profile.html",
    adminPath: "../pages/profile.html",
    rolePath: "../pages/profile.html",
    loginPath: "../pages/login.html",
    imageBasePath: "../img/profile_img/"
  });

  loadProfilePage(auth.user.id, auth.token);
  footer();
});

//organiza a sequência de carregamento
async function loadProfilePage(userId, token) {
  try {
    await loadUserData(userId, token);
    await loadUserRanking(userId, token);
    await loadUserActivity(userId, token);
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
  }
}


// busca e exibe os dados princioais do user
async function loadUserData(userId, token) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar usuário");
  }

  const users = await response.json();
  const user = users[0];

  document.getElementById("userName").textContent =
    user.user_real_name ||
    user.user_name ||
    "Usuário";

  document.getElementById("Role").textContent =
    user.user_tipo ||
    "Sem tipo";

 
const profileImage = document.getElementById("profile-image");
if (profileImage) {
   // define a foto de perfil, com base no tipo
  const imageName = getUserImageByType(user);
  profileImage.src = `../img/profile_img/${imageName}`;
// define o texto da alternativo da imagem
  profileImage.alt = user.user_real_name || user.user_name || "Usuário";
}
}


// busca a media dos usuarios, atualiza a nota e pinta a estrela
async function loadUserRanking(userId, token) {
  const response = await fetch(`${API_URL}/users/${userId}/ranking`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    console.warn("Ranking ainda não disponível");
    return;
  }

  const ranking = await response.json();

  console.log("Ranking recebido do backend:", ranking);

  const nota = Number(ranking.media || 0);
  const estrelasPintadas = Math.floor(nota);

  console.log("Nota convertida:", nota);
  console.log("Estrelas pintadas:", estrelasPintadas);

  const ratingValue = document.getElementById("rating-value");
  if (ratingValue) {
    ratingValue.textContent = `Nota: ${nota.toFixed(1)}`;
  }

  updateStars(estrelasPintadas);
}

//dados da atividades do user, busca todas
async function loadUserActivity(userId, token) {
  const response = await fetch(`${API_URL}/users/${userId}/activity`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    console.warn("Atividade ainda não disponível");
    return;
  }

  const activity = await response.json();

  const projetosRealizados = document.getElementById("projectsDone");
  const projetosEmExecucao = document.getElementById("projectsInProgress");
  const horasTrabalhadas = document.getElementById("workedHours");
  const classificacoes = document.getElementById("clientRatings");

  if (projetosRealizados) {
    projetosRealizados.textContent = activity.projetos_realizados ?? 0;
  }

  if (projetosEmExecucao) {
    projetosEmExecucao.textContent = activity.projetos_em_execucao ?? 0;
  }

  if (horasTrabalhadas) {
    horasTrabalhadas.textContent = activity.horas_trabalhadas ?? 0;
  }

  if (classificacoes) {
    classificacoes.textContent = activity.classificacoes_clientes ?? 0;
  }
}

function setupStars() {
  stars = document.querySelectorAll("#rating i");

  console.log("Stars encontradas:", stars.length);

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      currentRating = parseInt(star.getAttribute("data-value"), 10);

      const ratingValue = document.getElementById("rating-value");
      if (ratingValue) {
        ratingValue.textContent = `Nota: ${currentRating}`;
      }

      updateStars(currentRating);
    });

    star.addEventListener("mouseover", () => {
      const hoverRating = parseInt(star.getAttribute("data-value"), 10);
      updateStars(hoverRating);
    });

    star.addEventListener("mouseout", () => {
      updateStars(currentRating);
    });
  });
}

function updateStars(rating) {
  console.log("updateStars recebeu:", rating);

  stars.forEach((star) => {
    const value = Number(star.getAttribute("data-value"));

    console.log("estrela", value, "rating", rating);

    if (value <= rating) {
      star.className = "bi bi-star-fill text-warning";
    } else {
      star.className = "bi bi-star";
    }
  });

  // window cria uma funçao global
  window.logout = function () {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("LogedUser");
    window.location.href = "../pages/login.html";
  };
}