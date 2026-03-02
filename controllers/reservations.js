const Reservation = require('../models/Reservation');

const WorkingSpace = require('../models/WorkingSpace');

//@desc Get all reservations
//@route GET /api/v1/reservations
//@access Public

exports.getReservations=async(req,res,next)=>{
    let query;

    if(req.user.role !== 'admin'){
        query=Reservation.find({user:req.user.id}).populate({
            path:'workingspaces',
            select: 'name province tel'
        });
    } else{
        if(req.params.workingspaceId){
            
            console.log(req.params.workingspaces);

            query=Reservation.find({
                workingspaces:req.params.workingspaceId
            }).populate({
                path: "workingspace",
                select: 'name province tel'
            });
            
        }else{
            query = Reservation.find().populate({
                path: 'workingspaces',
                select: 'name province tel'
            });
        }
    }
    try{
        const reservations = await query;

        res.status(200).json({
            success:true,
            count:reservations.length,
            data: reservations
        });
    } catch (error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot find Reservation"});
    }
};

//@desc Get single reservation
//@route GET /api/v1/reservations/:id
//@access Public
exports.getReservation=async (req,res,next)=>{
    try {
        const reservation = await Reservation.findById(req.params.id).populate({
            path: 'workingspaces',
            select: 'name description tel'
        });

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: `No reservation with the id of ${req.params.id}`
            });
        }

        if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false, 
                message: 'Not authorized to view this reservation'
            });
        }

        res.status(200).json({
            success: true,
            data: reservation
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot find Reservation"});
    }
};

//@desc Add reservation
//@route POST /api/v1/workingspaces/:workingspaceId/reservation
//@access Private
exports.addReservation = async(req, res, next) => {
    try {
        req.body.workingspace = req.params.workingspaceId;

        const mongoose = require('mongoose');
        
        if (!mongoose.Types.ObjectId.isValid(req.params.workingspaceId)) {
            return res.status(400).json({
                success: false,
                message: `Invalid workspace ID format: ${req.params.workingspaceId}`
            });
        }

        const workingspace = await WorkingSpace.findById(req.params.workingspaceId);

        if (!workingspace) {
            return res.status(404).json({
                success: false,
                message: `No workingspace with the id of ${req.params.workingspaceId}`
            });
        }

        req.body.user = req.user.id;

        // ✅ NEW LOGIC: Check reservations for THIS SPECIFIC DATE only
        const existedReservations = await Reservation.find({ 
            user: req.user.id,
            date: req.body.date // Filters the database by the date sent in Postman
        });

        // Check if the user already has 3 reservations ON THAT DATE
        if (existedReservations.length >= 3 && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: `The user with ID ${req.user.id} has already made 3 reservations for the date ${req.body.date}`
            });
        }

        const reservation = await Reservation.create(req.body);

        res.status(201).json({
            success: true,
            data: reservation
        });
    } catch (error) {
        console.error("Error:", error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: `Invalid ID format`
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Cannot create Reservation"
        });
    }
}

//@desc Update reservation
//@route PUT /api/v1/reservations/:id
//@access Private
exports.updateReservation=async (req,res,next) =>{
    try{
        let reservation = await Reservation.findById(req.params.id);

        if(!reservation){
            return res.status(404).json({success:false,message:`No reservation with the id of ${req.params.id}`});
        }

        if(reservation.user.toString()!== req.user.id && req.user.role != 'admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this reservation`});
        }
        
        reservation = await Reservation.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        res.status(200).json({
            success:true,
            data: reservation
        });
    } catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot update Reservation"});
    }
};

//@desc Delete reservation
//@route DELETE /api/v1/reservations/:id
//@access Private
exports.deleteReservation=async (req,res,next)=>{
    try {
        const reservation = await Reservation.findById(req.params.id);

        if(!reservation){
            return res.status(404).json({success:false,message:`No reservation with the id of ${req.params.id}`});
        }

        if(reservation.user.toString() !== req.user.id && req.user.role != 'admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to delete this Reservation`});
        }       

        await reservation.deleteOne();

        res.status(200).json({
            success:true,
            data:{}
        });
    } catch (error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot delete Reservation"});
    }
};