import mailgen from "mailgen";
import "dotenv/config";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const mailGenerator = new mailgen({
    theme: "default",
    product: {
      name: "Task Manager",
      link: "https://Taskmanagerlink.com",
    },
  });
  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });
  const mail = {
    from: "mail.taskmanager@example.com",
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };
  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error(
      "Email service has failed silently, make sure that you've provided your MAILTRAP crediantials in the .env file "
    );
  }
};

const emailVerificationMailGenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our App! We're excited to have you on board.",
      action: {
        instructions: "To verify your Email, please click on the button below.",
        button: {
          color: "#22BB66",
          text: "Verify User",
          link: verificationUrl,
        },
      },
      outro:
        "Need help or have questions? - Just reply to this Email, we'd love to help out.",
    },
  };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of your account .",
      action: {
        instructions:
          "To reset your password, please click on the button below.",
        button: {
          color: "#22BB66",
          text: "Reset Password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help or have questions? - Just reply to this Email, we'd love to help out.",
    },
  };
};

export {
  emailVerificationMailGenContent,
  forgotPasswordMailgenContent,
  sendEmail,
};
