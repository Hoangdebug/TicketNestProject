const nodemailer = require('nodemailer')
const asyncHandler = require("express-async-handler")

const sendMail =  asyncHandler(async ({email, html} : {email: string, html: string}) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: process.env.GOOGLE_EMAIL_NAME,
          pass: process.env.GOOGLE_EMAIL_PASSWORD,
        },
      });
    
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"TicketNest" <no-reply@example.com>', // sender address
            to: email, // list of receivers
            subject: "Forgot password", // Subject line
            text: `Hello,\n\nPlease use the following code to reset your password:\n`,
            html: html, // html body
          });
          
         return info 
})

module.exports = sendMail