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
        let data = await db.User.findAll();
        return res.render('crud.ejs', { data });
    } catch (error) {
        console.log(error);
    }
};

let createUser = async (req, res) => {
    let response = await CRUDService.createUser(req.body);
};

module.exports = {
    getHomePage, getCRUD, createUser
};