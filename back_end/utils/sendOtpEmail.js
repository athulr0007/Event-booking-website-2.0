const nodemailer = require("nodemailer");

module.exports = async (email, otp) => {

  const transporter = nodemailer.createTransport(
    process.env.NODE_ENV === "production"
      ? {
          // Brevo — used on Render
          host: "smtp-relay.brevo.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.BREVO_USER,
            pass: process.env.BREVO_PASS,
          },
        }
      : {
          // Gmail — used locally
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        }
  );

  await transporter.sendMail({
    from: process.env.NODE_ENV === "production"
      ? `"Crowd" <${process.env.BREVO_SENDER}>`
      : `"Crowd" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Crowd Login Code",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Login Code</title>
</head>
<body style="
  margin: 0;
  padding: 0;
  background-color: #020b06;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background-color: #020b06; padding: 48px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
          style="
            max-width: 520px;
            background-color: #070f09;
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,0.06);
            overflow: hidden;
          ">

          <!-- Green top accent bar -->
          <tr>
            <td style="
              background: linear-gradient(90deg, #00c853 0%, #00e676 50%, #00c853 100%);
              height: 4px;
              font-size: 0;
              line-height: 0;
            ">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 48px 32px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="
                    background-color: #00c853;
                    border-radius: 10px;
                    width: 40px;
                    height: 40px;
                    text-align: center;
                    vertical-align: middle;
                    font-size: 20px;
                    line-height: 40px;
                  ">🎟</td>
                  <td style="width: 10px;"></td>
                  <td style="
                    font-size: 22px;
                    font-weight: 800;
                    letter-spacing: 4px;
                    color: #ffffff;
                    text-transform: uppercase;
                    vertical-align: middle;
                  ">CROWD</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 48px;">
              <div style="height: 1px; background-color: rgba(255,255,255,0.06);"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 48px 32px;">

              <div style="margin-bottom: 24px;">
                <span style="
                  display: inline-block;
                  background-color: rgba(0,200,83,0.12);
                  border: 1px solid rgba(0,200,83,0.3);
                  color: #00c853;
                  font-size: 10px;
                  font-weight: 600;
                  letter-spacing: 3px;
                  text-transform: uppercase;
                  padding: 5px 14px;
                  border-radius: 2px;
                ">Security Code</span>
              </div>

              <h1 style="
                margin: 0 0 12px;
                font-size: 28px;
                font-weight: 800;
                color: #ffffff;
                letter-spacing: -0.5px;
                line-height: 1.2;
              ">Your login code</h1>

              <p style="
                margin: 0 0 32px;
                font-size: 15px;
                color: rgba(255,255,255,0.45);
                line-height: 1.7;
                font-weight: 300;
              ">
                Use the code below to complete your sign-in to Crowd.
                This code is single-use and expires in <strong style="color: rgba(255,255,255,0.65); font-weight: 500;">5 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="margin-bottom: 32px;">
                <tr>
                  <td align="center" style="
                    background-color: rgba(0,200,83,0.05);
                    border: 1px solid rgba(0,200,83,0.2);
                    border-radius: 12px;
                    padding: 28px 24px;
                  ">
                    <div style="
                      font-size: 11px;
                      font-weight: 600;
                      letter-spacing: 3px;
                      text-transform: uppercase;
                      color: rgba(255,255,255,0.3);
                      margin-bottom: 14px;
                    ">One-time password</div>
                    <div style="
                      font-size: 48px;
                      font-weight: 800;
                      color: #ffffff;
                      letter-spacing: 12px;
                      line-height: 1;
                      text-indent: 12px;
                    ">${otp}</div>
                  </td>
                </tr>
              </table>

              <!-- Warning box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="margin-bottom: 32px;">
                <tr>
                  <td style="
                    background-color: rgba(255,170,0,0.06);
                    border: 1px solid rgba(255,170,0,0.2);
                    border-radius: 8px;
                    padding: 14px 18px;
                  ">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="
                          font-size: 16px;
                          vertical-align: top;
                          padding-right: 10px;
                          line-height: 1.5;
                        ">⚠️</td>
                        <td style="
                          font-size: 13px;
                          color: rgba(255,255,255,0.4);
                          line-height: 1.6;
                          font-weight: 300;
                        ">
                          If you didn't request this code, you can safely ignore this email.
                          Someone may have entered your email by mistake.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 48px;">
              <div style="height: 1px; background-color: rgba(255,255,255,0.06);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 28px 48px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="
                      margin: 0 0 6px;
                      font-size: 12px;
                      color: rgba(255,255,255,0.2);
                      line-height: 1.6;
                    ">
                      This is an automated message from Crowd Event Platform.
                      Please do not reply to this email.
                    </p>
                    <p style="
                      margin: 0;
                      font-size: 12px;
                      color: rgba(255,255,255,0.15);
                    ">
                      © ${new Date().getFullYear()} Crowd · All rights reserved
                    </p>
                  </td>
                  <td align="right" valign="top">
                    <div style="
                      width: 32px;
                      height: 32px;
                      background-color: rgba(0,200,83,0.1);
                      border: 1px solid rgba(0,200,83,0.2);
                      border-radius: 6px;
                      text-align: center;
                      line-height: 32px;
                      font-size: 14px;
                    ">🎟</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <p style="
          margin: 24px 0 0;
          font-size: 12px;
          color: rgba(255,255,255,0.15);
          text-align: center;
        ">
          Crowd Event Platform · Secure Login
        </p>

      </td>
    </tr>
  </table>

</body>
</html>
    `,
  });
};