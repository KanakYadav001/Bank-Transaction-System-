
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

async function sendTransactionEmail(email, name, amount, toAccount) {

  const subject = "✅ Transaction Successful";

  const text = `Hello ${name},
Your transaction of ₹${amount} to account ${toAccount} has been completed successfully.
If this wasn't you, please contact support immediately.`;

  const html = `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
    
    <div style="max-width:600px; margin:auto; background:white; border-radius:10px; padding:20px;">
      
      <h2 style="color:#2ecc71; text-align:center;">Transaction Successful ✅</h2>

      <p>Hello <b>${name}</b>,</p>

      <p>Your transaction has been completed successfully. Here are the details:</p>

      <div style="background:#f9f9f9; padding:15px; border-radius:8px; margin:15px 0;">
        <p><b>Amount:</b> ₹${amount}</p>
        <p><b>Transferred To:</b> ${toAccount}</p>
        <p><b>Status:</b> <span style="color:#2ecc71;">Completed</span></p>
      </div>

      <p>If you did not make this transaction, please contact our support team immediately.</p>

      <p style="margin-top:25px;">Thanks,<br/><b>Your Bank Team</b></p>

    </div>

    <p style="text-align:center; font-size:12px; color:#999; margin-top:10px;">
      This is an automated email. Please do not reply.
    </p>

  </div>
  `;

  await sendEmail(email, subject, text, html);
}

module.exports = {
    SendRegisterEmail,
    sendTransactionEmail
};
