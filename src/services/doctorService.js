import db from '../models/index';

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

module.exports = {
    getTopDoctor
};