import db from '../models/index';
import userService from '../services/userService';

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters!"
        });
    }
    let userData = await userService.handleLogin(email, password);
    return res.status(200).json({
        errCode: userData.errCode,
        errMessage: userData.errMessage,
        user: userData.user ? userData.user : {}
    });
};

module.exports = {
    handleLogin
};