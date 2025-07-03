const Event = require('../models/Event');

// Create Event
exports.createEvent = async (req, res) => {
    try {
        const { title, description, eventTime, email } = req.body;
        const event = new Event({ title, description, eventTime, email });
        await event.save();
        res.status(201).json({ message: '✅ Event created', event });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to create event', error });
    }
};

// Edit/Update Event
exports.editEvent = async (req, res) => {
    try {
        const { id, title, description, eventTime, email } = req.body;
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { title, description, eventTime, email },
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: '❌ Event not found' });
        }

        res.json({ message: '✅ Event updated', event: updatedEvent });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to update event', error });
    }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.body;
        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({ message: '❌ Event not found' });
        }

        res.json({ message: '✅ Event deleted', event: deletedEvent });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to delete event', error });
    }
};

// Get All Events (with optional filters)
exports.getAllEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { date, fromDate, toDate, search } = req.query;

        if (date && isNaN(Date.parse(date))) {
            return res.status(400).json({ message: 'Invalid date format', needLike: 'YYYY-MM-DD' });
        }
        if (fromDate && isNaN(Date.parse(fromDate))) {
            return res.status(400).json({ message: 'Invalid fromDate format', needLike: 'YYYY-MM-DD' });
        }

        if (toDate && isNaN(Date.parse(toDate))) {
            return res.status(400).json({ message: 'Invalid toDate format', needLike: 'YYYY-MM-DD' });
        }

        let query = {};

        // Filter for a particular date
        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            query.eventTime = { $gte: start, $lte: end };
        }

        // Filter between two dates
        if (fromDate && toDate) {
            query.eventTime = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            };
        }

        // Search by title or description (case insensitive)
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const events = await Event.find(query)
            .sort({ eventTime: 1 })
            .skip(skip)
            .limit(limit);

        const total = await Event.countDocuments(query);

        const result = {
            events,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to fetch events', error });
    }
};

// Get Event By ID
exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: '❌ Event not found' });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to fetch event', error });
    }
};
