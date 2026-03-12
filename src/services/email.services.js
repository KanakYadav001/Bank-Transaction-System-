
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"YOUR BANK" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
async function SendRegisterEmail(UserEmail, name) {
  const subject = "Welcome to Your Bank";


  const text = `Hello ${name},

Your registration on YOUR BANK application has been completed successfully.

You can now log in using your registered credentials and enjoy services like balance inquiry and bill payments.

If you did not register, please contact our support team immediately.

Regards,
Your Bank Team`;


  const html = `
        <h2>Hello ${name},</h2>
        <p>🎉 Your registration on <b>Your BANK</b> application has been completed successfully.</p>

        <p>You can now log in using your registered credentials and enjoy services like:</p>
        <ul>
          <li>Balance inquiry</li>
          <li>Bill payments</li>
        </ul>

        <p>If you did not register, please contact our support team immediately.</p>

        <br/>
        <p>Regards,<br/><b>Your Bank Team</b></p>
      `;

  await sendEmail(UserEmail, subject, text, html);
}

module.exports = {
    SendRegisterEmail
};
