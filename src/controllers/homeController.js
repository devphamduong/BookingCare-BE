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

let editUser = async (req, res) => {
    let id = req.query.id;
    if (id) {
        let response = await CRUDService.getUserById(id);
        return res.render('editCRUD.ejs', { user: response.user });
    } else {
        return res.send("User not found!");
    }
};

let editPutUser = async (req, res) => {
    let data = req.body;
    let response = await CRUDService.editPutUser(data);
    return res.render('displayCRUD.ejs', { data: response.data });
};

module.exports = {
    getHomePage, getCRUD, createUser, getAllUsers, editUser, editPutUser
};