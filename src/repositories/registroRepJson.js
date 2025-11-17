import users from '../database/Registros.json' with {type:'json'}
import fs from 'fs'

const registroRepJson = {
    async readAll(){
        return users
    },
    async readById(id){
        const user = users.find(j=>j.id==id)
        return user
    },
    async readUser(email,Senha){
        const user = users.find(
            (u)=>u.email === email && u.Senha===Senha
        )
        return user
    },
    async create(model){},
    async update(id,model){},
    async delete(id){}
}

export default registroRepJson