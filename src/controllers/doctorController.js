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
            message: 'Error from server...'
        });
    }
    return res.status(200).json(response);
};

module.exports = {
    getTopDoctor
};