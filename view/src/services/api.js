// Em desenvolvimento aponta para o servidor local.
// Em produção (Vercel) usa o mesmo domínio — não precisa de URL absoluta.
const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
export const API_URL = isLocal ? "http://localhost:3000" : "";
