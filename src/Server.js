import express from "express";
import globalMiddleware from "./middleware/globalMiddleware.js";
import UserRoute from "./routes/UsersRoutes.js";
import DemandasRoute from "./routes/DemandasRoute.js";
import ComentariosRoute from "./routes/ComentariosRoute.js";
import con from "./database/connectionSQL.js";
import AuthRoute from "./routes/AuthRoute.js";
import chamadosRouter from "./routes/ChamadosRoute.js";

const app = express();
const port = process.env.PORT;
const host = process.env.HOST;

app.use(globalMiddleware.cors);
app.use(express.json()); // sem isso o req.body vem vazio
app.use(UserRoute);
app.use(DemandasRoute);
app.use(ComentariosRoute);
app.use(AuthRoute);
app.use(chamadosRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    system: "Cowlabs",
    ok: true,
  });
});

// No Vercel (serverless) exporta o app diretamente.
// Localmente, sobe o servidor na porta definida no .env.
if (process.env.VERCEL) {
  con(); // pré-aquece o pool na cold start
} else {
  con().then(() => {
    app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
  });
}

export default app;