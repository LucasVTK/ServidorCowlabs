import express from "express";
import UserRoutes from "./routes/UsersRoutes.js";
import globalMiddleware from "./middleware/globalMiddleware.js";
import Demandarouter from "./routes/DemandasRotas.js"
import AuthRoute from "../src/routes/AuthRoute.js"
import RotaRepJson from "../src/routes/RotaRepjson.js"


const app = express();
const port = process.env.PORT;
const host = process.env.host;

app.use(globalMiddleware.cors);
app.use(express.json()); // sem isso o req.body vem vazio

app.use(UserRoutes);
app.use(Demandarouter)
app.use(AuthRoute)
app.use(RotaRepJson)
app.use(Demandarouter)

app.get("/", (req, res) => {
    res.status(200).json({
        system: "Cowlabs",
        ok: true,
    });
});


app.listen(port, host, () => {
    console.log(` Servidor rodando em uma porta ${port} `);
});
