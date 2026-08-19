type VercelRequest = any;
type VercelResponse = any;

const otpStore: Map<string, { code: string; expiresAt: number; lastSentAt: number }> =
  (global as any).__otpStore || new Map();
(global as any).__otpStore = otpStore;

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ success: false, error: 'Email and code are required.' });
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

    if (record.code !== String(code).trim()) {
      return res.status(400).json({ success: false, error: 'Invalid verification code. Please check your inbox and try again.' });
    }

    otpStore.delete(cleanEmail);
    return res.status(200).json({ success: true, message: 'Email successfully verified!' });
  } catch (error: any) {
    console.error('Error in /api/verify-otp:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to verify code.' });
  }
}
