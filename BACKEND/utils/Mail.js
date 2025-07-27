import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config();

const transporter = nodemailer.createTransport({
  service:"Gmail",
  port:465,
  secure: true,
  auth:{
    user:process.env.EMAIL,
    pass:process.env.EMAIL_PASS,
  },
});

const sendOtpMail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: `"Instagram Clone" <${process.env.EMAIL}>`, // use verified sender email
      to,
      subject: "Reset Your Password • Instagram Clone",
      html: `
        <div style="max-width: 600px; margin: auto; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #fff; border: 1px solid #dbdbdb; padding: 40px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 5px;">Instagram Clone</h1>
            <p style="font-size: 14px; color: #8e8e8e;">Reset Your Password</p>
          </div>

          <hr style="border: none; border-top: 1px solid #dbdbdb; margin: 20px 0;" />

          <p style="font-size: 15px; color: #262626;">Hello,</p>
          <p style="font-size: 15px; color: #262626;">
            We received a request to reset your password. Use the OTP below to proceed:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; padding: 15px 25px; font-size: 22px; font-weight: bold; background: linear-gradient(45deg, #f58529, #dd2a7b, #8134af); color: white; border-radius: 8px; letter-spacing: 2px;">
              ${otp}
            </span>
          </div>

          <p style="font-size: 14px; color: #8e8e8e;">
            This OTP is valid for 5 minutes. Please do not share it with anyone.
          </p>

          <p style="font-size: 14px; color: #8e8e8e;">
            If you did not request this, you can safely ignore this email.
          </p>

          <hr style="border: none; border-top: 1px solid #dbdbdb; margin: 30px 0;" />

          <p style="font-size: 13px; color: #c7c7c7; text-align: center;">
            © ${new Date().getFullYear()} Instagram Clone. All rights reserved.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw new Error("Could not send OTP. Please try again later.");
  }
};


export default sendOtpMail;


