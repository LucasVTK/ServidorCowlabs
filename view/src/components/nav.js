// ============================================================
// CowLabs · components/nav.js
// Navbar componentizada (mesmo modelo do footer.js).
//
// Comportamento:
//  - Menu hambúrguer responsivo (Bootstrap collapse).
//  - Verifica se há usuário logado (sessionStorage via auth.js).
//  - Logado     -> "Olá, <nome>" + avatar (imagem de perfil OU iniciais).
//  - Deslogado  -> botão "Entrar / Cadastrar".
//  - Marca automaticamente o link ativo conforme a URL atual.
//
// Uso na página:
//   <script type="module">
//     import nav from "/view/src/components/nav.js";
//     nav();            // monta a navbar
//   </script>
// ============================================================

import { getLoggedUser } from "../services/auth.js";

// Rotas centrais do site (caminhos absolutos a partir da raiz servida).
// Altere AQUI e reflete em todas as páginas.
export const ROUTES = {
  home:      "/view/public/index.html",
  demandas:  "/view/src/pages/brickwall.html",
  faq:       "/view/src/pages/faq.html",
  talkus:    "/view/src/pages/talkus.html",
  login:     "/view/src/pages/login.html",
  register:  "/view/src/pages/register.html",
  profile:   "/view/src/pages/profile.html",
  teacher:   "/view/src/pages/teacher.html",
  admin:     "/view/src/pages/admin.html",
};

// Links principais exibidos no centro da navbar.
const MAIN_LINKS = [
  { label: "Início",       href: ROUTES.home },
  { label: "Demandas",     href: ROUTES.demandas },
  { label: "FAQs",         href: ROUTES.faq },
  { label: "Fale Conosco", href: ROUTES.talkus },
];

// ---------- Helpers ----------

// Nome a ser exibido, com a mesma cascata de fallback do resto do projeto.
function getDisplayName(user) {
  const full = user.user_real_name || user.user_name;
  if (full) return full;
  if (user.email) return user.email.split("@")[0]; // antes do @
  return "Usuário";
}

// Iniciais a partir do nome (1ª letra do primeiro e do último nome).
function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2);
  return (parts[0][0] + parts[parts.length - 1][0]);
}

// Procura por uma imagem de perfil definida pelo usuário (campos possíveis
// que o backend poderá enviar futuramente). Sem isso -> usa iniciais.
function getProfileImage(user) {
  return (
    user.user_img ||
    user.user_image ||
    user.profile_img ||
    user.foto ||
    null
  );
}

// Avatar: <img> com foto real ou avatar gerado pelo ui-avatars como fallback.
function avatarHTML(user, name) {
  const img = getProfileImage(user);

  const cursoImgMap = {
    "Administração":            "/view/src/img/profile_img/administration.png",
    "Ciências Biológicas":      "/view/src/img/profile_img/biological.png",
    "Ciências Contábeis":       "/view/src/img/profile_img/accounting.png",
    "Design":                   "/view/src/img/profile_img/Design.png",
    "Direito":                  "/view/src/img/profile_img/Direito.png",
    "Educação Física":          "/view/src/img/profile_img/educacao_fisica.png",
    "Enfermagem":               "/view/src/img/profile_img/Enfermagem.png",
    "Engenharia Ambiental":     "/view/src/img/profile_img/Engenharia_Ambiental.png",
    "Engenharia Civil":         "/view/src/img/profile_img/Engenharia_Civil.png",
    "Engenharia de Produção":   "/view/src/img/profile_img/Engenharia_de_Producao.png",
    "Engenharia Elétrica":      "/view/src/img/profile_img/Engenharia_Eletrica.png",
    "Engenharia Mecânica":      "/view/src/img/profile_img/Engenharia_Mecanica.png",
    "Medicina":                 "/view/src/img/profile_img/Medicina.png",
    "Nutrição":                 "/view/src/img/profile_img/Nutricao.png",
    "Odontologia":              "/view/src/img/profile_img/Odonto.png",
    "Publicidade e Propaganda": "/view/src/img/profile_img/Publicidade_e_Propaganda.png",
    "Serviço Social":           "/view/src/img/profile_img/Servico_Social.png",
    "Sistemas de Informação":   "/view/src/img/profile_img/SI.png",
    "Técnico em Enfermagem":    "/view/src/img/profile_img/Tecnico_em_Enfermagem.png",
  };

  const cursoImg = cursoImgMap[user.user_curso || ""];
  const src = img || cursoImg || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=40&background=006eff&color=fff`;
  return `<span class="cl-avatar"><img src="${src}" alt="${name}"></span>`;
}

// Marca o link cuja href corresponde à página atual.
function isActive(href) {
  const current = window.location.pathname.replace(/\/index\.html?$/, "/");
  const target = href.replace(/\/index\.html?$/, "/");
  return current === target || window.location.pathname === href;
}

// Itens extras do dropdown conforme o tipo do usuário.
function roleLinks(user) {
  const tipo = (user.user_tipo || user.tipo || "").toLowerCase();
  let extra = "";
  if (tipo.includes("prof")) {
    extra += `<li><a class="dropdown-item" href="${ROUTES.teacher}">
                <i class="bi bi-easel2 me-2"></i>Painel do Professor</a></li>`;
  }
  if (tipo.includes("admin")) {
    extra += `<li><a class="dropdown-item" href="${ROUTES.admin}">
                <i class="bi bi-speedometer2 me-2"></i>Painel Admin</a></li>`;
  }
  return extra;
}

// ---------- Render ----------

function navHTML() {
  const user = getLoggedUser();

  const links = MAIN_LINKS.map(
    (l) =>
      `<li class="nav-item">
         <a class="nav-link px-3 ${isActive(l.href) ? "active" : ""}" href="${l.href}">${l.label}</a>
       </li>`
  ).join("");

  // Lado direito: usuário logado x visitante.
  let rightSide;
  if (user) {
    const name = getDisplayName(user);
    rightSide = `
      <div class="dropdown cl-user-menu">
        <button class="cl-user-chip" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <span class="cl-greeting d-none d-sm-block text-start">
            Olá,<strong>${name}</strong>
          </span>
          ${avatarHTML(user, name)}
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><h6 class="dropdown-header">${user.email || ""}</h6></li>
          <li><a class="dropdown-item" href="${ROUTES.profile}"><i class="bi bi-person me-2"></i>Meu Perfil</a></li>
          <li><a class="dropdown-item" href="${ROUTES.demandas}"><i class="bi bi-grid me-2"></i>Demandas</a></li>
          ${roleLinks(user)}
          <li><hr class="dropdown-divider"></li>
          <li><button class="dropdown-item text-danger" type="button" id="cl-logout">
            <i class="bi bi-box-arrow-right me-2"></i>Sair</button></li>
        </ul>
      </div>`;
  } else {
    rightSide = `<a href="${ROUTES.login}" class="btn btn-light-outline">Entrar / Cadastrar</a>`;
  }

  return `
    <nav class="navbar navbar-expand-lg navbar-dark bg-brand-solid sticky-top py-3 cl-navbar">
      <div class="container">
        <a class="logo-font" href="${ROUTES.home}">Cow<span>Labs</span></a>

        <button class="navbar-toggler border-0" type="button"
                data-bs-toggle="collapse" data-bs-target="#clNavMain"
                aria-controls="clNavMain" aria-expanded="false" aria-label="Abrir menu">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="clNavMain">
          <ul class="navbar-nav mx-auto">
            ${links}
          </ul>
          <div class="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            ${rightSide}
          </div>
        </div>
      </div>
    </nav>`;
}

// Logout padrão (limpa sessão e volta ao login).
function bindLogout() {
  const btn = document.getElementById("cl-logout");
  if (!btn) return;
  btn.addEventListener("click", () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("LogedUser");
    window.location.href = ROUTES.login;
  });
}

// Monta a navbar: usa um <div id="nav-root"> se existir; senão insere no topo do body.
export default function nav() {
  const markup = navHTML();
  const root = document.getElementById("nav-root");
  if (root) {
    root.innerHTML = markup;
  } else {
    document.body.insertAdjacentHTML("afterbegin", markup);
  }
  bindLogout();
}
