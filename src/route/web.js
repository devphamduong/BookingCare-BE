import express from "express";
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import doctorController from '../controllers/doctorController';
import patientController from '../controllers/patientController';
import specialtyController from '../controllers/specialtyController';
import clinicController from '../controllers/clinicController';

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
    router.get('/api/get-doctor-extra-infor-by-id', doctorController.getDoctorExtraInforById);
    router.get('/api/get-doctor-profile-by-id', doctorController.getDoctorProfileById);

    router.post('/api/patient-book-appointment', patientController.makeAnAppointment);
    router.post('/api/verify-book-appointment', patientController.verifyAnAppointment);

    router.post('/api/create-specialty', specialtyController.createSpecialty);
    router.get('/api/get-all-specialties', specialtyController.getAllSpecialties);
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);

    router.post('/api/create-clinic', clinicController.createClinic);
    router.get('/api/get-all-clinics', clinicController.getAllClinics);
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);

    return app.use('/', router);
};

module.exports = initWebRoutes;