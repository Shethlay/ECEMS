const mongoose = require('mongoose')
const Schema = mongoose.Schema;


//schema is definded here................................................................................
let organizerSchema = new Schema({
	id: String,
    name : String,
    myevent : [],
    notifications : [],
    bookedEvents : []
})


module.exports = mongoose.model('organize',organizerSchema)