const nodeMailer = require('nodemailer')

const Sendmail = async function (options) {
    const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        service: "gmail",
        auth: {
            user: "vmagdum18@gmail.com",
            pass: "nirunpeyqclbgcsl"
        }
    });

    const mailOption = {
        from: "vmagdum18@gmail.com",
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    await transporter.sendMail(mailOption)
}

module.exports = Sendmail