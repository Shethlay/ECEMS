const mongoose = require('mongoose')
const Schema = mongoose.Schema;


//schema is definded here................................................................................
let studentSchema = new Schema({
	id: String,
	name: String,
	notifications: [],
    bookedEvents: []

})


module.exports = mongoose.model('student',studentSchema)