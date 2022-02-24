const path = require('path');
const config = require('../../config');
const { Mail, MailerTemplateSetup } = require('mail-template-sender');
const { NodeMailerProvider } = require('mail-template-sender/providers');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(config.email.nodeMailer);

const nmProvider = new NodeMailerProvider(transporter);

const mailer = MailerTemplateSetup.config({
  provider: nmProvider,
  templateDir: path.join(__dirname, 'templates'),
});

const mails = {
  verification: new Mail({
    template: 'verification',
    from: config.email.from,
    subject: 'Email Verification',
  }),
};

mailer.onError((err, mail) => {
  console.error('=>>', err);
  console.log(mail);
});

module.exports = {
  mailer: mailer.mailSender,
  mails,
};
