import { createTransport } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async (to: string, subject: string, text: string) => {

    const transporter = createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export default sendEmail;