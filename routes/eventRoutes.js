const express = require('express');
const router = express.Router();
const {
  createEvent,
  editEvent,
  deleteEvent,
  getAllEvents,
  getEventById
} = require('../controllers/eventController');
const {
  validateCreateEvent,
  validateEditEvent,
  validateDeleteEvent,
  validateEventIdParam,
  validateFilterEvents
} = require('../validators/eventValidator');

const handleValidation = require('../middleware/handleValidation');


router.post('/add', validateCreateEvent, handleValidation, createEvent);
router.put('/edit', validateEditEvent, handleValidation, editEvent);
router.delete('/delete', validateDeleteEvent, handleValidation, deleteEvent);
router.get('/get/all', validateFilterEvents, handleValidation, getAllEvents);
router.get('/get/by/:id', validateEventIdParam, handleValidation, getEventById);

module.exports = router;
