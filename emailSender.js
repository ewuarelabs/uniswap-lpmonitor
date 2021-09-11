import sendgrid from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

sendgrid.setApiKey(SENDGRID_API_KEY)

export const sendEmail = (subject, message) => {
    const msg = {
        to: process.env.to, // your recipient
        from: process.env.from, // your verified sender
        subject: subject,
        text: message,
      }
      sendgrid
      .send(msg)
      .then((resp) => {
        console.log('Email sent\n', resp)
      })
      .catch((error) => {
        console.error(error)
    });
};