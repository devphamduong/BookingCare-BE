import express from "express";
import homeController from '../controllers/homeController';

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/crud', homeController.getCRUD);

    router.post('/create-user', homeController.createUser);
    router.get('/get-all-users', homeController.getAllUsers);
    router.get('/edit-user', homeController.editUser);
    router.post('/edit-put-user', homeController.editPutUser);

    return app.use('/', router);
};

module.exports = initWebRoutes;