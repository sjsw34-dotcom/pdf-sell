export function generateEmailHTML({
  customerName,
  birthDate,
  readingType,
  orderId,
  customMessage,
  pdfDownloadLink,
  reviewLink,
  hasAttachment = false,
  hasPdfAttachment = false,
}: {
  customerName: string;
  birthDate: string;
  readingType: string;
  orderId: string;
  customMessage: string;
  pdfDownloadLink?: string;
  reviewLink?: string;
  hasAttachment?: boolean;
  hasPdfAttachment?: boolean;
}) {
  const downloadSection = pdfDownloadLink
    ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px;">
        <tr>
          <td align="center">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="background-color: #1a1a2e; border-radius: 4px;">
                  <a href="${pdfDownloadLink}" target="_blank" style="display: inline-block; padding: 15px 40px; font-size: 14px; letter-spacing: 1.5px; color: #ffffff; font-family: Arial, sans-serif; text-decoration: none; text-transform: uppercase; font-weight: bold;">
                    Download Your Report
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`
    : '';

  const attachmentNotice = hasAttachment
    ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-size: 13px; color: #888; font-family: Georgia, serif; line-height: 1.7; padding-bottom: 16px; text-align: center; font-style: italic;">
            ${hasPdfAttachment ? 'Your PDF report is attached to this email.' : 'Please find the attached files with this email.'}
          </td>
        </tr>
      </table>`
    : '';

  const reviewSection = reviewLink
    ? `
      <tr>
        <td style="padding: 12px 40px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #faf8f4; border-radius: 4px;">
            <tr>
              <td style="padding: 20px 24px; text-align: center;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                  <tr>
                    <td style="font-size: 13px; color: #666; font-family: Georgia, serif; line-height: 1.6; padding-bottom: 12px;">
                      Enjoyed your reading? A review would mean the world to me.
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a href="${reviewLink}" target="_blank" style="display: inline-block; padding: 10px 28px; font-size: 12px; letter-spacing: 1px; color: #c9a96e; font-family: Arial, sans-serif; text-decoration: none; text-transform: uppercase; border: 1px solid #c9a96e; border-radius: 3px;">
                        Leave a Review
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    : '';

  // Convert newlines in custom message to <br> tags
  const formattedMessage = customMessage.replace(/\n/g, '<br>');

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Saju Reading is Ready</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f0; font-family: Georgia, 'Times New Roman', serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f7f5f0;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 2px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.06);">

          <!-- HEADER -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding: 48px 40px 44px; text-align: center;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="font-size: 12px; letter-spacing: 4px; color: #c9a96e; text-transform: uppercase; font-family: Georgia, serif; padding-bottom: 12px;">
                    SAJU MUSE
                  </td>
                </tr>
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="font-size: 26px; color: #ffffff; font-family: Georgia, serif; font-weight: normal; line-height: 1.3; letter-spacing: 0.5px;">
                    Your Reading is Ready
                  </td>
                </tr>
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 20px auto 0;">
                <tr>
                  <td style="width: 60px; height: 1px; background-color: #c9a96e;"></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding: 44px 40px 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size: 17px; color: #2c2c2c; font-family: Georgia, serif; line-height: 1.7; padding-bottom: 20px;">
                    Dear <span style="color: #0f3460; font-weight: bold;">${customerName}</span>,
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 15px; color: #4a4a4a; font-family: Georgia, serif; line-height: 1.8; padding-bottom: 24px;">
                    ${formattedMessage}
                  </td>
                </tr>
              </table>

              <!-- Info Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px;">
                <tr>
                  <td style="background-color: #faf8f4; border-left: 3px solid #c9a96e; padding: 20px 24px; border-radius: 0 4px 4px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-size: 11px; letter-spacing: 2px; color: #999; text-transform: uppercase; font-family: Arial, sans-serif; padding-bottom: 12px;">
                          Reading Details
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 14px; color: #4a4a4a; font-family: Georgia, serif; line-height: 1.9;">
                          <strong style="color: #2c2c2c;">Name:</strong> ${customerName}<br>
                          <strong style="color: #2c2c2c;">Birth Date:</strong> ${birthDate}<br>
                          <strong style="color: #2c2c2c;">Reading Type:</strong> ${readingType}<br>
                          <strong style="color: #2c2c2c;">Order #:</strong> ${orderId}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${downloadSection}

              ${attachmentNotice}
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="padding: 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="height: 1px; background-color: #e8e4dc;"></td></tr>
              </table>
            </td>
          </tr>

          <!-- SIGN OFF -->
          <tr>
            <td style="padding: 28px 40px 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size: 15px; color: #4a4a4a; font-family: Georgia, serif; line-height: 1.8; padding-bottom: 8px;">
                    If you have any questions about your reading, feel free to reply to this email. I'd love to hear your thoughts!
                  </td>
                </tr>
                <tr><td style="font-size: 15px; color: #4a4a4a; font-family: Georgia, serif; line-height: 1.8; padding-bottom: 4px;">Warmly,</td></tr>
                <tr><td style="font-size: 16px; color: #1a1a2e; font-family: Georgia, serif; font-weight: bold; padding-bottom: 4px;">Master K</td></tr>
                <tr><td style="font-size: 13px; color: #999; font-family: Georgia, serif; font-style: italic;">Certified Saju Counselor · 15+ Years Experience</td></tr>
              </table>
            </td>
          </tr>

          ${reviewSection}

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #1a1a2e; padding: 32px 40px; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size: 11px; letter-spacing: 3px; color: #c9a96e; text-transform: uppercase; font-family: Georgia, serif; padding-bottom: 14px;">
                    SAJU MUSE
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #8888a0; font-family: Arial, sans-serif; line-height: 1.8; padding-bottom: 16px;">
                    <a href="https://sajumuse.com" style="color: #8888a0; text-decoration: underline;">sajumuse.com</a>&nbsp;&nbsp;&middot;&nbsp;&nbsp;
                    <a href="https://www.instagram.com/sajumuse" style="color: #8888a0; text-decoration: underline;">Instagram</a>&nbsp;&nbsp;&middot;&nbsp;&nbsp;
                    <a href="https://www.threads.net/@sajumuse" style="color: #8888a0; text-decoration: underline;">Threads</a>
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 11px; color: #555570; font-family: Arial, sans-serif; line-height: 1.6;">
                    &copy; 2026 Saju Muse by IndieLabs &middot; All rights reserved<br>
                    Your destiny, decoded through the wisdom of Korean astrology
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
