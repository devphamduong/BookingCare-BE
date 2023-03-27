import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import db from '../models/index';
require('dotenv').config();
import emailService from './emailService';

let buildUrlEmail = (token, doctorId) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
};

let makeAnAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.date || !data.timeType || !data.fullname || !data.address || !data.selectedGender) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                });
            } else {
                let token = uuidv4();
                await emailService.sendEmail({
                    receiver: data.email,
                    patientName: data.fullname,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(token, data.doctorId),
                    time: data.time
                });
                //upsert patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.fullname
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
                            token
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

let verifyAnAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                });
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    }
                });
                if (appointment) {
                    await db.Booking.update(
                        {
                            statusId: 'S2'
                        },
                        {
                            where: {
                                doctorId: data.doctorId,
                                token: data.token,
                                statusId: 'S1'
                            }
                        }
                    );
                    resolve({
                        errCode: 0,
                        errMessage: 'Updated an appointment successfully!'
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated or does not exist!'
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    makeAnAppointment, verifyAnAppointment
};