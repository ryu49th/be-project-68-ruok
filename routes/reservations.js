const express = require('express');

const {getReservations, getReservation, addReservation, updateReservation, deleteReservation, updateReservationStatus} = require('../controllers/reservations');

const router = express.Router({mergeParams:true});

const {protect,authorize}= require('../middleware/auth');

router.route('/')
    .get(protect,getReservations)
    .post(protect,authorize('admin','user'),addReservation);

router.route('/:id')
    .get(protect,getReservation)
    .put(protect,authorize('admin','user'),updateReservation)
    .delete(protect,authorize('admin','user'),deleteReservation);

router.route('/:id/status')
    .put(protect, authorize('admin'), updateReservationStatus);

module.exports=router;