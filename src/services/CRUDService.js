
import bcrypt from 'bcryptjs';
import db from '../models/index';
const salt = bcrypt.genSaltSync(10);

let hashPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashPaswordBcrypt = await bcrypt.hashSync(password, salt);
            resolve(hashPaswordBcrypt);
        } catch (error) {
            reject(error);
        }
    });
};
let createUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPaswordBcrypt = await hashPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPaswordBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
            });
            resolve({
                errCode: 0,
                errMessage: "Create user successfully!"
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createUser
};