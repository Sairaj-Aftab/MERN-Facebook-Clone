import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, text) => {

    try {
        
        let transport = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          auth: {
            user: "sairajaftab769@gmail.com",
            pass: "psmpqhtguvpbswlq"
          }
        });

        await transport.sendMail({
            from : 'sairajaftab769@gmail.com',
            to : to,
            subject : subject,
            text : text
          })

    } catch (error) {
        console.log(error);
    }
}