const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var organizeSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true,
    },
    sponsorBy:{
        type: mongoose.Types.ObjectId, ref:'User'
    },
    name:{
        type:String,
        required:true,
    },
    Image:{
        type:String,
    },
},{
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Organize', organizeSchema);