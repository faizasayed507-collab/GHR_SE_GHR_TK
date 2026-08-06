import dotenv from "dotenv";
dotenv.config({ override: true });

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import cors from "cors";

// Utility helper to clean environment variables
function getCleanEnv(key: string, fallback = ""): string {
  const val = process.env[key] || fallback;
  return val.replace(/^["']|["']$/g, "").trim();
}

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

// Gmail Credentials Check Log
const gmailUser = getCleanEnv("EMAIL_USER");
const gmailPass = getCleanEnv("EMAIL_PASS");
console.log("Gmail Config Present:", Boolean(gmailUser && gmailPass));

// In-memory OTP storage
const otpStore = new Map<string, { code: string; expiresAt: number; lastSentAt: number }>();

// Nodemailer Gmail Transporter Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailUser,
    pass: gmailPass, // Google 16-digit App Password
  },
});

// Helper to send email via Gmail SMTP
async function sendEmailOtp(email: string, code: string) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #E2D9D0; border-radius: 10px; background-color: #FAF6F2;">
      <h2 style="color: #4A3F35; margin-bottom: 10px; text-align: center;">Ghar Se Ghar Tak (GHR_SE_GHR_TK)</h2>
      <p style="color: #6B5E52; font-size: 14px;">Assalam-o-Alaikum,</p>
      <p style="color: #6B5E52; font-size: 14px;">Your 6-digit email verification code for activating your Home Business account is:</p>
      <div style="background-color: #4A3F35; color: #D4AF37; font-size: 28px; font-weight: bold; letter-spacing: 6px; text-align: center; padding: 15px; border-radius: 8px; margin: 20px 0;">
        ${code}
      </div>
      <p style="color: #8C7B6C; font-size: 12px; text-align: center;">This code will expire in 5 minutes. Do not share this code with anyone.</p>
    </div>
  `;

  if (!gmailUser || !gmailPass) {
    return { 
      success: false, 
      error: "EMAIL_USER or EMAIL_PASS missing in environment variables (.env)." 
    };
  }

  try {
    await transporter.sendMail({
      from: `"Ghar Se Ghar Tak" <${gmailUser}>`,
      to: email, // Dynamic user email address
      subject: `Your Ghar Se Ghar Tak Seller Verification Code: ${code}`,
      html: htmlContent,
    });

    console.log(`[GMAIL SMTP SUCCESS] Dispatched OTP email to ${email}`);
    return { success: true, method: "gmail_smtp" };
  } catch (smtpErr: any) {
    const smtpErrorMessage = smtpErr?.message || "Gmail SMTP authentication failed";
    console.error(`[GMAIL SMTP ERROR] ${smtpErrorMessage}`);
    return { success: false, error: smtpErrorMessage };
  }
}

// API Endpoint 1: Send OTP
app.post("/api/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ success: false, error: "A valid email address is required." });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Rate-limit check (60 seconds)
    const existing = otpStore.get(cleanEmail);
    if (existing && Date.now() - existing.lastSentAt < 60000) {
      const waitSecs = Math.ceil((60000 - (Date.now() - existing.lastSentAt)) / 1000);
      return res.status(429).json({
        success: false,
        error: `Please wait ${waitSecs} seconds before requesting a new verification code.`
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins
    const lastSentAt = Date.now();

    const emailResult = await sendEmailOtp(cleanEmail, code);

    if (!emailResult.success) {
      return res.status(400).json({
        success: false,
        error: emailResult.error || "Failed to deliver verification email."
      });
    }

    otpStore.set(cleanEmail, { code, expiresAt, lastSentAt });

    return res.json({
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
      method: emailResult.method,
    });
  } catch (error: any) {
    console.error("Error in /api/send-otp:", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to send verification code." });
  }
});

// API Endpoint 2: Verify OTP
app.post("/api/verify-otp", (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ success: false, error: "Email and code are required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const record = otpStore.get(cleanEmail);

    if (!record) {
      return res.status(400).json({ success: false, error: "No verification request found for this email. Please request a new code." });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(cleanEmail);
      return res.status(400).json({ success: false, error: "Verification code has expired. Please click 'Resend Code'." });
    }

    if (record.code !== code.trim()) {
      return res.status(400).json({ success: false, error: "Invalid verification code. Please check your inbox and try again." });
    }

    otpStore.delete(cleanEmail);
    return res.json({ success: true, message: "Email successfully verified!" });
  } catch (error: any) {
    console.error("Error in /api/verify-otp:", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to verify code." });
  }
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();