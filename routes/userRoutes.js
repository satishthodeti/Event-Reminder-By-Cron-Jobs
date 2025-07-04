const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

router.get('/get/all', userController.getAll);
router.get('/get/:id', userController.getById);
router.put('/update', userController.update);
router.delete('/delete/:id', userController.delete);

module.exports = router;
