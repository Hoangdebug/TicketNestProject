import express from 'express'
const router = express.Router()
const orderRouter = require('../controller/orderController')

router.post('/', orderRouter.createOrder);
router.get('/:id', orderRouter.getOrder);
router.put('/:id', orderRouter.updateOrder); 
router.delete('/:id', orderRouter.deleteOrder);

module.exports = router