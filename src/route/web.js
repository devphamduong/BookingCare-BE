import express from "express";
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import doctorController from '../controllers/doctorController';

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/crud', homeController.getCRUD);
    router.post('/create-user', homeController.createUser);
    router.get('/get-all-users', homeController.getAllUsers);
    router.get('/edit-user', homeController.editUser);
    router.post('/edit-put-user', homeController.editPutUser);
    router.get('/delete-user', homeController.deleteUser);

    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.getAllUsers);
    router.post('/api/create-user', userController.createUser);
    router.put('/api/edit-user', userController.editUser);
    router.delete('/api/delete-user', userController.deleteUser);
    router.get('/api/allcode', userController.getAllCode);

    router.get('/api/top-doctor', doctorController.getTopDoctor);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    router.post('/api/save-infor-doctor', doctorController.saveInforDoctor);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-doctor-schedule-by-date', doctorController.getScheduleByDate);

    return app.use('/', router);
};

module.exports = initWebRoutes;