import jwt from 'jsonwebtoken'

const authMiddleare = {
    authenticate: async (req,res,next)=>{
        const c = req.headers.authorization
        if(!c) {
            res.status(400).json({
            ok:false,
            message: 'não autorizado'})
            return
        }
        const token = c.split(' ')[1] || c
        try{
            const user = jwt.verify(token,process.env.JWT_SECRET)
            next()
        }catch(e){
            res.status(401).json({
                ok:false,
                message:'não autorizado!'
            })
        }
        

    },
    authenticateAdmin: async (req,res,next)=>{
        const c = req.headers.authorization
        if(!c) res.status(400).json({
            ok:false,
            message: 'sem cabeçalho de autenticação'
        })
        const token = c.split(' ')[1] || c
        try{
            const user = jwt.verify(token,process.env.JWT_SECRET)
            if(user.user_tipo==='Admin') next()
            else res.status(401).json({
                ok:false,
                message:'não autorizado!'
            })
        }catch(e){
            res.status(401).json({
                ok:false,
                message:'não autenticado!'
            })
        }
    }
}

export default authMiddleare