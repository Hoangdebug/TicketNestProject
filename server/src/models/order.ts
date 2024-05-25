const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({    
    status:{
        type:String,        
        required:'Pending',
        enum:['Cancelled', 'Pending', 'Successed']
    },
    seatcode:{      
        seatcode: {type:mongoose.Types.ObjectId, ref:'Seat'},
        type:String,
        required:true,
    },
    totalmoney:{
        type:Number,
        required:true,
    },
    settime:{        
        type:Date,
        required:true,
    },
    // payment:{

    // }
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);