import express from 'express';
const router = express.Router()
const eventRouter = require('../controller/eventController')

router.post('/events', eventRouter.createEvent);
router.get('/events', eventRouter.readEvents);
router.put('/events/:id', eventRouter.updateEvent);

module.exports = router