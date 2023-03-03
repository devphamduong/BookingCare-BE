import db from '../models/index';
import bcrypt, { hash } from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);

let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email }
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
};

let handleLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: { email },
                    raw: true
                });
                if (user) {
                    let check = bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.message = "Ok";
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password!";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = "User not found!";
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = "Your email isn't exist in our system. Please try again!";
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });
};

let getAllUsers = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (id === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password'],
                    },
                });
            }
            if (id && id !== 'ALL') {
                users = await db.User.findOne({
                    where: { id },
                    attributes: {
                        exclude: ['password'],
                    },
                });
            }
            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
};

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
            let check = await checkUserEmail(data.email);
            if (check) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already in use. Try another one!'
                });
            } else {
                let hashPaswordBcrypt = await hashPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPaswordBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.image
                });
                resolve({
                    errCode: 0,
                    message: "OK"
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!',
                });
            }
            let user = await db.User.findOne({
                where: { id: data.id }
            });
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: "User not found!"
                });
            }
            await db.User.update(
                {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phoneNumber: data.phoneNumber,
                    address: data.address,
                    gender: data.gender,
                    positionId: data.positionId,
                    roleId: data.roleId,
                    image: data.image
                },
                {
                    where: { id: data.id }
                }
            );
            resolve({
                errCode: 0,
                message: "Update user successfully!"
            });
        } catch (error) {
            reject(error);
        }
    });
};

let deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id }
            });
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: "User not found!"
                });
            }
            await db.User.destroy({
                where: { id }
            });
            resolve({
                errCode: 0,
                message: "Delete user successfully!"
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getAllCode = (type) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!type) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                });
            } else {
                let data = await db.AllCode.findAll({
                    where: { type }
                });
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
    handleLogin, getAllUsers, createUser, updateUser, deleteUser, getAllCode
};