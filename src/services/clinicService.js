import db from '../models/index';

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address || !data.imgBase64 || !data.descriptionMarkdown || !data.descriptionHTML) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                });
            } else {
                await db.Clinic.create({
                    name: data.name,
                    image: data.imgBase64,
                    address: data.address,
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

let getAllClinics = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinics = await db.Clinic.findAll();
            if (clinics && clinics.length > 0) {
                clinics.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                });
            }
            resolve({
                errCode: 0,
                data: clinics
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getDetailClinicById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    data: 'Missing required parameter!'
                });
            } else {
                let data = await db.Clinic.findOne({
                    where: { id },
                    attributes: ['name', 'address', 'descriptionHTML', 'descriptionMarkdown']
                });
                if (data) {
                    let doctorClinic = await db.Doctor_Infor.findAll({
                        where: {
                            clinicId: id
                        },
                        attributes: ['doctorId', 'provinceId']
                    });
                    data.doctorClinic = doctorClinic;
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
    createClinic, getAllClinics, getDetailClinicById
};