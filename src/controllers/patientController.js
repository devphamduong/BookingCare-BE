import db from '../models/index';
import patientService from '../services/patientService';

let makeAnAppointment = async (req, res) => {
    try {
        let infor = await patientService.makeAnAppointment(req.body);
        return res.status(200).json(infor);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        });
    }
};

let verifyAnAppointment = async (req, res) => {
    try {
        let infor = await patientService.verifyAnAppointment(req.body);
        return res.status(200).json(infor);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        });
    }
};

module.exports = {
    makeAnAppointment, verifyAnAppointment
};