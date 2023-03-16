require('dotenv').config();
import nodemailer from 'nodemailer';

let sendEmail = async (data) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"DuongPC 👻" <pduong244@gmail.com>', // sender address
        to: data.receiver, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: getBodyHTMLEmail(data) // html body
    });
};

let getBodyHTMLEmail = (data) => {
    let result = '';
    if (data.language === 'vi') {
        result = `
        <h3>Xin chào ${data.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên DuongPC</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div>
            <b>Thời gian: ${data.time}</b>
        </div>
        <div>
            <b>Bác sĩ: ${data.doctorName}</b>
        </div>
        <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.</p>
        <div>
            <a href=${data.redirectLink}>Click here</a>
        </div>
        <div>Xin chân thành cảm ơn!</div>
        `;
    }
    if (data.language === 'en') {
        result = `
        <h3>Dear ${data.patientName}!</h3>
        <p>You received this email because you booked an online medical appointment on DuongPC</p>
        <p>Information to book a medical appointment:</p>
        <div>
            <b>Time: ${data.time}</b>
        </div>
        <div>
            <b>Doctor: ${data.doctorName}</b>
        </div>
        <p>If the above information is correct, please click on the link below to confirm and complete the medical appointment booking procedure.</p>
        <div>
            <a href=${data.redirectLink}>Click here</a>
        </div>
        <div>Sincerely thank!</div>
        `;
    }
    return result;
};

module.exports = {
    sendEmail
};