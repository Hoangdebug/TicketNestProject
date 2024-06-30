import { timeStamp } from "console";

const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var eventSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    time:{
        type:Date,
        required:true,
    },
    ticket_number:{
        type:Number,
        enum:['50', '60', '70']
    },
    price:{
        type:Number,
        required:true,
    },
    place:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        default: 'Pending',
        enum:['Cancelled', 'Pending', 'Successed']
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

//Export the model
module.exports = mongoose.model('Event', eventSchema);