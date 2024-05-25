const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var seatSchema = new mongoose.Schema({
    type:{
        type:String,
        required:true,
    },
    username:{
        user: {type:mongoose.Types.ObjectId, ref:'User'},
        type:String,
        required:true,
    },
    seatcode:{
        seatcode: {type:mongoose.Types.ObjectId, ref:'Ticket'},
        type:String,
        required:true,
    },
    Status:{
        type:Boolean,
        required:true,
    },
});

//Export the model
module.exports = mongoose.model('Seat', seatSchema);