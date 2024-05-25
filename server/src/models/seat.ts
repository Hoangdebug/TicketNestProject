const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var seatSchema = new mongoose.Schema({
    type:{
        type:Array,
        required:true,
    },
    username:{
        user: {type:mongoose.Types.ObjectId, ref:'User'},
        type:String,
        required:true,
    },
    seatcode:{        
        type:String,
        required:true,
    },
    status:{
        type:String,        
        required:'False',
        enum:['True','False']
    },
});

//Export the model
module.exports = mongoose.model('Seat', seatSchema);