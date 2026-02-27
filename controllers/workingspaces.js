const Reservation = require('../models/Reservation');
const WorkingSpace = require('../models/WorkingSpace');

//@desc Get all workingspaces
//@route GET /api/v1/workingspaces
//@access Public

exports.getWorkingSpaces=async(req,res,next)=>{
        let query;

        const reqQuery= {...req.query};

        const removeFields=['select','sort','page','limit'];

        removeFields.forEach(param=>delete reqQuery[param]);
        console.log(reqQuery);

        let queryStr=JSON.stringify(reqQuery);
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=> `$${match}`);

        query=WorkingSpace.find(JSON.parse(queryStr)).populate('reservations');

        if(req.query.select){
            const fields = req.query.select.split(',').join(' ');
            query=query.select(fields);
        }

        if(req.query.sort){
            const sortBy=req.query.sort.split(',').join(' ');
            query=query.sort(sortBy);
        } else{
            query=query.sort('-createdAt');
        }

        const page=parseInt(req.query.page,10) || 1;
        const limit=parseInt(req.query.limit,10) || 25;

        const startIndex = (page-1)*limit;
        const endIndex=page*limit;
        const total=await WorkingSpace.countDocuments();

        query=query.skip(startIndex).limit(limit);
    try{
        const workingspaces = await query;

        const pagination = {};
        if(endIndex<total){
            pagination.next={
                page:page+1,
                limit
            }
        }

        if(startIndex>0){
            pagination.prev={
                page:page-1,
                limit
            }
        }

        res.status(200).json({success:true, count: workingspaces.length, pagination, data: workingspaces});

    } catch(err){
        res.status(400).json({success:false});

    }
}

//@desc Get single workingspaces
//@route GET /api/v1/workingspaces/:id
//@access Public

exports.getWorkingSpace=async (req,res,next)=>{
    try{
        const workingspace = await WorkingSpace.findById(req.params.id);

        if(!workingspace){
            res.status(400).json({success:false});
        }

        res.status(200).json({success:true, data: workingspace});  
    } catch(err){
        res.status(400).json({success:false});
    }
}

//@desc Create a workingspace
//@route POST /api/v1/workingspaces
//@access Private

exports.createWorkingSpace = async (req,res,next)=>{
    const workingspace = await WorkingSpace.create(req.body);
    res.status(201).json({success:true, data: workingspace});
}

//@desc Update single workingspace
//@route PUT /api/v1/workingspaces/:id
//@access Private

exports.updateWorkingSpace=async (req,res,next)=>{
    try{
        const workingspace = await WorkingSpace.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators: true
        });

        if(!workingspace)
            return res.status(400).json({success: false});

        res.status(200).json({success: true, data: workingspace});
    } catch(err){
        res.status(400).json({success:false});
    }
}

//@desc Delete single workingspace
//@route DELETE /api/v1/workingspaces/:id
//@access Private

exports.deleteWorkingSpace=async (req,res,next)=>{
    try{
        const workingspace = await WorkingSpace.findById(req.params.id);

        if(!workingspace){
            return res.status(404).json({success: false, message:`WorkingSpace not found with id of ${req.params.id}`});
        }

        await Reservation.deleteMany({workingspace: req.params.id});
        await WorkingSpace.deleteOne({_id: req.params.id});

        res.status(200).json({success: true, data: {}});
    } catch(err){
        res.status(400).json({success: false});
    }
}