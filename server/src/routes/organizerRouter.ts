import express from "express";
const ctrls = require('../controller/organizerController')
const router = express.Router()
const { verifyAccessToken, isAdmin, isOrganizer} = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken], ctrls.createOrganizer)
router.get('/:oid',[verifyAccessToken, isAdmin], ctrls.getOrganizer)
router.put('/:oid',[verifyAccessToken, isOrganizer], ctrls.updateOrganizer)

module.exports = router