const express = require('express');
const {getWorkingSpaces,getWorkingSpace,createWorkingSpace,updateWorkingSpace,deleteWorkingSpace,addWorkingSpaceRating} = require('../controllers/workingspaces')

const reservationRouter=require('./reservations');

const router = express.Router();

const {protect,authorize} = require("../middleware/auth");

router.use('/:workingspaceId/reservations/',reservationRouter);

router.route('/').get(getWorkingSpaces).post(protect,authorize('admin'),createWorkingSpace);
router.route('/:id').get(getWorkingSpace).put(protect,authorize('admin'),updateWorkingSpace).delete(protect,authorize('admin'),deleteWorkingSpace);
router.route('/:id/rating').post(protect, addWorkingSpaceRating);

module.exports=router;