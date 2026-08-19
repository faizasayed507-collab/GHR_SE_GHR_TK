import nodemailer from 'nodemailer';
import crypto from 'crypto';

type VercelRequest = any;
type VercelResponse = any;

function getCleanEnv(key: string, fallback = ''): string {
  const val = process.env[key] || fallback;
  return val.replace(/^["']|["']$/g, '').trim();
}

const gmailUser = getCleanEnv('EMAIL_USER');
const gmailPass = getCleanEnv('EMAIL_PASS');
const otpSecret = getCleanEnv('OTP_SECRET', 'fallback-dev-secret-change-me');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
});

function signToken(payload: string): string {
  const hmac = crypto.createHmac('sha256', otpSecret).update(payload).digest('hex');
  const encodedPayload = Buffer.from(payload).toString('base64url');
  return `${encodedPayload}.${hmac}`;
}

async function sendEmailOtp(email: string, code: string) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #E2D9D0; border-radius: 10px; background-color: #FAF6F2;">
      <h2 style="color: #4A3F35; margin-bottom: 10px; text-align: center;">Ghar Se Ghar Tak</h2>
      <p style="color: #6B5E52; font-size: 14px;">Assalam-o-Alaikum,</p>
      <p style="color: #6B5E52; font-size: 14px;">Your 6-digit email verification code is:</p>
      <div style="background-color: #4A3F35; color: #D4AF37; font-size: 28px; font-weight: bold; letter-spacing: 6px; text-align: center; padding: 15px; border-radius: 8px; margin: 20px 0;">
        ${code}
      </div>
      <p style="color: #8C7B6C; font-size: 12px; text-align: center;">This code will expire in 5 minutes.</p>
    </div>
  `;

  if (!gmailUser || !gmailPass) {
    return { success: false, error: 'EMAIL_USER or EMAIL_PASS missing in Vercel environment variables.' };
  }

  try {
    await transporter.sendMail({
      from: `"Ghar Se Ghar Tak" <${gmailUser}>`,
      to: email,
      subject: `Your Ghar Se Ghar Tak Verification Code: ${code}`,
      html: htmlContent,
    });
    return { success: true, method: 'gmail_smtp' };
  } catch (smtpErr: any) {
    return { success: false, error: smtpErr?.message || 'Gmail SMTP authentication failed' };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    const emailResult = await sendEmailOtp(cleanEmail, code);

    if (!emailResult.success) {
      return res.status(400).json({ success: false, error: emailResult.error || 'Failed to deliver verification email.' });
    }

    // Stateless token: email|code|expiresAt, signed so it can't be tampered with client-side
    const payload = `${cleanEmail}|${code}|${expiresAt}`;
    const token = signToken(payload);

    return res.status(200).json({
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
      method: emailResult.method,
      token,
    });
  } catch (error: any) {
    console.error('Error in /api/send-otp:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to send verification code.' });
  }
}