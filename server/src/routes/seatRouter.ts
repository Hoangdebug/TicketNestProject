import express from "express"
const ctrls = require('../controller/seatController')
const router = express.Router()
const { verifyAccessToken} = require('../middlewares/verifyToken')


router.post('/',[verifyAccessToken], ctrls.createSeat)
router.get('/:sid', ctrls.getSeat)

router.put('/:sid' , ctrls.updateSeat)


module.exports = router