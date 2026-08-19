import crypto from 'crypto';

type VercelRequest = any;
type VercelResponse = any;

function getCleanEnv(key: string, fallback = ''): string {
  const val = process.env[key] || fallback;
  return val.replace(/^["']|["']$/g, '').trim();
}

const otpSecret = getCleanEnv('OTP_SECRET', 'fallback-dev-secret-change-me');

function verifyToken(token: string): { email: string; code: string; expiresAt: number } | null {
  try {
    const [encodedPayload, hmac] = token.split('.');
    if (!encodedPayload || !hmac) return null;

    const payload = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
    const expectedHmac = crypto.createHmac('sha256', otpSecret).update(payload).digest('hex');

    if (hmac !== expectedHmac) return null;

    const [email, code, expiresAtStr] = payload.split('|');
    if (!email || !code || !expiresAtStr) return null;

    return { email, code, expiresAt: Number(expiresAtStr) };
  } catch {
    return null;
  }
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email, code, token } = req.body;
    if (!email || !code || !token) {
      return res.status(400).json({ success: false, error: 'Email, code, and token are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(400).json({ success: false, error: 'Invalid or corrupted verification session. Please request a new code.' });
    }

    if (decoded.email !== cleanEmail) {
      return res.status(400).json({ success: false, error: 'Verification session does not match this email. Please request a new code.' });
    }

    if (Date.now() > decoded.expiresAt) {
      return res.status(400).json({ success: false, error: "Verification code has expired. Please click 'Resend Code'." });
    }

    if (decoded.code !== String(code).trim()) {
      return res.status(400).json({ success: false, error: 'Invalid verification code. Please check your inbox and try again.' });
    }

    return res.status(200).json({ success: true, message: 'Email successfully verified!' });
  } catch (error: any) {
    console.error('Error in /api/verify-otp:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to verify code.' });
  }
}