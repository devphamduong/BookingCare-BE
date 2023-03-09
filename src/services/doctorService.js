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

let saveInforDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.contentMarkdown || !data.contentHTML || !data.action) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!',
                });
            }
            let doctor = await db.User.findOne({
                where: { id: data.doctorId }
            });
            if (!doctor) {
                resolve({
                    errCode: 2,
                    errMessage: "Doctor not found!"
                });
            } else {
                if (data.action === 'CREATE') {
                    await db.Markdown.create(
                        {
                            contentHTML: data.contentHTML,
                            contentMarkdown: data.contentMarkdown,
                            description: data.description,
                            doctorId: data.doctorId
                        }
                    );
                    resolve({
                        errCode: 0,
                        message: "Created doctor information successfully!"
                    });
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
                    resolve({
                        errCode: 0,
                        message: "Updated doctor information successfully!"
                    });
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
                //format date
                if (existing && existing.length > 0) {
                    existing.map(item => {
                        return item.date = new Date(item.date).getTime();
                    });
                }
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

module.exports = {
    getTopDoctor, getAllDoctors, saveInforDoctor, getDetailDoctorById, bulkCreateSchedule
};