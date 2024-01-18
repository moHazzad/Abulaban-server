import nodemailer from 'nodemailer';
import config from '../config';
export const sendEmail = async (to: string, subject: string, html: string)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config.NODE_ENV === 'production',
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: "hazzadmdap@gmail.com",
          pass: "amru bimt tctt bopw",
        },
      });

    await transporter.sendMail({
        from: '"AWalive Hotel" <noreply@awalivehotel.com>', //'hazzadmdap@gami.com', sender address
        to, // list of receivers
        subject, // Subject line
        text: "", // plain text body
        html, // html body
      });
}