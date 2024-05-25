const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var ticketSchema = new mongoose.Schema({
    cusname:{
        user: {type:mongoose.Types.ObjectId, ref:'User'},
        type:String,
        required:true,
    },
    eventname:{
        event: {type:mongoose.Types.ObjectId, ref:'Event'},
        type:String,
        required:true,
    },
    seatcode:{
        seatcode: {type:mongoose.Types.ObjectId, ref:'Seat'},
        type:String,
        required:true,
    },
    time:{
        type:Date,
        required:true,
    },
});

//Export the model
module.exports = mongoose.model('Ticket', ticketSchema);