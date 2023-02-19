import db from '../models/index';
import CRUDService from '../services/CRUDService';

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homePage.ejs', { data });
    } catch (error) {
        console.log(error);
    }
};

let getCRUD = async (req, res) => {
    try {
        return res.render('crud.ejs');
    } catch (error) {
        console.log(error);
    }
};

let createUser = async (req, res) => {
    let response = await CRUDService.createUser(req.body);
};

let getAllUsers = async (req, res) => {
    let response = await CRUDService.getAllUsers();
    return res.render('displayCRUD.ejs', { data: response.data });
};

module.exports = {
    getHomePage, getCRUD, createUser, getAllUsers
};