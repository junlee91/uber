import Mailgun from "mailgun-js";

const mailGunClient = new Mailgun({
  apiKey: process.env.MAILGUN_API_KEY || "",
  domain: "sandbox4cf63d25256e42209b88f8e6a1ae06e0.mailgun.org"
});

const sendEmail = (subject: string, html: string) => {
  const emailData = {
    from: "junlee3081@gmail.com",
    to: "junlee3081@gmail.com",
    subject,
    html
  };

  return mailGunClient.messages().send(emailData);
};

export const sendVerificationEmail = (fullName: string, key: string) => {
  const emailSubject = `Hello ${fullName}, please verify your email`;
  const emailBody = `Verify your email by clicking <a href="http://google.com/${key}">here</a>`;

  return sendEmail(emailSubject, emailBody);
};
