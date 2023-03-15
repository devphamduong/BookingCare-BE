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

let getDetailDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getDetailDoctorById(req.query.id);
        return res.status(200).json(infor);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        });
    }
};

let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(infor);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        });
    }
};

let getScheduleByDate = async (req, res) => {
    try {
        let infor = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);
        return res.status(200).json(infor);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        });
    }
};

let getDoctorExtraInforById = async (req, res) => {
    try {
        let infor = await doctorService.getDoctorExtraInforById(req.query.doctorId);
        return res.status(200).json(infor);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        });
    }
};

let getDoctorProfileById = async (req, res) => {
    try {
        let infor = await doctorService.getDoctorProfileById(req.query.doctorId);
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
    getTopDoctor, getAllDoctors, saveInforDoctor, getDetailDoctorById, bulkCreateSchedule, getScheduleByDate, getDoctorExtraInforById, getDoctorProfileById
};