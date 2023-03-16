import _ from 'lodash';
import db from '../models/index';
require('dotenv').config();
import emailService from './emailService';

let makeAnAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.date || !data.timeType || !data.fullname) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                });
            } else {
                await emailService.sendEmail({
                    receiver: data.email,
                    patientName: data.fullname,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: data.redirectLink,
                    time: data.time
                });
                //upsert patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3'
                    }
                });
                //create a booking record
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                        }
                    });
                }
                resolve({
                    errCode: 0,
                    errMessage: 'You made an appointment successfully!'
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    makeAnAppointment
};