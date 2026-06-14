# CowLabs · Guia de Identidade Visual (`default.css`)

Este documento descreve o que está padronizado em **`/view/src/styles/default.css`**.
A regra geral: **tudo que é identidade de marca mora no `default.css`**; cada página só
escreve no seu próprio CSS o que for **exclusivo dela**.

## Como usar em uma página nova

Carregue sempre o `default.css` **antes** do CSS específico da página:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
<link rel="stylesheet" href="/view/src/styles/default.css" />   <!-- base -->
<link rel="stylesheet" href="/view/src/styles/minhapagina.css" /> <!-- específico -->
```

E monte os componentes compartilhados (navbar + rodapé) no fim do `<body>`:

```html
<div id="nav-root"></div>
...
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script type="module">
  import nav from "/view/src/components/nav.js";
  import footer from "/view/src/components/footer.js";
  nav();
  footer();
</script>
```

> **Convenção de caminhos:** o site é servido com a raiz no diretório do projeto,
> então todo recurso é referenciado de forma absoluta começando por `/view/...`.
> Use sempre esse formato (e não `../`) para que o link funcione de qualquer página.

---

## 1. Design tokens (variáveis CSS)

Todas em `:root`. Use as variáveis em vez de valores fixos.

### Cores
| Token | Valor | Uso |
|---|---|---|
| `--primary` | `#006eff` | Cor principal da marca |
| `--primary-hover` | `#0056d6` | Hover de botões/links |
| `--primary-deep` | `#004299` | Fim do gradiente do hero |
| `--labs-light` | `#a5c9ff` | "Labs" da logo e detalhes claros |
| `--dark-blue` | `#001a41` | Tema escuro (painel admin/professor) |
| `--bg-page` | `#f8fafc` | Fundo padrão das páginas |
| `--white` / `--surface` | `#ffffff` | Fundo de cards e superfícies |
| `--border-soft` | `#e2e8f0` | Bordas suaves |
| `--text-main` | `#1e293b` | Texto principal |
| `--text-muted` | `#64748b` | Texto secundário |
| `--success` / `--danger` / `--warning` | — | Feedback |

### Tipografia
| Token | Fonte | Uso |
|---|---|---|
| `--font-body` | **Inter** | Corpo do texto (padrão do `body`) |
| `--font-display` | **Plus Jakarta Sans** | Títulos (classe `.fw-800`) |
| `--font-mono` | **JetBrains Mono** | Logo (`.logo-font`) |

### Raios e sombras
`--radius-sm` (10px) · `--radius-md` (15px) · `--radius-lg` (24px) · `--radius-xl` (30px) · `--radius-pill` (50px)
`--shadow-sm` · `--shadow-md` · `--shadow-brand`

---

## 2. Classes utilitárias prontas

| Classe | O que faz |
|---|---|
| `.fw-800` | Título em Plus Jakarta Sans, peso 800 |
| `.fw-600` | Peso 600 |
| `.text-labs` | Texto na cor `--labs-light` |
| `.bg-brand-solid` | Fundo azul de marca |
| `.bg-brand-deep` | Fundo azul escuro |
| `.logo-font` | Estilo da logo "Cow**Labs**" (use com `<span>` no "Labs") |
| `.hero-brand` | Cabeçalho com gradiente de marca e cantos arredondados |
| `.hero-brand.hero-compact` | Variante de hero mais baixo |

---

## 3. Botões (família padrão)

| Classe | Quando usar |
|---|---|
| `.btn-primary` | Ação principal sobre fundo claro (sobrescreve o Bootstrap com a marca) |
| `.btn-action-hero` | Botão branco de destaque **sobre** o fundo azul (hero) |
| `.btn-light-outline` | Botão contornado branco para usar **sobre** o azul (navbar/hero) |
| `.btn-send` | Botão de envio em formulários claros |

Todos já têm hover com leve elevação. Não recriar variações locais sem necessidade.

---

## 4. Componentes visuais incluídos

- **Badges:** `.badge-tag` (etiqueta de curso/área) e `.badge-premium` (selo sobre o hero).
- **Cards:** `.card-premium` (card branco arredondado com hover elevado).
- **Formulários:** `.form-control` já recebe borda arredondada e foco azul de marca.
- **Paginação:** `.custom-pagination` com item ativo na cor da marca.
- **Rodapé:** `.footer-premium .social-links` (estilo dos ícones sociais do `footer.js`).

---

## 5. Navbar (`nav.js`) — estilos no `default.css`

O componente de navegação usa as classes prefixadas com `cl-`:

| Classe | Função |
|---|---|
| `.cl-navbar` | Wrapper da navbar (controla cor dos links) |
| `.cl-user-chip` | Botão "Olá, &lt;nome&gt;" + avatar do usuário logado |
| `.cl-avatar` | Avatar circular: mostra a **imagem de perfil** ou, na falta dela, as **iniciais** |
| `.cl-user-menu` | Dropdown do usuário (Perfil, Demandas, painel por tipo, Sair) |

Comportamento do componente (em `nav.js`):
- **Menu hambúrguer** responsivo (collapse do Bootstrap) abaixo de `lg`.
- **Sem login:** botão "Entrar / Cadastrar".
- **Com login:** "Olá, &lt;nome&gt;" + avatar. O avatar usa a imagem de perfil
  se o backend enviar um dos campos `user_img` / `user_image` / `profile_img` / `foto`;
  **caso contrário, exibe as iniciais** do nome.
- O **link ativo** é marcado automaticamente conforme a URL atual.
- As rotas do site ficam centralizadas no objeto `ROUTES` (topo do `nav.js`).
  Para mudar um destino do menu, altere ali — vale para todas as páginas.

---

## 5.1. MyModal (`mymodal.js`) — substituto do `alert()`

Modal de aviso reutilizável, injetado dinamicamente. Estilos no `default.css`
(classes `.cl-modal*`). Importe e chame de qualquer serviço:

```js
import myModal from "/view/src/components/mymodal.js";

myModal("Preencha todos os campos");                       // info (padrão)
myModal("Demanda criada com sucesso!", { type: "success" });
myModal("Erro ao salvar", { type: "danger", title: "Ops!", okText: "Entendi" });

// Como retorna uma Promise, dá para aguardar o fechamento:
await myModal("Você será redirecionado");
window.location.href = "...";
```

Tipos: `info` · `success` · `danger` · `warning` (mudam só a cor do ícone).
Fecha pelo botão **OK**, pelo **×**, clicando fora ou com **ESC**.
Para migrar o código atual, basta trocar `alert("texto")` por `myModal("texto")`
no topo do arquivo de serviço com o respectivo `import`.

---

## 6. O que NÃO colocar no `default.css`

- Layout exclusivo de uma página (grids, posições, alturas específicas).
- Componentes que só existem em um lugar (ex.: accordion da FAQ, cartão de contato).
  Esses ficam no CSS da própria página (`faq.css`, `talkus.css`, etc.), que **reaproveita**
  os tokens (`var(--primary)`, `var(--radius-md)`, …) do `default.css`.
