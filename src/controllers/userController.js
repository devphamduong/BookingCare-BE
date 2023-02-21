import db from '../models/index';
import userService from '../services/userService';

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(200).json({
            errCode: 1,
            message: "Missing required parameters!"
        });
    }
    let userData = await userService.handleLogin(email, password);
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
        user: userData.user ? userData.user : {}
    });
};

let getAllUsers = async (req, res) => {
    let id = req.query.id;
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            message: "Missing required parameters!"
        });
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        message: 'OK',
        users
    });
};

let createUser = async (req, res) => {
    await userService.createUser(req.body);
    return res.status(200).json({
        errCode: 0,
        message: 'OK',
    });
};

let editUser = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUser(data);
    return res.status(200).json(message);
};

let deleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing required parameters!',
        });
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
};

module.exports = {
    handleLogin, getAllUsers, createUser, editUser, deleteUser
};