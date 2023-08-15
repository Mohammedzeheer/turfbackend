const nodemailer = require('nodemailer');
require('dotenv').config()

const sendMail = async function (bookingData) {
  try {
    const mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NodeMailer_Mail,
        pass: process.env.NodeMailer_Password,       
      }
    });

    const formattedBookingDate = new Date(bookingData.bookDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    const mailOptions = {
        from: "AoneTurf@gmail.com",
        to: bookingData.user.email,
        subject: "A One Turf Booking Confirmation",
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h1 style="color: #008080;">Turf Booking Order Confirmation</h1>
            <p style="font-size: 18px;">Dear ${bookingData.user.username},</p>
            <p>Your turf booking has been successfully confirmed. Here are the details:</p>
            
            <h2>Booking Details:</h2>
            <ul>
              <li><strong>Booking ID:</strong> ${bookingData._id}</li>
              <li><strong>Date:</strong> ${bookingData.turf.courtName}</li>
              <li><strong>Date:</strong> ${formattedBookingDate}</li>
              <li><strong>Time Slot:</strong> ${bookingData.time}</li>
              <li><strong>Turf Location:</strong> ${bookingData.turf.location},${bookingData.turf.district}</li>
            </ul>
            
            <h2>Additional Information:</h2>
            <p>We look forward to welcoming you to our turf facility. If you have any questions or need assistance, please feel free to contact us.</p>
            
            <p>Thank you for choosing A One Turf!</p>
           
            
            <p style="margin-top: 20px; font-style: italic;">Best regards,<br>A One Turf Team</p>
          </div>
        `,
      };
      
    await mailTransporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
    throw new Error("Error sending email");
  }
};

module.exports = sendMail;
 
            // <div style="margin-top: 20px;">
            //   <img src="https://example.com/path-to-your-image.png" alt="Turf Image" style="max-width: 100%;">
            // </div>