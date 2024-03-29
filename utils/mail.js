const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD
    }
});

async function mail(from, to, subject, content) {
    try{
        

        const info = await transporter.sendMail({
            from: from, 
            to:to, 
            subject: subject, 
            html:content,

            
        }, (error, info)=>{
            if (error) {
                console.error('Error sending email:', error);
              } else {
                console.log('Email sent:', info.response);
              }
        });
        console.log("Message sent: %s", info.messageId);
    }
    catch(err){
        return err
    }

}


module.exports= {
    mail
}