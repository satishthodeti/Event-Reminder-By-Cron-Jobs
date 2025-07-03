const { body, query, param } = require('express-validator');

// Create Event Validation
exports.validateCreateEvent = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('eventTime').isISO8601().toDate().withMessage('Valid eventTime (ISO date) is required'),
  body('email').isEmail().withMessage('Valid email is required')
];

// Edit Event Validation
exports.validateEditEvent = [
  body('id').notEmpty().withMessage('Event ID is required'),
  body('title').optional().notEmpty(),
  body('description').optional().notEmpty(),
  body('eventTime').optional().isISO8601().toDate(),
  body('email').optional().isEmail()
];

// Delete Event Validation
exports.validateDeleteEvent = [
  body('id').notEmpty().withMessage('Event ID is required')
];

// Get Event by ID Validation
exports.validateEventIdParam = [
  param('id').notEmpty().withMessage('ID parameter is required')
];

// Filter Query Validation
exports.validateFilterEvents = [
  query('date').optional().isISO8601().withMessage('Date must be valid'),
  query('fromDate').optional().isISO8601().withMessage('fromDate must be valid'),
  query('toDate').optional().isISO8601().withMessage('toDate must be valid'),
  query('search').optional().isString()
];
