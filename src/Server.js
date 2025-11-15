 import express from 'express'
 import globalMiddleware from './middleware/globalMiddleware.js'
import UserRoute from './routes/UsersRoutes.js'

 const app = express()
 const port = process.env.PORT
 const host = process.env.host

 app.use(globalMiddleware.cors)
 app.use(express.json()) // sem isso o req.body vem vazio
 app.use(UserRoute)

 app.get('/' ,(req, res) =>{ 
     res.status(200).json({
         system: 'Cowlabs',
         ok: true
     })
 })

 app.listen(port, host, () => {
    console.log(` Servidor rodando em uma porta ${port} `)
 })