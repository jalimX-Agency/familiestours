import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface BookingEmailData {
  id: string;
  packageName: string;
  customerName: string;
  email: string;
  phone?: string | null;
  date: string | Date;
  guests: number;
  message?: string | null;
}

/**
 * Send reservation confirmation email to customer and notification to agency
 */
export async function sendBookingNotifications(data: BookingEmailData) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not configured. Skipping email dispatch.');
    return { success: false, reason: 'RESEND_API_KEY missing' };
  }

  const formattedDate =
    typeof data.date === 'string'
      ? data.date
      : new Date(data.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

  const fromEmail = process.env.EMAIL_FROM || 'Families Tours <onboarding@resend.dev>';
  const adminEmail = process.env.ADMIN_EMAIL || 'info@familiestours.com';

  const cleanPhone = data.phone ? data.phone.replace(/[^0-9+]/g, '') : '';
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
        `Hello ${data.customerName}, thank you for choosing Families Tours for your "${data.packageName}" experience!`
      )}`
    : '';

  try {
    // 1. Send Luxury Confirmation Email to Customer
    const customerEmailPromise = resend.emails.send({
      from: fromEmail,
      to: [data.email],
      subject: `Reservation Received: ${data.packageName} | Families Tours`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reservation Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #0d0d0d; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #e5e5e5;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0d0d0d; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #141414; border: 1px solid #2a241b; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(180deg, #1c1812 0%, #141414 100%); border-bottom: 1px solid #2a241b;">
                      <div style="display: inline-block; width: 48px; height: 48px; border: 1px solid #d97706; border-radius: 50%; line-height: 48px; font-size: 24px; color: #d97706; font-family: Georgia, serif; font-weight: bold; margin-bottom: 12px;">F</div>
                      <h1 style="margin: 0; color: #f59e0b; font-size: 22px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase;">FAMILIES TOURS</h1>
                      <p style="margin: 6px 0 0; color: #a3a3a3; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Luxury Moroccan Desert Experiences</p>
                    </td>
                  </tr>
                  
                  <!-- Body -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px; font-size: 16px; color: #ffffff; font-weight: 300;">Dear <strong style="color: #f59e0b; font-weight: 500;">${data.customerName}</strong>,</p>
                      <p style="margin: 0 0 28px; font-size: 14px; line-height: 1.7; color: #a3a3a3;">
                        Thank you for choosing Families Tours. We have received your reservation request for the <strong style="color: #ffffff;">${data.packageName}</strong>. Our dedicated desert travel specialist is reviewing your request and will contact you shortly to confirm arrangements and free transport pickup.
                      </p>

                      <!-- Booking Details Table -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #1a1714; border: 1px solid #2f271d; border-radius: 8px; margin-bottom: 30px;">
                        <tr>
                          <td style="padding: 20px;">
                            <div style="font-size: 11px; color: #f59e0b; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 14px; font-weight: 600;">Reservation Summary</div>
                            
                            <table width="100%" border="0" cellspacing="0" cellpadding="6">
                              <tr>
                                <td style="color: #737373; font-size: 13px; width: 40%;">Experience:</td>
                                <td style="color: #ffffff; font-size: 13px; font-weight: 500;">${data.packageName}</td>
                              </tr>
                              <tr>
                                <td style="color: #737373; font-size: 13px;">Date:</td>
                                <td style="color: #ffffff; font-size: 13px; font-weight: 500;">${formattedDate}</td>
                              </tr>
                              <tr>
                                <td style="color: #737373; font-size: 13px;">Guests:</td>
                                <td style="color: #ffffff; font-size: 13px; font-weight: 500;">${data.guests} Guest(s)</td>
                              </tr>
                              <tr>
                                <td style="color: #737373; font-size: 13px;">Transport:</td>
                                <td style="color: #10b981; font-size: 13px; font-weight: 500;">Included (Free 4x4 / Minivan Pickup)</td>
                              </tr>
                              ${
                                data.message
                                  ? `<tr>
                                <td style="color: #737373; font-size: 13px; vertical-align: top;">Notes:</td>
                                <td style="color: #d4d4d4; font-size: 13px;">${data.message}</td>
                              </tr>`
                                  : ''
                              }
                            </table>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 0 0 10px; font-size: 13px; color: #737373; line-height: 1.6;">
                        Need immediate assistance or have special dietary / travel requests? You can reach us directly via WhatsApp at anytime.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 40px; background-color: #0e0e0e; border-top: 1px solid #1f1f1f; text-align: center;">
                      <p style="margin: 0 0 6px; font-size: 12px; color: #525252;">Families Tours &bull; Merzouga Desert, Morocco</p>
                      <p style="margin: 0; font-size: 11px; color: #404040;">&copy; ${new Date().getFullYear()} Families Tours. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    // 2. Send Immediate Notification Email to Agency Admin
    const adminEmailPromise = resend.emails.send({
      from: fromEmail,
      to: [adminEmail],
      subject: `🚨 NEW BOOKING: ${data.packageName} - ${data.customerName}`,
      html: `
        <h2>New Booking Request Received</h2>
        <p><strong>Customer:</strong> ${data.customerName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <p><strong>Experience:</strong> ${data.packageName}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Guests:</strong> ${data.guests}</p>
        <p><strong>Special Notes:</strong> ${data.message || 'None'}</p>
        ${
          whatsappUrl
            ? `<p><a href="${whatsappUrl}" style="display:inline-block;padding:10px 20px;background-color:#25D366;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;">Reply to Customer via WhatsApp</a></p>`
            : ''
        }
      `,
    });

    const [customerRes, adminRes] = await Promise.allSettled([
      customerEmailPromise,
      adminEmailPromise,
    ]);

    return {
      success: true,
      customerSent: customerRes.status === 'fulfilled',
      adminSent: adminRes.status === 'fulfilled',
    };
  } catch (err: any) {
    console.error('Error dispatching emails via Resend:', err);
    return { success: false, error: err.message };
  }
}
