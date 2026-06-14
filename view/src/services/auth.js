
//pega as informaçoes e transforma para objeto (JSON)
import myModal from "../components/mymodal.js";

export function getLoggedUser() {
  const rawUser = sessionStorage.getItem("LogedUser");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    console.error("Erro ao ler LogedUser do sessionStorage:", error);
    return null;
  }
}

// pega o token
export function getToken() {
  return sessionStorage.getItem("token");
}
// verificar se existe usuário logado no sessionStorage
export function requireAuth(loginPath = "../pages/login.html") {
  const user = getLoggedUser();
  const token = getToken();

  if (!user || !user.id || !token) {
    // mostra o aviso e só redireciona quando o usuário fechar o modal
    myModal("Usuário não está logado.", { type: "warning" })
      .then(() => { window.location.href = loginPath; });
    return null;
  }

  return {
    user,
    token
  };
}
