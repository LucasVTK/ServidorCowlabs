# 📁 Estrutura do Projeto

Este projeto segue uma arquitetura separada entre **backend (MVC)** e **frontend (view desacoplada)** dentro do mesmo repositório.

---

## 🧱 Estrutura de Pastas

```bash
project-root/
│
├── src/                    # Backend (MVC)
│   ├── controllers/
│   ├── models/
│   ├── repositories/
│   ├── middlewares/
│   ├── routes/
│   └── server.js
│
├── view/              # 🔥 Frontend (view separada do backend)
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas (views)
│   │   ├── services/      # Comunicação com API
│   │   ├── utils/         # Funções auxiliares
│   │   ├── styles/        # CSS/SCSS global
│   │   └── main.js
│ 
│
├── .env
├── package.json          
└── README.md