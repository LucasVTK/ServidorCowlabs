
//pega as informaçoes e transforma para objeto (JSON)
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
    alert("Usuário não está logado.");
    window.location.href = loginPath;
    return null;
  }

  return {
    user,
    token
  };
}
