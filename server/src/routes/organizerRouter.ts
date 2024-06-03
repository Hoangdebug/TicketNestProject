import express from "express";
const ctrls = require('../controller/organizerController')
const router = express.Router()
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/', verifyAccessToken, ctrls.createOrganizer)
router.get('/:oid', ctrls.getOrganizer)
router.put('/:oid', ctrls.updateOrganizer)

module.exports = router