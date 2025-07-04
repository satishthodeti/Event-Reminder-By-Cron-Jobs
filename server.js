const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

const connectDB = require('./config/mongodb');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes'); 
const swaggerDocument = require('./swagger.json');
const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();

const app = express();

// ------------------ ✅ Middleware ------------------ //

// Body parser
app.use(express.json());

// CORS - enable cross-origin requests
app.use(cors());

// Secure HTTP headers
app.use(helmet());

// Log requests (optional but helpful)
app.use(morgan('dev'));

// Rate limiting (protect from brute-force/spam)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Cron Job (Event Reminder)
require('./jobs/reminderJob');

// ------------------ ✅ Routes ------------------ //

app.get('/ok', (req, res) => {
    res.status(200).json({
        status: "Success",
        message: 'Event Reminder By Cron Jobs Project Set-Up is Ready.',
        swaggerURL: `${req.protocol}://${req.get('host')}/api-docs/#/`
    });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

// Global fallback for unknown routes
app.use('/ok', (req, res) => {
    res.status(200).json({ message: 'Event Reminder By Cron Jobs Porject Set-Up Ready.' });
});

// ------------------ ✅ Server ------------------ //

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
