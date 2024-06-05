import express from 'express'
const router = express.Router()
const ctrls = require('../controller/eventController')
const { verifyAccessToken, isAdmin, isOrganizer} = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isOrganizer] ,ctrls.createEvent);
router.get('/',[verifyAccessToken, isOrganizer], ctrls.readEvent);
router.put('/:id',[verifyAccessToken, isOrganizer], ctrls.updateEvent);

module.exports = router