import express from 'express'
const router = express.Router()
const ctrls = require('../controller/orderController')
const { verifyAccessToken, isAdmin, isOrganizer} = require('../middlewares/verifyToken')

router.post('/', ctrls.createOrder);
router.get('/:id', ctrls.getOrder);
router.put('/:id', ctrls.updateOrder); 
router.delete('/:id', ctrls.deleteOrder);

module.exports = router