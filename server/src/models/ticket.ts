const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var ticketSchema = new mongoose.Schema({
    cusname:{
        user: {type:mongoose.Types.ObjectId, ref:'User'},
    },
    eventname:{
        event: {type:mongoose.Types.ObjectId, ref:'Event'},        
    },
    seatcode:{
        seatcode: {type:mongoose.Types.ObjectId, ref:'Seat'},        
    },
    time:{
        type:Date,
        required:true,
    },
});

//Export the model
module.exports = mongoose.model('Ticket', ticketSchema);