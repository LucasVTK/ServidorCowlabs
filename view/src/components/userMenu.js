
//decidir qual imagem de perfil usar com base no tipo do usuário
export function getUserImageByType(user) {
  const imageMap = {
    "Administração": "Admin.png",
    "Aluno":"accounting.png",
    "Biologia":"biological.png",
    "Design": "Design.png",
    "Direito": "Direito.png",
    "Enfermagem": "Enfermagem.png",
    "Engenharia Civil": "Engenharia_Civil.png",
    "Engenharia Ambiental": "Engenharia_Ambiental.png",
    "Engenharia de Produção": "Engenharia_de_Producao.png"
  };

const userType = user.user_tipo || user.tipo;
return imageMap[userType] || "accounting.png";
}

// menu do perfil é feito aqui
export function renderUserMenu(user, options = {}) {
  const {
    demandasPath = "../pages/demandas.html",
    profilePath = "../pages/profile.html",
    adminPath = "../pages/profile.html",
    rolePath = "../pages/profile.html",
    loginPath = "../pages/login.html",
    imageBasePath = "../img/profile_img/"
  } = options;

  const profileList = document.getElementById("profile_list");
  const profileImg = document.querySelector("#profile_img img");


  const imageName = getUserImageByType(user);

  if (profileImg) {
    profileImg.src = `${imageBasePath}${imageName}`;
    profileImg.alt = user.user_name || "Usuário";
  }

  if (profileList) {
    profileList.innerHTML = `
      <li>
        <a class="dropdown-item text-center py-2" href="${demandasPath}">
          Ver Demandas
        </a>
      </li>

      <li>
        <a class="dropdown-item text-center py-2" href="${profilePath}">
          ${user.user_real_name || user.user_name || user.email || "Usuário"}
        </a>
      </li>

      <li>
        <a class="dropdown-item text-center py-2" href="${adminPath}">
          Administração
        </a>
      </li>

      <li>
        <a class="dropdown-item text-center py-2" href="${rolePath}">
          ${user.user_tipo || user.tipo || "Aluno"}
        </a>
      </li>
    `;
  }

}