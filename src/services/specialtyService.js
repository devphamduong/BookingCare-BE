import db from '../models/index';

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imgBase64 || !data.descriptionMarkdown || !data.descriptionHTML) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                });
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imgBase64,
                    descriptionMarkdown: data.descriptionMarkdown,
                    descriptionHTML: data.descriptionHTML
                });
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getAllSpecialties = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialties = await db.Specialty.findAll();
            if (specialties && specialties.length > 0) {
                specialties.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                });
            }
            resolve({
                errCode: 0,
                data: specialties
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getDetailSpecialtyById = (id, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !location) {
                resolve({
                    errCode: 1,
                    data: 'Missing required parameter!'
                });
            } else {
                let data = await db.Specialty.findOne({
                    where: { id },
                    attributes: ['descriptionHTML', 'descriptionMarkdown']
                });
                if (data) {
                    let doctorSpecialty = [];
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: { specialtyId: id },
                            attributes: ['doctorId', 'provinceId']
                        });
                    } else {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: id,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId']
                        });
                    }
                    data.doctorSpecialty = doctorSpecialty;
                } else {
                    data = {};
                }
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
    createSpecialty, getAllSpecialties, getDetailSpecialtyById
};