import db from '../models/index';
import doctorService from '../services/doctorService';

let getTopDoctor = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) {
        limit = 10;
    }
    let response = '';
    try {
        response = await doctorService.getTopDoctor(+limit);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        });
    }
    return res.status(200).json(response);
};

let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        });
    }
};

let saveInforDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveInforDoctor(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        });
    }
};

module.exports = {
    getTopDoctor, getAllDoctors, saveInforDoctor
};