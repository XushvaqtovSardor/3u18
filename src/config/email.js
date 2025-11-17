import nodemailer from 'nodemailer';
import logger from './logger.js';

let transporter = null;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    logger.error('Email credentials not found in environment variables');
    logger.error(`EMAIL_USER: ${emailUser ? 'exists' : 'missing'}`);
    logger.error(`EMAIL_PASS: ${emailPass ? 'exists' : 'missing'}`);
    throw new Error('Email configuration is missing');
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  return transporter;
};

export const sendOTPEmail = async (email, otp) => {
  try {
    const mailer = getTransporter();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code - Recipe App',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Your OTP code is:</p>
          <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    };

    const info = await mailer.sendMail(mailOptions);
    logger.info(
      `OTP email sent successfully to ${email}, MessageID: ${info.messageId}`
    );
    return true;
  } catch (error) {
    logger.error(`Failed to send OTP email to ${email}: ${error.message}`);
    logger.error(`Email error details: ${JSON.stringify(error)}`);
    throw new Error('Failed to send OTP email');
  }
};

export default getTransporter;
