import _ from 'lodash';
import db from '../models/index';
require('dotenv').config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctor = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = '';
            doctors = await db.User.findAll({
                limit,
                where: { roleId: 'R2' },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ['password'],
                },
                include: [
                    { model: db.AllCode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.AllCode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            });
            resolve({
                errCode: 0,
                data: doctors
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image'],
                }
            });
            resolve({
                errCode: 0,
                data: doctors
            });
        } catch (error) {
            reject(error);
        }
    });
};

let checkRequiredFields = (input) => {
    let isValid = true;
    let element = '';
    let arrFields = ['doctorId', 'contentMarkdown', 'contentHTML', 'specialtyId', 'selectedPrice', 'selectedPayment', 'selectedProvince', 'nameClinic', 'addressClinic', 'note', 'action'];
    for (let i = 0; i < arrFields.length; i++) {
        if (!input[arrFields[i]]) {
            isValid = false;
            element = arrFields[i];
            break;
        }
    }
    return {
        isValid, element
    };
};

let saveInforDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkInput = checkRequiredFields(data);
            if (!checkInput.isValid) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing ${checkInput.element} parameter!`,
                });
            } else {
                let doctor = await db.User.findOne({
                    where: { id: data.doctorId }
                });
                if (!doctor) {
                    resolve({
                        errCode: 2,
                        errMessage: "Doctor not found!"
                    });
                } else {
                    //upsert to Markdown
                    if (data.action === 'CREATE') {
                        await db.Markdown.create(
                            {
                                contentHTML: data.contentHTML,
                                contentMarkdown: data.contentMarkdown,
                                description: data.description,
                                doctorId: data.doctorId
                            }
                        );
                    } else if (data.action === 'EDIT') {
                        await db.Markdown.update(
                            {
                                contentHTML: data.contentHTML,
                                contentMarkdown: data.contentMarkdown,
                                description: data.description
                            },
                            {
                                where: { doctorId: data.doctorId }
                            }
                        );
                    }
                    //upsert to Doctor_Infor
                    let doctor_infor = await db.Doctor_Infor.findOne({
                        where: { doctorId: data.doctorId }
                    });
                    //insert 
                    if (!doctor_infor) {
                        await db.Doctor_Infor.create(
                            {
                                specialtyId: data.specialtyId,
                                clinicId: data.clinicId ? data.clinicId : null,
                                doctorId: data.doctorId,
                                priceId: data.selectedPrice,
                                paymentId: data.selectedPayment,
                                provinceId: data.selectedProvince,
                                nameClinic: data.nameClinic,
                                addressClinic: data.addressClinic,
                                note: data.note
                            }
                        );
                        resolve({
                            errCode: 0,
                            message: "Created doctor information successfully!"
                        });
                    } else { //update
                        await db.Doctor_Infor.update(
                            {
                                specialtyId: data.specialtyId,
                                clinicId: data.clinicId ? data.clinicId : null,
                                priceId: data.selectedPrice,
                                paymentId: data.selectedPayment,
                                provinceId: data.selectedProvince,
                                nameClinic: data.nameClinic,
                                addressClinic: data.addressClinic,
                                note: data.note
                            },
                            {
                                where: { doctorId: data.doctorId }
                            }
                        );
                        resolve({
                            errCode: 0,
                            message: "Updated doctor information successfully!"
                        });
                    }
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getDetailDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                });
            } else {
                let data = await db.User.findOne({
                    where: { id },
                    attributes: {
                        exclude: ['password'],
                    },
                    include: [
                        { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                        { model: db.AllCode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.AllCode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.AllCode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.AllCode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Specialty, as: 'specialtyData', attributes: ['id', 'name'] }
                            ]
                        }
                    ],
                    raw: true,
                    nest: true
                });
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formattedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                });
            } else {
                let schedules = data.arrSchedule;
                if (schedules && schedules.length > 0) {
                    schedules = schedules.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    });
                }
                //check existing
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.formattedDate },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber']
                });
                //compare different
                let toCreate = _.differenceWith(schedules, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });
                //create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }
                resolve({
                    errCode: 0,
                    message: 'Saved schedule(s) successfully!'
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                });
            } else {
                let data = await db.Schedule.findAll({
                    where: { doctorId, date },
                    include: [
                        { model: db.AllCode, as: "timeTypeData", attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: "doctorData", attributes: ['firstName', 'lastName'] }
                    ],
                    raw: false,
                    nest: true
                });
                if (!data) data = [];
                resolve({
                    errCode: 0,
                    data
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getDoctorExtraInforById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                });
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: { doctorId },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.AllCode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.AllCode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.AllCode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] }
                    ],
                    raw: false,
                    nest: true
                });
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getDoctorProfileById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                });
            } else {
                let data = await db.User.findOne({
                    where: { id: doctorId },
                    attributes: {
                        exclude: ['password'],
                    },
                    include: [
                        { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                        { model: db.AllCode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.AllCode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.AllCode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.AllCode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] }
                            ]
                        }
                    ],
                    raw: true,
                    nest: true
                });
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                });
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId,
                        date
                    },
                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [
                                { model: db.AllCode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                            ]
                        }
                    ],
                    raw: false,
                    nest: true
                });
                if (!data) data = [];
                resolve({
                    errCode: 0,
                    data
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    getTopDoctor, getAllDoctors, saveInforDoctor, getDetailDoctorById, bulkCreateSchedule, getScheduleByDate, getDoctorExtraInforById, getDoctorProfileById, getListPatientForDoctor
};