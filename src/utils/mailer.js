import nodemailer from "nodemailer"


// 2. Configura o "transportador" de email (quem envia)
const transporter = nodemailer.createTransport({
service: 'gmail',
    auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// 3. Função que envia o email de teste
async function mailer(email_resp, email_content, id) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email_resp,
      subject: `Resposta do chamado ${id} - COWLABS`,
      html:
        `
        <h3>Sua solcitação foi finalizada!</h3>
        <p>Agradecemos pelo seu contato com a equipe de Desenvolvimento da Cowlabs. Sua solicitação foi finalizada.</p>
        <p>Nossos desenvolvedores, ao finalizarem a sua solicitação responderam o seguinte:</p>
        <p>${email_content}</p>
        <p>Data/hora: ${new Date().toLocaleString('pt-BR')}</p>
      `
    })

    console.log('✅ Email enviado com sucesso!')
    console.log('ID da mensagem:', info.messageId)
  } catch (erro) {
    console.error('❌ Erro ao enviar email:')
    console.error(erro)
  }
}

export default mailer
