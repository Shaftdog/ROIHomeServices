import * as nodemailer from 'nodemailer';
import { logger } from './logger';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `ROI Home Services <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    
    logger.info({
      messageId: info.messageId,
      to,
      subject,
    }, 'Email sent successfully');
    
    return info;
  } catch (error) {
    logger.error({
      err: error,
      to,
      subject,
    }, 'Failed to send email');
    throw error;
  }
}

export async function sendAdminNotification({
  subject,
  html,
  text,
}: {
  subject: string;
  html: string;
  text: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@roiappraise.com'; // Fixed case sensitivity
  
  // Try primary admin email first
  try {
    return await sendEmail({
      to: adminEmail,
      subject,
      html,
      text,
    });
  } catch (primaryError) {
    logger.warn({
      err: primaryError,
      primaryEmail: adminEmail,
    }, 'Primary admin email failed, trying fallback');
    
    // Try fallback email if configured
    const fallbackEmail = process.env.ADMIN_EMAIL_FALLBACK;
    if (fallbackEmail && fallbackEmail !== adminEmail) {
      try {
        return await sendEmail({
          to: fallbackEmail,
          subject: `[FALLBACK] ${subject}`,
          html,
          text,
        });
      } catch (fallbackError) {
        logger.error({
          err: fallbackError,
          fallbackEmail,
        }, 'Fallback admin email also failed');
      }
    }
    
    // Re-throw the original error if all attempts failed
    throw primaryError;
  }
}

export async function sendBookingNotification(bookingData: {
  bookingId: string;
  serviceType: string;
  preferredDate: string;
  zip: string;
  email: string;
  phone: string;
  name?: string;
  address?: string;
  notes?: string;
  requestId: string;
}) {
  const subject = `New Booking Request - ${bookingData.serviceType}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-left: 10px; color: #333; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Booking Request Received</h2>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Booking ID:</span>
            <span class="value">${bookingData.bookingId}</span>
          </div>
          <div class="field">
            <span class="label">Service Type:</span>
            <span class="value">${bookingData.serviceType}</span>
          </div>
          <div class="field">
            <span class="label">Preferred Date:</span>
            <span class="value">${bookingData.preferredDate}</span>
          </div>
          <div class="field">
            <span class="label">ZIP Code:</span>
            <span class="value">${bookingData.zip}</span>
          </div>
          <div class="field">
            <span class="label">Customer Email:</span>
            <span class="value">${bookingData.email}</span>
          </div>
          <div class="field">
            <span class="label">Customer Phone:</span>
            <span class="value">${bookingData.phone}</span>
          </div>
          ${bookingData.name ? `
          <div class="field">
            <span class="label">Customer Name:</span>
            <span class="value">${bookingData.name}</span>
          </div>` : ''}
          ${bookingData.address ? `
          <div class="field">
            <span class="label">Address:</span>
            <span class="value">${bookingData.address}</span>
          </div>` : ''}
          ${bookingData.notes ? `
          <div class="field">
            <span class="label">Notes:</span>
            <span class="value">${bookingData.notes}</span>
          </div>` : ''}
        </div>
        <div class="footer">
          <p>Request ID: ${bookingData.requestId}</p>
          <p>This is an automated message from ROI Home Services booking system.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
New Booking Request Received

Booking ID: ${bookingData.bookingId}
Service Type: ${bookingData.serviceType}
Preferred Date: ${bookingData.preferredDate}
ZIP Code: ${bookingData.zip}
Customer Email: ${bookingData.email}
Customer Phone: ${bookingData.phone}
${bookingData.name ? `Customer Name: ${bookingData.name}` : ''}
${bookingData.address ? `Address: ${bookingData.address}` : ''}
${bookingData.notes ? `Notes: ${bookingData.notes}` : ''}

Request ID: ${bookingData.requestId}

This is an automated message from ROI Home Services booking system.
  `.trim();
  
  return sendAdminNotification({ subject, html, text });
}

export async function sendContactNotification(contactData: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  requestId: string;
}) {
  const emailSubject = `Contact Form: ${contactData.subject}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-left: 10px; color: #333; }
        .message-box { background-color: white; padding: 15px; border-left: 3px solid #2c3e50; margin-top: 20px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Contact Form Submission</h2>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Name:</span>
            <span class="value">${contactData.name}</span>
          </div>
          <div class="field">
            <span class="label">Email:</span>
            <span class="value">${contactData.email}</span>
          </div>
          ${contactData.phone ? `
          <div class="field">
            <span class="label">Phone:</span>
            <span class="value">${contactData.phone}</span>
          </div>` : ''}
          <div class="field">
            <span class="label">Subject:</span>
            <span class="value">${contactData.subject}</span>
          </div>
          <div class="message-box">
            <p><strong>Message:</strong></p>
            <p>${contactData.message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
        <div class="footer">
          <p>Request ID: ${contactData.requestId}</p>
          <p>This is an automated message from ROI Home Services contact form.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
New Contact Form Submission

Name: ${contactData.name}
Email: ${contactData.email}
${contactData.phone ? `Phone: ${contactData.phone}` : ''}
Subject: ${contactData.subject}

Message:
${contactData.message}

Request ID: ${contactData.requestId}

This is an automated message from ROI Home Services contact form.
  `.trim();
  
  return sendAdminNotification({ subject: emailSubject, html, text });
}
