import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  service: "gmail", // You can also use SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendLoginEmail(to: string, password: string) {
  const mailOptions = {
    from: `"Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Account Login Details",
    text: `You have been added as a user.\n\nEmail: ${to}\nPassword: ${password}\n\nPlease login and change your password.`,
  }

  await transporter.sendMail(mailOptions)
}

// import { Resend } from "resend"

// const resend = new Resend(process.env.RESEND_API_KEY)

// export async function sendLoginEmail(to: string, password: string) {
//   await resend.emails.send({
//     from: process.env.RESEND_FROM!,
//     to,
//     subject: "Your Account Login Details",
//     html: `
//       <h2>Welcome!</h2>
//       <p>You’ve been manually added as a user.</p>
//       <p><strong>Email:</strong> ${to}</p>
//       <p><strong>Password:</strong> ${password}</p>
//       <p>Please login and change your password immediately.</p>
//     `,
//   })
// }
