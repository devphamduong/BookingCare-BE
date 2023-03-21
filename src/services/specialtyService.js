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

module.exports = {
    createSpecialty, getAllSpecialties
};