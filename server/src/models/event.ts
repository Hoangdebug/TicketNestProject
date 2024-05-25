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
    password:{
        type:String,
        required:true,
    },
});

//Export the model
module.exports = mongoose.model('Event', eventSchema);