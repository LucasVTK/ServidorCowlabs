import express from "express";
import globalMiddleware from "./middleware/globalMiddleware.js";
import UserRoute from "./routes/UsersRoutes.js";
import DemandasRoute from "./routes/DemandasRoute.js";
import con from "./database/connectionSQL.js";

const app = express();

const PORT = process.env.PORT || 3000;
// const host = process.env.HOST;
//  const pool = await con(); // declarei essa variável dnv para receber a função importada do connectionSQL

app.use(globalMiddleware.cors);
app.use(express.json()); // sem isso o req.body vem vazio
app.use("/users", UserRoute);
app.use("/demanndas",DemandasRoute);

app.get("/", (req, res) => {
  res.status(200).json({
    system: "Cowlabs",
    ok: true,
  });
});

// Criei uma função nova async para controlar melhor o start, a antiga conectava ao serve 2 vezes
// por usar await e .then 
async function startServer() {
  try {
    //conecta o banco antes de rodar o servidor, evitando erro
    await con();
   //aqui inicia o serve na porta definida ou na nuvem
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    
    console.error("Erro ao iniciar servidor:", err);

  }
}
//executa a função para iniciar tudo
startServer();






// // Inicia servidor só após conectar ao banco par evitar erros de conexão
// con().then(() => {
//   // estamos utilizando o .then() aqui para esperara conexao com o banco e depois dar inicio ao servidor, não sei bem o pq mas sem isso não tava funcionando antes.
//   app.listen(port, () => {
//     console.log("Servidor rodando na porta 3000");
//   });
// });

// //! app.get("/", async (req, res) => {
// //!   try {
// //!    const result = await pool.request().query("SELECT user_name FROM tb_user"); //fiz essa querry simples só para testar
// //!     res.json(result.recordset); // retorna os dados como JSON
// //!   } catch (err) {
// //!     console.error(err);
// //!     res.status(500).json({ erro: err.message });
// //!   }
// //! });
