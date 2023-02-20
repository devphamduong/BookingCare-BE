import db from '../models/index';
import bcrypt from 'bcryptjs';
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

let getAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true
            });
            resolve({
                errCode: 0,
                data: users,
                errMessage: "Get all users successfully!"
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id },
                raw: true
            });
            if (user) {
                resolve({
                    errCode: 0,
                    user,
                    errMessage: "Get user successfully!"
                });
            } else {
                resolve({});
            }
        } catch (error) {
            reject(error);
        }
    });
};

let editPutUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.User.update(
                {
                    firstName: data.firstName,
                    lastName: data.lastName
                },
                {
                    where: { id: data.id }
                }
            );
            let users = await db.User.findAll({
                raw: true
            });
            resolve({
                errCode: 0,
                data: users,
                errMessage: "Update user successfully!"
            });
        } catch (error) {
            reject(error);
        }
    });
};

let deleteUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.User.destroy({
                where: { id }
            });
            let users = await db.User.findAll({
                raw: true
            });
            resolve({
                errCode: 0,
                data: users,
                errMessage: "Delete user successfully!"
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createUser, getAllUsers, getUserById, editPutUser, deleteUserById
};