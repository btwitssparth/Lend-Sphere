import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (options) => {
    try {
        const response = await resend.emails.send({
            from: "Lend-Sphere <onboarding@resend.dev>", // default sender (works without setup)
            to: options.email,
            subject: options.subject,
            html: options.html,
        });

        console.log(`✅ Email sent successfully to: ${options.email}`);
        console.log("Response:", response);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};