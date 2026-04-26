import nodemailer from "nodemailer";
import logger from "./logger.js";

// Creates transporter — uses Gmail SMTP if configured, else logs to console in dev
const createTransporter = () => {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        return nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });
    }
    // Dev fallback — logs email to console instead of sending
    return null;
};

const send = async ({ to, subject, html }) => {
    const transporter = createTransporter();
    if (!transporter) {
        logger.info(`[EMAIL - DEV MODE] To: ${to} | Subject: ${subject}`);
        return;
    }
    try {
        await transporter.sendMail({ from: `"CareerConnect Pro" <${process.env.EMAIL_USER}>`, to, subject, html });
        logger.info(`Email sent to ${to}`);
    } catch (err) {
        logger.error(`Email failed to ${to}: ${err.message}`);
        // Non-fatal — don't throw, email failure shouldn't break the API
    }
};

export const sendWelcomeEmail = (to, name) =>
    send({
        to, subject: "Welcome to CareerConnect Pro!",
        html: `<h2>Hi ${name} 👋</h2><p>Your account has been created successfully. Start exploring top job opportunities today!</p><br/><p>— CareerConnect Pro Team</p>`,
    });

export const sendApplicationConfirmEmail = (to, name, jobTitle, company) =>
    send({
        to, subject: `Application Received — ${jobTitle} at ${company}`,
        html: `<h2>Hi ${name},</h2><p>We've received your application for <strong>${jobTitle}</strong> at <strong>${company}</strong>.</p><p>The recruiter will review your profile and update the status soon.</p><br/><p>— CareerConnect Pro Team</p>`,
    });

export const sendStatusUpdateEmail = (to, name, jobTitle, status) => {
    const statusMessages = {
        under_review: "Your application is now <strong>Under Review</strong> by the recruiter.",
        shortlisted:  "🎉 Congratulations! You've been <strong>Shortlisted</strong> for the next round.",
        hired:        "🎊 Amazing news! You've been <strong>Hired</strong>! The recruiter will contact you shortly.",
        rejected:     "Thank you for applying. Unfortunately, your application was <strong>not selected</strong> this time. Keep applying!",
    };
    send({
        to, subject: `Application Update — ${jobTitle}`,
        html: `<h2>Hi ${name},</h2><p>${statusMessages[status] ?? `Your application status has been updated to <strong>${status}</strong>.`}</p><br/><p>— CareerConnect Pro Team</p>`,
    });
};
