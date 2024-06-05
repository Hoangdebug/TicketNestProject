const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var seatSchema = new mongoose.Schema({
    type:{
        type:String,
        enum:['Normal, Vip1, Vip2, Vip Plus']
    },
    username:{
        user: {type:mongoose.Types.ObjectId, ref:'User'},       
    },
    seatcode:{        
        type:String,
        required:true,
    },
    status:{
        type:String,        
        default: 'False',
        enum:['True','False']
    },
});

//Export the model
module.exports = mongoose.model('Seat', seatSchema);