import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Send verification email
export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Welcome to Wellness Bot!</h2>
      <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
      <a href="${verificationUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Email</a>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #6b7280;">${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Verify Your Email - Wellness Bot',
    html
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc2626;">Password Reset Request</h2>
      <p>You requested a password reset for your Wellness Bot account. Click the button below to reset your password:</p>
      <a href="${resetUrl}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #6b7280;">${resetUrl}</p>
      <p>This link will expire in 10 minutes.</p>
      <p>If you didn't request this password reset, please ignore this email.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Password Reset - Wellness Bot',
    html
  });
};

// Send medicine reminder email
export const sendMedicineReminderEmail = async (email: string, medicineName: string, time: string): Promise<void> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #059669;">Medicine Reminder</h2>
      <p>It's time to take your medication:</p>
      <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <h3 style="margin: 0; color: #374151;">${medicineName}</h3>
        <p style="margin: 8px 0 0 0; color: #6b7280;">Scheduled time: ${time}</p>
      </div>
      <p>Don't forget to mark it as taken in your Wellness Bot app!</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: `Medicine Reminder: ${medicineName}`,
    html
  });
};
