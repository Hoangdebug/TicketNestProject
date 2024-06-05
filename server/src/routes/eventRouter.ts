import express from 'express'
const router = express.Router()
const ctrls = require('../controller/eventController')

router.post('/', ctrls.createEvent);
router.get('/', ctrls.readEvent);
router.put('/:id', ctrls.updateEvent);

module.exports = router