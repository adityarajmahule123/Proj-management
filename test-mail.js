// test-mail.js
import "dotenv/config";
import nodemailer from "nodemailer";

(async () => {
  const port = Number(process.env.MAILTRAP_SMTP_PORT) || 2525;
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
    logger: true,
    debug: true,
    tls: { rejectUnauthorized: false },
    connectionTimeout: 10000,
  });

  try {
    console.log("→ running transporter.verify() ...");
    await transporter.verify();
    console.log("✅ transporter.verify() OK — connection/auth works");

    console.log("→ sending a tiny test email ...");
    const info = await transporter.sendMail({
      from: "mail.taskmanager@example.com",
      to: "one@one.com",
      subject: "Quick test",
      text: "hello from test-mail.js",
      html: "<p>hello from test-mail.js</p>",
    });
    console.log(
      "📨 sendMail OK:",
      info && (info.messageId || JSON.stringify(info))
    );
  } catch (err) {
    console.error("❌ ERROR (full):", err && (err.stack || err.message || err));
  } finally {
    transporter.close();
  }
})();
