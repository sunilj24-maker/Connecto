import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

// Create Resend instance (requires RESEND_API_KEY in .env)
// If the key is missing, we skip sending emails (useful for local dev).
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendOtpEmail(email, otp) {
  if (!resend) {
    console.warn("RESEND_API_KEY not configured – skipping OTP email send.");
    return { skipped: true };
  }

  try {
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "Connecto <onboarding@routineready.me>";

    const data = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: "Your Connecto Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="font-size: 24px; font-weight: 900; color: #000; margin-bottom: 8px;">Verify your email</h2>
          <p style="color: #64748b; font-size: 15px; margin-bottom: 32px;">Use the code below to complete your sign-up for Connecto. This code expires in <strong>10 minutes</strong>.</p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; text-align: center; letter-spacing: 0.4em; font-size: 36px; font-weight: 900; color: #000; margin-bottom: 32px;">
            ${otp}
          </div>
          <p style="color: #94a3b8; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (data.error) {
      console.error("❌ Resend API Error:", data.error);
      throw new Error(data.error.message);
    }
    console.log("✅ OTP Email sent successfully via Resend to:", email);
    return data;
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    throw error;
  }
}
