import express from "express";
import globalMiddleware from "./middleware/globalMiddleware.js";
import UserRoute from "./routes/UsersRoutes.js";
import DemandasRoute from "./routes/DemandasRoute.js";
import con from "./database/connectionSQL.js";

const app = express();
const port = process.env.PORT;
const host = process.env.HOST;
const pool = await con(); // declarei essa variável dnv para receber a função importada do connectionSQL

app.use(globalMiddleware.cors);
app.use(express.json()); // sem isso o req.body vem vazio
app.use(UserRoute);
app.use(DemandasRoute);

app.get("/", (req, res) => {
  res.status(200).json({
    system: "Cowlabs",
    ok: true,
  });
});

// Inicia servidor só após conectar ao banco par evitar erros de conexão
con().then(() => {
  // estamos utilizando o .then() aqui para esperara conexao com o banco e depois dar inicio ao servidor, não sei bem o pq mas sem isso não tava funcionando antes.
  app.listen(port, () => {
    console.log("Servidor rodando na porta 3000");
  });
});